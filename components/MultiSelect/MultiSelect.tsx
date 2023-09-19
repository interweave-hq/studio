"use client";

import { MultiSelect as TMultiSelect, MultiSelectItem as TMultiSelectItem } from "@tremor/react";
import { useState, useEffect, useId, useMemo } from "react";
import { useController } from "react-hook-form";
import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";
import { FormFieldError, type FormFieldErrorOverrides } from "@/components/FormFieldError";
import { FormFieldLabel, type FormFieldLabelOverrides } from "@/components/FormFieldLabel";

const Overrides = {
    root: "root",
} as const;

type OverridesKeys = keyof typeof Overrides;

type InternalMultiSelectOverrides<T> = {
    [K in OverridesKeys]?: T;
};

type ExternalMultiSelectOverrides<T> = {
    FormFieldError?: FormFieldErrorOverrides<T>;
    FormFieldLabel?: FormFieldLabelOverrides<T>;
};

export type MultiSelectOverrides<T> = InternalMultiSelectOverrides<T> & ExternalMultiSelectOverrides<T>;

type Option = {
    value: string | number;
    label: string;
};

type Props = {
    error?: string;
    form: {
        control: any;
        name: string;
    };
    label: string;
    helperText?: string;
    onChange?: (options: Option[]) => void;
    options: Option[];
    selectedOptions?: Option[];
    __cssFor?: MultiSelectOverrides<string>;
};

const MultiSelect = ({ error, form, label, helperText = "Select multiple", options, selectedOptions = [], __cssFor }: Props) => {
    const id = useId();
    const [selected, setSelected] = useState(selectedOptions.map(o => o.value));
    const { field } = useController(form);
    const { root: rootStyles } = useMemo(() => {
        return shapeCss<OverridesKeys, MultiSelectOverrides<string>>(Overrides, styles, __cssFor);
    }, [__cssFor]);

    // Holy fucking fuck this shit
    // Makes activeChildren work as expected for fucks sake
    useEffect(() => {
        if (selectedOptions.length === selectedOptions.length) return;
        setSelected(selectedOptions.map(o => o.value));
    }, [selectedOptions]);

    // Update form when selected options change
    useEffect(() => {
        field.onChange(selected);
    }, [selected]);

    return (
        <div
            className={rootStyles + " flex flex-col max-w-xl"}
            data-component="multiselect"
        >
            <FormFieldLabel
                htmlFor={id}
                helperText={helperText}
                __cssFor={__cssFor?.FormFieldLabel}
            >
                {label}
            </FormFieldLabel>
            <TMultiSelect
                onValueChange={setSelected}
                // @ts-expect-error
                defaultValue={selectedOptions.map(o => o.value)}
            >
                {options.map(o => (
                    // @ts-expect-error
                    <TMultiSelectItem
                        key={o.value}
                        value={o.value}
                    >
                        {o.label}
                    </TMultiSelectItem>
                ))}
            </TMultiSelect>
            {error && <FormFieldError __cssFor={__cssFor?.FormFieldError}>{error}</FormFieldError>}
        </div>
    );
};

export default MultiSelect;
