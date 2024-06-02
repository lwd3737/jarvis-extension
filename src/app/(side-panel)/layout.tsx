import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ContainerProvider from "./components/ContainerProvider";
import AuthProvider from "./components/AuthProvider";
import Header from "./components/Header";
import "./side-panel.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Jarvis",
};

export default function SidePannelLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ContainerProvider>
					<Header height="10%" />
					<main className="h-[90%]">
						<AuthProvider>{children}</AuthProvider>
					</main>
				</ContainerProvider>
			</body>
		</html>
	);
}
