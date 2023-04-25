import {
	EyeSlash,
	Globe,
	HandRaised,
	LockClosed,
	UserGroup,
} from "@/components/Icons";
import { Badge, type BadgeOverrides } from "@/components/Badge";

const Overrides = {} as const;

type OverridesKeys = keyof typeof Overrides;

type ExternalPrivacyBadgeOverrides<T> = {
	Badge?: BadgeOverrides<T>;
};
type InternalBadgeOverrides<T> = Record<OverridesKeys, T>;

export type PrivacyBadgeOverrides<T> = InternalBadgeOverrides<T> &
	ExternalPrivacyBadgeOverrides<T>;

export type PrivacyValue =
	| "Private"
	| "Unlisted"
	| "Public"
	| "DomainRestricted"
	| "InviteRestricted";

export interface PrivacyBadgeProps {
	privacy: PrivacyValue;
	__cssFor?: PrivacyBadgeOverrides<string>;
}

const badgeConfigs = {
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

export function PrivacyBadge({ privacy, __cssFor }: PrivacyBadgeProps) {
	const badgeConfig = badgeConfigs[privacy];
	return (
		<Badge
			text={badgeConfig.label}
			icon={badgeConfig.svg}
			__cssFor={__cssFor?.Badge}
		/>
	);
}
