"use client";

import { API_URL } from "@/lib/constants";

export function LogOutButton() {
	const logOut = async () => {
		window.location.href = `${API_URL}/auth/logout`;
	};
	return <button onClick={logOut}>Log Out</button>;
}
