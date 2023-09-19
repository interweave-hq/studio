import styles from "./styles.module.css";
import { Logo } from "@/components";
import { getButtonStyle } from "@/components/Button";
import Link from "next/link";
import { combineCss } from "@/lib/helpers";

const CreateAccountButton = ({ url }: { url: string }) => (
    <Link
        href={`/login?url=${url}`}
        className={combineCss([getButtonStyle(), styles["create-account__button"]])}
    >
        Create an account for access
    </Link>
);

export const CreateAccount = ({ projectTitle, url }: { projectTitle: string; url: string }) => {
    return (
        <div className="create-account">
            <Logo __cssFor={{ root: styles["create-account__logo"] }} />
            <h2 className={styles["create-account__title"]}>
                Unlock the Power of{" "}
                <strong>
                    <u>{projectTitle}</u> APIs
                </strong>
            </h2>
            {/* <EncryptPicto /> */}
            <div className={styles["create-account__content"]}>
                <p className={styles["create-account__copy"]}>
                    Create a <strong>FREE</strong> account before you can view and interact with the {projectTitle} data.
                </p>
                <CreateAccountButton url={url} />
                <p className={styles["create-account__subtitle"]}>Avg. time to complete: 14 seconds</p>
                <ul className={styles["create-account__list"]}>
                    <p className={styles["create-account__list-heading"]}>
                        Create a <strong>free</strong> account to access:
                    </p>
                    <li className={styles["create-account__list-item"]}>✅ Retrieve real-time data</li>
                    <li className={styles["create-account__list-item"]}>✅ Create new entries in the {projectTitle} database</li>
                    <li className={styles["create-account__list-item"]}>✅ Update or delete entries in the {projectTitle} database</li>
                    <li className={styles["create-account__list-item"]}>✅ Interact with thousands of other APIs</li>
                </ul>
                <CreateAccountButton url={url} />
                <Link
                    href="/login"
                    className={styles["create-account__button--secondary"]}
                >
                    or log in
                </Link>
            </div>
        </div>
    );
};
