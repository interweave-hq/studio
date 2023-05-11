import { useState, useEffect, useContext } from "react";

import { MultiSelect, Input, Checkbox, Error } from "@/components";
import { type Control, type RegisterOptions } from "react-hook-form";
import { Request, type StaticDataSource } from "@interweave/interweave";
import { clientRequest } from "@/lib/api/clientRequest";
import { get } from "@/lib/helpers";
import { InterfaceContext } from "@/providers/InterfaceProvider";
import { type VariableState } from "@/interfaces";
import { Select, type SelectOption } from "@/components/Select";

export interface ComponentSetup {
	component: JSX.Element;
	key: string;
}

interface GetComponentOptions {
	type: string;
	enum?: StaticDataSource;
	dynamic_enum?: Request;
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

// Must be very careful with this component
// If anything of these props are manipulated before calling, an infinite loop will occur
export function GetComponent(
	key: string,
	options: GetComponentOptions,
	secondaryOptions?: {
		variables?: VariableState;
		isParameterFetch?: boolean;
		setParameterLoadingState?: (key: string, status: boolean) => void;
		parameterLoadingState?: any;
	}
): ComponentSetup {
	const { interfaceId } = useContext(InterfaceContext);
	const [enumData, setEnumData] = useState([]);
	const [enumFetchHappened, setEnumFetchHappened] = useState(false);
	const [enumDataLoading, setEnumDataLoading] = useState(
		!!options.dynamic_enum
	);
	const [enumDataError, setEnumDataError] = useState<string | null>(null);
	const variables = secondaryOptions?.variables;

	// Parse out options
	const type = options.type;
	const isArray = options.isArray;
	const enumValue = options?.enum;
	const dynamicEnum = options?.dynamic_enum;
	const defaultValue = options?.defaultValue;
	const label = options?.label || key;
	const required = options.required;
	const disabled = options?.disabled;
	const hidden = options?.hidden;
	const styles = options?.styles;
	const description = options?.description;
	const register = options?.form?.register;
	const maxLength = options.maxLength;

	// Handle dynamic Select and MultiSelect values
	useEffect(() => {
		// Everything will get really slow and stuck in a loop without this
		// Keep at the top
		if (!dynamicEnum) {
			setEnumDataLoading(false);
			return;
		}

		// Only fetch dynamic_enums in parameters once to avoid a rerender loop
		if (!!secondaryOptions?.isParameterFetch) {
			if (enumFetchHappened) return;
		}

		// setLastRefreshToggle(refreshToggle);
		if (dynamicEnum) {
			if (dynamicEnum.uri) {
				// Control loading state for parameter enums
				// Let other components know that we're waiting on these keys here
				if (!enumFetchHappened) {
					if (secondaryOptions?.setParameterLoadingState) {
						secondaryOptions?.setParameterLoadingState(key, true);
					}
				}

				// Definitely specifying a request
				(async () => {
					setEnumFetchHappened(true);
					setEnumDataLoading(true);
					setEnumDataError(null);

					const { data, error } = await clientRequest(
						`/api/v1/interfaces/${interfaceId}`,
						{
							method: "POST",
							requestBody: {
								method: "get", // this is necessary to pass the endpoint validation but not really used
								return_array: true,
								request_config: dynamicEnum,
								...variables,
							},
						}
					);

					if (error) {
						console.error(error);
						setEnumDataLoading(false);
						setEnumDataError(
							error.userError ||
								`Check the configuration in schema.enum for key '${key}'.`
						);
						// Control loading state for parameter enums
						// Let parent state know that we finished loading
						if (!enumFetchHappened) {
							if (secondaryOptions?.setParameterLoadingState) {
								secondaryOptions?.setParameterLoadingState(
									key,
									false
								);
							}
						}
						return;
					}

					// Control loading state for parameter enums
					// Let parent state know that we finished loading
					if (!enumFetchHappened) {
						if (secondaryOptions?.setParameterLoadingState) {
							secondaryOptions?.setParameterLoadingState(
								key,
								false
							);
						}
					}

					if (!data && !error) {
						setEnumData([]);
						setEnumDataLoading(false);
						return;
					}

					setEnumData(data);
					setEnumDataLoading(false);
				})();
			}
		}
	}, [options.dynamic_enum, variables]);

	if (hidden) return { component: <></>, key };
	if (enumDataLoading)
		return {
			component: (
				<Select
					label={label}
					domProps={{ disabled: true }}
					options={[
						{ label: "Loading options...", value: "loading" },
					]}
					__cssFor={{ root: styles }}
				/>
			),
			key,
		};
	if (enumDataError)
		return {
			component: (
				<Error
					title="Error Fetching Enum Data"
					text="Could not successfully complete the fetch request for the enum data."
					details={enumDataError}
				/>
			),
			key,
		};

	const enumSource = enumFetchHappened ? enumData : enumValue;

	// If is_array, we can render a multiselect
	if (enumSource && isArray) {
		return {
			component: (
				<MultiSelect
					options={enumSource.map((e: any) => {
						if (!enumFetchHappened) {
							if (typeof e === "object") {
								return {
									label:
										e?.label.toString() ||
										e.value.toString(),
									value: e.value,
								};
							}
							return {
								label: e.toString(),
								value: e,
							};
						}
						const value = get(
							e,
							dynamicEnum?.value_path,
							typeof e === "object" ? e.toString() : e
						);
						return {
							label: get(
								e,
								dynamicEnum?.label_path,
								value
							).toString(),
							value,
						};
					})}
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
	if (enumSource && !isArray) {
		const nullOption: SelectOption[] = !required
			? [
					{
						label: "None",
						value: undefined,
						keyOverride: `empty-option-${key}`,
					},
			  ]
			: [];
		const enumSourceOpts: SelectOption[] = enumSource.map((e: any) => {
			if (!enumFetchHappened) {
				if (typeof e === "object") {
					return {
						label: e?.label.toString() || e.value.toString(),
						value: e.value,
					};
				}
				return {
					label: e.toString(),
					value: e,
				};
			}
			const value = get(
				e,
				dynamicEnum?.value_path,
				typeof e === "object" ? e.toString() : e
			);
			return {
				label: get(e, dynamicEnum?.label_path, value).toString(),
				value,
			};
		});
		const combinedDataSource = nullOption.concat(enumSourceOpts);
		return {
			component: (
				<Select
					label={label}
					options={combinedDataSource}
					register={register(key, { required })}
					domProps={{
						defaultValue,
						readOnly: disabled,
					}}
					helperText={description}
					error={options?.error}
					__cssFor={{ root: styles }}
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
						domProps={{
							defaultChecked: defaultValue,
						}}
						register={register(key, { required })}
						__cssFor={{ root: styles }}
						description={description}
					/>
				),
				key,
			};

		default:
			return {
				component: <p className={styles}>{label}</p>,
				key,
			};
	}
}
