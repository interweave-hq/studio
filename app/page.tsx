import Link from "next/link";

import { Header, Footer, Input } from "@/components";
import { Button } from "@/components/Button";
import { getMetadata } from "@/lib/metadata";

import styles from "./home.module.css";

export const metadata = getMetadata({ title: "Home" });

export default async function Home() {
    return (
        <>
            <Header />
            <main>
                <section className={`${styles.main} ${styles.section}`}>
                    <h1 className={styles.main__title}>Generate user-interfaces for your API</h1>
                    <p className={styles.main__subtitle}>Live in seconds, functional immediately, and keeps your team moving fast.</p>
                    <Input
                        label="Enter API URL"
                        domProps={{ defaultValue: "https://google.com/api/" }}
                        __cssFor={{
                            root: styles["main__input-container"],
                            input: styles.main__input,
                        }}
                    />
                    <div className={styles.main__actions}>
                        <Button __cssFor={{ root: styles["main__gen-button"] }}>Generate!</Button>
                        <Button
                            kind="hollow"
                            __cssFor={{ root: styles["main__opts-button"] }}
                        >
                            More Options
                        </Button>
                    </div>
                </section>
                <section className={`${styles.step} ${styles.section}`}>
                    <h2 className={styles.step__title}>1. Define Configuration</h2>
                    <p className={styles.step__body}>Describe your configuration in JSON with help from our TypeScript interfaces.</p>
                    <pre className={styles.step__code}>
                        <div className={styles.main__actions}>
                            <Button __cssFor={{ root: styles["main__gen-button"] }}>Generate!</Button>
                            <Button kind="hollow">More Options</Button>
                        </div>
                    </pre>
                </section>
                <section className={`${styles.step} ${styles.section}`}>
                    <h2 className={styles.step__title}>2. Send To Interweave</h2>
                    <p className={styles.step__body}>Describe your configuration in JSON with help from our TypeScript interfaces.</p>
                    <pre className={styles.step__code}>
                        <div className={styles.main__actions}>
                            <Button __cssFor={{ root: styles["main__gen-button"] }}>Generate!</Button>
                            <Button kind="hollow">More Options</Button>
                        </div>
                    </pre>
                </section>
                <section className={`${styles.step} ${styles.section}`}>
                    <h2 className={styles.step__title}>3. Run In Browser</h2>
                    <p className={styles.step__body}>Describe your configuration in JSON with help from our TypeScript interfaces.</p>
                    <pre className={styles.step__code}>
                        <div className={styles.main__actions}>
                            <Button __cssFor={{ root: styles["main__gen-button"] }}>Generate!</Button>
                            <Button kind="hollow">More Options</Button>
                        </div>
                    </pre>
                </section>
            </main>
            <Footer />
        </>
    );
}
