"use client";

import { useState, useEffect, useRef, useId } from "react";
import { useController } from "react-hook-form";
import styles from "./multiselect.module.css";
import { shapeCss } from "@/lib/helpers";
import { Checkbox } from "@/components/Checkbox";

const Overrides = {
	root: "root",
	container: "container",
	label: "label",
	option: "option",
	optionLabel: "optionLabel",
} as const;

type OverridesKeys = keyof typeof Overrides;

export type MultiSelectOverrides<T> = {
	[K in OverridesKeys]?: T;
};

type Option = {
	value: string | number;
	label: string;
};

type Props = {
	options: Option[];
	label: string;
	selectedOptions?: Option[];
	onChange?: (options: Option[]) => void;
	form: {
		control: any;
		name: string;
	};
	__cssFor?: MultiSelectOverrides<string>;
};

const MultiSelect = ({
	options,
	selectedOptions = [],
	form,
	label,
	__cssFor,
}: Props) => {
	const id = useId();
	const [selected, setSelected] = useState(
		selectedOptions.map((o) => o.value)
	);
	const { field } = useController(form);
	const ref = useRef(form.control);
	const {
		root: rootStyles,
		label: labelStyles,
		container: containerStyles,
		option: optionStyles,
		optionLabel: optionLabelStyles,
	} = shapeCss<OverridesKeys, MultiSelectOverrides<string>>(
		Overrides,
		styles,
		__cssFor
	);

	// Holy fucking fuck this shit
	// Makes activeChildren work as expected for fucks sake
	useEffect(() => {
		if (selectedOptions.length === selectedOptions.length) return;
		setSelected(selectedOptions.map((o) => o.value));
	}, [selectedOptions]);

	// Update form when selected options change
	useEffect(() => {
		field.onChange(selected);
	}, [selected]);

	const handleOptionSelect = (option: string | number) => {
		if (selected.includes(option)) {
			setSelected(selected.filter((o) => o !== option));
		} else {
			setSelected([...selected, option]);
		}
	};
	return (
		<div className={rootStyles} data-component="multiselect">
			<label className={labelStyles}>
				{label}{" "}
				<span className={styles["helper-text"]}>(Select multiple)</span>
			</label>
			<div className={containerStyles}>
				{options.map((opt) => (
					<Checkbox
						key={opt.value}
						label={opt.label}
						domProps={{
							defaultChecked: !!selected.find(
								(o) => o === opt.value
							),
							onChange: () => handleOptionSelect(opt.value),
						}}
						__cssFor={{
							root: styles.checkbox,
						}}
						ref={ref}
					/>
				))}
			</div>
		</div>
	);
};

export default MultiSelect;
