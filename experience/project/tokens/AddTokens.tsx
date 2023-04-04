"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "@/components";
import { clientRequest } from "@/lib/api/clientRequest";
import styles from "./styles.module.css";

export function AddTokens({ projectId }: { projectId: string }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState("");
	const { register, handleSubmit, control } = useForm();
	const [createdToken, setCreatedToken] = useState("");

	// Create inline loading UI
	const isMutating = isFetching || isPending;

	const onNewTokenSubmit = async (data: any) => {
		setIsFetching(true);
		setError("");

		const payload = {
			projectId,
			...data,
		};
		const { data: newToken, error } = await clientRequest(
			`/api/v1/projects/${projectId}/api-tokens`,
			{
				method: "POST",
				requestBody: payload,
			}
		);
		setIsFetching(false);

		if (error) {
			console.log(error);
			if (error.userError) {
				return setError(error.userError);
			}
			return;
		}

		if (newToken) {
			console.log(newToken);
			setCreatedToken(newToken);
		}

		startTransition(() => {
			// Refresh the current route and fetch new data from the server without
			// losing client-side browser or React state.
			router.refresh();
		});
	};
	return (
		<div>
			<form onSubmit={handleSubmit(onNewTokenSubmit)}>
				<Input
					register={register("nickname")}
					label="Nickname"
					__cssFor={{ root: styles["add-token__input"] }}
				/>
				<Input
					register={register("expiration")}
					label="Expiration"
					domProps={{ type: "date" }}
					__cssFor={{ root: styles["add-token__input"] }}
				/>
				<Select
					register={register("permission")}
					form={{ control, name: "permission" }}
					domProps={{ defaultValue: "Read" }}
					options={[
						{ value: "Admin" },
						{ value: "Create" },
						{ value: "Read" },
					]}
					label="Permission"
					__cssFor={{ root: styles["add-token__input"] }}
				/>
				<Button>Create API Token</Button>
				{isMutating ? "Loading..." : null}
				{error ? (
					<p className={styles["add-token__error"]}>{error}</p>
				) : null}
			</form>
			{createdToken ? (
				<div className={styles["add-token__new-token-container"]}>
					<p className={styles["add-token__new-token-label"]}>
						Copy your new API token! This will never be visible
						again.
					</p>
					<textarea
						className={styles["add-token__new-token"]}
						value={createdToken}
					/>
				</div>
			) : null}
		</div>
	);
}
