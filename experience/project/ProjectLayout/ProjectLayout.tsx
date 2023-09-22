import { type ReactNode } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { APP_URL } from "@/lib/constants";
import { PROJECT_TABS } from "../constants";
import { type PublicUser } from "@/interfaces";
import Image from "next/image";

type Props = {
    projectSlug: string;
    activeTab: string;
    projectName: string;
    projectId: string;
    children: ReactNode;
    isOwner: boolean;
    creator: PublicUser;
};

export function ProjectLayout(props: Props) {
    const { projectId, projectName, projectSlug, activeTab, children, isOwner, creator } = props;
    return (
        <>
            <main className={styles.container}>
                <div className={styles.section}>
                    <h2 className={styles.section__header}>{projectName}</h2>
                    <p className={styles.pid}>ID: {projectId}</p>
                    <span className={styles.creator}>
                        <p className={styles.creator__name}>Created by {creator?.display_name}</p>
                        {creator?.picture ? (
                            <Image
                                src={creator?.picture}
                                width={20}
                                height={20}
                                alt=""
                                className={styles.creator__pic}
                            />
                        ) : null}
                    </span>
                    <nav className={styles.nav}>
                        <ul className="flex">
                            <li className={`${styles.tab} ${activeTab === PROJECT_TABS.interfaces.slug ? styles["tab--active"] : null}`}>
                                <Link href={`${APP_URL}/${projectSlug}?tab=${PROJECT_TABS.interfaces.slug}`}>{PROJECT_TABS.interfaces.display}</Link>
                            </li>
                            {isOwner ? (
                                <li className={`${styles.tab} ${activeTab === PROJECT_TABS.tokens.slug ? styles["tab--active"] : null}`}>
                                    <Link href={`${APP_URL}/${projectSlug}?tab=${PROJECT_TABS.tokens.slug}`}>{PROJECT_TABS.tokens.display}</Link>
                                </li>
                            ) : null}
                        </ul>
                    </nav>
                </div>
                {children}
            </main>
        </>
    );
}
