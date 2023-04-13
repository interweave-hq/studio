"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./styles.module.css";
import { Button, Input, Error } from "@/components";
import { clientRequest } from "@/lib/api/clientRequest";

export function CreateProject() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [formError, setFormError] = useState("");

	const submit = async (formData: any) => {
		const { data, error, status } = await clientRequest(
			"/api/v1/projects",
			{
				method: "POST",
				requestBody: { ...formData, is_trial: false },
			}
		);
		if (error) {
			if (error.userError) {
				setFormError(error.userError);
			}
		}
		if (status === 201) {
			router.push(`/${data.slug}`);
		}
	};
	const userErrors = {
		title: {
			minLength: "Project title must be at least 2 characters",
			maxLength: "Project title can't be longer than 35 characters",
			required: "Required",
		},
		slug: {
			minLength: "Project slug must be at least 3 characters",
			maxLength: "Project slug can't be longer than 19 characters",
			required: "Required",
		},
	};
	return (
		<main className={styles.container}>
			<h1 className={styles.header}>Create Project</h1>
			<form onSubmit={handleSubmit(submit)} autoComplete="off">
				<Input
					label="Project Display Name"
					register={register("title", {
						minLength: 2,
						maxLength: 35,
						required: true,
					})}
					__cssFor={{ root: styles.input }}
					// @ts-expect-error weird react-hooks thing idk
					error={errors.title && userErrors.title[errors.title.type]}
					domProps={{
						placeholder: "New Project",
					}}
				/>
				<Input
					label="Unique Slug"
					register={register("slug", {
						minLength: 3,
						maxLength: 19,
						required: true,
					})}
					__cssFor={{ root: styles.input }}
					description="Must only contain 0-9, A-z and dashes"
					domProps={{
						placeholder: "new-project",
					}}
					// @ts-expect-error weird react-hooks thing idk
					error={errors.slug && userErrors.slug[errors?.slug?.type]}
				/>
				<Button __cssFor={{ root: styles.button }}>
					Create Project
				</Button>
				{formError ? (
					<Error
						title="Failed To Create Project"
						text={formError}
						__cssFor={{ root: styles.error }}
					/>
				) : null}
			</form>
		</main>
	);
}
