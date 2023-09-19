import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { API_URL } from "@/lib/constants";

export async function authenticate(params?: { optional?: boolean }) {
    const originalUrl = headers().get("x-url");
    const cookieStore = cookies();
    const cookie = cookieStore.get("XSRF-TOKEN");
    const isOptional = !!params?.optional;
    const cookieHeaders = new Headers();
    if (cookie) {
        cookieHeaders.append("Cookie", `${cookie.name}=${cookie.value}`);
    }
    const res = await fetch(`${API_URL}/auth/authentication-status`, {
        credentials: "include",
        mode: "cors",
        cache: "no-store",
        headers: cookieHeaders,
    });
    if (res.status > 399) {
        if (!isOptional) {
            if (originalUrl) {
                redirect(`/login?url=${originalUrl}`);
            } else {
                redirect(`/login`);
            }
        }
        return {
            user: null,
            isAuthenticated: false,
        };
    }

    const data = await res.json();
    return {
        user: data.user,
        isAuthenticated: true,
    };
}
