"use client";

import styles from "./styles.module.css";

import { LoadingDots } from "@/components";
import { useState } from "react";

export function RequestConfiguration({ url }: { url: string }) {
    const [isInitialRequestLoading, setIsInitialRequestLoading] = useState(true);
    return (
        <>
            {isInitialRequestLoading ? (
                <div className={styles.initial}>
                    <p className={styles.initial__title}>Fetching Data</p>
                    <p>{url}</p>
                    <LoadingDots __cssFor={{ root: styles.initial__loading }} />
                    <section>
                        <p>If good</p>
                        <code>show response here</code>
                        <input placeholder="what is your data path?" />
                    </section>
                    <section>
                        <p>If wrong</p>
                        <p>This demo doesn&apos;t support API keys yet. Interfaces support secure API key storage. No sensitive information here!</p>
                        <div>
                            <input placeholder="what are your headers" />
                            <input placeholder="what is the http method" />
                        </div>
                    </section>
                </div>
            ) : null}
        </>
    );
}
