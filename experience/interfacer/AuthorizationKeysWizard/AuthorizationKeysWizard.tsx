"use client";

import { useId } from "react";
import styles from "./styles.module.css";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Input, InfoModal } from "@/components";
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
	const scheme: any = schemes[0];
	return (
		<WizardPanel
			scheme={scheme}
			projectId={projectId}
			interfaceId={interfaceId}
		/>
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
	const formId = useId();
	const [error, setError] = useState("");
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [modalActive, setModalActive] = useState(true);

	const submitKey = async (data: any) => {
		setLoading(true);
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
			setModalActive(false);
			router.refresh();
			reset();
			setLoading(false);
		}, 2500);
	};

	return (
		<InfoModal
			modalProps={{
				isDismissible: false,
				isOpen: modalActive,
				setClosed: () => setModalActive(!modalActive),
			}}
			title={
				scheme?.interface?.title
					? scheme.interface.title
					: `Key Required (${scheme.key})`
			}
			body={
				scheme?.interface?.description
					? scheme.interface?.description
					: "An API key is required to access the resources in this interface."
			}
			isLoading={loading}
			confirmCtaProps={{
				children: "Save key",
				domProps: {
					disabled: loading,
					form: formId,
					type: "submit",
				},
			}}
			cancelCtaProps={{
				children: "Cancel",
				flavor: "primary",
				kind: "hollow",
				onClick: () => {
					router.back();
				},
			}}
			contextLink={scheme?.interface?.instructions_link}
			errorProps={
				error
					? {
							title: "Error Saving Token",
							text: error,
					  }
					: undefined
			}
		>
			<form
				className={styles.dialog__form}
				onSubmit={handleSubmit(submitKey)}
				autoComplete="off"
				id={formId}
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
				/>
			</form>
		</InfoModal>
	);
}
