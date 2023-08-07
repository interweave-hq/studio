"use client";

import { useEffect, useMemo, useState } from "react";
import { type Schema, type KeyConfiguration } from "@interweave/interweave";

import { Button, Sizes, Flavors, Kinds } from "@/components/Button";
import { Error, Table } from "@/components";

import { isEmpty } from "@/lib/helpers";

import styles from "./styles.module.css";
import { NoData } from "../NoData";
import { getLabelFromKey } from "@/lib/parsers";

const getActions = ({
	activeRow,
	onUpdate,
	onDelete,
}: {
	activeRow?: any;
	onDelete?: () => void;
	onUpdate?: () => void;
}) => {
	let noActiveRow = !activeRow;
	if (typeof activeRow === "object" && activeRow !== null) {
		if (Object.keys(activeRow).length <= 0) {
			noActiveRow = true;
		}
	}
	return [
		onUpdate ? (
			<Button
				key={"update"}
				domProps={{ disabled: noActiveRow }}
				onClick={() => onUpdate()}
				size={Sizes.sm}
				kind={Kinds.hollow}
				__cssFor={{ root: styles.updateButton }}
			>
				Update
			</Button>
		) : null,
		onDelete ? (
			<Button
				key={"delete"}
				domProps={{ disabled: noActiveRow }}
				onClick={() => onDelete()}
				size={Sizes.sm}
				flavor={Flavors.danger}
				kind={Kinds.hollow}
			>
				Delete
			</Button>
		) : null,
	];
};

// Given a schema configuration object...
// We need to take a path X and return a proper configuration object
// So given obj { products: { schema: { object_keys: Schema } } }
// So path "products"
// Will return products.schema.object_keys
const getColumnsFromKeys = (columnData: {
	[key: string]: KeyConfiguration;
}) => {
	const initialColumnVisibility: Record<string, any> = {};
	const keysArr = Object.keys(columnData);
	const cols: any[] = keysArr.map((k) => {
		const typeConfig = columnData[k];
		const tableOptions = typeConfig?.interface?.table;
		if (tableOptions?.hidden) {
			initialColumnVisibility[k] = false;
		}
		return {
			header: typeConfig?.interface?.label || getLabelFromKey(k),
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
			isVisible: tableOptions?.hidden,
		};
	});
	// Having a bunch of empty columns makes the table look and function better
	// The accessibility of this may not be great...
	const MIN_COLUMNS = 10;
	const diff = MIN_COLUMNS - cols.length;
	// No negative numbers here
	const numEmptyColumns = diff >= 0 ? diff : 0;
	const emptyCols = new Array(numEmptyColumns)
		.fill({ header: "", key: null })
		.map((e, i) => ({ ...e, id: `empty-col-${i}` }));
	const fullCols = cols.concat(emptyCols);
	return {
		data: fullCols,
		initialState: { columnVisibility: initialColumnVisibility },
		error: null,
	};
};

export default function DynamicTable({
	data,
	columnData,
	uri,
	requestDuration,
	reload,
	setRowState,
	onDelete,
	onUpdate,
	purgeRowState = false,
}: {
	data: any[];
	columnData: { [key: string]: KeyConfiguration };
	uri: string;
	requestDuration?: number;
	reload?: () => void;
	schema: Schema;
	onDelete?: () => void;
	onUpdate?: () => void;
	setRowState: (r: any) => void;
	purgeRowState?: boolean;
}) {
	const {
		data: cols,
		error,
		initialState,
	} = useMemo(() => getColumnsFromKeys(columnData), []);
	const [selectedRow, setSelectedRow] = useState<any>(undefined);

	const onRowSelection = (r: any) => {
		setSelectedRow(r);
		setRowState(r);
	};

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

	// Get actions that will render on the table
	const rowActions = getActions({
		activeRow: selectedRow,
		onDelete,
		onUpdate,
	});

	if (isEmpty(data)) {
		return <NoData uri={uri} />;
	}

	return (
		<>
			<Table
				columns={cols}
				data={data}
				supplementalInfo={supplementalInfo}
				reload={reload}
				actions={rowActions}
				selectable={!!onDelete || !!onUpdate}
				setSelectedRow={(row) => onRowSelection(row)}
				initialState={initialState}
				purgeRowState={purgeRowState}
			/>
		</>
	);
}
