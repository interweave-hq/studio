import { CreateProject } from "@/experience/project/create";
import { getMetadata } from "@/lib/metadata";

export const metadata = getMetadata({ title: "Create Project" });

export default async function ProjectListing() {
	return <CreateProject />;
}
