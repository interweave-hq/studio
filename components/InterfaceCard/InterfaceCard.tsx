"use client";

import Link from "next/link";
import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";
import { timeAgo } from "@/lib/dates/timeAgo";
import { PrivacyBadge, type PrivacyValue, type PrivacyBadgeOverrides } from "../PrivacyBadge";
import { useMemo } from "react";

const Overrides = {
    root: "root",
    description: "description",
    hash: "hash",
    lastBuild: "lastBuild",
    title: "title",
} as const;

type OverridesKeys = keyof typeof Overrides;

type ExternalInterfaceCardOverrides<T> = {
    PrivacyBadge?: PrivacyBadgeOverrides<T>;
};

type InternalInterfaceCardOverrides<T> = {
    [k in OverridesKeys]?: T;
};

export type InterfaceCardOverrides<T> = ExternalInterfaceCardOverrides<T> & InternalInterfaceCardOverrides<T>;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    description?: string;
    hash?: string;
    lastBuild?: string;
    emailDomain?: string;
    privacy?: PrivacyValue;
    title?: string;
    titleParts?: {
        one: string;
        two: string;
    };
    relativePathLink?: string;
    __cssFor?: InterfaceCardOverrides<string>;
}

export const InterfaceCard = ({ description, hash, lastBuild, privacy, relativePathLink, title, titleParts, __cssFor }: Props) => {
    const {
        root: rootStyles,
        title: titleStyles,
        hash: hashStyles,
        lastBuild: lastBuildStyles,
        description: descriptionStyles,
        PrivacyBadge: privacyBadgeStyles,
    } = useMemo(() => {
        return shapeCss<OverridesKeys, InterfaceCardOverrides<string>>(Overrides, styles, __cssFor);
    }, [__cssFor]);
    const buildTime = timeAgo(new Date(lastBuild!));

    return (
        <div className={rootStyles}>
            {titleParts ? (
                <h2 className={titleStyles}>
                    <span className={styles["title__part-one"]}>{titleParts.one}</span>
                    <span className={styles.title__slash}>/</span>
                    <span className={styles["title__part-two"]}>{titleParts.two}</span>
                </h2>
            ) : (
                <h3 className={titleStyles}>{title}</h3>
            )}
            {description ? <p className={descriptionStyles}>{description}</p> : null}
            <div className={styles["bottom-container"]}>
                {privacy ? (
                    <PrivacyBadge
                        privacy={privacy}
                        __cssFor={__cssFor?.PrivacyBadge}
                    />
                ) : null}
                <div className={styles["bottom-right-container"]}>
                    {/* {hash ? <p className={hashStyles}>#{hash}</p> : null}
                    {lastBuild ? <p className={lastBuildStyles}>{buildTime}</p> : null} */}
                    {relativePathLink ? (
                        <Link
                            href={relativePathLink}
                            className={styles.link}
                        >
                            Use Interface
                            <svg
                                aria-hidden="true"
                                fill="none"
                                stroke="currentColor"
                                className={styles["arrow-icon"]}
                                strokeWidth={1.5}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </Link>
                    ) : null}
                </div>
            </div>
        </div>
    );
};
