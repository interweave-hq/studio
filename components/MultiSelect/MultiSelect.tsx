"use client";

import { useState, useEffect, useRef, useId } from "react";
import { useController } from "react-hook-form";
import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";
import { Checkbox } from "@/components/Checkbox";
import {
	FormFieldError,
	type FormFieldErrorOverrides,
} from "@/components/FormFieldError";
import {
	FormFieldLabel,
	type FormFieldLabelOverrides,
} from "@/components/FormFieldLabel";

const Overrides = {
	root: "root",
	container: "container",
	option: "option",
	optionLabel: "optionLabel",
} as const;

type OverridesKeys = keyof typeof Overrides;

type InternalMultiSelectOverrides<T> = {
	[K in OverridesKeys]?: T;
};

type ExternalMultiSelectOverrides<T> = {
	FormFieldError?: FormFieldErrorOverrides<T>;
	FormFieldLabel?: FormFieldLabelOverrides<T>;
};

export type MultiSelectOverrides<T> = InternalMultiSelectOverrides<T> &
	ExternalMultiSelectOverrides<T>;

type Option = {
	value: string | number;
	label: string;
};

type Props = {
	error?: string;
	form: {
		control: any;
		name: string;
	};
	label: string;
	onChange?: (options: Option[]) => void;
	options: Option[];
	selectedOptions?: Option[];
	__cssFor?: MultiSelectOverrides<string>;
};

const MultiSelect = ({
	error,
	form,
	label,
	options,
	selectedOptions = [],
	__cssFor,
}: Props) => {
	const id = useId();
	const [selected, setSelected] = useState(
		selectedOptions.map((o) => o.value)
	);
	const { field } = useController(form);
	const ref = useRef(form.control);
	const { root: rootStyles, container: containerStyles } = shapeCss<
		OverridesKeys,
		MultiSelectOverrides<string>
	>(Overrides, styles, __cssFor);

	// Holy fucking fuck this shit
	// Makes activeChildren work as expected for fucks sake
	useEffect(() => {
		if (selectedOptions.length === selectedOptions.length) return;
		setSelected(selectedOptions.map((o) => o.value));
	}, [selectedOptions]);

	// Update form when selected options change
	useEffect(() => {
		field.onChange(selected);
	}, [selected]);

	const handleOptionSelect = (option: string | number) => {
		if (selected.includes(option)) {
			setSelected(selected.filter((o) => o !== option));
		} else {
			setSelected([...selected, option]);
		}
	};
	return (
		<div className={rootStyles} data-component="multiselect">
			<FormFieldLabel
				htmlFor={id}
				helperText="Select multiple"
				__cssFor={__cssFor?.FormFieldLabel}
			>
				{label}
			</FormFieldLabel>
			<div id={id} className={containerStyles}>
				{options.map((opt) => (
					<Checkbox
						key={opt.value}
						label={opt.label}
						domProps={{
							defaultChecked: !!selected.find(
								(o) => o === opt.value
							),
							onChange: () => handleOptionSelect(opt.value),
						}}
						__cssFor={{
							root: styles.checkbox,
						}}
						ref={ref}
					/>
				))}
			</div>
			{error && (
				<FormFieldError __cssFor={__cssFor?.FormFieldError}>
					{error}
				</FormFieldError>
			)}
		</div>
	);
};

export default MultiSelect;
