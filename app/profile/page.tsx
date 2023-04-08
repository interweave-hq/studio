import "server-only";

import { Profile } from "@/experience/profile";

export default async function ProfilePage() {
	/* @ts-expect-error server component */
	return <Profile />;
}
