"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { clientRequest } from "@/lib/api/clientRequest";
import styles from "./styles.module.css";
import { PrivacyBadge } from "@/components/PrivacyBadge";
import { type Interfacer } from "@/interfaces/Interfacer";
import { type Project } from "@/interfaces/Project";

export default function ProjectLinks() {
    const pathname = usePathname();
    const nav = pathname ? pathname.substring(1).split("/") : [""];
    const [projectSlug, interfaceSlug] = nav;
    const [project, setProject] = useState<Project | null>(null);
    const [interfacer, setInterfacer] = useState<Interfacer | null>(null);

    useEffect(() => {
        if (projectSlug) {
            (async () => {
                const { data } = await clientRequest(`/api/v1/projects/${projectSlug}`);
                const { project: fetchedProject } = data;
                setProject(fetchedProject);
                setInterfacer(fetchedProject.interfaces.find((i: any) => i.slug === interfaceSlug));
            })();
        }
    }, [pathname, projectSlug]);

    if (!pathname) {
        return null;
    }

    let navLinks: { href: string; display: string }[] = [
        {
            href: pathname.substring(1).split("/")[0],
            display: pathname.substring(1).split("/")[0],
        },
    ];

    if (project) {
        navLinks = [{ href: project.slug, display: project.slug }];
    }

    if (interfacer) {
        navLinks.push({ href: pathname.toString(), display: interfacer.title });
    } else {
        navLinks.push({
            href: pathname.toString(),
            display: pathname.substring(1).split("/")[1],
        });
    }

    return (
        <div className={styles["header__crumbs"]}>
            {navLinks.map((n, i) => (
                <span key={n.href}>
                    <Link
                        href={n.href}
                        className={`${styles["crumbs__anchor"]} ${i === 1 && styles["crumbs__anchor--bold"]}`}
                    >
                        {n.display}
                    </Link>
                    {i < nav.length - 1 ? <span className={styles.crumbs__separator}>/</span> : null}
                </span>
            ))}
            {interfacer ? <PrivacyBadge privacy={interfacer.privacy} /> : null}
        </div>
    );
}
