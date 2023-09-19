import { type ServerResponse } from "@/interfaces";
import { API_URL } from "../constants";

export interface RequestOptions {
    method?: "GET" | "POST" | "DELETE" | "PATCH";
    requestBody?: Record<string | number | symbol, unknown>;
    headers?: any;
    returnRequest?: boolean;
}

export type RequestReturn = {
    data?: any;
    error?: {
        technicalError?: string;
        userError?: string;
    };
    status: number;
    duration?: number;
};

export async function request(url: string, options?: RequestOptions): Promise<RequestReturn> {
    const defaultOptions: RequestOptions = {
        method: "GET",
        requestBody: {},
        returnRequest: false,
    };
    options = {
        ...defaultOptions,
        ...options,
    };
    const { method, requestBody, headers } = options;
    try {
        const madeFetch = fetch(`${API_URL}${url}`, {
            method,
            credentials: "include",
            mode: "cors",
            cache: "no-store",
            headers,
            body: method === "GET" ? undefined : JSON.stringify(requestBody),
        });

        // Return request if specified
        if (options.returnRequest) {
            return madeFetch;
        }

        // Await it to come back otherwise
        const res = await madeFetch;

        const data: ServerResponse = await res.json();
        if (res.status > 399) {
            return {
                error: {
                    technicalError: data.error?.technical_message,
                    userError: data.error?.user_facing_message,
                },
                data: data?.results?.data,
                status: res.status,
                duration: data.operation_duration,
            };
        }
        return {
            error: undefined,
            data: data.results.data,
            status: res.status,
            duration: data.operation_duration,
        };
    } catch (error) {
        console.error(error);
        return {
            error: {
                technicalError: "An unexpected error occurred. Check console for full error.",
                userError: "Could not make request.",
            },
            data: null,
            status: 500,
        };
    }
}
