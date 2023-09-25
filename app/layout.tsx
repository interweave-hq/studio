import { Inter } from "next/font/google";
import "./globals.css";

export const metadata = {
    title: "Interweave",
    description: "",
};

const font = Inter({
    weight: ["300", "400", "600"],
    subsets: ["latin"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            color-scheme="light"
        >
            <body className={font.className}>{children}</body>
        </html>
    );
}
