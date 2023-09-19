"use client";

import Image from "next/image";
import { API_URL } from "@/lib/constants";

import styles from "./login.module.css";

export default function LogIn({ redirect }: { redirect?: string }) {
    const signIn = async () => {
        if (redirect) {
            window.location.href = `${API_URL}/auth/google?url=${redirect}`;
        } else {
            window.location.href = `${API_URL}/auth/google`;
        }
    };

    return (
        <div>
            <button
                onClick={() => signIn()}
                className={styles["google-btn"]}
            >
                <Image
                    alt=""
                    src="https://img.icons8.com/color/48/000000/google-logo.png"
                    width="30"
                    height="30"
                />
                <span>Sign in with Google</span>
            </button>
            <p className={styles.excuse}>More options coming soon</p>
        </div>
    );
}
