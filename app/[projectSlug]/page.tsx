import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "../home.module.css";
import { APP_URL } from "@/lib/constants";
import { serverRequest } from "@/lib/api/serverRequest";
import { AddTokens } from "@/experience/project/tokens";
import { authenticate } from "@/lib/auth";

export default async function ProjectListing({
	params,
}: {
	params: {
		projectSlug: string;
	};
}) {
	await authenticate();
	const projectSlug = params["projectSlug"];
	const { projectData, tokensData } = await getData({ projectSlug });
	const tokens = tokensData || [];
	return (
		<main className={styles["main-container"]}>
			<h1>{projectData.title}</h1>
			{projectData.interfaces.map(
				(i: { id: string; title: string; slug: string }) => (
					<Link
						key={i.id}
						href={`${APP_URL}/${projectSlug}/${i.slug}`}
					>
						{i.title}
					</Link>
				)
			)}
			<AddTokens projectId={projectData.id} />
			{tokens.map((t) => (
				<p key={t.id}>{t.nickname}</p>
			))}
		</main>
	);
}

async function getData({ projectSlug }: { projectSlug: string }) {
	const { data: projectData, error: interfaceError } = await serverRequest(
		`/api/v1/projects/${projectSlug}`
	);
	const { data: tokensData, error: tokensErrors } = await serverRequest(
		`/api/v1/projects/${projectSlug}/api-tokens`
	);
	if (!projectData) {
		notFound();
	}

	return {
		projectData,
		tokensData,
	};
}
