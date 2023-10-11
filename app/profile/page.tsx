import "server-only";

import { Profile } from "@/experience/profile";
import { getMetadata } from "@/lib/metadata";
import { PageLayout } from "@/layouts/PageLayout";
import { mixpanelServer } from "@/lib/analytics/mixpanelServer";

export const metadata = getMetadata({ title: "Profile" });

export default async function ProfilePage() {
    mixpanelServer.track("page_viewed", { page: `/profile` });
    return (
        <PageLayout>
            {/* @ts-expect-error server component */}
            <Profile />
        </PageLayout>
    );
}
