import { redirect } from "next/navigation";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata({ title: "Join The Discord" });

export default async function Chat() {
    redirect("https://discord.gg/ypfzHSJ9jU");
}
