"use client";

import { useEffect, useState } from "react";
import { type Request } from "@interweave/interweave";
import { clientRequest, type RequestReturn } from "@/lib/api/clientRequest";
import { Error } from "@/components";
import Table from "./table";
import { ParameterInputs } from "../ParameterInputs";

type Error = Omit<RequestReturn, "status" | "data">["error"];

const notReadyReturn: RequestReturn = {
	data: [],
	error: {
		userError: "Please fill out the inputs above.",
		technicalError: "A parameter is required.",
	},
	status: 400,
};

interface ValueState {
	[key: string]: {
		isOptional: boolean;
		isSearchParam: boolean;
		value: any;
	};
}

function getUrlQueryParamaters(valueState: ValueState) {
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(valueState)) {
		if (value.isSearchParam) {
			query.append(key, value.value);
		}
	}
	return query;
}

const DEFAULT_ERROR: Error = { userError: "", technicalError: "" };

/**
 * We'll process this in two steps
 * 1. coordinate the form state so that defaults are handled and everything in sync
 * 2. after submit, use form state to build our URL
 *
 */
export function FetchTableData({
	keys,
	request,
	interfaceId,
}: {
	keys: any;
	request: Request;
	interfaceId: string;
}) {
	const [data, setData] = useState(null);
	const [error, setError] = useState<Error>(DEFAULT_ERROR);
	const [valueState, setValueState] = useState<ValueState>({});
	const [makeRequest, setMakeRequest] = useState(false);
	const [url, setUrl] = useState(request.uri);

	// if theres URL parameters, wait until something has been submitted
	// if theres required query parameters, wait until something has been submitted
	const parameters = request?.parameters;
	const parameterKeys = parameters ? Object.keys(parameters) : [];
	const hasUrlParameters = url.indexOf("{") > -1;

	const setFormState = (data: any) => {
		for (const [key, value] of Object.entries(data)) {
			setValueState((prev: ValueState) => ({
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
					const isSearchParam = !(request.uri.indexOf(paramKey) > -1);
					setValueState((prev) => ({
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
						valueState[paramKey]?.value ||
						param.schema.default_value;
					const isRequired = !param.schema.is_optional;
					const isSearchParam = !(url.indexOf(paramKey) > -1);

					// Update URL to remove any required parameters
					if (value) {
						if (!isSearchParam) {
							setUrl(url.replace(`{${paramKey}}`, value));
						}
					}

					if (isRequired && !value) {
						allGood = false;
					}
				});
				setMakeRequest(allGood);
			}
		}
	}, [valueState]);

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
				setError(DEFAULT_ERROR);
				const fullUrl = new URL(url);
				const query = getUrlQueryParamaters(valueState);
				fullUrl.search = query.toString().replaceAll("%2C", ",");
				const { data, error } = makeRequest
					? await getTableData({ interfaceId, url: fullUrl.href })
					: notReadyReturn;

				if (error) {
					setError(error);
					// console.error(error);
					return;
				}
				setData(data);
			} catch (err) {
				console.error(error);
			}
		})();
	}, [valueState, makeRequest]);

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
			{data ? <Table data={data} columnData={keys} uri={url} /> : null}
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
	console.log(url);
	return await clientRequest(`/api/v1/interfaces/${interfaceId}`, {
		method: "POST",
		requestBody: { method: "get", uri: url },
	});
}
