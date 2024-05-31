import { json } from "@/src/utils/fetch";
import { CoreUserMessage } from "ai";
import { fetchWithToken } from "../base-fetch";

export async function sendPrompt(body: CoreUserMessage): Promise<Response> {
	return fetchWithToken("chat", {
		method: "POST",
		body: json(body),
	});
}
