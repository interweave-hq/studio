import { Header, Footer } from "@/components";
import { PageLayout } from "@/layouts/PageLayout";
import { RequestConfiguration } from "./RequestConfiguration";

import { redirect } from "next/navigation";

export async function OnboardRequestDetailsPage({ url }: { url?: string }) {
    // Make request looking for data
    // If not successful, ask for more details (http method, headers, etc) can show more options like OpenAPI etc
    // If successful, ask for data path

    if (!url) {
        redirect("/");
    }
    return (
        <>
            <Header />
            <PageLayout>
                <RequestConfiguration url={url} />
            </PageLayout>
            <Footer />
        </>
    );
}
