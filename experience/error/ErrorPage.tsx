"use client"; // Error components must be Client components

import { useEffect } from "react";
import styles from "./styles.module.css";

export function ErrorPage({
    error,
    reset,
    title = "Something went wrong",
    errorMessage,
}: {
    error: Error;
    reset: () => void;
    title?: string;
    errorMessage?: string;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    const message = errorMessage ? errorMessage : error.message;
    return (
        <div className={styles.error}>
            <h2>{title}</h2>
            <p>{message}</p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </button>
        </div>
    );
}
