import { CreateProject } from "@/experience/project/create";
import { PageLayout } from "@/layouts/PageLayout";
import { getMetadata } from "@/lib/metadata";
import { mixpanelServer } from "@/lib/analytics/mixpanelServer";

export const metadata = getMetadata({ title: "Create Project" });

export default async function ProjectListing() {
    mixpanelServer.track("page_viewed", { page: "/create" });
    return (
        <PageLayout>
            <CreateProject />
        </PageLayout>
    );
}
