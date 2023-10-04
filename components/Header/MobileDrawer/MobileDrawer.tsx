"use client";

import { type ReactNode } from "react";
import { Drawer } from "vaul";

import styles from "./styles.module.css";

export function MobileDrawer({ children }: { children: ReactNode }) {
    return (
        <Drawer.Root shouldScaleBackground>
            <Drawer.Trigger asChild>
                <button aria-label="Open mobile menu">
                    <svg
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.icon}
                    >
                        <path
                            d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className={styles.overlay} />
                <Drawer.Content className={styles.content}>
                    <span
                        className={styles.thumb}
                        aria-hidden="true"
                    ></span>
                    <Drawer.Title asChild>Mobile Navigation Menu</Drawer.Title>
                    <div className={styles["inner-content"]}>{children}</div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
