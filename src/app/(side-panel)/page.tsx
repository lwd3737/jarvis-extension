"use client";

import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./components/LoadingSpinner";

export default function SidePanelPage() {
	const router = useRouter();
	const auth = useAuth();

	useEffect(() => {
		if (!auth) return;
		if (!auth.loading && auth.isLogined) {
			// router.replace("/chat");
		}
	}, [auth, router]);

	return (
		<div className="flex items-center justify-center h-full">
			<LoadingSpinner width={150} height={150} />
		</div>
	);
}
