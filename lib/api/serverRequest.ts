import { cookies } from "next/headers";
import { request, type RequestOptions, type RequestReturn } from "./request";

export async function serverRequest(url: string, options?: RequestOptions) {
	const cookieHeaders = new Headers();
	const cookieStore = cookies();
	const cookie = cookieStore.get("connect.sid");
	if (cookie) {
		cookieHeaders.append("Cookie", `${cookie.name}=${cookie.value}`);
	}
	cookieHeaders.append("Content-Type", "application/json");
	return request(url, {
		...options,
		headers: cookieHeaders,
	});
}

export { type RequestOptions, type RequestReturn };
