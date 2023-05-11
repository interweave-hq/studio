"use client";

import { forwardRef, useId, useMemo } from "react";
import styles from "./checkbox.module.css";
import { shapeCss } from "@/lib/helpers";
import {
	FormFieldLabel,
	type FormFieldLabelOverrides,
} from "@/components/FormFieldLabel";

const Overrides = {
	root: "root",
	container: "container",
	input: "input",
	label: "label",
	description: "description",
} as const;

type OverridesKeys = keyof typeof Overrides;

type ExternalCheckboxOverrides<T> = {
	FormFieldLabel?: FormFieldLabelOverrides<T>;
};

type InternalCheckboxOverrides<T> = {
	[K in OverridesKeys]?: T;
};

export type CheckboxOverrides<T> = InternalCheckboxOverrides<T> &
	ExternalCheckboxOverrides<T>;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	description?: string;
	domProps?: React.HTMLProps<HTMLInputElement>;
	helperText?: string;
	label?: string;
	ref?: any;
	register?: object;
	__cssFor?: CheckboxOverrides<string>;
}

type ChildRef = HTMLInputElement;

const Checkbox = forwardRef<ChildRef, Props>((props, ref) => {
	Checkbox.displayName = "Checkbox";
	const {
		description,
		domProps,
		helperText = "",
		label,
		register,
		__cssFor,
	} = props;
	const id = useId();
	const {
		root: rootStyles,
		container: containerStyles,
		input: inputStyles,
		description: descriptionStyles,
	} = useMemo(() => {
		return shapeCss<OverridesKeys, CheckboxOverrides<string>>(
			Overrides,
			styles,
			__cssFor
		);
	}, [__cssFor]);
	return (
		<div className={rootStyles}>
			<div className={containerStyles}>
				<input
					type="checkbox"
					{...domProps}
					id={id}
					className={inputStyles}
					ref={ref}
					// register must be below the ref or values will return undefined
					{...register}
				/>
				{label ? (
					<FormFieldLabel
						htmlFor={id}
						__cssFor={__cssFor?.FormFieldLabel}
						helperText={helperText}
					>
						{label}
					</FormFieldLabel>
				) : null}
			</div>
			{description && <p className={descriptionStyles}>{description}</p>}
		</div>
	);
});

export default Checkbox;
