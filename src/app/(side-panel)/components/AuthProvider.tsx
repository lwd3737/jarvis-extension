"use client";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";
import useStorage from "../hooks/useStorage";

export const AuthContext = createContext<{
	isLogined: boolean;
	login: () => void;
	logout: () => void;
} | null>(null);

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const storage = useStorage();

	const [isLogined, setIsLogined] = useState<boolean>(false);

	const router = useRouter();

	useEffect(
		function onAuthenticate() {
			storage?.get<string>("accessToken").then((accessToken) => {
				console.log("accessToken", accessToken);
				if (!accessToken) {
					console.log("no access token");
					router.replace("/login");
				}
			});
		},
		[router, storage],
	);

	const login = useCallback(() => {
		router.replace("/chat");
	}, [router]);

	const logout = useCallback(() => {
		setIsLogined(false);
	}, []);

	return (
		<AuthContext.Provider value={{ isLogined, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
