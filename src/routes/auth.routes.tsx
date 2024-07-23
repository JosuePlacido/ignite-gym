import {
	createNativeStackNavigator,
	NativeStackNavigationProp
} from "@react-navigation/native-stack";
import { NotFound } from "@screens/NotFound";
import { SignIn } from "@screens/Signin";
import { SignUp } from "@screens/Signup";
import { tagUserLogged } from "src/Notifications/tags";

type AuthRoutes = {
	signIn: undefined;
	signUp: undefined;
	NotFound: undefined;
	NoMatch: undefined;
	"*": undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
	tagUserLogged("false");
	return (
		<Navigator screenOptions={{ headerShown: false }}>
			<Screen name="signIn" component={SignIn} />
			<Screen name="signUp" component={SignUp} />
			<Screen name="NotFound" component={SignIn} />
		</Navigator>
	);
}
