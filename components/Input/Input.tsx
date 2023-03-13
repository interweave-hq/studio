"use client";

import { useId } from "react";
import styles from "./input.module.css";
import { shapeCss } from "@/lib/helpers";

const Overrides = {
	root: "root",
	input: "input",
	label: "label",
	description: "description",
} as const;

type OverridesKeys = keyof typeof Overrides;

export type InputOverrides<T> = {
	[K in OverridesKeys]?: T;
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	description?: string;
	domProps?: React.HTMLProps<HTMLInputElement>;
	label?: string;
	register?: object;
	__cssFor?: InputOverrides<string>;
}

const Input = ({
	description,
	domProps,
	label = "Label",
	register,
	__cssFor,
}: Props) => {
	const id = useId();
	const {
		root: rootStyles,
		label: labelStyles,
		input: inputStyles,
		description: descriptionStyles,
	} = shapeCss<OverridesKeys, InputOverrides<string>>(
		Overrides,
		styles,
		__cssFor
	);
	return (
		<div className={rootStyles}>
			{label && (
				<label htmlFor={id} className={labelStyles}>
					{label}
				</label>
			)}
			{description && <p className={descriptionStyles}>{description}</p>}
			<input
				type="text"
				{...domProps}
				{...register}
				id={id}
				className={inputStyles}
			/>
		</div>
	);
};

export default Input;
