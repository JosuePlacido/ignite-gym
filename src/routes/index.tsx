import { Loading } from "@components/Loading";
import { useAuth } from "@hooks/useAuth";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { Box, useTheme } from "native-base";
import { AppRoutes } from "./app.routes";

import { AuthRoutes } from "./auth.routes";
import { Notification } from "@components/Notifications";
import {
	NotificationWillDisplayEvent,
	OneSignal,
	OSNotification
} from "react-native-onesignal";
import { useEffect, useMemo, useState } from "react";
import { Linking } from "react-native";

export function Routes() {
	const { colors } = useTheme();
	const { user, isLoadingUserStorageData } = useAuth();
	const [notification, setNotification] = useState<OSNotification>();

	const theme = DefaultTheme;
	theme.colors.background = colors.gray[700];

	useEffect(() => {
		const handleNotification = (
			event: NotificationWillDisplayEvent
		): void => {
			event.preventDefault();
			const response = event.getNotification();
			console.log("chamou o hook setNotification");
			setNotification(response);
		};

		OneSignal.Notifications.addEventListener(
			"foregroundWillDisplay",
			handleNotification
		);
		return () =>
			OneSignal.Notifications.removeEventListener(
				"foregroundWillDisplay",
				handleNotification
			);
	}, []);

	const linking = useMemo(
		() => ({
			prefixes: ["com.rocketseat.ignitegym://", "exp+ignite-gym://"],
			config: !!user.id
				? {
						screens: {
							home: "home",
							history: "history",
							exercise: {
								path: "exercise/:exerciseId",
								parse: (exerciseId: string) => exerciseId
							},
							NotFound: {
								path: "*"
							}
						}
				  }
				: {
						screens: {
							signIn: {
								path: "signIn"
							},
							signUp: {
								path: "signUp"
							},
							NotFound: {
								path: "*"
							}
						}
				  }
		}),
		[user]
	);

	if (isLoadingUserStorageData) {
		return <Loading />;
	}

	return (
		<Box flex={1} bg="gray.700">
			<NavigationContainer theme={theme} linking={linking}>
				{user.id ? <AppRoutes /> : <AuthRoutes />}
				{notification?.title && (
					<Notification
						data={notification}
						onClose={() => setNotification(undefined)}
					/>
				)}
			</NavigationContainer>
		</Box>
	);
}
