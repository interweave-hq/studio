"use client";

import {
	Column,
	Table as ReactTable,
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	flexRender,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import styles from "./table.module.css";
import { Input } from "@/components/Input";
import {
	Beaker,
	ChevronDoubleLeft,
	ChevronDoubleRight,
	ChevronLeft,
	ChevronRight,
	Reload,
} from "@/components/Icons";
import { combineCss } from "@/lib/helpers";

export default function Table({
	data,
	columns,
	supplementalInfo = [],
	reload,
	actions,
	setSelectedRow,
	selectable,
	initialState,
}: {
	data: any;
	columns: any[];
	supplementalInfo?: string[];
	reload?: () => void;
	actions?: React.ReactNode[];
	selectable?: boolean;
	setSelectedRow?: (row: any) => void;
	initialState?: Record<string, any>;
}) {
	const [rowSelection, setRowSelection] = useState<any>(undefined);

	useEffect(() => {
		if (setSelectedRow) {
			setSelectedRow(rowSelection);
		}
	}, [rowSelection]);
	const table = useReactTable({
		data,
		columns,
		enableRowSelection: true,
		enableMultiRowSelection: false,
		state: {
			rowSelection,
		},
		initialState,
		onRowSelectionChange: (e) => setRowSelection(e),
		// Pipeline
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		//
		debugTable: process.env.NODE_ENV === "development",
	});

	return (
		<div className={styles.root}>
			<div className={styles.table__outer}>
				<table className={styles.table}>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th
											key={header.id}
											colSpan={header.colSpan}
											className={styles.table__header}
										>
											{header.isPlaceholder ? null : (
												<div
													className={
														styles[
															"table__header-container"
														]
													}
												>
													{flexRender(
														header.column.columnDef
															.header,
														header.getContext()
													)}
													{header.column.getCanFilter() ? (
														<Filter
															column={
																header.column
															}
															table={table}
														/>
													) : null}
												</div>
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => {
							const selectedRow = rowSelection?.id == row.id;
							const className = selectedRow
								? combineCss([
										styles.table__row,
										styles["table__row--selected"],
								  ])
								: styles.table__row;
							return (
								<tr
									key={row.id}
									className={className}
									onClick={() => {
										if (selectable) {
											if (selectedRow) {
												return setRowSelection(null);
											}
											setRowSelection(row);
										}
									}}
									data-selectable={!!selectable}
								>
									{row.getVisibleCells().map((cell) => {
										return (
											<td
												className={styles.table__cell}
												key={cell.id}
											>
												<div
													className={
														styles[
															"table__cell-text"
														]
													}
												>
													{flexRender(
														cell.column.columnDef
															.cell,
														cell.getContext()
													)}
												</div>
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className={styles["table__bottom-container"]}>
				<div className={styles["table-controls"]}>
					<button
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
						className={styles["table-controls__button"]}
					>
						<ChevronDoubleLeft
							className={styles["table-controls__button-svg"]}
						/>
					</button>
					<button
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className={styles["table-controls__button"]}
					>
						<ChevronLeft
							className={styles["table-controls__button-svg"]}
						/>
					</button>
					<button
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className={styles["table-controls__button"]}
					>
						<ChevronRight
							className={styles["table-controls__button-svg"]}
						/>
					</button>
					<button
						onClick={() =>
							table.setPageIndex(table.getPageCount() - 1)
						}
						disabled={!table.getCanNextPage()}
						className={styles["table-controls__button"]}
					>
						<ChevronDoubleRight
							className={styles["table-controls__button-svg"]}
						/>
					</button>
					<span>
						<p className={styles["table-controls__page-text"]}>
							Page
						</p>
						<strong
							className={
								styles["table-controls__page-range-number"]
							}
						>
							{table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount()}
						</strong>
					</span>
					<span className={styles["table-controls__go-to-text"]}>
						Go to page:
						<input
							className={styles["table-controls__input"]}
							type="number"
							defaultValue={
								table.getState().pagination.pageIndex + 1
							}
							onChange={(e) => {
								const page = e.target.value
									? Number(e.target.value) - 1
									: 0;
								table.setPageIndex(page);
							}}
						/>
					</span>
					<select
						className={styles["table-controls__select"]}
						value={table.getState().pagination.pageSize}
						onChange={(e) => {
							table.setPageSize(Number(e.target.value));
						}}
					>
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								Show {pageSize}
							</option>
						))}
					</select>
					{reload ? (
						<button
							onClick={() => reload()}
							className={combineCss([
								styles["table-controls__button"],
								styles["table__reload-button"],
							])}
						>
							<Reload
								className={combineCss([
									styles["table-controls__button-svg"],
									styles["table__reload-button-svg"],
								])}
							/>
						</button>
					) : null}
					{actions ? (
						<div className={styles["table__actions-container"]}>
							{actions.map((el) => el)}
						</div>
					) : null}
				</div>
				<div>
					{supplementalInfo.map((s, i) => (
						<span
							key={s}
							className={styles["table__supplemental-info"]}
						>
							{s}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

function FilterButton({
	hidden,
	setHidden,
}: {
	hidden: boolean;
	setHidden: (value: boolean) => void;
}) {
	// temporarily disabling until we have bandwidth to make it better looking
	return null;
	return (
		<button
			onClick={() => setHidden(!hidden)}
			className={styles["filter-button"]}
		>
			<Beaker className={styles["filter-button__icon"]} />
		</button>
	);
}

function Filter({
	column,
	table,
}: {
	column: Column<any, any>;
	table: ReactTable<any>;
}) {
	const [hidden, setHidden] = useState(true);
	const firstValue = table
		.getPreFilteredRowModel()
		.flatRows[0]?.getValue(column.id);

	const columnFilterValue = column.getFilterValue();

	if (hidden) {
		return <FilterButton hidden={hidden} setHidden={setHidden} />;
	}
	return typeof firstValue === "number" ? (
		<div>
			<FilterButton hidden={hidden} setHidden={setHidden} />
			<div>
				<Input
					label="Min"
					domProps={{
						type: "number",
						value:
							(columnFilterValue as [number, number])?.[0] ?? "",
						onChange: (e) => {
							column.setFilterValue((old: [number, number]) => [
								e.currentTarget.value,
								old?.[1],
							]);
						},
						placeholder: `1`,
					}}
				/>
				<Input
					label="Max"
					domProps={{
						type: "number",
						value:
							(columnFilterValue as [number, number])?.[1] ?? "",
						onChange: (e) => {
							column.setFilterValue((old: [number, number]) => [
								old?.[0],
								e.currentTarget.value,
							]);
						},
						placeholder: `100`,
					}}
				/>
			</div>
		</div>
	) : (
		<div>
			<FilterButton hidden={hidden} setHidden={setHidden} />
			<Input
				label="Search"
				domProps={{
					type: "text",
					value: (columnFilterValue ?? "") as string,
					onChange: (e) =>
						column.setFilterValue(e.currentTarget.value),
					placeholder: `Aaron Judge`,
				}}
			/>
		</div>
	);
}
