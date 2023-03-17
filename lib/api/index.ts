import { type ServerResponse } from "@/interfaces";

const API_URL = "https://api.interweave.studio/api/v1";

interface MakeRequestParams {
	interfaceId: string;
	method: "get" | "create" | "delete" | "update";
	requestBody?: object;
}
export async function makeRequest({ interfaceId, ...rest }: MakeRequestParams) {
	try {
		const req = await fetch(`${API_URL}/interfaces/${interfaceId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...rest,
				request_body: rest.requestBody,
			}),
		});
		const data: ServerResponse = await req.json();
		if (req.status > 399) {
			return {
				error: {
					technicalError: data.error?.technical_message,
					userError: data.error?.user_facing_message,
				},
				data: data?.results?.data,
			};
		}
		return {
			error: null,
			data: data.results.data,
		};
	} catch (err) {
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
