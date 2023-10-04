import { OnboardRequestDetailsPage } from "@/experience/home/OnboardRequestDetailsPage";

import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata({ title: "Create Project" });

type SearchParams = Record<string, string>;

export default async function OnboardRequestPage({ searchParams }: { searchParams: SearchParams }) {
    // @ts-expect-error server component
    return <OnboardRequestDetailsPage url={searchParams["url"] || ""} />;
}
