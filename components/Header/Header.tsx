import Link from "next/link";
import styles from "./header.module.css";
import { Logo } from "@/components";

export default function Header() {
	return (
		<header className={styles.header}>
			<div className={styles.header__interior}>
				<Logo />
				<ul className={styles.header__list}>
					<li className={styles["header__list-item"]}>
						<Link className={styles.header__anchor} href="/">
							Screens
						</Link>
					</li>
					<li className={styles["header__list-item"]}>
						<Link className={styles.header__anchor} href="/">
							Projects
						</Link>
					</li>
				</ul>
			</div>
		</header>
	);
}
