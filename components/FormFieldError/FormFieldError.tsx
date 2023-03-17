"use client";

import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";

const Overrides = {
	root: "root",
} as const;

type OverridesKeys = keyof typeof Overrides;

export type FormFieldErrorOverrides<T> = {
	[K in OverridesKeys]?: T;
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	children: string;
	__cssFor?: FormFieldErrorOverrides<string>;
}

export function FormFieldError({ children, __cssFor }: Props) {
	const { root: rootStyles } = shapeCss<
		OverridesKeys,
		FormFieldErrorOverrides<string>
	>(Overrides, styles, __cssFor);
	return <p className={rootStyles}>{children}</p>;
}
