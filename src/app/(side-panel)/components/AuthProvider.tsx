"use client";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";

interface UserProfile {
	email: string;
}

export const AuthContext = createContext<{
	profile: UserProfile | null;
	login: (profile: UserProfile) => void;
	logout: () => void;
} | null>(null);

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [profile, setProfile] = useState<UserProfile | null>(null);

	const router = useRouter();

	useEffect(
		function navigateToLoginOnUnauthenticated() {
			if (!profile) router.replace("/login");
		},
		[profile, router],
	);

	const login = useCallback(
		(profile: UserProfile) => {
			setProfile(profile);
			router.replace("/chat");
		},
		[router],
	);

	const logout = useCallback(() => {
		setProfile(null);
	}, []);

	return (
		<AuthContext.Provider value={{ profile, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
