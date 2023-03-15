"use client"; // Error components must be Client components

import { useEffect } from "react";
import styles from "./styles.module.css";

export function ErrorPage({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className={styles.error}>
			<h2>Something went wrong!</h2>
			<p>{error.message}</p>
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
