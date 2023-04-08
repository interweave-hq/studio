import LogIn from "./login";
import { Logo } from "@/components";
import styles from "./styles.module.css";

export default async function Login({
	searchParams,
}: {
	searchParams: Record<string, string>;
}) {
	return (
		<main className={styles.container}>
			<Logo __cssFor={{ root: styles.logo }} />
			<p className={styles.directions}>
				Sign in to continue to Interweave
			</p>
			<div className={styles["login-container"]}>
				<LogIn redirect={searchParams?.url} />
			</div>
		</main>
	);
}
