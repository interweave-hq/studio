"use client";

import { request, type RequestOptions, type RequestReturn } from "./request";

export async function clientRequest(url: string, options?: RequestOptions) {
    return request(url, {
        ...options,
        headers: { "Content-Type": "application/json" },
    });
}

export { type RequestOptions, type RequestReturn };
