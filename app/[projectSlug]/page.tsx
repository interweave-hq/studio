import { notFound } from "next/navigation";
import { serverRequest } from "@/lib/api/serverRequest";
import { TokenPage, InterfacePage, PROJECT_TABS } from "@/experience/project";
import { getMetadata } from "@/lib/metadata";
import { authenticate } from "@/lib/auth";
import { PageLayout } from "@/layouts/PageLayout";
import { mixpanelServer } from "@/lib/analytics";

type Params = {
    projectSlug: string;
};

type SearchParams = Record<string, string>;

export async function generateMetadata({ params }: { params: Params }) {
    const { data } = await getProject({ projectSlug: params.projectSlug });
    return getMetadata({ title: data.title });
}

export default async function ProjectListing({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
    const { user } = await authenticate({ optional: true });
    const projectSlug = params["projectSlug"];
    const { data: projectData } = await getProject({ projectSlug });
    const tab = searchParams["tab"];
    const isOwner = projectData.created_by_user_id === user?.id;
    const creator = projectData.created_by_user;

    mixpanelServer.track("page_viewed", { page: `/${projectSlug}`, distinct_id: user?.id });

    if (tab === PROJECT_TABS.tokens.slug) {
        return (
            <PageLayout>
                <TokenPage
                    projectId={projectData.id}
                    projectName={projectData.title}
                    projectSlug={projectData.slug}
                    isOwner={isOwner}
                    creator={creator}
                />
            </PageLayout>
        );
    }

    if (tab === PROJECT_TABS.interfaces.slug || !tab) {
        return (
            <PageLayout>
                <InterfacePage
                    projectId={projectData.id}
                    projectName={projectData.title}
                    projectSlug={projectData.slug}
                    isOwner={isOwner}
                    interfaces={projectData.interfaces}
                    creator={creator}
                />
            </PageLayout>
        );
    }

    return notFound();
}

async function getProject({ projectSlug }: { projectSlug: string }) {
    const { data: fetchProjectData, error: interfaceError, status } = await serverRequest(`/api/v1/projects/${projectSlug}`);

    const { project: projectData, access } = fetchProjectData;

    if (!projectData || status === 401 || access) {
        notFound();
    }

    return {
        data: projectData,
    };
}
