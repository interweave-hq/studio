"use client";

import { API_URL } from "@/lib/constants";

export function Profile({ user }: { user: { display_name: string } }) {
	const logOut = async () => {
		window.location.href = `${API_URL}/auth/logout`;
	};
	return (
		<div>
			<h1>{user.display_name}</h1>
			<button onClick={logOut}>Log Out</button>
		</div>
	);
}
