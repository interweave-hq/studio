"use client";

import { useState, useId, useMemo } from "react";
import { type Request, type SchemaKeys } from "@interweave/interweave";

import { InfoModal } from "@/components";
import { UpdateForm } from "@/experience/interfacer/UpdateForm";
import { FetchTableData } from "@/experience/interfacer/FetchTableData";
import { Interfacer } from "@/experience/interfacer/Interfacer";
import {
	type Interfacer as InterfacerType,
	type VariableState,
	type Error as ErrorType,
} from "@/interfaces";

import { formatFormObject } from "@/lib/formatters";

import { clientRequest } from "@/lib/api/clientRequest";

import styles from "./styles.module.css";

export function TableAndForm({
	interfacer,
	keys,
	fetchData,
	createData,
	updateRequest,
	deleteRequest,
}: {
	interfacer: InterfacerType;
	keys: SchemaKeys;
	fetchData: Request;
	createData: Request;
	updateRequest: Request;
	deleteRequest: Request;
}) {
	const [parametersState, setParametersState] = useState({});
	const [rowState, setRowState] = useState({});
	const [parametersLoading, setParametersLoading] = useState(true);
	const [reloadValue, setReload] = useState(false);

	// Update state
	const [updateModalOpen, setUpdateModalOpen] = useState(false);
	const [isUpdateRequestLoading, setUpdateRequestLoading] = useState(false);
	const [updateRequestError, setUpdateRequestError] = useState<ErrorType>();
	const updateFormId = useId();

	// Delete state
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isDeleteRequestLoading, setDeleteRequestLoading] = useState(false);
	const [deleteRequestError, setDeleteRequestError] = useState<ErrorType>();

	const reload = () => {
		setReload(!reloadValue);
	};

	const variables: VariableState = {
		parameters: parametersState,
		row: rowState,
		form: {},
	};

	const updateRowState = (row: any) => {
		setRowState(row ? row.original : {});
	};

	// Handle update request
	const handleUpdateRequest = async (formData: any) => {
		setUpdateRequestLoading(true);
		setUpdateRequestError(undefined);

		formData = formatFormObject(formData, interfacer.schema_config.keys);

		if (updateRequest) {
			const { data, error } = await clientRequest(
				`/api/v1/interfaces/${interfacer.id}`,
				{
					method: "POST",
					requestBody: {
						method: "update",
						...variables,
						row: rowState,
						form: formData,
					},
				}
			);
			if (error) {
				setUpdateRequestLoading(false);
				setUpdateRequestError(error);
				return;
			}
		}

		// Reload the table guarantees accurate rowData if they click off and on again
		if (reload) {
			reload();
		}

		// After an entry is updated, the rowData becomes outdated
		// We cant say for certain what the new row looks like, but lets try our best by merging the form and existing row
		setRowState({
			...rowState,
			...formData,
		});

		setUpdateModalOpen(false);
		setUpdateRequestLoading(false);
	};

	// Handle delete request
	const handleDeleteRequest = async () => {
		setDeleteRequestLoading(true);
		setDeleteRequestError(undefined);

		if (deleteRequest) {
			const { data, error } = await clientRequest(
				`/api/v1/interfaces/${interfacer.id}`,
				{
					method: "POST",
					requestBody: {
						method: "delete",
						...variables,
						row: rowState,
					},
				}
			);
			if (error) {
				setDeleteRequestLoading(false);
				setDeleteRequestError(error);
				return;
			}
		}
		if (reload) {
			reload();
		}
		setRowState({});
		setDeleteModalOpen(false);
		setDeleteRequestLoading(false);
	};

	const onDelete = deleteRequest
		? () => {
				setDeleteRequestError(undefined);
				setDeleteModalOpen(true);
		  }
		: undefined;

	const onUpdate = updateRequest
		? () => {
				setUpdateRequestError(undefined);
				setUpdateModalOpen(true);
		  }
		: undefined;

	const memoizedTableComponent = useMemo(() => {
		return (
			<FetchTableData
				interfaceId={interfacer.id}
				keys={keys}
				getRequest={fetchData}
				schema={interfacer.schema_config}
				setParametersState={setParametersState}
				setRowState={(r) => updateRowState(r)}
				variables={variables}
				parametersLoading={parametersLoading}
				setParametersLoading={setParametersLoading}
				onDelete={onDelete}
				onUpdate={onUpdate}
				reload={reload}
				triggerReload={reloadValue}
			/>
		);
	}, [variables.parameters, interfacer.id, reloadValue]);

	return (
		<>
			{fetchData ? (
				<div className={styles["table-container"]}>
					{memoizedTableComponent}
				</div>
			) : null}
			{!createData ? null : (
				<div className={styles["form-container"]}>
					<h2>Create</h2>
					<Interfacer
						interfaceId={interfacer.id}
						schema={interfacer.schema_config}
						variables={variables}
					/>
				</div>
			)}
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
					schema={interfacer.schema_config}
					variables={variables}
					onSubmit={handleUpdateRequest}
					formId={updateFormId}
				/>
			</InfoModal>
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
						{rowState ? JSON.stringify(rowState, null, 2) : null}
					</code>
				</div>
			</InfoModal>
		</>
	);
}
