"use client";

import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";
import { timeAgo } from "@/lib/dates/timeAgo";
import {
	EyeSlash,
	Globe,
	HandRaised,
	LockClosed,
	UserGroup,
} from "@/components/Icons";
import { Badge } from "@/components/Badge";

const Overrides = {
	root: "root",
	description: "description",
	hash: "hash",
	lastBuild: "lastBuild",
	title: "title",
} as const;

type OverridesKeys = keyof typeof Overrides;

export type InterfaceCardOverrides<T> = {
	[K in OverridesKeys]?: T;
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	description?: string;
	hash?: string;
	lastBuild?: string;
	emailDomain?: string;
	privacy?:
		| "Private"
		| "Unlisted"
		| "Public"
		| "DomainRestricted"
		| "InviteRestricted";
	title?: string;
	titleParts?: {
		one: string;
		two: string;
	};
	__cssFor?: InterfaceCardOverrides<string>;
}

const badgeConfig = {
	Public: {
		label: "Public",
		svg: Globe,
	},
	Private: {
		label: "Private",
		svg: LockClosed,
	},
	Unlisted: {
		label: "Unlisted",
		svg: EyeSlash,
	},
	DomainRestricted: {
		label: "Domain Restricted",
		svg: UserGroup,
	},
	InviteRestricted: {
		label: "Invite Only",
		svg: HandRaised,
	},
};

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
	} = shapeCss<OverridesKeys, InterfaceCardOverrides<string>>(
		Overrides,
		styles,
		__cssFor
	);
	const buildTime = timeAgo(new Date(lastBuild!));
	const badge = privacy ? badgeConfig[privacy] : null;

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
				{badge ? <Badge text={badge.label} icon={badge.svg} /> : null}
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
