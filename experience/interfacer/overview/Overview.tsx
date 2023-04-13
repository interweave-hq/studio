import styles from "./overview.module.css";

export default function Overview({
	title,
	description,
	interfaceId,
	hash,
	buildTime,
}: {
	title: string;
	description?: string;
	interfaceId: string;
	hash: string;
	buildTime: Date;
}) {
	const time = new Date(buildTime);
	return (
		<div className={styles.overview}>
			<div className={styles.overview__interior}>
				<h1 className={styles.overview__title}>{title}</h1>
				<p className={styles.overview__description}>{description}</p>
				<div className={styles.overview__ids}>
					<p className={styles.overview__id}>ID: {interfaceId}</p>
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
