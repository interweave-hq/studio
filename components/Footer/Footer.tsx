import { Logo } from "@/components/Logo";
import styles from "./styles.module.css";

export function Footer() {
	return (
		<footer className={styles.footer}>
			<Logo />
			<p className={styles.footer__copy}>
				Carbonology Interactive LLC {new Date().getFullYear()} &copy;
			</p>
			<div className={styles.footer__links}>
				<a
					href="https://docs.interwv.com"
					target="_blank"
					rel="noopener noreferrer"
					className={styles.footer__link}
				>
					Docs
				</a>
				<a
					href="https://docs.interwv.com/pricing"
					target="_blank"
					rel="noopener noreferrer"
					className={styles.footer__link}
				>
					Pricing
				</a>
				<a
					href="https://docs.interwv.com/terms"
					target="_blank"
					rel="noopener noreferrer"
					className={styles.footer__link}
				>
					Terms of Service
				</a>
				<a
					href="https://docs.interwv.com/privacy"
					target="_blank"
					rel="noopener noreferrer"
					className={styles.footer__link}
				>
					Privacy Policy
				</a>
			</div>
		</footer>
	);
}
