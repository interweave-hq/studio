import { cloneElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles.module.css";
import { Button } from "@/components";
import { GetComponent } from "@/experience/interfacer/GetComponent";
import { type Parameter } from "@interweave/interweave";

export function ParameterInputs({
	parameters,
	setFormState,
	parameterState,
	setParametersLoading,
}: {
	parameters?: Record<string, unknown>;
	setFormState: (props: any) => void;
	parameterState: Record<string, unknown>;
	setParametersLoading: (v: any) => void;
}) {
	const { register, handleSubmit, control, getValues } = useForm();
	const [loadingStates, setLoadingStates] = useState(() => {
		const initialLoadingState: Record<string, unknown> = {};
		if (!parameters) return {};
		const pKeys = Object.keys(parameters);
		pKeys.forEach((p) => {
			const parameter = parameters[p] as Parameter;
			if (parameter.schema.dynamic_enum) {
				initialLoadingState[p] = true;
			}
		});
		return initialLoadingState;
	});

	// We want to wait for all the dynamic_enums to finish loading, then update our parameters state
	// with the values
	// This will control a loading state object of { keyName1: true | false, keyName2: true | false }
	// Once these parameters are all loaded, we can update our parameter state and fetch the table data
	useEffect(() => {
		const keys = Object.keys(loadingStates);
		if (!keys || keys.length <= 0) {
			setParametersLoading(false);
			return setFormState(getValues());
		}
		const loadingKeys = keys.filter((k) => !!loadingStates[k]);
		if (!loadingKeys || loadingKeys.length <= 0) {
			setParametersLoading(false);
			return setFormState(getValues());
		}
	}, [loadingStates]);

	if (!parameters) {
		return null;
	}

	const submitForm = (data: any) => {
		setFormState(data);
	};

	// Handles updating the loading state
	const controlLoadingState = (key: string, status: boolean) => {
		setLoadingStates((prev) => {
			return {
				...prev,
				[key]: status,
			};
		});
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
			{
				variables: { parameters: parameterState, row: {}, form: {} },
				isParameterFetch: true,
				setParameterLoadingState: controlLoadingState,
			}
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
