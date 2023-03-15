import styles from "./overview.module.css";

export default function Overview({
	title,
	projectId,
	interfaceId,
	hash,
	buildTime,
}: {
	title: string;
	projectId: string;
	interfaceId: string;
	hash: string;
	buildTime: Date;
}) {
	const time = new Date(buildTime);
	return (
		<div className={styles.overview}>
			<div className={styles.overview__interior}>
				<h1 className={styles.overview__title}>{title}</h1>
				<div className={styles.overview__ids}>
					<p className={styles.overview__id}>pID: {projectId}</p>
					<span className={styles.overview__id}>/</span>
					<p className={styles.overview__id}>iID: {interfaceId}</p>
					<span className={styles.overview__id}>/</span>
					<p className={styles.overview__id}>#{hash}</p>
					<span className={styles.overview__id}>/</span>
					<p className={styles.overview__id}>
						Last build: {time.toDateString()}{" "}
						{time.toLocaleTimeString()}
					</p>
				</div>
			</div>
		</div>
	);
}
