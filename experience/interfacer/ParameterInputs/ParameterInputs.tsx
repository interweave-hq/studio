import { cloneElement } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles.module.css";
import { Button } from "@/components";
import { GetComponent } from "@/experience/interfacer/GetComponent";
import { type Parameter } from "@interweave/interweave";

export function ParameterInputs({
	parameters,
	setFormState,
	parameterState,
}: {
	parameters?: Record<string, unknown>;
	setFormState: (props: any) => void;
	parameterState: Record<string, unknown>;
}) {
	const { register, handleSubmit, control } = useForm();

	if (!parameters) {
		return null;
	}

	const submitForm = (data: any) => {
		setFormState(data);
	};

	const parameterKeys = Object.keys(parameters);

	const components = parameterKeys.map((p) => {
		const parameter = parameters[p] as Parameter;
		const optionalText = parameter?.schema?.is_optional ? "Optional" : "";

		return GetComponent(
			p,
			{
				type: parameter.schema.type,
				enum: parameter?.schema?.enum,
				dynamic_enum: parameter?.schema?.dynamic_enum,
				defaultValue: parameter?.schema?.default_value,
				isArray: parameter?.schema?.is_array,
				label: parameter?.interface?.form?.label,
				required: !parameter?.schema?.is_optional,
				styles: styles["input-styles"],
				description:
					parameter?.interface?.form?.description || optionalText,
				disabled: parameter?.interface?.form?.disabled,
				form: { register, control },
			},
			{ parameters: parameterState, row: {}, form: {} }
		);
	});

	return (
		<form onSubmit={handleSubmit(submitForm)} autoComplete="off">
			<div className={styles["outer-container"]}>
				<div className={styles["inner-container"]}>
					{components.map(({ component, key }) =>
						cloneElement(component, { key })
					)}
				</div>
				<Button
					kind="hollow"
					size="sm"
					__cssFor={{ root: styles.button }}
				>
					Refresh Data
				</Button>
			</div>
		</form>
	);
}
