import { PrivacyBadge, type PrivacyValue } from "@/components/PrivacyBadge";
import styles from "./overview.module.css";

export default function Overview({
	title,
	description,
	interfaceId,
	hash,
	buildTime,
	privacy,
}: {
	title: string;
	description?: string;
	interfaceId: string;
	hash: string;
	buildTime: Date;
	privacy: PrivacyValue;
}) {
	const time = new Date(buildTime);
	return (
		<div className={styles.overview}>
			<div className={styles.overview__interior}>
				<h1 className={styles.overview__title}>{title}</h1>
				<div className={styles["overview__badge-desc-container"]}>
					<PrivacyBadge
						privacy={privacy}
						__cssFor={{
							Badge: { root: styles["overview__privacy-badge"] },
						}}
					/>
					<p className={styles.overview__description}>
						{description}
					</p>
				</div>
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
