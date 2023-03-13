import styles from "./overview.module.css";
import { combineCss } from "@/lib/helpers";

export default function Overview({
	title,
	projectId,
	interfaceId,
}: {
	title: string;
	projectId: string;
	interfaceId: string;
}) {
	return (
		<div className={styles.overview}>
			<div className={styles.overview__interior}>
				<h1 className={styles.overview__title}>{title}</h1>
				<div className={styles.overview__ids}>
					<p className={styles.overview__id}>pID: {projectId}</p>
					<span className={styles.overview__id}>/</span>
					<p className={styles.overview__id}>iID: {interfaceId}</p>
				</div>
			</div>
		</div>
	);
}
