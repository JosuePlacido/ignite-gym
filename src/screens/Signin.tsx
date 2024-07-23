import {
	VStack,
	Image,
	Text,
	Center,
	Heading,
	ScrollView,
	useToast
} from "native-base";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import LogoSvg from "@assets/logo.svg";
import BackgroundImg from "@assets/background.png";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import AppError from "api/src/utils/AppError";
import { useState } from "react";

type FormDataProps = {
	email: string;
	password: string;
};

const signIpSchema = yup.object({
	email: yup.string().required("Informe o e-mail").email("E-mail inválido"),
	password: yup.string().required("Informe a senha")
});

export function SignIn() {
	const { name } = useRoute();
	const [isLoading, setIsLoading] = useState(false);
	const { singIn } = useAuth();
	const toast = useToast();
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<FormDataProps>({
		resolver: yupResolver(signIpSchema)
	});
	const navigation = useNavigation<AuthNavigatorRoutesProps>();

	function handleNewAccount() {
		navigation.navigate("signUp");
	}

	async function handleSignIn({ email, password }: FormDataProps) {
		try {
			setIsLoading(true);
			await singIn(email, password);
		} catch (error) {
			const isAppError = error instanceof AppError;

			const title = isAppError
				? error.message
				: "Não foi possível entrar. Tente novamente mais tarde.";

			toast.show({
				title,
				placement: "top",
				bgColor: "red.500"
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			showsVerticalScrollIndicator={false}
		>
			<Image
				source={BackgroundImg}
				defaultSource={BackgroundImg}
				alt="Pessoas treinando"
				position="absolute"
				resizeMode="stretch"
			/>
			<VStack flex={1} px={10} pb={16}>
				<Center my={24}>
					<LogoSvg />
					<Text color="gray.100" fontSize="sm">
						Treine sua mente e o seu corpo.
					</Text>
				</Center>

				<Center>
					<Heading
						color="gray.100"
						fontSize="xl"
						mb={6}
						fontFamily="heading"
					>
						{name === "NotFound"
							? "Faça login para acessar a tela"
							: "Acesse a conta"}
					</Heading>
					<Controller
						control={control}
						name="email"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="E-mail"
								keyboardType="email-address"
								autoCapitalize="none"
								onChangeText={onChange}
								errorMessage={errors.email?.message}
								value={value}
							/>
						)}
					/>
					<Controller
						control={control}
						name="password"
						render={({ field: { onChange, value } }) => (
							<Input
								placeholder="Senha"
								secureTextEntry
								onChangeText={onChange}
								errorMessage={errors.password?.message}
								value={value}
							/>
						)}
					/>
					<Button
						title="Acessar"
						onPress={handleSubmit(handleSignIn)}
						isLoading={isLoading}
					/>
				</Center>

				<Center mt={24}>
					<Text
						color="gray.100"
						fontSize="sm"
						mb={3}
						fontFamily="body"
					>
						Ainda não tem acesso?
					</Text>
				</Center>

				<Button
					title="Criar Conta"
					variant="outline"
					onPress={handleNewAccount}
				/>
			</VStack>
		</ScrollView>
	);
}
