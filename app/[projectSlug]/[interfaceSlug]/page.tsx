import "server-only";
import Table from "./table";
import Interfacer from "./interfacer";
import styles from "../../home.module.css";
import { ComponentError, Header, Logo } from "@/components";
import { Overview } from "@/experience/interfacer/overview";
import { type Interfacer as InterfacerType } from "@/interfaces";
import { makeRequest } from "@/lib/api";

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
	const { response, interfacer, fetched, error } = await getData({
		projectSlug,
		interfaceSlug,
	});
	const config = interfacer.schema_config;
	const keys = config.keys;

	const fetchData = interfacer.schema_config.requests?.get?.uri;
	const createData = interfacer.schema_config.requests?.create?.uri;

	return (
		<>
			<Header />
			<main className={styles["main-container"]}>
				<Overview
					title={interfacer.title}
					projectId={response.results.data.id}
					interfaceId={interfacer.id}
					hash={interfacer.hash}
					buildTime={interfacer.build_time}
				/>
				<div className={styles.container}>
					{!fetchData ? null : error?.userError ? (
						<ComponentError
							componentName="Data Table"
							text={error.userError}
							details={error.technicalError}
						/>
					) : (
						<Table
							data={fetched}
							columnData={keys}
							endpoint={fetchData}
						/>
					)}
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
	const res = await fetch(
		`https://api.interweave.studio/api/v1/projects/${projectSlug}`,
		{ cache: "no-store" }
	);
	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}
	const response = await res.json();
	const results = response.results.data;
	const interfacer: InterfacerType = results.interfaces.find(
		(i: { [key: string]: string }) => i.slug === interfaceSlug
	);
	const { data, error } = await makeRequest({
		interfaceId: interfacer.id,
		method: "get",
	});

	return {
		response,
		interfacer,
		fetched: data,
		error,
	};
}
