export const APP_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://interwv.com";

export const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://api.interwv.com";

export const DEFAULT_META_DESCRIPTION = "User‑interfaces for your API. Live in seconds, functional immediately, and keeps your team moving fast.";
export const DEFAULT_META_DESCRIPTION_SHORT = "User‑interfaces for your API.";
export const DEFAULT_META_TITLE = "Interweave";
export const DEFAULT_META_IMAGE_PATH = "/interweave-meta.jpg";
export const DEFAULT_META_IMAGE_URL = `${APP_URL}${DEFAULT_META_IMAGE_PATH}`;

export const GET_META_TITLE = (pageTitle: string) => `${pageTitle} | ${DEFAULT_META_TITLE}`;
export const GET_META_DESCRIPTION = ({ projectTitle, interfaceTitle }: { projectTitle: string; interfaceTitle: string }) => {
    return `The ${interfaceTitle} interface for the ${projectTitle} database. Read, create, update, or delete ${interfaceTitle} data.`;
};
