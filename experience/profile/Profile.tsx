import Image from "next/image";
import { serverRequest } from "@/lib/api/serverRequest";
import { LogOutButton } from "./LogOutButton";
import { Table } from "@/components";
import styles from "./styles.module.css";
import { getButtonStyle } from "@/components/Button";

export async function Profile() {
    const { data: user } = await getProfile();
    const { data } = await getReceipts();
    const entries = data.bucket?.store?.entries || [];
    return (
        <main className={styles.wrapper}>
            <section className={styles.section}>
                <h1 className={styles.section__title}>Account</h1>
                <p className={styles.section__text}>{user.display_name}</p>
                <p className={styles.section__text}>{user.email}</p>
                {user?.picture ? (
                    <Image
                        src={user.picture}
                        alt="profile picture"
                        height={50}
                        width={50}
                        className={styles.profile__picture}
                    />
                ) : null}
            </section>
            <section className={styles.section}>
                <h2 className={styles.section__title}>Usage</h2>
                <p className={styles.section__text}>
                    This billing cycle, you&apos;re responsible for{" "}
                    <strong>{new Intl.NumberFormat().format(user.billing_cycle_owned_requests)} requests</strong>.
                </p>
                <p className={styles.section__text}>We&apos;ll send an invoice at the first of every month.</p>
                <a
                    className={getButtonStyle()}
                    href="https://docs.interwv.com/pricing"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    View Pricing Details
                </a>
            </section>
            <section className={styles.section}>
                <h2 className={styles.section__title}>Request history</h2>
                <Table
                    columns={[
                        { header: "Time", accessorKey: "time", id: "time" },
                        {
                            header: "Requested by",
                            accessorKey: "user_email",
                            id: "user",
                        },
                        {
                            header: "Request Status",
                            accessorKey: "status",
                            id: "status",
                        },
                        {
                            header: "Source",
                            accessorKey: "source",
                            id: "source",
                        },
                        {
                            header: "Endpoint",
                            accessorKey: "endpoint",
                            id: "endpoint",
                        },
                    ]}
                    supplementalInfo={[`Showing ${entries.length} of ${user.total_owned_requests} records`]}
                    data={entries}
                />
                <a
                    className={`${getButtonStyle()} ${styles["billing__details-button"]}`}
                    href="https://docs.interwv.com/specification/billing-strategy"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    Read About How Billing Works
                </a>
                <p className={styles.section__text}>
                    If an interface in one of your projects has the <code>InterfaceOwner</code> billing strategy enabled, you may see requests from other users
                    here.
                </p>
            </section>
            <section className={styles.section}>
                <h2 className={styles.section__title}>Log Out</h2>
                <LogOutButton />
            </section>
        </main>
    );
}

async function getReceipts() {
    return await serverRequest(`/api/v1/user/requests`);
}
async function getProfile() {
    return await serverRequest(`/api/v1/user/profile`);
}
