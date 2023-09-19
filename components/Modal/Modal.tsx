"use client";

import { useMemo, useState } from "react";
import { shapeCss, combineCss } from "@/lib/helpers";

import { ButtonOverrides } from "../Button";
import { XMarkSVG } from "../Icons";

import styles from "./styles.module.css";

const Overrides = {
    root: "root",
    dialog: "dialog",
    closeButton: "closeButton",
    closeButtonContainer: "closeButtonContainer",
} as const;

type OverridesKeys = keyof typeof Overrides;

type InternalModalOverrides<T> = {
    [K in OverridesKeys]?: T;
};

type ExternalModalOverrides<T> = {
    CloseButton?: ButtonOverrides<T>;
};

export type ModalOverrides<T> = InternalModalOverrides<T> & ExternalModalOverrides<T>;

export interface ModalProps {
    ariaProps?: React.AriaAttributes;
    children: React.ReactNode;
    isDismissible?: boolean;
    isOpen?: boolean;
    setClosed?: () => void;
    __cssFor?: ModalOverrides<string>;
}

export function Modal({ ariaProps, isDismissible = true, children, isOpen = false, setClosed, __cssFor }: ModalProps) {
    const [currentlyOpen, setCurrentlyOpen] = useState(isOpen);
    const [playingClosingAnimation, setPlayingClosingAnimation] = useState(false);
    // Only find the HTML element reference once, not every render
    const htmlEl = useMemo(() => {
        if (typeof document === "undefined") return undefined;
        return document.getElementsByTagName("html")[0];
    }, []);
    const {
        root: rootStyles,
        dialog: dialogStyles,
        closeButton: closeButtonStyles,
        closeButtonContainer: closeButtonContainerStyles,
    } = useMemo(() => {
        return shapeCss<OverridesKeys, ModalOverrides<string>>(Overrides, styles, __cssFor);
    }, [__cssFor]);

    const handleModalClose = () => {
        // Play closing animation
        setPlayingClosingAnimation(true);
        // Handle internal state after animation finishes
        setTimeout(() => {
            setPlayingClosingAnimation(false);
            setCurrentlyOpen(false);
            // Handle consumer state as the last thing
            // This will unmount this component
            if (setClosed) {
                setClosed();
            }
            // Re-enable scroll
            if (htmlEl) {
                htmlEl.style.overflow = "auto";
            }
        }, 400);
    };

    const onClose = () => {
        handleModalClose();
    };

    // Handle external control of closing it
    if (isOpen === false && currentlyOpen && !playingClosingAnimation) {
        handleModalClose();
    }

    // Handle external control of opening it
    if (isOpen == true && !currentlyOpen && !playingClosingAnimation) {
        setCurrentlyOpen(true);
    }

    const stylesOverlay = playingClosingAnimation ? combineCss([styles.overlay, styles["overlay--closing"]]) : styles.overlay;
    const stylesRoot = playingClosingAnimation ? combineCss([rootStyles, styles["dialog--closing"]]) : rootStyles;

    if (!currentlyOpen) return null;
    if (currentlyOpen && !playingClosingAnimation && htmlEl) {
        // Disable scroll when open
        htmlEl.style.overflow = "hidden";
    }
    return (
        <div>
            <div className={stylesOverlay}></div>
            <div className={stylesRoot}>
                <div
                    className={dialogStyles}
                    role="dialog"
                    {...ariaProps}
                >
                    {isDismissible ? (
                        <div className={closeButtonContainerStyles}>
                            <button
                                onClick={() => onClose()}
                                className={closeButtonStyles}
                            >
                                <XMarkSVG />
                            </button>
                        </div>
                    ) : null}
                    {children}
                </div>
            </div>
            {isDismissible ? (
                <div
                    className={styles["dialog__overlay-click-target"]}
                    onClick={handleModalClose}
                ></div>
            ) : null}
        </div>
    );
}
