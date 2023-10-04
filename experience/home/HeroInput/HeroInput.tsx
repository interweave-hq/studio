"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

export function HeroInput() {
    const [urlValue, setUrlValue] = useState("https://google.com/api/");
    return (
        <div className={styles["hero__input-container"]}>
            <label>
                <p className={styles["hero__input-label"]}>⚡ Build your first interface in seconds:</p>
            </label>
            <div className={styles["hero__input-inner-container"]}>
                <input
                    className={styles.hero__input}
                    value={urlValue}
                    placeholder="URL to your API"
                    onChange={e => setUrlValue(e.currentTarget.value)}
                />
                <Link
                    className={styles["hero__gen-button"]}
                    href={`/demo?url=${urlValue}`}
                >
                    Generate!
                </Link>
            </div>
        </div>
    );
}
