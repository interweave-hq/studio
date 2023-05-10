"use client";

import { useMemo, useState, cloneElement, useId } from "react";
import { type Schema, type KeyConfiguration } from "@interweave/interweave";
import { useForm } from "react-hook-form";

import { Button, Sizes, Flavors, Kinds } from "@/components/Button";
import { Error, InfoModal, Table } from "@/components";

import { RequestReturn } from "@/lib/api/request";
import { VariableState, type Error as ErrorType } from "@/interfaces";
import { isEmpty } from "@/lib/helpers";
import { GetComponent } from "@/experience/interfacer/GetComponent";

import styles from "./styles.module.css";
import { NoData } from "../NoData";
import { formatFormObject } from "@/lib/formatters";

const getActions = ({
	activeRow,
	renderUpdate,
	renderDelete,
	openDeleteModal,
	openUpdateModal,
}: {
	activeRow?: any;
	renderUpdate: boolean;
	renderDelete: boolean;
	openDeleteModal: (
		e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => void;
	openUpdateModal: (
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
				onClick={(e) => openUpdateModal(e)}
				size={Sizes.sm}
				kind={Kinds.hollow}
				__cssFor={{ root: styles.updateButton }}
			>
				Update
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
	const initialColumnVisibility: Record<string, any> = {};
	const keysArr = Object.keys(columnData);
	const cols: any[] = keysArr.map((k) => {
		const typeConfig = columnData[k];
		const tableOptions = typeConfig?.interface?.table;
		if (tableOptions?.hidden) {
			initialColumnVisibility[k] = false;
		}
		return {
			header: typeConfig?.interface?.label || k,
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
	deleteRequest,
	updateRequest,
	schema,
	setRowState,
	variables,
}: {
	data: any[];
	columnData: { [key: string]: KeyConfiguration };
	uri: string;
	requestDuration?: number;
	reload?: () => void;
	schema: Schema;
	deleteRequest?: ({
		row,
	}: {
		row: Record<string, any>;
	}) => Promise<RequestReturn>;
	updateRequest?: ({
		row,
		form,
	}: {
		row: Record<string, any>;
		form: Record<string, any>;
	}) => Promise<RequestReturn>;
	setRowState: (r: any) => void;
	variables: VariableState;
}) {
	const {
		data: cols,
		error,
		initialState,
	} = useMemo(() => getColumnsFromKeys(columnData), []);
	const [selectedRow, setSelectedRow] = useState<any>(undefined);
	// Delete state
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isDeleteRequestLoading, setDeleteRequestLoading] = useState(false);
	const [deleteRequestError, setDeleteRequestError] = useState<ErrorType>();
	// Update state
	const [updateModalOpen, setUpdateModalOpen] = useState(false);
	const [isUpdateRequestLoading, setUpdateRequestLoading] = useState(false);
	const [updateRequestError, setUpdateRequestError] = useState<ErrorType>();
	const updateFormId = useId();

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
		renderDelete: !!deleteRequest,
		renderUpdate: !!updateRequest,
		openDeleteModal: () => {
			setDeleteRequestError(undefined);
			setDeleteModalOpen(true);
		},
		openUpdateModal: () => {
			setUpdateRequestError(undefined);
			setUpdateModalOpen(true);
		},
	});

	// Handle delete request
	const handleDeleteRequest = async () => {
		setDeleteRequestLoading(true);
		setDeleteRequestError(undefined);

		if (deleteRequest) {
			const { data, error } = await deleteRequest({ row: selectedRow });
			if (error) {
				setDeleteRequestLoading(false);
				setDeleteRequestError(error);
				return;
			}
		}
		if (reload) {
			reload();
		}
		setSelectedRow(undefined);
		setDeleteModalOpen(false);
		setDeleteRequestLoading(false);
	};

	// Handle update request
	const handleUpdateRequest = async (formData: any) => {
		setUpdateRequestLoading(true);
		setUpdateRequestError(undefined);

		formData = formatFormObject(formData, schema.keys);

		if (updateRequest) {
			const { data, error } = await updateRequest({
				row: selectedRow.original,
				form: formData,
			});
			if (error) {
				setUpdateRequestLoading(false);
				setUpdateRequestError(error);
				return;
			}
		}
		if (reload) {
			reload();
		}
		setUpdateModalOpen(false);
		setUpdateRequestLoading(false);
	};

	if (isEmpty(data)) {
		return <NoData uri={uri} />;
	}

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
					domProps: {
						disabled: isDeleteRequestLoading,
					},
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
			<InfoModal
				modalProps={{
					isOpen: updateModalOpen,
					setClosed: () => setUpdateModalOpen(false),
				}}
				isLoading={isUpdateRequestLoading}
				errorProps={
					updateRequestError && {
						title: "Update Operation Failed",
						text:
							updateRequestError?.userError ||
							"This error is unexpected. Please check your configuration for this request.",
						details: updateRequestError?.technicalError,
					}
				}
				confirmCtaProps={{
					children: "Save",
					kind: "solid",
					flavor: "primary",
					domProps: {
						type: "submit",
						form: updateFormId,
						disabled: isUpdateRequestLoading,
					},
				}}
				cancelCtaProps={{
					children: "Cancel",
					kind: "hollow",
				}}
				title={`Update Entry`}
				body=""
			>
				<UpdateForm
					schema={schema}
					variables={variables}
					onSubmit={handleUpdateRequest}
					formId={updateFormId}
				/>
			</InfoModal>
			<Table
				columns={cols}
				data={data}
				supplementalInfo={supplementalInfo}
				reload={reload}
				actions={rowActions}
				selectable={!!deleteRequest || !!updateRequest}
				setSelectedRow={(row) => onRowSelection(row)}
				initialState={initialState}
			/>
		</>
	);
}

function UpdateForm({
	schema,
	variables,
	formId,
	onSubmit,
}: {
	schema: Schema;
	variables: VariableState;
	formId: string;
	onSubmit: (data: any) => void;
}) {
	const { register, control, handleSubmit } = useForm();
	const schemaKeys = schema.keys;
	const components = Object.keys(schemaKeys).map((k) => {
		const keyConfig = schemaKeys[k];
		const optionalText = keyConfig?.schema?.is_optional ? "Optional" : "";

		return GetComponent(
			k,
			{
				type: keyConfig.schema.type,
				enum: keyConfig?.schema?.enum,
				dynamic_enum: keyConfig?.schema?.dynamic_enum,
				defaultValue:
					variables.row[k] || keyConfig?.schema?.default_value,
				isArray: keyConfig?.schema?.is_array,
				label: keyConfig?.interface?.label,
				required: !keyConfig?.schema?.is_optional,
				styles: styles["shared-styles"],
				description:
					keyConfig?.interface?.form?.description || optionalText,
				disabled: keyConfig?.interface?.form?.disabled,
				form: { register, control },
				hidden: keyConfig?.interface?.form?.hidden,
			},
			{ variables }
		);
	});
	return (
		<form autoComplete="off" onSubmit={handleSubmit(onSubmit)} id={formId}>
			{components.map(({ component, key }) =>
				cloneElement(component, { key })
			)}
		</form>
	);
}
