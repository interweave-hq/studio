"use client";

import { useRef, type ReactNode, type ButtonHTMLAttributes, useMemo } from "react";
import styles from "./button.module.css";
import { combineCss, shapeCss } from "@/lib/helpers";

const Overrides = {
    root: "root",
} as const;

type OverridesKeys = keyof typeof Overrides;

export type ButtonOverrides<T> = {
    [K in OverridesKeys]?: T;
};

export const Flavors = {
    primary: "primary",
    danger: "danger",
} as const;

const FlavorStyles = {
    [Flavors.primary]: "",
    [Flavors.danger]: styles["button--danger"],
};

export const Sizes = {
    sm: "sm",
    md: "md",
} as const;

const SizeStyles = {
    [Sizes.sm]: styles["button--small"],
    [Sizes.md]: "",
};

export const Kinds = {
    solid: "solid",
    hollow: "hollow",
} as const;

const KindStyles = {
    [Kinds.solid]: "",
    [Kinds.hollow]: styles["button--hollow"],
};

export interface ButtonProps {
    onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    domProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;
    flavor?: keyof typeof Flavors;
    size?: keyof typeof Sizes;
    kind?: keyof typeof Kinds;
    __cssFor?: ButtonOverrides<string>;
}

export function Button({ onClick = () => {}, children, domProps, flavor = Flavors.primary, size = Sizes.md, kind = Kinds.solid, __cssFor }: ButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { root: rootStyles } = useMemo(() => {
        return shapeCss<OverridesKeys, ButtonOverrides<string>>(Overrides, styles, __cssFor);
    }, [__cssFor]);
    const move = (e: React.MouseEvent<HTMLButtonElement>) => {
        buttonRef.current?.animate([{ transform: "translateY(3px) translateX(2px)" }, { transform: "translateY(0px) translateX(0px)" }], {
            easing: "linear",
            duration: 150,
            fill: "forwards",
        });
        onClick(e);
    };

    return (
        <button
            type="submit"
            {...domProps}
            onClick={move}
            ref={buttonRef}
            className={combineCss([rootStyles, FlavorStyles[flavor], SizeStyles[size], KindStyles[kind]])}
        >
            {children}
        </button>
    );
}
