"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "@/components";
import { clientRequest } from "@/lib/api/clientRequest";

export function AddTokens({ projectId }: { projectId: string }) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState("");
	const { register, handleSubmit, control } = useForm();

	// Create inline loading UI
	const isMutating = isFetching || isPending;

	const onNewTokenSubmit = async (data: any) => {
		setIsFetching(true);
		const payload = {
			projectId,
			...data,
		};
		console.log(payload);
		const { data: newToken, error } = await clientRequest(
			`/api/v1/projects/${projectId}/api-tokens`,
			{
				method: "POST",
				requestBody: payload,
			}
		);

		if (newToken) {
			console.log(newToken);
		}

		if (error) {
			console.log(error);
			if (error.userError) {
				setIsFetching(false);
				return setError(error.userError);
			}
			return;
		}

		setIsFetching(false);

		startTransition(() => {
			// Refresh the current route and fetch new data from the server without
			// losing client-side browser or React state.
			router.refresh();
		});
	};
	return (
		<div>
			{isMutating ? "Loading..." : null}
			{error ? <p>{error}</p> : null}
			<form onSubmit={handleSubmit(onNewTokenSubmit)}>
				<Input register={register("nickname")} label="Nickname" />
				<Input
					register={register("expiration")}
					label="Expiration"
					domProps={{ type: "date" }}
				/>
				<Select
					register={register("permission")}
					form={{ control, name: "permission" }}
					options={[
						{ value: "Admin" },
						{ value: "Create" },
						{ value: "Read" },
					]}
					label="Permission"
				/>
				<Button>Submit</Button>
			</form>
		</div>
	);
}
