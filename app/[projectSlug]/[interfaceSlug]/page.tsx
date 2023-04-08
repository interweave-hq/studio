import "server-only";

import { Suspense } from "react";
import { notFound } from "next/navigation";

import Interfacer from "./interfacer";
import styles from "../../home.module.css";
import { Logo, LoadingDots } from "@/components";
import { Overview } from "@/experience/interfacer/overview";
import { type Interfacer as InterfacerType } from "@/interfaces";
import { serverRequest } from "@/lib/api/serverRequest";
import { FetchTableData } from "@/experience/interfacer/FetchTableData";

export default async function Home({
	params,
}: {
	params: {
		projectSlug: string;
		interfaceSlug: string;
	};
}) {
	const projectSlug = params["projectSlug"];
	const interfaceSlug = params["interfaceSlug"];
	const { project, interfacer, access } = await getData({
		projectSlug,
		interfaceSlug,
	});
	const config = interfacer.schema_config;
	const keys = config.keys;

	const accessPermissions = access?.permissions;
	const canRead =
		!access ||
		accessPermissions.includes("Read") ||
		accessPermissions.includes("All");
	const canCreate =
		!access ||
		accessPermissions.includes("Create") ||
		accessPermissions.includes("All");
	const fetchData = canRead && interfacer.schema_config.requests?.get?.uri;
	const createData =
		canCreate && interfacer.schema_config.requests?.create?.uri;

	return (
		<>
			<main className={styles["main-container"]}>
				<Overview
					title={interfacer.title}
					projectId={project.id}
					interfaceId={interfacer.id}
					hash={interfacer.hash}
					buildTime={interfacer.build_time}
				/>
				<div className={styles.container}>
					{fetchData ? (
						<Suspense fallback={<LoadingDots />}>
							{/* @ts-expect-error server component */}
							<FetchTableData
								interfaceId={interfacer.id}
								keys={keys}
								endpoint={fetchData}
							/>
						</Suspense>
					) : null}
					{!createData ? null : (
						<div className={styles["form-container"]}>
							<h1>Create new</h1>
							<Interfacer interfacer={interfacer} />
						</div>
					)}
				</div>
			</main>
			<footer className={styles.footer}>
				<Logo />
				<p className={styles.footer__text}>
					Made with love for builders like you.
				</p>
				<p className={styles.footer__copy}>
					Carbonology Interactive LLC {new Date().getFullYear()}{" "}
					&copy;
				</p>
			</footer>
		</>
	);
}

async function getData({
	projectSlug,
	interfaceSlug,
}: {
	projectSlug: string;
	interfaceSlug: string;
}) {
	// Fetch project
	const {
		data: fetchProjectData,
		error: projectError,
		status,
	} = await serverRequest(`/api/v1/projects/${projectSlug}`);

	const { project: projectData, access } = fetchProjectData;

	if (!projectData || status === 401) {
		notFound();
	}

	if (projectError) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	const interfacer: InterfacerType = projectData.interfaces.find(
		(i: { [key: string]: string }) => i.slug === interfaceSlug
	);

	return {
		project: projectData,
		interfacer,
		access,
	};
}
