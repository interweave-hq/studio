"use client";

import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";
import { useMemo } from "react";

const Overrides = {
    root: "root",
    helperText: "helperText",
} as const;

type OverridesKeys = keyof typeof Overrides;

export type FormFieldLabelOverrides<T> = {
    [K in OverridesKeys]?: T;
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    children: string;
    helperText?: string;
    htmlFor: string;
    __cssFor?: FormFieldLabelOverrides<string>;
}

export function FormFieldLabel({ children, helperText, htmlFor, __cssFor }: Props) {
    const { root: rootStyles, helperText: helperTextStyles } = useMemo(() => {
        return shapeCss<OverridesKeys, FormFieldLabelOverrides<string>>(Overrides, styles, __cssFor);
    }, [__cssFor]);
    return (
        <label
            className={rootStyles}
            htmlFor={htmlFor}
        >
            {children}
            {helperText ? <span className={helperTextStyles}>({helperText})</span> : null}
        </label>
    );
}
