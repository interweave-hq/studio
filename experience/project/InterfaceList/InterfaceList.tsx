import Link from "next/link";

import { timeAgo } from "@/lib/dates/timeAgo";
import { Interfacer } from "@/interfaces";
import { PrivacyBadge } from "@/components/PrivacyBadge";

import styles from "./styles.module.css";

type GetUrl = (i: Interfacer) => string;

function InterfaceListItem({
	interfacer,
	getUrl,
}: {
	interfacer: Interfacer;
	getUrl: GetUrl;
}) {
	return (
		<li className={styles.item}>
			<Link href={getUrl(interfacer)}>
				<div className={styles.item__top}>
					<h2 className={styles.item__title}>{interfacer.title}</h2>
					<PrivacyBadge privacy={interfacer.privacy} />
				</div>
				<div className={styles.item__bottom}>
					<p className={styles.item__description}>
						{interfacer?.description}
					</p>
					<p className={styles["item__last-updated"]}>
						Last updated {timeAgo(interfacer.build_time)}
					</p>
				</div>
			</Link>
		</li>
	);
}

export function InterfaceList({
	interfaces,
	getUrl,
}: {
	interfaces: Interfacer[];
	getUrl: GetUrl;
}) {
	return (
		<ul>
			{interfaces.map((i) => (
				<InterfaceListItem key={i.id} interfacer={i} getUrl={getUrl} />
			))}
		</ul>
	);
}
