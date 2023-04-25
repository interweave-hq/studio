import { type RequestReturn } from "@/lib/api/clientRequest";

export type Error = Omit<RequestReturn, "status" | "data">["error"];
