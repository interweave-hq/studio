// THIS FILE SLOWS EVERYTHING DOWN
// This will enable redirects to work, but decided its not worth it for now
// Ideally we can expose the url to our server renders another way
// https://github.com/vercel/next.js/issues/43704
//

import { NextResponse } from "next/server";

// export function middleware(request: Request) {
// 	// Store current request url in a custom header, which you can read later
// 	const requestHeaders = new Headers(request.headers);
// 	requestHeaders.set("x-url", request.url);

// 	return NextResponse.next({
// 		request: {
// 			// Apply new request headers
// 			headers: requestHeaders,
// 		},
// 	});
// }
