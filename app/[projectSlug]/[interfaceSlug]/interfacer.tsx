"use client";

import { useEffect, useState, cloneElement } from "react";
import { useForm, type Control } from "react-hook-form";
import { MultiSelect, Input, Button, Checkbox } from "@/components";
import styles from "./interfacer.module.css";
import { Card } from "@tremor/react";
import { type KeyConfiguration } from "@interweave/interweave";
import { type Interfacer } from "@/interfaces";

interface ComponentSetup {
	component: JSX.Element;
	key: string;
}

/** this will be the Client logic that gets rendered dynamically */
export default function Interfacer({ interfacer }: { interfacer: Interfacer }) {
	const [data, setData] = useState("");
	const { register, handleSubmit, control } = useForm();

	useEffect(() => {
		console.log(data);
	}, [data]);

	const config = interfacer.schema_config;
	const schema = config.keys;

	const getComponentsFromKeys = (keys: {
		[key: string]: any;
	}): ComponentSetup[] => {
		const keysArr = Object.keys(keys);
		const determinedComponents = keysArr.map((k) => {
			const typeConfig = keys[k];
			const type = typeConfig.schema.type;
			if (type === "object") {
				return getComponentsFromKeys(
					typeConfig.schema.object_schema.keys
				);
			}

			// This is where we can pass any props
			return getComponent(k, typeConfig, register, control);
		});
		return determinedComponents.flat();
	};

	const comps = getComponentsFromKeys(schema);

	return (
		<form onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))}>
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
	control: Control
): ComponentSetup => {
	const type = typeConfig.schema.type;
	const enumValue = typeConfig.schema.enum;
	const defaultValue = typeConfig.schema.default_value;
	const label = typeConfig?.interface?.attributes?.label || key;
	const sharedStyles = styles["shared-styles"];

	// If is_array, we can render a multiselect
	if (enumValue) {
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
