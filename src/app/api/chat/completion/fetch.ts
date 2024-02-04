import { CompletionCreateResult } from "@/src/models/chat";
import { baseFetch } from "../../shared";

export interface CompletionCreateRequestBody {
	content: string;
}

export default async function createChatCompletion(
	body: CompletionCreateRequestBody,
) {
	return baseFetch<CompletionCreateResult>("chat/completion", {
		method: "POST",
		body,
	});
}
