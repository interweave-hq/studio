import Link from "next/link";

import styles from "./styles.module.css";

import { Interfacer } from "@/interfaces";
import { InterfaceCard } from "@/components";

type GetUrl = (i: Interfacer) => string;

export function InterfaceList({ interfaces, getUrl }: { interfaces: Interfacer[]; getUrl: GetUrl }) {
    return (
        <ul className={styles.container}>
            {interfaces.map(i => (
                <div key={i.id}>
                    <li>
                        <Link href={getUrl(i)}>
                            <InterfaceCard
                                title={i.title}
                                description={i.description}
                                lastBuild={i.build_time}
                                privacy={i.privacy}
                            />
                        </Link>
                    </li>
                </div>
            ))}
        </ul>
    );
}
