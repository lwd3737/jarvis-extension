import { getConfig } from "@/src/services";
import { json } from "@/src/utils/fetch";
import { CoreUserMessage } from "ai";

export async function sendPrompt(body: CoreUserMessage): Promise<Response> {
	const { backendUrl } = getConfig();

	return fetch(`${backendUrl}/api/chat`, {
		method: "POST",
		body: json(body),
		headers: {
			"Content-Type": "application/json",
		},
	});
}
