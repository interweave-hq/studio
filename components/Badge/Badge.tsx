import { type ReactNode, useMemo } from "react";
import styles from "./style.module.css";

import { shapeCss } from "@/lib/helpers";

const Overrides = {
    root: "root",
    icon: "icon",
    text: "text",
} as const;

type OverridesKeys = keyof typeof Overrides;

export type BadgeOverrides<T> = {
    [K in OverridesKeys]?: T;
};

type BadgeProps = {
    text: string;
    icon?: (props: any) => ReactNode;
    backgroundColor?: string;
    color?: string;
    __cssFor?: BadgeOverrides<string>;
};

export const Badge = ({ text, icon, backgroundColor = "var(--grey-4)", color = "#3d3d3d", __cssFor }: BadgeProps) => {
    const {
        root: rootStyles,
        icon: iconStyles,
        text: textStyles,
    } = useMemo(() => {
        return shapeCss<OverridesKeys, BadgeOverrides<string>>(Overrides, styles, __cssFor);
    }, [__cssFor]);

    return (
        <div className={rootStyles}>
            {icon ? <span className={iconStyles}>{icon({ className: iconStyles })}</span> : null}
            <span className={textStyles}>{text}</span>
        </div>
    );
};
