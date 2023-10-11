import LogIn from "./login";
import { Logo } from "@/components";
import styles from "./styles.module.css";
import { getMetadata } from "@/lib/metadata";
import { mixpanelServer } from "@/lib/analytics";

export const metadata = getMetadata({ title: "Log In" });

export default async function Login({ searchParams }: { searchParams: Record<string, string> }) {
    mixpanelServer.track("page_viewed", { page: "/login" });
    return (
        <main className={styles.container}>
            <Logo __cssFor={{ root: styles.logo }} />
            <p className={styles.directions}>Sign in to continue to Interweave</p>
            <div className={styles["login-container"]}>
                <LogIn redirect={searchParams?.url} />
            </div>
        </main>
    );
}
