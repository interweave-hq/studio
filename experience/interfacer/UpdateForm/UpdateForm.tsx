import { cloneElement } from "react";
import { useForm } from "react-hook-form";
import { type Schema } from "@interweave/interweave";

import { GetComponent } from "@/experience/interfacer/GetComponent";
import { type VariableState } from "@/interfaces";

import styles from "./styles.module.css";

export function UpdateForm({
	schema,
	variables,
	formId,
	onSubmit,
}: {
	schema: Schema;
	variables: VariableState;
	formId: string;
	onSubmit: (data: any) => void;
}) {
	const { register, control, handleSubmit } = useForm();
	const schemaKeys = schema.keys;
	const components = Object.keys(schemaKeys).map((k) => {
		const keyConfig = schemaKeys[k];
		const optionalText = keyConfig?.schema?.is_optional ? "Optional" : "";

		return GetComponent(
			k,
			{
				type: keyConfig.schema.type,
				enum: keyConfig?.schema?.enum,
				dynamic_enum: keyConfig?.schema?.dynamic_enum,
				defaultValue:
					variables.row[k] || keyConfig?.schema?.default_value,
				isArray: keyConfig?.schema?.is_array,
				label: keyConfig?.interface?.label,
				required: !keyConfig?.schema?.is_optional,
				styles: styles["shared-styles"],
				description:
					keyConfig?.interface?.form?.description || optionalText,
				disabled: keyConfig?.interface?.form?.disabled,
				form: { register, control },
				hidden: keyConfig?.interface?.form?.hidden,
			},
			{
				variables,
				renderEmptyDefaultDates: true,
			}
		);
	});
	return (
		<form autoComplete="off" onSubmit={handleSubmit(onSubmit)} id={formId}>
			{components.map(({ component, key }) =>
				cloneElement(component, { key })
			)}
		</form>
	);
}
