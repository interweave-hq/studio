"use client";

import { useEffect, useState, cloneElement } from "react";
import { useForm, type Control } from "react-hook-form";
import { MultiSelect, Input, Button, Checkbox, Select } from "@/components";
import styles from "./interfacer.module.css";
import { Card } from "@tremor/react";
import { validate, type KeyConfiguration } from "@interweave/interweave";
import { type Interfacer } from "@/interfaces";
import { get } from "@/lib/helpers";

interface ComponentSetup {
	component: JSX.Element;
	key: string;
}

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

			const props = {
				// Errors object is post form-combine so we have to parse our key out for nested value errors
				error: get(errors, `${formKey}.message`),
			};
			// This is where we can pass any props
			return getComponent(formKey, typeConfig, register, control, props);
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

const getComponent = (
	key: string,
	typeConfig: KeyConfiguration,
	register: (opts: any) => object,
	control: Control,
	props: {
		error?: any;
	}
): ComponentSetup => {
	const type = typeConfig.schema.type;
	const enumValue = typeConfig.schema.enum;
	const defaultValue = typeConfig.schema.default_value;
	const label = typeConfig?.interface?.form?.label || key;
	const sharedStyles = styles["shared-styles"];

	// If is_array, we can render a multiselect
	if (enumValue && typeConfig.schema.is_array) {
		return {
			component: (
				<MultiSelect
					options={enumValue.map((e: string | number) => ({
						label: e.toString(),
						value: e,
					}))}
					label={label}
					selectedOptions={
						defaultValue
							? Array.isArray(defaultValue)
								? defaultValue.map((d) => ({
										value: d,
										label: d,
								  }))
								: [{ value: defaultValue, label: defaultValue }]
							: []
					}
					form={{ control, name: key }}
					__cssFor={{ root: sharedStyles }}
					error={props?.error}
				/>
			),
			key,
		};
	}
	if (enumValue && !typeConfig.schema.is_array) {
		return {
			component: (
				<Select
					label={label}
					options={enumValue.map((e: string | number) => ({
						label: e.toString(),
						value: e,
					}))}
					register={register(key)}
					domProps={{
						defaultValue,
					}}
					error={props?.error}
				/>
			),
			key,
		};
	}

	switch (type) {
		case "string":
			return {
				component: (
					<Input
						label={label}
						register={register(key)}
						__cssFor={{ root: sharedStyles }}
						error={props?.error}
					/>
				),
				key,
			};

		case "number":
			return {
				component: (
					<Input
						domProps={{ type: "number" }}
						label={label}
						register={register(key)}
						error={props?.error}
						__cssFor={{ root: sharedStyles }}
					/>
				),
				key,
			};

		case "boolean":
			return {
				component: (
					<Checkbox
						label={label}
						register={register(key)}
						__cssFor={{ root: sharedStyles }}
					/>
				),
				key,
			};

		// case "object":
		// 	return Checkbox;
		// case "object":
		// 	return <Checkbox label={"test"} />;
		// case "object":
		// 	return <p>other</p>;

		default:
			return {
				component: <p className={sharedStyles}>{label}</p>,
				key,
			};
	}
};
