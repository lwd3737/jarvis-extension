import { CompletionUserMessage } from "@/src/models/chat";
import { json } from "@/src/utils/fetch";

export type MessageAppendRequestBody = CompletionUserMessage;

export async function sendUserMessage(
	body: CompletionUserMessage,
	signal: AbortSignal,
): Promise<Response> {
	return fetch("/api/chat", {
		method: "POST",
		body: json(body),
		signal,
	});
}
