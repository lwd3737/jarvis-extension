"use client";

import { useEffect } from "react";
import useAuth from "./hooks/useAuth";
import { useRouter } from "next/navigation";

export default function SidePanelPage() {
	const router = useRouter();
	const auth = useAuth();

	useEffect(() => {
		if (!auth) return;
		if (!auth.loading && auth.isLogined) {
			router.replace("/chat");
		}
	}, [auth, router]);

	return <div>Loading...</div>;
}
