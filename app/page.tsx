import { HomePage } from "@/experience/home";

import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata({ title: "Home" });

export default async function Home() {
    // @ts-expect-error server component
    return <HomePage />;
}
