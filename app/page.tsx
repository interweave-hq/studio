import styles from "./home.module.css";

import Link from "next/link";
import { Header } from "@/components";
import { authenticate } from "@/lib/auth";
import { serverRequest } from "@/lib/api/serverRequest";
import { Suspense } from "react";

export default async function Home() {
	const { user } = await authenticate({ optional: true });
	const { data: projects, error } = await getProjects({ authorized: !!user });

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
				{user ? <p>{user.id}</p> : null}
				{user ? <p>{user.display_name}</p> : null}
			</main>
		</>
	);
}

async function getProjects({ authorized }: { authorized: boolean }) {
	if (authorized) {
		return await serverRequest("/api/v1/projects");
	}
	return {
		data: null,
		error: "Unauthorized",
	};
}
