import "server-only";

import { notFound } from "next/navigation";

import Interfacer from "./interfacer";
import styles from "../../home.module.css";
import { Overview } from "@/experience/interfacer/overview";
import { type Interfacer as InterfacerType } from "@/interfaces";
import { serverRequest } from "@/lib/api/serverRequest";
import { FetchTableData } from "@/experience/interfacer/FetchTableData";
import { AuthorizationKeysWizard } from "@/experience/interfacer/AuthorizationKeysWizard";
import { DeleteAPITokens } from "@/experience/interfacer/DeleteAPITokens";

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
	const { project, interfacer, access, needsKeys } = await getData({
		projectSlug,
		interfaceSlug,
	});
	const config = interfacer.schema_config;
	const keys = config.keys;

	// If there's no access, I think we assume they have permission
	// we only create an Access object if they're invited
	// otherwise it's public and accessible?
	const accessPermissions = access?.permissions;
	const canRead =
		!access ||
		accessPermissions.includes("Read") ||
		accessPermissions.includes("All");
	const canCreate =
		!access ||
		accessPermissions.includes("Create") ||
		accessPermissions.includes("All");
	const canDelete =
		!access ||
		accessPermissions.includes("Delete") ||
		accessPermissions.includes("All");
	const canUpdate =
		!access ||
		accessPermissions.includes("Update") ||
		accessPermissions.includes("All");
	const fetchData = canRead && interfacer.schema_config.requests?.get;
	const createData = canCreate && interfacer.schema_config.requests?.create;
	const deleteRequest =
		canDelete && interfacer.schema_config.requests?.delete;
	const updateRequest =
		canDelete && interfacer.schema_config.requests?.update;

	const hasAuthKeys =
		Object.keys(interfacer.schema_config.authentication || {}).length > 0;
	// Figure out if more API keys are needed
	const authSchemesThatNeedUserInput = needsKeys.map((kString: string) => ({
		...interfacer.schema_config.authentication![kString],
		key: kString,
	}));

	if (authSchemesThatNeedUserInput.length > 0) {
		return (
			<main>
				<AuthorizationKeysWizard
					projectId={project.id}
					interfaceId={interfacer.id}
					schemes={authSchemesThatNeedUserInput}
				/>
			</main>
		);
	}

	return (
		<>
			<main className={styles["main-container"]}>
				<Overview
					title={interfacer.title}
					description={interfacer.description}
					interfaceId={interfacer.id}
					hash={interfacer.hash}
					buildTime={interfacer.build_time}
					privacy={interfacer.privacy}
				/>
				<div className={styles.container}>
					{fetchData ? (
						<div className={styles["table-container"]}>
							<FetchTableData
								interfaceId={interfacer.id}
								keys={keys}
								getRequest={fetchData}
								updateRequest={updateRequest}
								deleteRequest={deleteRequest}
							/>
						</div>
					) : null}
					{!createData ? null : (
						<div className={styles["form-container"]}>
							<h1>Create new</h1>
							<Interfacer interfacer={interfacer} />
						</div>
					)}
				</div>
				{hasAuthKeys ? (
					<div
						className={
							styles["delete-authentication-button-container"]
						}
					>
						<DeleteAPITokens
							interfaceId={interfacer.id}
							projectId={project.id}
						/>
					</div>
				) : null}
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

	// Check if the token is present and valid on the backend
	// The token doesnt ever have to come to the frontend
	// Fetch tokens that need inputting
	const { data: requiredTokensData, error: requiredTokensError } =
		await serverRequest(
			`/api/v1/projects/${projectData.id}/third-party-tokens/require-auth`,
			{
				method: "POST",
				requestBody: {
					projectId: projectData.id,
					interfaceId: interfacer.id,
				},
			}
		);
	if (requiredTokensError) {
		console.error(requiredTokensError.technicalError);
		throw new Error(
			"Failed to find required token data. Returning an error to protect user data."
		);
	}
	const needsKeys = requiredTokensData.unsatisifed_auth_keys;

	return {
		project: projectData,
		interfacer,
		access,
		needsKeys,
	};
}
