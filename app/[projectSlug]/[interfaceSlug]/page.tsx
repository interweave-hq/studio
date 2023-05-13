import "server-only";

import { notFound } from "next/navigation";

import styles from "../../home.module.css";
import { Overview } from "@/experience/interfacer/overview";
import { type Interfacer as InterfacerType } from "@/interfaces";
import { serverRequest } from "@/lib/api/serverRequest";
import { AuthorizationKeysWizard } from "@/experience/interfacer/AuthorizationKeysWizard";
import { DeleteAPITokens } from "@/experience/interfacer/DeleteAPITokens";
import { InterfaceContextProvider } from "../../../providers/InterfaceProvider";
import { TableAndForm } from "@/experience/interfacer/TableAndForm";
import { getMetadata } from "@/lib/metadata";

type Params = {
	projectSlug: string;
	interfaceSlug: string;
};

export async function generateMetadata({ params }: { params: Params }) {
	const { project, interfacer } = await getData({
		projectSlug: params.projectSlug,
		interfaceSlug: params.interfaceSlug,
	});
	return getMetadata({ title: `${interfacer.title} - ${project.title}` });
}

export default async function Home({ params }: { params: Params }) {
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

	// This is where we decide whether to show the "Reset Authentication" button
	// we look through each request and see if it has an authentication_key
	// If so, we can unset it
	const possibleRequests = interfacer.schema_config.requests;
	let hasAuthKeys;
	if (possibleRequests) {
		hasAuthKeys =
			Object.keys(possibleRequests).filter((r) => {
				if (r in possibleRequests) {
					return possibleRequests[r as keyof typeof possibleRequests]
						?.authentication_key;
				}
			}).length > 0;
	}

	// Figure out if more API keys are needed
	// We want to return the scheme, but the scheme may live on another interface in the project
	// This logic sucks. Ideally handled by the backend
	const authSchemesThatNeedUserInput: object[] = [];
	needsKeys.map((kString: string) => {
		const target = interfacer?.schema_config?.authentication || {};
		if (kString in target) {
			authSchemesThatNeedUserInput.push({
				...target[kString],
				key: kString,
			});
		} else {
			// Look through other interfaces
			project.interfaces.map((int: any) => {
				const deepTarget = int?.schema_config?.authentication || {};
				if (kString in deepTarget) {
					authSchemesThatNeedUserInput.push({
						...target[kString],
						key: kString,
					});
				}
			});
		}
	});

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
				<InterfaceContextProvider interfaceId={interfacer.id}>
					<Overview
						title={interfacer.title}
						description={interfacer.description}
						interfaceId={interfacer.id}
						hash={interfacer.hash}
						buildTime={interfacer.build_time}
						privacy={interfacer.privacy}
					/>
					<div className={styles.container}>
						<TableAndForm
							interfacer={interfacer}
							fetchData={fetchData}
							createData={createData}
							deleteRequest={deleteRequest}
							updateRequest={updateRequest}
							keys={keys}
						/>
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
				</InterfaceContextProvider>
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

	// Access is an array of InterfaceAccess objects
	const {
		project: projectData,
		access,
		is_owner: isOwner,
	} = fetchProjectData;

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

	// If they don't have an access object, get out of here
	const appliedAccess = isOwner
		? undefined
		: access.find((a: any) => a.interface_id === interfacer.id);

	if (!appliedAccess && !isOwner) {
		notFound();
	}

	// Check if the token is present and valid on the backend
	// The token doesnt ever have to come to the frontend
	// Fetch tokens that need inputting
	const { data: requiredTokensData, error: requiredTokensError } =
		await serverRequest(
			`/api/v1/projects/${projectData.id}/interfaces/${interfacer.id}/third-party-tokens/require-auth`
		);

	if (requiredTokensError) {
		console.error(requiredTokensError.technicalError);
		throw new Error(
			"Failed to find required token data. Returning an error to protect user data."
		);
	}
	const needsKeys = requiredTokensData.unsatisfied_auth_keys;

	return {
		project: projectData,
		interfacer,
		access: appliedAccess,
		needsKeys,
	};
}
