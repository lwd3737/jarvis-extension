import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";
import ContainerProvider from "./components/ContainerProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Chatbot for chrome extension",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ContainerProvider>
					<Header height="10%" />
					<main className="h-[90%]">{children}</main>
				</ContainerProvider>
			</body>
		</html>
	);
}
