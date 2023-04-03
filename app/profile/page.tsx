import "server-only";

import { Header } from "@/components";
import { authenticate } from "@/lib/auth";
import { Profile } from "@/experience/profile";

export default async function ProfilePage() {
	const { user } = await authenticate();

	return (
		<>
			<Header user={user} />
			<main>
				<Profile user={user} />
			</main>
		</>
	);
}
