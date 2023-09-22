import { ProjectLayout } from "@/experience/project/ProjectLayout";
import { Interfacer } from "@/interfaces";
import { APP_URL } from "@/lib/constants";
import { InterfaceList } from "@/experience/project/InterfaceList";
import { PROJECT_TABS } from "../constants";
import { type PublicUser } from "@/interfaces";

interface InterfacePageProps {
    projectId: string;
    projectSlug: string;
    projectName: string;
    isOwner: boolean;
    interfaces: Interfacer[];
    creator: PublicUser;
}

export function InterfacePage({ projectId, projectSlug, projectName, isOwner, interfaces, creator }: InterfacePageProps) {
    const hasInterfaces = interfaces?.length > 0;

    const getUrl = (i: Interfacer) => {
        return `${APP_URL}/${projectSlug}/${i.slug}`;
    };

    return (
        <ProjectLayout
            projectId={projectId}
            projectSlug={projectSlug}
            projectName={projectName}
            isOwner={isOwner}
            activeTab={PROJECT_TABS.interfaces.slug}
            creator={creator}
        >
            <div>
                {hasInterfaces ? (
                    <InterfaceList
                        interfaces={interfaces}
                        getUrl={getUrl}
                    />
                ) : (
                    <p>No interfaces yet.</p>
                )}
            </div>
        </ProjectLayout>
    );
}
