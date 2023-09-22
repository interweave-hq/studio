import "server-only";

import { Profile } from "@/experience/profile";
import { getMetadata } from "@/lib/metadata";
import { PageLayout } from "@/layouts/PageLayout";

export const metadata = getMetadata({ title: "Profile" });

export default async function ProfilePage() {
    return (
        <PageLayout>
            {/* @ts-expect-error server component */}
            <Profile />
        </PageLayout>
    );
}
