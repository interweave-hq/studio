import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";
import { Logo } from "@/components";
import { UserAuth } from "@/interfaces";
import { getButtonStyle } from "../Button";
import { combineCss } from "@/lib/helpers";

export default function Header({ user }: { user?: UserAuth }) {
    return (
        <header className={styles.header}>
            <div className={styles.header__interior}>
                <Link href="/">
                    <Logo __cssFor={{ root: styles.header__logo }} />
                </Link>
                <ul className={styles.header__list}>
                    <li className={styles["header__list-item"]}>
                        <Link
                            className={styles.header__anchor}
                            href="https://docs.interwv.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Documentation
                        </Link>
                    </li>
                    <li className={styles["header__list-item"]}>
                        <Link
                            className={styles.header__anchor}
                            href="https://docs.interwv.com/pricing"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Pricing
                        </Link>
                    </li>
                    <li className={styles["header__list-item"]}>
                        <Link
                            className={combineCss([styles.header__button, getButtonStyle()])}
                            href="/dashboard"
                        >
                            {!user ? "Get Started" : "Dashboard"}
                        </Link>
                    </li>
                    {user?.picture ? (
                        <li className={styles["header__list-item"]}>
                            <Link
                                className={styles.header__anchor}
                                href="/profile"
                            >
                                <Image
                                    width={50}
                                    height={50}
                                    src={user?.picture}
                                    alt=""
                                    className={styles["header__profile-picture"]}
                                />
                            </Link>
                        </li>
                    ) : null}
                </ul>
            </div>
        </header>
    );
}
