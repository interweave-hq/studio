import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.css";
import { APP_URL } from "@/lib/constants";
import { serverRequest } from "@/lib/api/serverRequest";
import { AddTokens, TokenDisplay } from "@/experience/project/tokens";
import { LoadingDots, Header, InterfaceCard } from "@/components";

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

	return (
		<>
			<main className={styles.container}>
				<h1>{projectData.title}</h1>
				<div className={styles.section}>
					<h2 className={styles.section__header}>Interfaces</h2>
					{hasInterfaces ? (
						projectData.interfaces.map((i: any) => (
							<Link
								key={i.id}
								href={`${APP_URL}/${projectSlug}/${i.slug}`}
							>
								<InterfaceCard
									hash={i.hash}
									lastBuild={i.build_time}
									privacy={i.privacy}
									description={i.description}
									titleParts={{
										one: projectData.slug,
										two: i.slug,
									}}
								/>
							</Link>
						))
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
