import type { Metadata } from "next";

export const METADATA_DEFAULTS = {
    title: "Home",
    description:
        "Accelerate your team with generated user-interfaces synced to your API data. Built-in support for authentication, permissions, validation, and more. Start for free!",
    keywords: "interweave,api,interface,generate",
    viewport: "width=device-width, initial-scale=1",
    url: "https://interwv.com",
} as const;

export const getMetadata = ({ title, description }: { title: string; description?: string }): Metadata => {
    const renderedTitle = `${title || METADATA_DEFAULTS.title} | Interweave`;
    return {
        title: renderedTitle,
        description: description || METADATA_DEFAULTS.description,
        keywords: METADATA_DEFAULTS.keywords,
        viewport: METADATA_DEFAULTS.viewport,
        twitter: {
            card: "summary_large_image",
            site: METADATA_DEFAULTS.url,
            images: [],
            title: renderedTitle,
        },
        openGraph: {
            title: renderedTitle,
            description: description || METADATA_DEFAULTS.description,
            images: [],
            url: METADATA_DEFAULTS.url,
        },
    };
};
