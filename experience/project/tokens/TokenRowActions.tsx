"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Flavors, Sizes, Kinds } from "@/components/Button";
import { LoadingDots } from "@/components";
import { clientRequest } from "@/lib/api/clientRequest";
import styles from "./styles.module.css";

export function TokenRowActions({
	tokenId,
	projectId,
}: {
	tokenId: string;
	projectId: string;
}) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState("");

	const [confirmActive, setConfirmActive] = useState(false);

	const isMutating = isFetching || isPending;

	const removeToken = async ({ tokenId }: { tokenId: string }) => {
		setIsFetching(true);
		setError("");

		const { error } = await clientRequest(
			`/api/v1/projects/${projectId}/api-tokens/${tokenId}`,
			{ method: "DELETE" }
		);
		setIsFetching(false);

		if (error) {
			console.error(error);
			if (error.userError) {
				setIsFetching(false);
				return setError(error.userError);
			}
			return setError("Could not delete token.");
		}

		startTransition(() => {
			// Refresh the current route and fetch new data from the server without
			// losing client-side browser or React state.
			router.refresh();
		});
	};
	return (
		<div>
			<Button
				size={Sizes.sm}
				flavor={Flavors.danger}
				kind={Kinds.hollow}
				onClick={() =>
					confirmActive
						? removeToken({ tokenId })
						: setConfirmActive(!confirmActive)
				}
			>
				{confirmActive
					? "Click again to confirm deletion"
					: "Revoke Token"}
				<span className={styles["token-display__row-button-loading"]}>
					{isMutating ? <LoadingDots /> : null}
				</span>
			</Button>
			{error ? <p>{error}</p> : null}
		</div>
	);
}
