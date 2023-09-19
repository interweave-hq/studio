import { authenticate } from "@/lib/auth";
import { Footer } from "@/components";
import { InnerProjectHeader } from "@/experience/project/InnerProjectHeader";

export async function ProjectLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user } = await authenticate({ optional: true });
	return (
		<>
			<InnerProjectHeader user={user} />
			{children}
			<Footer />
		</>
	);
}
