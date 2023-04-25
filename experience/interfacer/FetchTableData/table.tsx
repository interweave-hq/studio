"use client";

import { useMemo } from "react";

import { Table, Checkbox, Error } from "@/components";

import { type KeyConfiguration } from "@interweave/interweave";

// Given a schema configuration object...
// We need to take a path X and return a proper configuration object
// So given obj { products: { schema: { object_keys: Schema } } }
// So path "products"
// Will return products.schema.object_keys
const getColumnsFromKeys = (columnData: {
	[key: string]: KeyConfiguration;
}) => {
	const keysArr = Object.keys(columnData);
	const selectionColumn = [
		{
			id: "select",
			header: "select",
			cell: ({ row }: { row: any }) => {
				return (
					<Checkbox
						domProps={{
							checked: row.getIsSelected(),
							disabled: !row.getCanSelect(),
							// indeterminate: row.getIsSomeSelected(),
							onChange: row.getToggleSelectedHandler(),
						}}
					/>
				);
			},
			// <div>
			// 	<p>{row.getIsSelected()}</p>
			/* <Checkbox
						domProps={{
							checked: row.getIsSelected(),
							disabled: !row.getCanSelect(),
							// indeterminate: row.getIsSomeSelected(),
							onChange: row.getToggleSelectedHandler(),
						}}
					/> */
		},
		// </div>
	];
	const cols: any[] = keysArr.map((k) => {
		const typeConfig = columnData[k];
		// const tableOptions = typeConfig?.interface?.table;
		return {
			header: typeConfig?.interface?.form?.label || k,
			// footer: (props) => props.column.id,
			// columns: [
			// 	{
			// 		accessorKey: "firstName",
			// 		cell: (info) => info.getValue(),
			// 		footer: (props) => props.column.id,
			// 	},
			// 	{
			// 		accessorFn: (row) => row.lastName,
			// 		id: "lastName",
			// 		cell: (info) => info.getValue(),
			// 		header: () => <span>Last Name</span>,
			// 		footer: (props) => props.column.id,
			// 	},
			// ],
			accessorKey: k,
			// hide: tableOptions?.hidden,
		};
	});
	const together = selectionColumn.concat(cols);
	// return cols;
	return { data: together, error: null };
};

export default function DynamicTable({
	data,
	columnData,
	uri,
	requestDuration,
}: {
	data: any[];
	columnData: { [key: string]: KeyConfiguration };
	uri: string;
	requestDuration?: number;
}) {
	const { data: cols, error } = useMemo(
		() => getColumnsFromKeys(columnData),
		[]
	);
	const getDurationNumber = (num: number) => {
		const seconds = num / 1000;
		if (seconds < 1) {
			return `${num.toFixed(0)}ms`;
		}
		return `${seconds.toFixed(2)}s`;
	};
	const supplementalInfo = [
		`GET ${uri}`,
		requestDuration
			? `Fetched ${data.length} entries in ${getDurationNumber(
					requestDuration
			  )}`
			: "",
	];
	if (cols === null || error) {
		return (
			<Error
				title="Error Loading Table"
				text="We encountered an unexpected error generating the table for this data."
			/>
		);
	}
	return (
		<Table columns={cols} data={data} supplementalInfo={supplementalInfo} />
	);
}
