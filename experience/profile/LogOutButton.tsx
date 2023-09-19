"use client";

import { API_URL } from "@/lib/constants";
import { Button } from "@/components";

export function LogOutButton() {
    const logOut = async () => {
        window.location.href = `${API_URL}/auth/logout`;
    };
    return <Button onClick={logOut}>Log Out</Button>;
}
