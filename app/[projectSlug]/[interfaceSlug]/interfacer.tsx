"use client";

import { useEffect, useState, cloneElement } from "react";
import { useForm } from "react-hook-form";
import { Button, Error, LoadingDots } from "@/components";
import styles from "./interfacer.module.css";
import { validate, type SchemaKeys } from "@interweave/interweave";
import { type Interfacer, type Error as ErrorType } from "@/interfaces";
import { get } from "@/lib/helpers";
import {
	getComponent,
	type ComponentSetup,
} from "@/experience/interfacer/getComponent";
import { clientRequest } from "@/lib/api/clientRequest";

const DEFAULT_ERROR: ErrorType = { userError: "", technicalError: "" };

const getValueFromValidationOption = (x: any) => {
	if (typeof x === "object") {
		return x.value;
	}
	return x;
};

/** this will be the Client logic that gets rendered dynamically */
export default function Interfacer({ interfacer }: { interfacer: Interfacer }) {
	const [formLoading, setFormLoading] = useState(false);
	const [formSuccess, setFormSuccess] = useState(false);
	const [submissionError, setSubmissionError] = useState(DEFAULT_ERROR);
	const {
		register,
		handleSubmit,
		control,
		setError,
		clearErrors,
		formState: { errors },
		reset,
	} = useForm();
	const hasSubmissionError =
		submissionError?.technicalError || submissionError?.userError;

	const config = interfacer.schema_config;
	const schema = config.keys;

	const getComponentsFromKeys = (
		keys: SchemaKeys,
		nestedPath?: string
	): ComponentSetup[] => {
		const keysArr = Object.keys(keys);
		const determinedComponents = keysArr.map((k) => {
			const formKey = nestedPath ? `${nestedPath}.${k}` : k;
			const typeConfig = keys[k];
			const type = typeConfig.schema.type;
			const hidden = typeConfig?.interface?.form?.hidden;
			if (hidden) {
				return null;
			}
			if (type === "object") {
				if (typeConfig?.schema?.object_schema?.keys) {
					return getComponentsFromKeys(
						typeConfig.schema?.object_schema.keys,
						formKey
					);
				}
			}

			// This is where we can pass any props
			return getComponent(formKey, {
				type: typeConfig.schema.type,
				enum: typeConfig?.schema?.enum,
				defaultValue: typeConfig?.schema?.default_value,
				isArray: typeConfig?.schema?.default_value,
				label: typeConfig?.interface?.form?.label,
				required: !typeConfig?.schema?.is_optional,
				styles: styles["shared-styles"],
				description: typeConfig?.interface?.form?.description,
				disabled: typeConfig?.interface?.form?.disabled,
				// Errors object is post form-combine so we have to parse our key out for nested value errors
				error: get(errors, `${formKey}.message`),
				form: { register, control },
				maxLength: getValueFromValidationOption(
					typeConfig?.validation?.max_length
				),
			});
		});
		return determinedComponents
			.filter((v) => v !== null)
			.flat() as ComponentSetup[];
	};

	const onSubmit = async (data: Record<string, unknown>) => {
		setFormLoading(true);
		setFormSuccess(false);
		setSubmissionError(DEFAULT_ERROR);

		// Clear errors from previous submissions
		clearErrors();

		// Handles new form errors
		const validation = validate(data, interfacer.schema_config, {
			returnErrors: true,
		});
		if (validation?.didError) {
			const keysWithError = Object.keys(validation.keys);
			keysWithError.forEach((key) => {
				const err = validation.keys[key];
				const isRequiredAndMissing = err.requiredAndMissing;
				if (isRequiredAndMissing) {
					return setError(key, {
						type: "custom",
						message: `Required`,
					});
				}
				err.errors.forEach((err) => {
					setError(key, {
						type: "custom",
						message: err,
					});
				});
			});
			setFormLoading(false);
			// stop further execution
			return;
		}

		const { data: submitData, error } = await clientRequest(
			`/api/v1/interfaces/${interfacer.id}`,
			{
				method: "POST",
				requestBody: { method: "create", request_body: data },
			}
		);
		if (error?.technicalError || error?.userError) {
			setFormLoading(false);
			return setSubmissionError(error);
		}
		setFormSuccess(true);
		setFormLoading(false);
		reset();
		return;
	};

	const comps = getComponentsFromKeys(schema);

	return (
		<form
			onSubmit={handleSubmit((data) => onSubmit(data))}
			autoComplete="off"
			autoCorrect="off"
		>
			{comps.map(({ component, key }) =>
				cloneElement(component, { key })
			)}
			<Button
				__cssFor={{ root: styles["submit-button"] }}
				domProps={{ disabled: formLoading }}
			>
				Submit
			</Button>
			{formLoading ? <LoadingDots /> : null}
			{hasSubmissionError ? (
				<Error
					title="Error Saving New Data"
					text={submissionError?.technicalError || ""}
					details={submissionError?.userError}
					__cssFor={{ root: styles["submission-error"] }}
				/>
			) : null}
			{formSuccess ? (
				<p className={styles["submission-success"]}>
					Data successfully saved!
				</p>
			) : null}
		</form>
	);
}
