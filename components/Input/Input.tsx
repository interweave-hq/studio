"use client";

import { useId } from "react";
import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";
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
	input: "input",
	description: "description",
} as const;

type OverridesKeys = keyof typeof Overrides;

type InternalInputOverrides<T> = {
	[K in OverridesKeys]?: T;
};

type ExternalInputOverrides<T> = {
	FormFieldError?: FormFieldErrorOverrides<T>;
	FormFieldLabel?: FormFieldLabelOverrides<T>;
};

export type InputOverrides<T> = InternalInputOverrides<T> &
	ExternalInputOverrides<T>;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	description?: string;
	domProps?: React.HTMLProps<HTMLInputElement>;
	error?: string;
	helperText?: string;
	label?: string;
	register?: object;
	__cssFor?: InputOverrides<string>;
}

const Input = ({
	description,
	domProps,
	error,
	helperText = "",
	label = "Label",
	register,
	__cssFor,
}: Props) => {
	const id = useId();
	const {
		root: rootStyles,
		input: inputStyles,
		description: descriptionStyles,
	} = shapeCss<OverridesKeys, InputOverrides<string>>(
		Overrides,
		styles,
		__cssFor
	);
	return (
		<div className={rootStyles}>
			<div className={styles["top-container"]}>
				{label ? (
					<FormFieldLabel
						htmlFor={id}
						__cssFor={__cssFor?.FormFieldLabel}
						helperText={helperText}
					>
						{label}
					</FormFieldLabel>
				) : null}
				{description ? (
					<p className={descriptionStyles}>{description}</p>
				) : null}
			</div>
			<input
				type="text"
				{...domProps}
				{...register}
				id={id}
				className={inputStyles}
			/>
			{error && (
				<FormFieldError __cssFor={__cssFor?.FormFieldError}>
					{error}
				</FormFieldError>
			)}
		</div>
	);
};

export default Input;
