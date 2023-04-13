import { Logo } from "@/components/Logo";
import styles from "./styles.module.css";

export function Footer() {
	return (
		<footer className={styles.footer}>
			<Logo />
			<p className={styles.footer__text}>
				Made with love for builders like you.
			</p>
			<p className={styles.footer__copy}>
				Carbonology Interactive LLC {new Date().getFullYear()} &copy;
			</p>
		</footer>
	);
}
