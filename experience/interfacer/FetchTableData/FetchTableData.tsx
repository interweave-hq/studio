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
	updateRequest,
	deleteRequest,
	interfaceId,
	schema,
	setParametersState,
	setRowState,
	variables,
	parametersLoading,
	setParametersLoading,
}: {
	keys: SchemaKeys;
	getRequest: Request;
	updateRequest: Request;
	deleteRequest: Request;
	interfaceId: string;
	schema: Schema;
	setParametersState: (q: Record<string, unknown>) => void;
	setRowState: (q: Record<string, unknown>) => void;
	variables: VariableState;
	parametersLoading: boolean;
	setParametersLoading: (v: any) => void;
}) {
	const [data, setData] = useState(null);
	const [error, setError] = useState(DEFAULT_ERROR);
	const [isLoading, setLoading] = useState(true);
	const [requestDuration, setRequestDuration] = useState(0);

	// Boolean switch, whenever value changes, we rerun the query
	const [triggerReload, setTriggerReload] = useState(false);

	const url = getRequest.uri;

	// if theres URL parameters, wait until something has been submitted
	// if theres required query parameters, wait until something has been submitted
	const parameters = getRequest?.parameters;
	const hasUrlParameters = url.indexOf("<") > -1;

	// Whenever value state is updated after button click, refetch the data
	useEffect(() => {
		(async () => {
			try {
				setError(DEFAULT_ERROR);
				setLoading(true);
				if (parametersLoading) return;
				const { data, error, duration } = await getTableData({
					interfaceId,
					url: url,
					...variables,
				});

				if (error) {
					setError(error);
					setLoading(false);
					console.error(error);
					return;
				}
				setRequestDuration(duration || 0);
				setData(data);
				setLoading(false);
			} catch (err) {
				setLoading(false);
				console.error(err);
			}
		})();
	}, [triggerReload, variables, parametersLoading]);

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

	const preparedDeleteRequest = deleteRequest
		? prepareDeleteRequest({
				interfaceId,
				request: deleteRequest,
				variables,
		  })
		: deleteRequest;

	const preparedUpdateRequest = updateRequest
		? prepareUpdateRequest({
				interfaceId,
				request: updateRequest,
				variables,
		  })
		: updateRequest;

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
					uri={url}
					requestDuration={requestDuration}
					reload={() => setTriggerReload(!triggerReload)}
					deleteRequest={preparedDeleteRequest}
					updateRequest={preparedUpdateRequest}
					schema={schema}
					setRowState={setRowState}
					variables={variables}
				/>
			) : null}
		</div>
	);
}

async function getTableData({
	interfaceId,
	url,
	parameters,
}: {
	interfaceId: string;
	url: string;
	parameters: Record<string, unknown>;
}) {
	return await clientRequest(`/api/v1/interfaces/${interfaceId}`, {
		method: "POST",
		requestBody: {
			parameters: parameters,
			method: "get",
			uri: url,
			return_array: true,
		},
	});
}

const prepareDeleteRequest =
	({
		interfaceId,
		request,
		variables,
	}: {
		interfaceId: string;
		request: Request;
		variables: VariableState;
	}) =>
	async ({ row }: { row: Record<string, any> }): Promise<RequestReturn> => {
		return await clientRequest(`/api/v1/interfaces/${interfaceId}`, {
			method: "POST",
			requestBody: {
				method: "delete",
				...variables,
				row: row.original,
			},
		});
	};

const prepareUpdateRequest =
	({
		interfaceId,
		request,
		variables,
	}: {
		interfaceId: string;
		request: Request;
		variables: VariableState;
	}) =>
	async ({
		row,
		form,
	}: {
		row?: Record<string, any>;
		form?: Record<string, any>;
	}): Promise<RequestReturn> => {
		return await clientRequest(`/api/v1/interfaces/${interfaceId}`, {
			method: "POST",
			requestBody: {
				method: "update",
				...variables,
				row,
				form,
			},
		});
	};
