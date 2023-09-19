import Image from "next/image";
import Link from "next/link";
import { LogoIcon } from "@/components";
import { UserAuth } from "@/interfaces";
import ProjectLinks from "./ProjectLinks";
import styles from "./styles.module.css";

export default function InnerProjectHeader({ user }: { user?: UserAuth }) {
    return (
        <header className={styles.header}>
            <div className={styles.header__interior}>
                <div className={styles.header__left}>
                    <Link href="/">
                        <LogoIcon __cssFor={{ root: styles.header__logo }} />
                    </Link>
                    <ProjectLinks />
                </div>
                <ul className={styles.header__list}>
                    {/* <li className={styles["header__list-item"]}>
						<Link className={styles.header__anchor} href="/">
							Screens
						</Link>
					</li>
					<li className={styles["header__list-item"]}>
						<Link className={styles.header__anchor} href="/">
							Projects
						</Link>
					</li> */}
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
                    {!user ? (
                        <li className={styles["header__list-item"]}>
                            <Link
                                className={styles.header__anchor}
                                href="/login"
                            >
                                Sign In
                            </Link>
                        </li>
                    ) : null}
                </ul>
            </div>
        </header>
    );
}
