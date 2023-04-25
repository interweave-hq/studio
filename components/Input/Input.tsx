"use client";

import { useId, useRef, useState } from "react";
import styles from "./styles.module.css";
import { shapeCss, combineCss } from "@/lib/helpers";
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
	maxLength?: number;
	register?: object;
	__cssFor?: InputOverrides<string>;
}

const Input = ({
	description,
	domProps,
	error,
	helperText = "",
	label = "Label",
	maxLength,
	register,
	__cssFor,
}: Props) => {
	const [inputLength, setInputValueLength] = useState(
		domProps?.defaultValue?.toString().length || 0
	);
	const id = useId();
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (domProps?.onChange) {
			domProps.onChange(e);
		}
		setInputValueLength(e.currentTarget.value.length);
	};
	const {
		root: rootStyles,
		input: inputStyles,
		description: descriptionStyles,
	} = shapeCss<OverridesKeys, InputOverrides<string>>(
		Overrides,
		styles,
		__cssFor
	);
	const invalidLength = maxLength ? inputLength > maxLength : false;
	const inputElementClass =
		error || invalidLength
			? combineCss([inputStyles, styles["input-error"]])
			: inputStyles;
	const maxLengthClass = invalidLength
		? combineCss([styles["max-length"], styles["max-length-error"]])
		: styles["max-length"];
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
				className={inputElementClass}
				onChange={(e) => handleOnChange(e)}
			/>
			{error || maxLength ? (
				<div className={styles["bottom-container"]}>
					{error ? (
						<FormFieldError __cssFor={__cssFor?.FormFieldError}>
							{error}
						</FormFieldError>
					) : (
						<span></span>
					)}
					{maxLength ? (
						<span className={maxLengthClass}>
							{maxLength - inputLength}
						</span>
					) : null}
				</div>
			) : null}
		</div>
	);
};

export default Input;
