import { OneSignal } from "react-native-onesignal";

export function tagUserLogged(value: 'true' | 'false') {
	OneSignal.User.addTags({
		is_logged: value,
	});
}
type ITags = {
	count_exercise?: string;
	last_day?: string;
}
export async function updateTagLastDayTraining() {
	const today = new Date();
	const tags: ITags = await OneSignal.User.getTags();
	console.log(tags);
	let count = 1;
	if (tags.count_exercise !== undefined && tags.last_day !== undefined) {
		count = Number(tags.count_exercise) + 1;
		const lastDayExercise = new Date(tags.last_day).getDay();
		if (lastDayExercise === 6 && today.getDay() === 0) {
			count = 1;
		}
	}
	OneSignal.User.addTags({
		last_day: today.toLocaleDateString('en-US'),
		count_exercise: count
	});
}
