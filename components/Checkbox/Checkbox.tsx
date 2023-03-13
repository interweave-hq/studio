"use client";

import { forwardRef, useId } from "react";
import styles from "./checkbox.module.css";
import { shapeCss } from "@/lib/helpers";

const Overrides = {
	root: "root",
	container: "container",
	input: "input",
	label: "label",
	description: "description",
} as const;

type OverridesKeys = keyof typeof Overrides;

export type CheckboxOverrides<T> = {
	[K in OverridesKeys]?: T;
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	description?: string;
	domProps?: React.HTMLProps<HTMLInputElement>;
	label?: string;
	ref?: any;
	register?: object;
	__cssFor?: CheckboxOverrides<string>;
}

type ChildRef = HTMLInputElement;

const Checkbox = forwardRef<ChildRef, Props>((props, ref) => {
	Checkbox.displayName = "Checkbox";
	const { description, domProps, label, register, __cssFor } = props;
	const id = useId();
	const {
		root: rootStyles,
		container: containerStyles,
		label: labelStyles,
		input: inputStyles,
		description: descriptionStyles,
	} = shapeCss<OverridesKeys, CheckboxOverrides<string>>(
		Overrides,
		styles,
		__cssFor
	);
	return (
		<div className={rootStyles}>
			<div className={containerStyles}>
				<input
					type="checkbox"
					{...domProps}
					{...register}
					id={id}
					className={inputStyles}
					ref={ref}
				/>
				{label && (
					<label htmlFor={id} className={labelStyles}>
						{label}
					</label>
				)}
			</div>
			{description && <p className={descriptionStyles}>{description}</p>}
		</div>
	);
});

export default Checkbox;
