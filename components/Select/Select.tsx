"use client";

import { useId, useMemo, type ChangeEvent } from "react";
import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";
import { FormFieldError, type FormFieldErrorOverrides } from "@/components/FormFieldError";
import { FormFieldLabel, type FormFieldLabelOverrides } from "@/components/FormFieldLabel";

const Overrides = {
    root: "root",
    container: "container",
    option: "option",
    optionLabel: "optionLabel",
} as const;

type OverridesKeys = keyof typeof Overrides;

type InternalSelectOverrides<T> = {
    [K in OverridesKeys]?: T;
};

type ExternalSelectOverrides<T> = {
    FormFieldError?: FormFieldErrorOverrides<T>;
    FormFieldLabel?: FormFieldLabelOverrides<T>;
};

export type SelectOverrides<T> = InternalSelectOverrides<T> & ExternalSelectOverrides<T>;

export type SelectOption = {
    value: string | number | undefined;
    label?: string;
    keyOverride?: any;
};

type Props = {
    domProps?: React.HTMLProps<HTMLSelectElement>;
    error?: string;
    form?: {
        control: any;
        name: string;
    };
    helperText?: string;
    label: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>, value: string) => void;
    options: SelectOption[];
    register?: object;
    __cssFor?: SelectOverrides<string>;
};

const Select = ({ domProps = {}, error, form, helperText = "Select one", label, onChange = () => {}, options, register = {}, __cssFor }: Props) => {
    const id = useId();
    const { root: rootStyles, container: containerStyles } = useMemo(() => {
        return shapeCss<OverridesKeys, SelectOverrides<string>>(Overrides, styles, __cssFor);
    }, [__cssFor]);

    return (
        <div
            className={rootStyles}
            data-component="select"
        >
            <FormFieldLabel
                htmlFor={id}
                helperText={helperText}
                __cssFor={__cssFor?.FormFieldLabel}
            >
                {label}
            </FormFieldLabel>
            <select
                id={id}
                className={containerStyles}
                {...domProps}
                {...register}
                onChange={e => onChange(e, e.target.value)}
            >
                {options.map(opt => (
                    <option
                        key={opt.keyOverride || opt.value}
                        value={opt.value}
                    >
                        {opt.label || opt.value}
                    </option>
                ))}
            </select>
            {error && <FormFieldError __cssFor={{ ...__cssFor?.FormFieldError }}>{error}</FormFieldError>}
        </div>
    );
};

export default Select;
