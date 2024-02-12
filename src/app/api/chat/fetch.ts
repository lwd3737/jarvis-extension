import { CompletionCreateResult, CompletionMessage } from "@/src/models/chat";
import { baseFetch } from "../shared";
import { Message } from "ai";

export interface CompletionCreateRequestBody {
	messages: CompletionMessage[];
}

export default async function createChatCompletion(
	body: CompletionCreateRequestBody,
) {
	return baseFetch<CompletionCreateResult>("chat/completion", {
		method: "POST",
		body,
	});
}
