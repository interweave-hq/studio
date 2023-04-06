import { serverRequest } from "@/lib/api/serverRequest";
import { LogOutButton } from "./LogOutButton";

export async function Profile() {
	const { data: user, error } = await getProfile();

	return (
		<div>
			<h1>{user.display_name}</h1>
			<LogOutButton />
		</div>
	);
}

async function getProfile() {
	return await serverRequest(`/api/v1/profile`);
}
