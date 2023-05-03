import { MultiSelect, Input, Button, Checkbox, Select } from "@/components";
import { type Control, type RegisterOptions } from "react-hook-form";
import { type KeyConfiguration } from "@interweave/interweave";

export interface ComponentSetup {
	component: JSX.Element;
	key: string;
}

interface GetComponentOptions {
	type: string;
	enum?: number[] | string[];
	defaultValue?: any;
	isArray?: boolean;
	label?: string;
	required?: boolean;
	description?: string;
	disabled?: boolean;
	styles?: string;
	hidden?: boolean;
	error?: string;
	maxLength?: number;
	form: {
		register: (key: string, opts?: RegisterOptions) => object;
		control?: Control;
	};
}

export const getComponent = (
	key: string,
	options: GetComponentOptions
): ComponentSetup => {
	const type = options.type;
	const isArray = options.isArray;
	const enumValue = options?.enum;
	const defaultValue = options?.defaultValue;
	const label = options?.label || key;
	const required = options.required;
	const disabled = options?.disabled;
	const hidden = options?.hidden;
	const styles = options?.styles;
	const description = options?.description;
	const register = options?.form?.register;
	const maxLength = options.maxLength;

	if (hidden) return { component: <></>, key };

	// If is_array, we can render a multiselect
	if (enumValue && isArray) {
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
					form={{ control: options?.form?.control, name: key }}
					__cssFor={{ root: styles }}
					error={options?.error}
					helperText={description}
				/>
			),
			key,
		};
	}
	if (enumValue && !isArray) {
		return {
			component: (
				<Select
					label={label}
					options={enumValue.map((e: string | number) => ({
						label: e.toString(),
						value: e,
					}))}
					register={register(key, { required })}
					domProps={{
						defaultValue,
						readOnly: disabled,
					}}
					error={options?.error}
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
						register={register(key, { required })}
						__cssFor={{ root: styles }}
						error={options?.error}
						domProps={{
							defaultValue,
							hidden,
							readOnly: disabled,
						}}
						helperText={description}
						maxLength={maxLength}
					/>
				),
				key,
			};

		case "number":
			return {
				component: (
					<Input
						domProps={{
							type: "number",
							defaultValue,
							readOnly: disabled,
							hidden,
							step: ".01",
							inputMode: "numeric",
							pattern: "[-+]?[0-9]*[.,]?[0-9]+",
							noValidate: true,
						}}
						label={label}
						register={register(key, { required })}
						error={options?.error}
						__cssFor={{ root: styles }}
						helperText={description}
						maxLength={maxLength}
					/>
				),
				key,
			};

		case "boolean":
			return {
				component: (
					<Checkbox
						label={label}
						register={register(key, { required })}
						__cssFor={{ root: styles }}
						description={description}
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
				component: <p className={styles}>{label}</p>,
				key,
			};
	}
};
