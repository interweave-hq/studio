import { redirect } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { mixpanelServer } from "@/lib/analytics";

export const metadata = getMetadata({ title: "Join The Discord" });

export default async function Chat() {
    mixpanelServer.track("page_viewed", { page: "/chat" });
    redirect("https://discord.gg/ypfzHSJ9jU");
}
