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

const notReadyReturn: RequestReturn = {
	data: [],
	error: {
		userError: "Please fill out the inputs above.",
		technicalError: "A parameter is required.",
	},
	status: 400,
};

interface QueryState {
	[key: string]: {
		isOptional: boolean;
		isSearchParam: boolean;
		value: any;
	};
}

const DEFAULT_ERROR: ErrorType = { userError: "", technicalError: "" };

const simplifyQueryState = (
	queryState: QueryState
): Record<string, unknown> => {
	const obj: Record<string, unknown> = {};
	Object.keys(queryState).forEach((k) => {
		obj[k] = queryState[k].value;
	});
	return obj;
};

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
}: {
	keys: SchemaKeys;
	getRequest: Request;
	updateRequest: Request;
	deleteRequest: Request;
	interfaceId: string;
	schema: Schema;
	setParametersState: (q: Record<string, unknown>) => void;
	setRowState: (q: Record<string, unknown>) => void;
}) {
	const [data, setData] = useState(null);
	const [error, setError] = useState(DEFAULT_ERROR);
	const [queryState, setQueryState] = useState<QueryState>({});
	const [makeRequest, setMakeRequest] = useState(false);
	const [isLoading, setLoading] = useState(true);
	const [requestDuration, setRequestDuration] = useState(0);
	// Boolean switch, whenever value changes, we rerun the query
	const [triggerReload, setTriggerReload] = useState(false);

	const url = getRequest.uri;

	// if theres URL parameters, wait until something has been submitted
	// if theres required query parameters, wait until something has been submitted
	const parameters = getRequest?.parameters;
	const parameterKeys = parameters ? Object.keys(parameters) : [];
	const hasUrlParameters = url.indexOf("<") > -1;

	const setFormState = (data: any) => {
		for (const [key, value] of Object.entries(data)) {
			setQueryState((prev: QueryState) => ({
				...prev,
				[key]: {
					...prev[key],
					value,
				},
			}));
		}
	};

	// Initialize value state store, keep it organized as simple objects
	useEffect(() => {
		if (parameters) {
			if (parameterKeys.length > 0) {
				parameterKeys.forEach((paramKey) => {
					const param = parameters[paramKey];
					const isSearchParam = !(url.indexOf(paramKey) > -1);
					setQueryState((prev) => ({
						...prev,
						[paramKey]: {
							isOptional: !!param.schema?.is_optional,
							isSearchParam,
							value: param.schema?.default_value,
						},
					}));
				});
			}
		}
		setParametersState(simplifyQueryState(queryState));
	}, []);

	// Whenever our values change, let's try to fill in the URL and replace the dynamic parts
	// We also check to make sure the required parameters are entered
	useEffect(() => {
		if (parameters) {
			if (parameterKeys.length > 0) {
				let allGood = true;
				parameterKeys.forEach((paramKey) => {
					const param = parameters[paramKey];
					const value =
						queryState[paramKey]?.value ||
						param.schema.default_value;
					const isRequired = !param.schema.is_optional;
					if (isRequired && !value) {
						allGood = false;
					}
				});
				setMakeRequest(allGood);
			}
		}
		setParametersState(simplifyQueryState(queryState));
	}, [queryState]);

	// Whenever our parameters or URL changes, we check to see if we can make our request
	useEffect(() => {
		if (!parameters || !hasUrlParameters) {
			setMakeRequest(true);
		}
	}, [parameters, hasUrlParameters]);

	// Whenever value state is updated after button click, refetch the data
	useEffect(() => {
		(async () => {
			try {
				if (!makeRequest) return;
				setError(DEFAULT_ERROR);
				setLoading(true);
				// const fullUrl = new URL(url);
				// const query = getUrlQueryParamaters(queryState);
				// fullUrl.search = query.toString().replaceAll("%2C", ",");
				// setUrl(fullUrl.href);
				// If we pass a URL override, the request config URL wont get used,
				// So lets move the query parsing logic into our setVariable algorithm on the backend
				// We can attach the variableData as an object but maybe attach another parameter that says to set it as the query state
				//
				const { data, error, duration } = makeRequest
					? await getTableData({
							interfaceId,
							url: url,
							parameters: simplifyQueryState(queryState),
					  })
					: notReadyReturn;

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
	}, [queryState, makeRequest, triggerReload]);

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
				parameters: queryState,
		  })
		: deleteRequest;

	const preparedUpdateRequest = updateRequest
		? prepareUpdateRequest({
				interfaceId,
				request: updateRequest,
				parameters: queryState,
		  })
		: updateRequest;

	return (
		<div>
			<ParameterInputs
				parameters={parameters}
				setFormState={setFormState}
				parameterState={simplifyQueryState(queryState)}
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
		parameters,
	}: {
		interfaceId: string;
		request: Request;
		parameters?: Record<string, any>;
	}) =>
	async ({ row }: { row: Record<string, any> }): Promise<RequestReturn> => {
		return await clientRequest(`/api/v1/interfaces/${interfaceId}`, {
			method: "POST",
			requestBody: { method: "delete", row: row.original, parameters },
		});
	};

const prepareUpdateRequest =
	({
		interfaceId,
		request,
		parameters,
	}: {
		interfaceId: string;
		request: Request;
		parameters?: Record<string, any>;
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
				row,
				parameters,
				form,
			},
		});
	};
