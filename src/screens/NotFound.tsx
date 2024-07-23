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
import { AppNavigatorRoutesProps } from "@routes/app.routes";

export function NotFound() {
	const route = useRoute();
	const navigation = useNavigation<AppNavigatorRoutesProps>();
	console.log(route.name);
	function handleGoHome() {
		navigation.navigate("home");
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
						Tela não encontrada
					</Heading>
					<Button
						title="Voltar a tela inicial"
						onPress={handleGoHome}
					/>
				</Center>
			</VStack>
		</ScrollView>
	);
}
