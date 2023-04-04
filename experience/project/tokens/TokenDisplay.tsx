import "server-only";
import { serverRequest } from "@/lib/api/serverRequest";
import { TokenRowActions } from ".";
import styles from "./styles.module.css";

async function getTokens({ projectSlug }: { projectSlug: string }) {
	const { data, error } = await serverRequest(
		`/api/v1/projects/${projectSlug}/api-tokens`
	);
	return { data, error };
}

export async function TokenDisplay({ projectSlug }: { projectSlug: string }) {
	const { data: tokensData, error } = await getTokens({ projectSlug });
	if (error) {
		return <p>Error loading Tokens</p>;
	}
	const hasTokens = tokensData.length > 0;
	return (
		<div>
			{hasTokens ? (
				<div className={styles["token-display__table"]}>
					<div className={styles["token-display__row-header"]}>
						<p className={styles["token-display__entry"]}>
							Nickname
						</p>
						<p className={styles["token-display__entry"]}>
							Permission
						</p>
						<p className={styles["token-display__entry"]}>
							Created
						</p>
						<p className={styles["token-display__entry"]}>
							Expires
						</p>
						<p className={styles["token-display__entry"]}>
							Revoke?
						</p>
					</div>
					{tokensData.map((t: any) => (
						<div
							key={t.id}
							className={styles["token-display__row"]}
						>
							<p className={styles["token-display__entry"]}>
								{t.nickname}
							</p>
							<p className={styles["token-display__entry"]}>
								{t.permission}
							</p>
							<p className={styles["token-display__entry"]}>
								{new Date(t.created_at).toDateString()}
							</p>
							<p className={styles["token-display__entry"]}>
								{new Date(t.expiration).toDateString()}
							</p>
							<TokenRowActions tokenId={t.id} projectId={t.project_id} />
						</div>
					))}
				</div>
			) : (
				<p className={styles["token-display__no-tokens"]}>
					No API tokens yet.
				</p>
			)}
		</div>
	);
}
