import { type ServerResponse } from "@/interfaces";
import { API_URL } from "../constants";

export interface RequestOptions {
	method?: "GET" | "POST" | "DELETE" | "PATCH";
	requestBody?: Record<string | number | symbol, unknown>;
	headers?: any;
}

export async function request(url: string, options?: RequestOptions) {
	const defaultOptions: RequestOptions = {
		method: "GET",
		requestBody: {},
	};
	options = {
		...defaultOptions,
		...options,
	};
	const { method, requestBody, headers } = options;
	try {
		const res = await fetch(`${API_URL}${url}`, {
			method,
			credentials: "include",
			mode: "cors",
			cache: "no-store",
			headers,
			body: method === "GET" ? undefined : JSON.stringify(requestBody),
		});

		const data: ServerResponse = await res.json();
		if (res.status > 399) {
			return {
				error: {
					technicalError: data.error?.technical_message,
					userError: data.error?.user_facing_message,
				},
				data: data?.results?.data,
				status: res.status,
			};
		}
		return {
			error: null,
			data: data.results.data,
		};
	} catch (error) {
		console.error(error);
		return {
			error: {
				technicalError:
					"An unexpected error occurred. Check console for full error.",
				userError: "Could not make request.",
			},
			data: null,
		};
	}
}
