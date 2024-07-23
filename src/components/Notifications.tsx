import {
	CloseIcon,
	HStack,
	Icon,
	IconButton,
	Pressable,
	Text
} from "native-base";
import { OSNotification } from "react-native-onesignal";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";

type Props = {
	data: OSNotification;
	onClose: () => void;
};
export function Notification({ data, onClose }: Props) {
	function handlePressNotification() {
		if (data.launchURL) {
			Linking.openURL(data.launchURL);
			onClose();
		}
	}

	return (
		<Pressable
			bg="gray.500"
			borderWidth={1}
			borderColor="green.500"
			rounded="md"
			p={4}
			onPress={handlePressNotification}
			position="absolute"
			top={6}
			left={6}
			right={6}
		>
			<HStack justifyContent="space-between" alignItems="center">
				<Icon
					as={Ionicons}
					name="notifications-outline"
					size={5}
					color="green.500"
					mr={2}
				/>

				<Text fontSize="md" color="green.500" flex={1}>
					{data.title}
				</Text>

				<IconButton
					variant="unstyled"
					_focus={{ borderWidth: 0 }}
					icon={<CloseIcon size="3" />}
					_icon={{ color: "coolGray.100" }}
					color="black"
					onPress={onClose}
				/>
			</HStack>
		</Pressable>
	);
}
