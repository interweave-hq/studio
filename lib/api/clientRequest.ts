import { request, type RequestOptions } from "./request";

export async function clientRequest(url: string, options?: RequestOptions) {
	return request(url, {
		...options,
		headers: { "Content-Type": "application/json" },
	});
}
