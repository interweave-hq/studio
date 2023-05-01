"use client";

import styles from "./styles.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button, Error, Input, LoadingDots, Modal } from "@/components";
import { useState } from "react";
import { clientRequest } from "@/lib/api/clientRequest";

export function AuthorizationKeysWizard({
	projectId,
	interfaceId,
	schemes,
}: {
	projectId: string;
	interfaceId: string;
	schemes: object[];
}) {
	return (
		<Modal isDismissible={false} isOpen>
			<WizardPanel
				scheme={schemes[0]}
				projectId={projectId}
				interfaceId={interfaceId}
			/>
		</Modal>
	);
}

function WizardPanel({
	projectId,
	interfaceId,
	scheme,
}: {
	projectId: string;
	interfaceId: string;
	scheme: any;
}) {
	const { register, handleSubmit, reset } = useForm();
	const [error, setError] = useState("");
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const submitKey = async (data: any) => {
		setLoading(true);
		try {
			const { error } = await clientRequest(
				`/api/v1/projects/${projectId}/third-party-tokens`,
				{
					method: "POST",
					requestBody: {
						interfaceId: interfaceId,
						value: data.value,
						key: scheme.key,
					},
				}
			);
			if (error?.userError) {
				setLoading(false);
				setError(error?.userError);
				return;
			}
			setTimeout(() => {
				router.refresh();
				reset();
				setLoading(false);
			}, 2800);
		} catch (err) {}
	};

	return (
		<div>
			<h2 className={styles.dialog__title}>
				{scheme?.interface?.title
					? scheme.interface.title
					: `Key Required (${scheme.key})`}
			</h2>
			<p className={styles.dialog__description}>
				{scheme?.interface?.description
					? scheme.interface?.description
					: "An API key is required to access the resources in this interface."}
			</p>
			<form
				className={styles.dialog__form}
				onSubmit={handleSubmit(submitKey)}
				autoComplete="off"
			>
				<Input
					label={
						scheme?.interface?.label
							? scheme?.interface?.label
							: "API Key"
					}
					description="Encrypted and entirely secure."
					domProps={{
						placeholder: scheme?.interface?.placeholder
							? scheme.interface.placeholder
							: "abc123",
						autoFocus: true,
					}}
					register={register("value", { required: true })}
					__cssFor={{
						root: styles["dialog__input-container"],
						input: styles.dialog__input,
					}}
				/>
				<div className={styles.dialog__bottom}>
					{scheme?.interface?.instructions_link ? (
						<a
							className={styles.dialog__link}
							target="_blank"
							rel="noopener noreferrer"
							href={scheme.interface.instructions_link}
						>
							More Information
						</a>
					) : (
						<div></div>
					)}
					<div>
						{loading ? (
							<LoadingDots
								__cssFor={{
									root: styles["dialog__loading-dots"],
								}}
							/>
						) : null}
						<Button domProps={{ disabled: loading }}>
							Save Key
						</Button>
					</div>
					{error ? (
						<Error title="Error Saving Token" text={error} />
					) : null}
				</div>
			</form>
		</div>
	);
}
