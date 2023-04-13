import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";

const Overrides = {
	root: "root",
	title: "title",
	text: "text",
	details: "details",
} as const;

type OverridesKeys = keyof typeof Overrides;

export type ErrorOverrides<T> = {
	[K in OverridesKeys]?: T;
};

interface Props {
	text: string;
	details?: string;
	title: string;
	__cssFor?: ErrorOverrides<string>;
}

export default function Error({ text, details, title, __cssFor }: Props) {
	const {
		root: rootStyles,
		text: textStyles,
		details: detailsStyles,
		title: titleStyles,
	} = shapeCss<OverridesKeys, ErrorOverrides<string>>(
		Overrides,
		styles,
		__cssFor
	);
	return (
		<div className={rootStyles}>
			<h2 className={titleStyles}>{title}</h2>
			<p className={textStyles}>{text}</p>
			<p className={detailsStyles}>{details}</p>
		</div>
	);
}
