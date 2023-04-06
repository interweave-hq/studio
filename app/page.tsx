import Link from "next/link";
import styles from "./home.module.css";

import { Header } from "@/components";
import { serverRequest } from "@/lib/api/serverRequest";
import { Suspense } from "react";
import { authenticate } from "@/lib/auth";

export default async function Home() {
	const { user } = await authenticate({ optional: true });
	const { data: projects, error } = await getProjects();

	return (
		<>
			<Header user={user} />
			<main className={styles["main-container"]}>
				<h1>Hello</h1>
				<Suspense>
					{error
						? null
						: projects.map((p: any) => (
								<Link key={p.id} href={`/${p.slug}`}>
									{p.title}
								</Link>
						  ))}
				</Suspense>
			</main>
		</>
	);
}

async function getProjects() {
	return await serverRequest("/api/v1/projects");
}
