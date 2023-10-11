import { HomePage } from "@/experience/home";

import { getMetadata } from "@/lib/metadata";
import { DEFAULT_META_DESCRIPTION_SHORT } from "@/lib/constants";
import { mixpanelServer } from "@/lib/analytics/mixpanelServer";

export const metadata = getMetadata({ fullTitle: `Interweave | ${DEFAULT_META_DESCRIPTION_SHORT}` });

export default async function Home() {
    mixpanelServer.track("page_viewed", { page: `/` });

    // @ts-expect-error server component
    return <HomePage />;
}
