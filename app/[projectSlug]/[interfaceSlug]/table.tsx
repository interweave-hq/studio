"use client";

import { useMemo } from "react";

import { Table, Checkbox, ComponentError } from "@/components";

import { getSchema } from "@/lib/helpers";
import { type KeyConfiguration } from "@interweave/interweave";

// Given a schema configuration object...
// We need to take a path X and return a proper configuration object
// So given obj { products: { schema: { object_keys: Schema } } }
// So path "products"
// Will return products.schema.object_keys
const getColumnsFromKeys = (
	columnData: { [key: string]: KeyConfiguration },
	dataPath?: string
) => {
	// We have to use the get path to parse our schema
	// columnData will be a KeyConfiguration
	// dataPath will be a string of where to look
	const schema = getSchema(columnData, dataPath || "");
	if (schema === null) {
		const error =
			"requests.get.data_path returned a null or undefined object. Check your configuration.";
		console.error(error);
		return { data: null, error };
	}
	const keysArr = Object.keys(schema);
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
			header: typeConfig?.interface?.attributes?.label || k,
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
	dataPath,
	endpoint,
}: {
	data: any[];
	columnData: { [key: string]: KeyConfiguration };
	dataPath?: string;
	endpoint: string;
}) {
	const { data: cols, error } = useMemo(
		() => getColumnsFromKeys(columnData, dataPath),
		[]
	);
	const supplementalInfo = [
		`GET ${endpoint}`,
		`Fetched ${data.length} entries in 1.2s`,
	];
	if (cols === null || error) {
		return (
			<ComponentError text="We encountered an unexpected error generating the table for this data." />
		);
	}
	return (
		<Table columns={cols} data={data} supplementalInfo={supplementalInfo} />
	);
}
