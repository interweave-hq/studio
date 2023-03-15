import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";
import { type ReactNode } from "react";

const Overrides = {
	root: "root",
	title: "title",
	text: "text",
	details: "details",
} as const;

type OverridesKeys = keyof typeof Overrides;

export type ComponentErrorOverrides<T> = {
	[K in OverridesKeys]?: T;
};

interface Props {
	text: string;
	details?: string;
	componentName?: string;
	__cssFor?: ComponentErrorOverrides<string>;
}

export default function ComponentError({
	text,
	details,
	componentName,
	__cssFor,
}: Props) {
	const {
		root: rootStyles,
		text: textStyles,
		details: detailsStyles,
		title: titleStyles,
	} = shapeCss<OverridesKeys, ComponentErrorOverrides<string>>(
		Overrides,
		styles,
		__cssFor
	);
	const name = componentName ? componentName : "Component";
	return (
		<div className={rootStyles}>
			<h2 className={titleStyles}>{name} Failed To Load</h2>
			<p className={textStyles}>{text}</p>
			<p className={detailsStyles}>{details}</p>
		</div>
	);
}
