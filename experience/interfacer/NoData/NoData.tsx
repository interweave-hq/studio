import styles from "./styles.module.css";

export function NoData({ uri }: { uri: string }) {
    return <p className={styles.root}>No data returned from request to {uri}</p>;
}
