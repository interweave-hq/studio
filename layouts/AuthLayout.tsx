import { authenticate } from "@/lib/auth";
import { Header } from "@/components";

export async function AuthLayout({ children }: { children: React.ReactNode }) {
	const { user } = await authenticate();
	return (
		<>
			<Header user={user} />
			{children}
		</>
	);
}
