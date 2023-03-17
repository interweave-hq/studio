import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "../home.module.css";
import { APP_URL } from "@/lib/constants";

export default async function ProjectListing({
	params,
}: {
	params: {
		projectSlug: string;
	};
}) {
	const projectSlug = params["projectSlug"];
	const res = await getData({ projectSlug });
	const results = res.results.data;

	return (
		<main className={styles["main-container"]}>
			<h1>{results.title}</h1>
			{results.interfaces.map(
				(i: { id: string; title: string; slug: string }) => (
					<Link
						key={i.id}
						href={`${APP_URL}/${projectSlug}/${i.slug}`}
					>
						{i.title}
					</Link>
				)
			)}
		</main>
	);
}

async function getData({ projectSlug }: { projectSlug: string }) {
	const res = await fetch(
		`https://api.interweave.studio/api/v1/projects/${projectSlug}`,
		{ cache: "no-store" }
	);

	if (!res.ok) {
		notFound();
	}
	const json = await res.json();
	return json;
}
