import "server-only";
import Table from "./table";
import Interfacer from "./interfacer";
import { get } from "../../../lib/helpers";
import styles from "../../home.module.css";
import { Header } from "@/components/Header";
import { Overview } from "@/experience/interfacer/overview";
import { Logo } from "@/components";
import { type Interfacer as InterfacerType } from "@/interfaces";

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
	const { response, interfacer, fetched } = await getData({
		projectSlug,
		interfaceSlug,
	});
	const config = interfacer.schema_config;
	const keys = config.keys;

	return (
		<>
			<Header />
			<main className={styles["main-container"]}>
				<Overview
					title={interfacer.title}
					projectId={response.results.data.id}
					interfaceId={interfacer.id}
				/>
				<div className={styles.container}>
					<Table
						data={fetched}
						columnData={keys}
						dataPath={config?.requests?.get?.data_path}
						endpoint={interfacer.endpoint}
					/>
					<div className={styles["form-container"]}>
						<h1>Create new</h1>
						<Interfacer interfacer={interfacer} />
					</div>
				</div>
			</main>
			<footer className={styles.footer}>
				<Logo />
				<p className={styles.footer__text}>
					Made with love for builders like you.
				</p>
				<p className={styles.footer__copy}>
					&copy; Carbonology Interactive LLC{" "}
					{new Date().getFullYear()}
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
	const getter = interfacer.schema_config?.requests?.get;
	let fetched = null;
	if (getter) {
		const getRes = await fetch(getter.uri, {
			method: getter.http_method,
			cache: "no-cache",
			headers: { ...getter.headers },
			body: JSON.stringify(getter.body),
		});
		const getJson = await getRes.json();
		const returnedData = get(getJson, getter?.data_path);
		fetched = returnedData;
	}

	return {
		response,
		interfacer,
		fetched,
	};
}
