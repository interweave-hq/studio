"use client";

import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";
import { timeAgo } from "@/lib/dates/timeAgo";
import {
	PrivacyBadge,
	type PrivacyValue,
	type PrivacyBadgeOverrides,
} from "../PrivacyBadge";
import { useMemo } from "react";

const Overrides = {
	root: "root",
	description: "description",
	hash: "hash",
	lastBuild: "lastBuild",
	title: "title",
} as const;

type OverridesKeys = keyof typeof Overrides;

type ExternalInterfaceCardOverrides<T> = {
	PrivacyBadge?: PrivacyBadgeOverrides<T>;
};

type InternalInterfaceCardOverrides<T> = {
	[k in OverridesKeys]?: T;
};

export type InterfaceCardOverrides<T> = ExternalInterfaceCardOverrides<T> &
	InternalInterfaceCardOverrides<T>;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	description?: string;
	hash?: string;
	lastBuild?: string;
	emailDomain?: string;
	privacy?: PrivacyValue;
	title?: string;
	titleParts?: {
		one: string;
		two: string;
	};
	__cssFor?: InterfaceCardOverrides<string>;
}

export const InterfaceCard = ({
	description,
	hash,
	lastBuild,
	privacy,
	title,
	titleParts,
	__cssFor,
}: Props) => {
	const {
		root: rootStyles,
		title: titleStyles,
		hash: hashStyles,
		lastBuild: lastBuildStyles,
		description: descriptionStyles,
		PrivacyBadge: privacyBadgeStyles,
	} = useMemo(() => {
		return shapeCss<OverridesKeys, InterfaceCardOverrides<string>>(
			Overrides,
			styles,
			__cssFor
		);
	}, [__cssFor]);
	const buildTime = timeAgo(new Date(lastBuild!));

	return (
		<div className={rootStyles}>
			{titleParts ? (
				<h2 className={titleStyles}>
					<span className={styles["title__part-one"]}>
						{titleParts.one}
					</span>
					<span className={styles.title__slash}>/</span>
					<span className={styles["title__part-two"]}>
						{titleParts.two}
					</span>
				</h2>
			) : (
				<h3 className={titleStyles}>{title}</h3>
			)}
			{description ? (
				<p className={descriptionStyles}>{description}</p>
			) : null}
			<div className={styles["bottom-container"]}>
				{privacy ? (
					<PrivacyBadge
						privacy={privacy}
						__cssFor={__cssFor?.PrivacyBadge}
					/>
				) : null}
				<div className={styles["bottom-right-container"]}>
					{hash ? <p className={hashStyles}>#{hash}</p> : null}
					{lastBuild ? (
						<p className={lastBuildStyles}>{buildTime}</p>
					) : null}
				</div>
			</div>
		</div>
	);
};
