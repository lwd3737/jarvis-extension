import { getConfig } from "@/src/services";
import { getStorageService } from "@/src/services/storage/storage.service";

export const baseFetch: typeof fetch = async (input, init) => {
	const { backendUrl } = getConfig();
	const url =
		input instanceof URL
			? input.toString()
			: input instanceof globalThis.Request
			? input.url
			: `${backendUrl}/api/${input}`;

	return fetch(url, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...init?.headers,
		},
	});
};

export const fetchWithToken: typeof fetch = async (input, init) => {
	const storageService = getStorageService();

	const accessToken = (await storageService.get("accessToken")) as string;
	if (!accessToken) throw new Error("Access token is not found from storage");

	return baseFetch(input, {
		...init,
		headers: {
			...init?.headers,
			Authorization: `Bearer ${accessToken}`,
		},
	});
};
