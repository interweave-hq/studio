import { Suspense } from "react";
import { notFound } from "next/navigation";
import styles from "./styles.module.css";
import { APP_URL } from "@/lib/constants";
import { serverRequest } from "@/lib/api/serverRequest";
import { AddTokens, TokenDisplay } from "@/experience/project/tokens";
import { InterfaceList } from "@/experience/project/InterfaceList";
import { LoadingDots, InterfaceCard } from "@/components";
import { Interfacer } from "@/interfaces";

export default async function ProjectListing({
	params,
}: {
	params: {
		projectSlug: string;
	};
}) {
	const projectSlug = params["projectSlug"];
	const { data: projectData } = await getProject({ projectSlug });
	const hasInterfaces = projectData?.interfaces?.length > 0;

	const getUrl = (i: Interfacer) => {
		return `${APP_URL}/${projectSlug}/${i.slug}`;
	};

	return (
		<>
			<main className={styles.container}>
				<div className={styles.section}>
					<h2 className={styles.section__header}>
						{projectData.title}
					</h2>
					<p>Project ID: {projectData.id}</p>
				</div>
				<div className={styles.section}>
					<h2 className={styles.section__header}>Interfaces</h2>
					{hasInterfaces ? (
						<InterfaceList
							interfaces={projectData.interfaces}
							getUrl={getUrl}
						/>
					) : (
						<p>No interfaces yet. Create your first.</p>
					)}
				</div>
				<div className={styles.section}>
					<h2 className={styles.section__header}>API Tokens</h2>
					<AddTokens projectId={projectData.id} />
					<Suspense fallback={<LoadingDots />}>
						{/* @ts-expect-error server component */}
						<TokenDisplay projectSlug={projectSlug} />
					</Suspense>
				</div>
			</main>
		</>
	);
}

async function getProject({ projectSlug }: { projectSlug: string }) {
	const {
		data: fetchProjectData,
		error: interfaceError,
		status,
	} = await serverRequest(`/api/v1/projects/${projectSlug}`);

	const { project: projectData, access } = fetchProjectData;

	if (!projectData || status === 401 || access) {
		notFound();
	}

	return {
		data: projectData,
	};
}
