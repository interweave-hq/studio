"use client";

import { useEffect, useState } from "react";
import {
	type SchemaKeys,
	type Schema,
	type Request,
} from "@interweave/interweave";
import { clientRequest, type RequestReturn } from "@/lib/api/clientRequest";
import { Error, LoadingDots } from "@/components";
import { type Error as ErrorType } from "@/interfaces/Error";
import Table from "./table";
import { ParameterInputs } from "../ParameterInputs";

import styles from "./styles.module.css";
import { VariableState } from "@/interfaces";
import { extractVariables } from "@/lib/parsers";
import { get } from "@/lib/helpers";
import { logMakeRequestResults } from "@/lib/loggers";

const DEFAULT_ERROR: ErrorType = { userError: "", technicalError: "" };

/**
 * We'll process this in two steps
 * 1. coordinate the form state so that defaults are handled and everything in sync
 * 2. after submit, use form state to build our URL
 *
 */
export function FetchTableData({
	keys,
	getRequest,
	onUpdate,
	onDelete,
	interfaceId,
	schema,
	setParametersState,
	setRowState,
	variables,
	parametersLoading,
	setParametersLoading,
	reload,
	triggerReload,
}: {
	keys: SchemaKeys;
	getRequest: Request;
	onUpdate?: () => void;
	onDelete?: () => void;
	interfaceId: string;
	schema: Schema;
	setParametersState: (q: Record<string, unknown>) => void;
	setRowState: (q: Record<string, unknown>) => void;
	variables: VariableState & { row?: Record<string, unknown> };
	parametersLoading: boolean;
	setParametersLoading: (v: any) => void;
	reload?: () => void;
	triggerReload?: boolean;
}) {
	const [data, setData] = useState(null);
	const [error, setError] = useState(DEFAULT_ERROR);
	const [isLoading, setLoading] = useState(true);
	const [requestDuration, setRequestDuration] = useState(0);

	// Whenever value state is updated after button click, refetch the data
	useEffect(() => {
		(async () => {
			try {
				setError(DEFAULT_ERROR);
				setLoading(true);
				if (parametersLoading) return;

				const {
					data: tableData,
					error,
					duration,
				} = await getTableData({
					interfaceId,
					...variables,
				});

				logMakeRequestResults({ key: "get", data: tableData, error });

				if (error) {
					setError(error);
					setLoading(false);
					console.error(error);
					return;
				}
				setRequestDuration(duration || 0);
				setData(tableData.parsed);
				setLoading(false);
			} catch (err) {
				setLoading(false);
				logMakeRequestResults({ key: "get", data, error: err });
				console.error(err);
			}
		})();
	}, [
		triggerReload,
		variables.form,
		variables.parameters,
		parametersLoading,
	]);

	const url = getRequest.uri;

	// if theres URL parameters, wait until something has been submitted
	// if theres required query parameters, wait until something has been submitted
	const parameters = getRequest?.parameters;
	const hasUrlParameters = url.indexOf("<") > -1;

	if (hasUrlParameters && !parameters) {
		const badConfigError: RequestReturn = {
			data: [],
			error: {
				userError: "Bad configuration. Please add a parameters key.",
				technicalError:
					"Your URL specifies a dynamic value but does not include a parameters key to define its shape.",
			},
			status: 400,
		};
		setError(badConfigError.error);
	}

	let displayUrl = url;
	const possibleVariables = extractVariables(displayUrl);
	possibleVariables.forEach((v) => {
		const possibleValue = get(variables, v, null);
		const newUrl = displayUrl.replaceAll(`<${v}>`, possibleValue);
		displayUrl = newUrl;
	});

	return (
		<div>
			<ParameterInputs
				parameters={parameters}
				setFormState={setParametersState}
				parameterState={variables.parameters}
				setParametersLoading={setParametersLoading}
			/>
			{error?.userError ? (
				<Error
					title="Data Table Failed To Load"
					text={error.userError}
					details={error.technicalError}
				/>
			) : null}
			{isLoading ? (
				<div className={styles.loading}>
					<LoadingDots />
				</div>
			) : null}
			{data ? (
				<Table
					data={data}
					columnData={keys}
					uri={displayUrl}
					requestDuration={requestDuration}
					reload={reload}
					onUpdate={onUpdate}
					onDelete={onDelete}
					schema={schema}
					setRowState={setRowState}
				/>
			) : null}
		</div>
	);
}

async function getTableData({
	interfaceId,
	parameters,
}: {
	interfaceId: string;
	parameters: Record<string, unknown>;
}) {
	return await clientRequest(`/api/v1/interfaces/${interfaceId}`, {
		method: "POST",
		requestBody: {
			parameters: parameters,
			method: "get",
			return_array: true,
		},
	});
}
