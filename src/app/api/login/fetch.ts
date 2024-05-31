import { getConfig } from "@/src/services";

export async function login(credentials: {
	email: string;
	password: string;
}): Promise<{ accessToken: string }> {
	const { backendUrl } = getConfig();
	const res = await fetch(`${backendUrl}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(credentials),
	});
	if (!res.ok) throw new Error("Failed to login");

	return res.json();
}
