import styles from "./styles.module.css";

export function LoadingDots() {
	return (
		<svg viewBox="0 0 100 100" className={styles.root}>
			<circle cx="25" cy="50" r="10" fill="#777">
				<animate
					attributeName="opacity"
					dur="1s"
					begin="0s"
					repeatCount="indefinite"
					values="1;0"
				></animate>
			</circle>
			<circle cx="50" cy="50" r="10" fill="#777">
				<animate
					attributeName="opacity"
					dur="1s"
					begin="0.33s"
					repeatCount="indefinite"
					values="1;0"
				></animate>
			</circle>
			<circle cx="75" cy="50" r="10" fill="#777">
				<animate
					attributeName="opacity"
					dur="1s"
					begin="0.66s"
					repeatCount="indefinite"
					values="1;0"
				></animate>
			</circle>
		</svg>
	);
}
