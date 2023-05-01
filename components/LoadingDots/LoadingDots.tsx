import { useMemo } from "react";
import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";

const Overrides = {
	root: "root",
} as const;

type OverridesKeys = keyof typeof Overrides;

export type LoadingDotsOverrides<T> = {
	[K in OverridesKeys]?: T;
};

export interface LoadingDotsProps {
	__cssFor?: LoadingDotsOverrides<string>;
}

export function LoadingDots({ __cssFor }: LoadingDotsProps) {
	const { root: rootStyles } = useMemo(() => {
		return shapeCss<OverridesKeys, LoadingDotsOverrides<string>>(
			Overrides,
			styles,
			__cssFor
		);
	}, [__cssFor]);
	return (
		<svg viewBox="0 0 100 100" className={rootStyles}>
			<circle cx="25" cy="50" r="10" fill="#777">
				<animate
					attributeName="opacity"
					dur="1s"
					begin="0s"
					repeatCount="indefinite"
					values="1;0"
				></animate>
			</circle>
			<circle cx="50" cy="50" r="10" fill="#777">
				<animate
					attributeName="opacity"
					dur="1s"
					begin="0.33s"
					repeatCount="indefinite"
					values="1;0"
				></animate>
			</circle>
			<circle cx="75" cy="50" r="10" fill="#777">
				<animate
					attributeName="opacity"
					dur="1s"
					begin="0.66s"
					repeatCount="indefinite"
					values="1;0"
				></animate>
			</circle>
		</svg>
	);
}
