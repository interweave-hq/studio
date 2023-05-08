"use client";

import { useState } from "react";
import { type Request, type SchemaKeys } from "@interweave/interweave";

import { FetchTableData } from "@/experience/interfacer/FetchTableData";
import { Interfacer } from "@/experience/interfacer/Interfacer";
import {
	type Interfacer as InterfacerType,
	type VariableState,
} from "@/interfaces";

import styles from "./styles.module.css";

export function TableAndForm({
	interfacer,
	keys,
	fetchData,
	createData,
	updateRequest,
	deleteRequest,
}: {
	interfacer: InterfacerType;
	keys: SchemaKeys;
	fetchData: Request;
	createData: Request;
	updateRequest: Request;
	deleteRequest: Request;
}) {
	const [parametersState, setParametersState] = useState({});
	const [rowState, setRowState] = useState({});

	const variables: VariableState = {
		parameters: parametersState,
		row: rowState,
		form: {},
	};

	return (
		<>
			{fetchData ? (
				<div className={styles["table-container"]}>
					<FetchTableData
						interfaceId={interfacer.id}
						keys={keys}
						getRequest={fetchData}
						updateRequest={updateRequest}
						deleteRequest={deleteRequest}
						schema={interfacer.schema_config}
						setParametersState={(q) => setParametersState(q)}
						setRowState={(r) => setRowState(r)}
					/>
				</div>
			) : null}
			{!createData ? null : (
				<div className={styles["form-container"]}>
					<h2>Create</h2>
					<Interfacer
						interfaceId={interfacer.id}
						schema={interfacer.schema_config}
						variables={variables}
					/>
				</div>
			)}
		</>
	);
}
