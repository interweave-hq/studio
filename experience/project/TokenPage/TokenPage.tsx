import { Suspense } from "react";
import { LoadingDots } from "@/components";
import { ProjectLayout } from "@/experience/project/ProjectLayout";
import { AddTokens, TokenDisplay } from "@/experience/project/tokens";
import { notFound } from "next/navigation";
import { PROJECT_TABS } from "../constants";
import { type PublicUser } from "@/interfaces";

interface TokenPageProps {
    projectId: string;
    projectSlug: string;
    projectName: string;
    isOwner: boolean;
    creator: PublicUser;
}

export function TokenPage({ projectId, projectSlug, projectName, isOwner, creator }: TokenPageProps) {
    if (!isOwner) {
        return notFound();
    }
    return (
        <ProjectLayout
            projectId={projectId}
            projectSlug={projectSlug}
            projectName={projectName}
            isOwner={isOwner}
            activeTab={PROJECT_TABS.tokens.slug}
            creator={creator}
        >
            <div>
                <Suspense fallback={<LoadingDots />}>
                    {/* @ts-expect-error server component */}
                    <TokenDisplay projectSlug={projectSlug} />
                </Suspense>
                <AddTokens projectId={projectId} />
            </div>
        </ProjectLayout>
    );
}
