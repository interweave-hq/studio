import { serverRequest } from "@/lib/api/serverRequest";
import { ComponentError } from "@/components";
import Table from "./table";

export async function FetchTableData({
	keys,
	endpoint,
	interfaceId,
}: {
	keys: any;
	endpoint: string;
	interfaceId: string;
}) {
	const { data, error } = await getTableData({ interfaceId });

	if (error) {
		console.error(error);
	}

	return (
		<div>
			{error?.userError ? (
				<ComponentError
					componentName="Data Table"
					text={error.userError}
					details={error.technicalError}
				/>
			) : (
				<Table data={data} columnData={keys} endpoint={endpoint} />
			)}
		</div>
	);
}

async function getTableData({ interfaceId }: { interfaceId: string }) {
	const { data, error } = await serverRequest(
		`/api/v1/interfaces/${interfaceId}`,
		{
			method: "POST",
			requestBody: { method: "get" },
		}
	);

	return { data, error };
}
