import { useMemo, useId } from "react";

import { Modal, type ModalProps } from "../Modal";
import { Button, type ButtonProps } from "@/components/Button";
import styles from "./styles.module.css";
import { shapeCss } from "@/lib/helpers";
import { LoadingDots } from "../LoadingDots";
import { Error, type ErrorProps } from "../Error";

const Overrides = {
    root: "root",
    title: "title",
    body: "body",
    ctaContainer: "ctaContainer",
    ctaContainerRight: "ctaContainerRight",
    ctaContainerLeft: "ctaContainerLeft",
    contextLink: "contextLink",
    mainContent: "mainContent",
} as const;

type OverridesKeys = keyof typeof Overrides;

type InfoModalOverrides<T> = {
    [K in OverridesKeys]?: T;
};

export interface InfoModalProps {
    body?: string;
    children?: React.ReactNode;
    cancelCtaProps?: Partial<ButtonProps>;
    confirmCtaProps?: Partial<ButtonProps>;
    contextLink?: string;
    isLoading?: boolean;
    errorProps?: ErrorProps;
    modalProps: Omit<ModalProps, "children">;
    title?: string;
    __renderTop?: (props: InfoModalProps) => React.ReactNode;
    __renderBottom?: (props: InfoModalProps) => React.ReactNode;
    __cssFor?: InfoModalOverrides<string>;
}

export function InfoModal(props: InfoModalProps) {
    const { modalProps, ...rest } = props;
    const titleId = useId();
    const bodyId = useId();
    const { body, cancelCtaProps, children, confirmCtaProps, contextLink, errorProps, isLoading, title, __renderTop, __renderBottom, __cssFor } = rest;
    const {
        root: rootStyles,
        title: titleStyles,
        body: bodyStyles,
        ctaContainer: ctaContainerStyles,
        ctaContainerLeft: ctaContainerLeftStyles,
        ctaContainerRight: ctaContainerRightStyles,
        contextLink: contextLinkStyles,
        mainContent: mainContentStyles,
    } = useMemo(() => {
        return shapeCss<OverridesKeys, InfoModalOverrides<string>>(Overrides, styles, __cssFor);
    }, [__cssFor]);
    return (
        <Modal
            {...modalProps}
            ariaProps={{
                "aria-labelledby": titleId || undefined,
                "aria-describedby": bodyId || undefined,
            }}
        >
            <div className={rootStyles}>
                <div className={mainContentStyles}>
                    {title ? (
                        <h2
                            className={titleStyles}
                            id={titleId}
                        >
                            {title}
                        </h2>
                    ) : null}
                    {body ? (
                        <p
                            className={bodyStyles}
                            id={bodyId}
                        >
                            {body}
                        </p>
                    ) : null}
                    {children}
                    {errorProps ? <Error {...errorProps} /> : null}
                </div>
                {__renderBottom ? (
                    __renderBottom(props)
                ) : confirmCtaProps || cancelCtaProps ? (
                    <div className={ctaContainerStyles}>
                        {contextLink ? (
                            <div className={ctaContainerLeftStyles}>
                                <a
                                    className={contextLinkStyles}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={contextLink}
                                >
                                    More Information
                                </a>
                            </div>
                        ) : (
                            <span></span>
                        )}
                        <div className={ctaContainerRightStyles}>
                            {isLoading ? <LoadingDots __cssFor={{ root: styles.loading }} /> : null}
                            {cancelCtaProps ? (
                                <Button
                                    onClick={() => modalProps.setClosed?.()}
                                    {...cancelCtaProps}
                                >
                                    {cancelCtaProps?.children}
                                </Button>
                            ) : null}
                            {confirmCtaProps ? <Button {...confirmCtaProps}>{confirmCtaProps?.children}</Button> : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </Modal>
    );
}
