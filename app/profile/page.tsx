import "server-only";

import { Profile } from "@/experience/profile";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata({ title: "Profile" });

export default async function ProfilePage() {
	/* @ts-expect-error server component */
	return <Profile />;
}
