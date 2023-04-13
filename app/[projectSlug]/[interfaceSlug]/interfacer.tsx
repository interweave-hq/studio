"use client";

import { useEffect, useState, cloneElement } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components";
import styles from "./interfacer.module.css";
import { Card } from "@tremor/react";
import { validate, type KeyConfiguration } from "@interweave/interweave";
import { type Interfacer } from "@/interfaces";
import { get } from "@/lib/helpers";
import {
	getComponent,
	type ComponentSetup,
} from "@/experience/interfacer/getComponent";

/** this will be the Client logic that gets rendered dynamically */
export default function Interfacer({ interfacer }: { interfacer: Interfacer }) {
	const [data, setData] = useState("");
	const {
		register,
		handleSubmit,
		control,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		console.log(data);
	}, [data]);

	useEffect(() => {
		console.log(errors);
	}, [errors]);

	const config = interfacer.schema_config;
	const schema = config.keys;

	const getComponentsFromKeys = (
		keys: {
			[key: string]: KeyConfiguration;
		},
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
			});
		});
		return determinedComponents
			.filter((v) => v !== null)
			.flat() as ComponentSetup[];
	};

	const onSubmit = (data: Record<string, unknown>) => {
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
		}
	};

	const comps = getComponentsFromKeys(schema);

	return (
		<form onSubmit={handleSubmit((data) => onSubmit(data))}>
			<Card
				maxWidth="max-w-none"
				hFull={false}
				shadow={true}
				decoration=""
				decorationColor="blue"
				marginTop="mt-0"
			>
				{comps.map(({ component, key }) =>
					cloneElement(component, { key })
				)}
				<Button __cssFor={{ root: styles["submit-button"] }}>
					Submit
				</Button>
			</Card>
		</form>
	);
}
