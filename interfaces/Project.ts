import { type Interfacer } from "@/interfaces/Interfacer";
import { type PublicUser } from "@/interfaces/PublicUser";

export interface Project {
    id: string;
    created_at: string;
    slug: string;
    title: string;
    is_trial: boolean;
    created_by_user_id: string;
    interfaces: Interfacer[];
    created_by_user: PublicUser;
}
