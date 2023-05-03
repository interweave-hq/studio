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
import { parseRequest } from "@/lib/parsers";

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

function getUrlQueryParamaters(queryState: QueryState) {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(queryState)) {
		if (value.isSearchParam) {
			query.append(key, value.value);
		}
	}
	return query;
}

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
}: {
	keys: SchemaKeys;
	getRequest: Request;
	updateRequest: Request;
	deleteRequest: Request;
	interfaceId: string;
	schema: Schema;
}) {
	const [data, setData] = useState(null);
	const [error, setError] = useState(DEFAULT_ERROR);
	const [queryState, setQueryState] = useState<QueryState>({});
	const [makeRequest, setMakeRequest] = useState(false);
	const [url, setUrl] = useState(getRequest.uri);
	const [isLoading, setLoading] = useState(true);
	const [requestDuration, setRequestDuration] = useState(0);
	// Boolean switch, whenever value changes, we rerun the query
	const [triggerReload, setTriggerReload] = useState(false);

	// if theres URL parameters, wait until something has been submitted
	// if theres required query parameters, wait until something has been submitted
	const parameters = getRequest?.parameters;
	const parameterKeys = parameters ? Object.keys(parameters) : [];
	const hasUrlParameters = url.indexOf("{") > -1;

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
					const isSearchParam = !(
						getRequest.uri.indexOf(paramKey) > -1
					);
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
					const isSearchParam = !(url.indexOf(paramKey) > -1);

					// Update URL to remove any required parameters
					if (value) {
						if (!isSearchParam) {
							setUrl(url.replace(`{query.${paramKey}}`, value));
						}
					}

					if (isRequired && !value) {
						allGood = false;
					}
				});
				setMakeRequest(allGood);
			}
		}
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
				const fullUrl = new URL(url);
				const query = getUrlQueryParamaters(queryState);
				fullUrl.search = query.toString().replaceAll("%2C", ",");
				setUrl(fullUrl.href);
				const { data, error, duration } = makeRequest
					? await getTableData({ interfaceId, url: fullUrl.href })
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
				/>
			) : null}
		</div>
	);
}

async function getTableData({
	interfaceId,
	url,
}: {
	interfaceId: string;
	url: string;
}) {
	return await clientRequest(`/api/v1/interfaces/${interfaceId}`, {
		method: "POST",
		requestBody: { method: "get", uri: url, return_array: true },
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
		// const { data, error } = parse(request, {
		// 	parameters,
		// 	row: { ...row?.original },
		// });
		// if (error) {
		// 	return {
		// 		data: null,
		// 		error: {
		// 			userError: "Parsing URL with variables failed.",
		// 			technicalError: error,
		// 		},
		// 		status: 400,
		// 	};
		// }
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
