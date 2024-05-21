import { CompletionUserMessage } from "@/src/domains/chat";
import { getConfig } from "@/src/services";
import { json } from "@/src/utils/fetch";

export type MessageAppendRequestBody = CompletionUserMessage;

export async function sendPrompt(
	body: CompletionUserMessage,
	signal: AbortSignal,
): Promise<Response> {
	const { backendUrl } = getConfig();

	return fetch(`${backendUrl}/api/chat`, {
		method: "POST",
		body: json(body),
		headers: {
			"Content-Type": "application/json",
		},
		signal,
	});
}
