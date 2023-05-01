"use client";

import { useMemo, useState } from "react";

import { Button, Sizes, Flavors, Kinds } from "@/components/Button";
import { Error, InfoModal, Table } from "@/components";

import { Request, type KeyConfiguration } from "@interweave/interweave";
import { RequestReturn } from "@/lib/api/request";
import { type Error as ErrorType } from "@/interfaces";

import styles from "./styles.module.css";

const getActions = ({
	activeRow,
	renderUpdate,
	renderDelete,
	openDeleteModal,
}: {
	activeRow?: any;
	renderUpdate: boolean;
	renderDelete: boolean;
	openDeleteModal: (
		e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => void;
}) => {
	let noActiveRow = !activeRow;
	const rowData = activeRow?.original;
	if (typeof activeRow === "object" && activeRow !== null) {
		if (Object.keys(activeRow).length <= 0) {
			noActiveRow = true;
		}
	}
	return [
		renderUpdate ? (
			<Button
				key={"update"}
				domProps={{ disabled: noActiveRow }}
				onClick={() => console.log("heello")}
				size={Sizes.sm}
				kind={Kinds.hollow}
			>
				Update {rowData?.slug}
			</Button>
		) : null,
		renderDelete ? (
			<Button
				key={"delete"}
				domProps={{ disabled: noActiveRow }}
				onClick={(e) => openDeleteModal(e)}
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
	const keysArr = Object.keys(columnData);
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
	return { data: cols, error: null };
};

export default function DynamicTable({
	data,
	columnData,
	uri,
	requestDuration,
	reload,
	deleteRequest,
	updateRequest,
}: {
	data: any[];
	columnData: { [key: string]: KeyConfiguration };
	uri: string;
	requestDuration?: number;
	reload?: () => void;
	deleteRequest?: ({
		row,
	}: {
		row?: Record<string, any>;
	}) => Promise<RequestReturn>;
	updateRequest?: Request;
}) {
	const { data: cols, error } = useMemo(
		() => getColumnsFromKeys(columnData),
		[]
	);
	const [selectedRow, setSelectedRow] = useState<any>(undefined);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isDeleteRequestLoading, setDeleteRequestLoading] = useState(false);
	const [deleteRequestError, setDeleteRequestError] = useState<ErrorType>();

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
		renderDelete: !!deleteRequest,
		renderUpdate: !!updateRequest,
		openDeleteModal: () => {
			setDeleteModalOpen(true);
		},
	});

	// Handle delete request
	const handleDeleteRequest = async () => {
		setDeleteRequestLoading(true);
		setDeleteRequestError(undefined);

		if (deleteRequest) {
			const { data, error } = await deleteRequest({ row: selectedRow });
			console.log(data, error);
			if (error) {
				setDeleteRequestLoading(false);
				setDeleteRequestError(error);
				return;
			}
		}
		if (reload) {
			reload();
		}
		setDeleteModalOpen(false);
		setDeleteRequestLoading(false);
	};

	return (
		<>
			<InfoModal
				modalProps={{
					isOpen: deleteModalOpen,
					setClosed: () => setDeleteModalOpen(false),
				}}
				isLoading={isDeleteRequestLoading}
				errorProps={
					deleteRequestError && {
						title: "Delete Operation Failed",
						text:
							deleteRequestError?.userError ||
							"This error is unexpected. Please check your configuration for this request.",
						details: deleteRequestError?.technicalError,
					}
				}
				confirmCtaProps={{
					children: "Confirm Delete",
					kind: "solid",
					flavor: "danger",
					onClick: () => handleDeleteRequest(),
				}}
				cancelCtaProps={{
					children: "Cancel",
					kind: "solid",
				}}
				title={`Confirm Deletion`}
				body="Are you sure you want to delete this record?"
			>
				<div className={styles["code-container"]}>
					<code className={styles.code}>
						{selectedRow
							? JSON.stringify(selectedRow?.original, null, 2)
							: null}
					</code>
				</div>
			</InfoModal>
			<Table
				columns={cols}
				data={data}
				supplementalInfo={supplementalInfo}
				reload={reload}
				actions={rowActions}
				selectable={!!deleteRequest || !!updateRequest}
				setSelectedRow={(row) => setSelectedRow(row)}
			/>
		</>
	);
}
