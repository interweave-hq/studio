import type { Metadata } from "next";

import { APP_URL, DEFAULT_META_DESCRIPTION, DEFAULT_META_IMAGE_PATH, DEFAULT_META_TITLE, GET_META_TITLE } from "../constants";

export const getMetadata = ({
    title,
    description,
    image,
    shouldIndex = true,
    fullTitle,
}: {
    title?: string;
    description?: string;
    image?: string;
    shouldIndex?: boolean;
    fullTitle?: string;
}): Metadata => {
    const renderedTitle = fullTitle ? fullTitle : title ? GET_META_TITLE(title) : DEFAULT_META_TITLE;
    const renderedImage = image || DEFAULT_META_IMAGE_PATH;
    return {
        applicationName: "Interweave",
        generator: "Next.js",
        authors: [{ name: "Carbonology Interactive LLC", url: "https://carbonology.in" }],
        colorScheme: "light",
        creator: "Carbonology Interactive LLC",
        publisher: "Carbonology Interactive LLC",
        metadataBase: new URL(APP_URL),
        alternates: {
            canonical: "/",
        },
        title: renderedTitle,
        description: description || DEFAULT_META_DESCRIPTION,
        keywords: "interweave,api,interface,generate",
        viewport: "width=device-width, initial-scale=1",
        twitter: {
            card: "summary_large_image",
            site: APP_URL,
            images: renderedImage,
            title: renderedTitle,
        },
        openGraph: {
            title: renderedTitle,
            description: description || DEFAULT_META_DESCRIPTION,
            images: renderedImage,
            url: APP_URL,
        },
        robots: {
            index: shouldIndex,
            follow: true,
            nocache: true,
            googleBot: {
                index: shouldIndex,
                follow: true,
                noimageindex: false,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
};
