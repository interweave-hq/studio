import styles from "./home.module.css";

import { Header } from "@/components";
import { authenticate } from "@/lib/auth";

export default async function Home() {
	const { user } = await authenticate({ optional: true });
	return (
		<>
			<Header user={user} />
			<main className={styles["main-container"]}>
				<h1>Hello</h1>
				{user ? <p>{user.id}</p> : null}
				{user ? <p>{user.display_name}</p> : null}
			</main>
		</>
	);
}
