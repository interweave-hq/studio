import "server-only";

import { notFound } from "next/navigation";

import Interfacer from "./interfacer";
import styles from "../../home.module.css";
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
	const fetchData = canRead && interfacer.schema_config.requests?.get;
	const createData = canCreate && interfacer.schema_config.requests?.create;

	return (
		<>
			<main className={styles["main-container"]}>
				<Overview
					title={interfacer.title}
					description={interfacer.description}
					interfaceId={interfacer.id}
					hash={interfacer.hash}
					buildTime={interfacer.build_time}
				/>
				<div className={styles.container}>
					{fetchData ? (
						<FetchTableData
							interfaceId={interfacer.id}
							keys={keys}
							request={fetchData}
						/>
					) : null}
					{!createData ? null : (
						<div className={styles["form-container"]}>
							<h1>Create new</h1>
							<Interfacer interfacer={interfacer} />
						</div>
					)}
				</div>
			</main>
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
