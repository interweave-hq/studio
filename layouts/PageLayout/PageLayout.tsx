import { type ReactNode } from "react";
import styles from "./styles.module.css";

export const PageLayout = ({ children }: { children: ReactNode }) => {
    return <div className={styles.container}>{children}</div>;
};
