import { CompletionUserMessage } from "@/src/models/chat";
import { json } from "@/src/utils/fetch";

export type MessageAppendRequestBody = CompletionUserMessage;

export async function sendPrompt(
	body: CompletionUserMessage,
	signal: AbortSignal,
): Promise<Response> {
	location.host;
	return fetch(`http://localhost:8000/api/chat`, {
		method: "POST",
		body: json(body),
		headers: {
			"Content-Type": "application/json",
		},
		signal,
	});
}
