import { useState } from "react";
import { TouchableOpacity } from "react-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as FileSystem from "expo-file-system";
import {
	Center,
	ScrollView,
	VStack,
	Skeleton,
	Text,
	Heading,
	useToast
} from "native-base";
import * as ImagePicker from "expo-image-picker";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Controller, useForm } from "react-hook-form";
import { api } from "@services/api";
import AppError from "api/src/utils/AppError";
import { useAuth } from "@hooks/useAuth";
import defaulUserPhotoImg from "@assets/userPhotoDefault.png";

type FormDataProps = {
	name: string;
	old_password?: string;
	password?: string | null;
	confirmPassword?: string | null;
};

const PHOTO_SIZE = 33;

const profileSchema = yup.object({
	name: yup.string().required("Informe o nome"),
	old_password: yup.string().min(6, "A senha deve ter pelo menos 6 dígitos."),
	password: yup
		.string()
		.min(6, "A senha deve ter pelo menos 6 dígitos.")
		.nullable()
		.transform(value => (!!value ? value : null)),
	confirmPassword: yup
		.string()
		.nullable()
		.transform(value => (!!value ? value : null))
		.oneOf([yup.ref("password")], "A confirmação de senha não confere.")
		.when("password", {
			is: (Field: any) => Field,
			then: schema =>
				schema
					.nullable()
					.required("Informe a confirmação da senha")
					.transform(value => (!!value ? value : null))
		})
});

export function Profile() {
	const { user, updateUserProfile } = useAuth();
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<FormDataProps>({
		defaultValues: {
			name: user.name
		},
		resolver: yupResolver(profileSchema)
	});
	const [isUpdating, setIsUpdating] = useState(false);
	const [photoIsLoading, setPhotoIsLoading] = useState(false);

	const toast = useToast();

	async function handleUserPhotoSelected() {
		setPhotoIsLoading(true);

		try {
			const photoSelected = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
				aspect: [4, 4],
				allowsEditing: true
			});

			if (photoSelected.assets) {
				const photoInfo = await FileSystem.getInfoAsync(
					photoSelected.assets[0].uri
				);
				if (photoInfo.exists) {
					if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
						return toast.show({
							title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
							placement: "top",
							bgColor: "red.500"
						});
					}
				}

				const fileExtension = photoSelected.assets[0].uri
					.split(".")
					.pop();

				const photoFile = {
					name: `${user.name}.${fileExtension}`.toLowerCase(),
					uri: photoSelected.assets[0].uri,
					type: `${photoSelected.assets[0].type}/${fileExtension}`
				} as any;

				const userPhotoUploadForm = new FormData();

				userPhotoUploadForm.append("avatar", photoFile);

				const avatarUpdtedResponse = await api.patch(
					"/users/avatar",
					userPhotoUploadForm,
					{
						headers: {
							"Content-Type": "multipart/form-data"
						}
					}
				);
				const userUpdated = user;
				userUpdated.avatar = avatarUpdtedResponse.data.avatar;
				await updateUserProfile(userUpdated);

				toast.show({
					title: "Foto atualizada!",
					placement: "top",
					bgColor: "green.500"
				});
			}
		} catch (error) {
			console.log(error);
		} finally {
			setPhotoIsLoading(false);
		}
	}

	async function handleUpdateProfile(data: FormDataProps) {
		try {
			setIsUpdating(true);
			await api.put("/users", data);

			const userUpdated = user;
			userUpdated.name = data.name;
			await updateUserProfile(userUpdated);
			toast.show({
				title: "Perfil atualizado com sucesso!",
				placement: "top",
				bgColor: "green.500"
			});
		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError
				? error.message
				: "Não foi possível atualizar os dados. Tente novamente mais tarde.";

			toast.show({
				title,
				placement: "top",
				bgColor: "red.500"
			});
		} finally {
			setIsUpdating(false);
		}
	}

	return (
		<VStack flex={1}>
			<ScreenHeader title="Perfil" />

			<ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
				<Center mt={6} px={10}>
					{photoIsLoading ? (
						<Skeleton
							w={PHOTO_SIZE}
							h={PHOTO_SIZE}
							rounded="full"
							startColor="gray.500"
							endColor="gray.400"
						/>
					) : (
						<UserPhoto
							source={
								user.avatar
									? {
											uri: `${api.defaults.baseURL}/avatar/${user.avatar}`
									  }
									: defaulUserPhotoImg
							}
							alt="Foto do usuário"
							size={PHOTO_SIZE}
						/>
					)}

					<TouchableOpacity onPress={handleUserPhotoSelected}>
						<Text
							color="green.500"
							fontWeight="bold"
							fontSize="md"
							mt={2}
							mb={8}
						>
							Alterar Foto
						</Text>
					</TouchableOpacity>

					<Controller
						control={control}
						name="name"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Nome"
								bg="gray.600"
								onChangeText={onChange}
								errorMessage={errors.name?.message}
								value={value}
							/>
						)}
					/>

					<Input
						bg="gray.600"
						placeholder="E-mail"
						value={user.email}
						isDisabled
					/>

					<Heading
						color="gray.200"
						fontSize="md"
						mb={2}
						alignSelf="flex-start"
						mt={12}
						fontFamily="heading"
					>
						Alterar senha
					</Heading>

					<Controller
						control={control}
						name="old_password"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Senha atual"
								bg="gray.600"
								secureTextEntry
								onChangeText={onChange}
								errorMessage={errors.old_password?.message}
								value={value}
							/>
						)}
					/>

					<Controller
						control={control}
						name="password"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Nova senha"
								bg="gray.600"
								secureTextEntry
								onChangeText={onChange}
								errorMessage={errors.password?.message}
								value={value!}
							/>
						)}
					/>

					<Controller
						control={control}
						name="confirmPassword"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Confirmar a Senha"
								bg="gray.600"
								secureTextEntry
								onChangeText={onChange}
								errorMessage={errors.confirmPassword?.message}
								value={value!}
							/>
						)}
					/>

					<Button
						title="Atualizar"
						mt={4}
						onPress={handleSubmit(handleUpdateProfile)}
						isLoading={isUpdating}
					/>
				</Center>
			</ScrollView>
		</VStack>
	);
}
