"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useController, useForm } from "react-hook-form";
import styles from "./styles.module.css";
import { shapeCss, combineCss } from "@/lib/helpers";
import { FormFieldError, type FormFieldErrorOverrides } from "@/components/FormFieldError";
import { FormFieldLabel, type FormFieldLabelOverrides } from "@/components/FormFieldLabel";

const Overrides = {
    root: "root",
    input: "input",
    description: "description",
} as const;

type OverridesKeys = keyof typeof Overrides;

type InternalInputOverrides<T> = {
    [K in OverridesKeys]?: T;
};

type ExternalInputOverrides<T> = {
    FormFieldError?: FormFieldErrorOverrides<T>;
    FormFieldLabel?: FormFieldLabelOverrides<T>;
};

export type InputOverrides<T> = InternalInputOverrides<T> & ExternalInputOverrides<T>;

interface Props {
    description?: string;
    domProps?: React.HTMLProps<HTMLInputElement>;
    error?: string;
    helperText?: string;
    label?: string;
    maxLength?: number;
    register?: object;
    isTextArea?: boolean;
    __cssFor?: InputOverrides<string>;
}

const Input = ({ description, domProps, error, helperText = "", isTextArea = false, label = "Label", maxLength, register, __cssFor }: Props) => {
    const [inputLength, setInputValueLength] = useState(domProps?.defaultValue?.toString().length || 0);
    const id = useId();
    const handleOnChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (domProps?.onChange) {
            // @ts-expect-error
            domProps.onChange(e);
        }
        setInputValueLength(e.currentTarget.value.length);
    };
    const {
        root: rootStyles,
        input: inputStyles,
        description: descriptionStyles,
    } = useMemo(() => {
        return shapeCss<OverridesKeys, InputOverrides<string>>(Overrides, styles, __cssFor);
    }, [__cssFor]);
    const invalidLength = maxLength ? inputLength > maxLength : false;
    const inputElementClass = error || invalidLength ? combineCss([inputStyles, styles["input-error"]]) : inputStyles;
    const maxLengthClass = invalidLength ? combineCss([styles["max-length"], styles["max-length-error"]]) : styles["max-length"];
    return (
        <div className={rootStyles}>
            <div className={styles["top-container"]}>
                {label ? (
                    <FormFieldLabel
                        htmlFor={id}
                        __cssFor={__cssFor?.FormFieldLabel}
                        helperText={helperText}
                    >
                        {label}
                    </FormFieldLabel>
                ) : null}
                {description ? <p className={descriptionStyles}>{description}</p> : null}
            </div>
            {isTextArea ? (
                // @ts-expect-error
                <textarea
                    {...domProps}
                    {...register}
                    id={id}
                    className={inputElementClass}
                    onChange={e => handleOnChange(e)}
                    style={{
                        height: Math.ceil(inputLength / 75) * 20 + "px",
                        padding: "12px",
                        lineHeight: 1.2,
                    }}
                    onInput={e => {
                        e.currentTarget.style.height = "";
                        e.currentTarget.style.height = e.currentTarget.scrollHeight + 3 + "px";
                    }}
                />
            ) : (
                <input
                    type="text"
                    {...domProps}
                    {...register}
                    id={id}
                    className={inputElementClass}
                    onChange={e => handleOnChange(e)}
                />
            )}
            {error || maxLength ? (
                <div className={styles["bottom-container"]}>
                    {error ? <FormFieldError __cssFor={__cssFor?.FormFieldError}>{error}</FormFieldError> : <span></span>}
                    {maxLength ? <span className={maxLengthClass}>{maxLength - inputLength}</span> : null}
                </div>
            ) : null}
        </div>
    );
};

export default Input;
