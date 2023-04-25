"use client";

import { Button, Flavors, Sizes, Kinds } from "@/components/Button";
import { clientRequest } from "@/lib/api/clientRequest";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

export function DeleteAPITokens({
	interfaceId,
	projectId,
}: {
	interfaceId: string;
	projectId: string;
}) {
	const router = useRouter();
	const onDelete = async () => {
		const { error } = await clientRequest(
			`/api/v1/projects/${projectId}/third-party-tokens`,
			{ method: "DELETE", requestBody: { interfaceId } }
		);
		const errorPresent = error?.technicalError || error?.userError;
		if (errorPresent) {
			console.error(error);
			return;
		}
		router.refresh();
	};
	return (
		<Button
			onClick={onDelete}
			flavor={Flavors.primary}
			size={Sizes.sm}
			kind={Kinds.hollow}
			__cssFor={{ root: styles.overrides }}
		>
			Reset Authentication
		</Button>
	);
}
