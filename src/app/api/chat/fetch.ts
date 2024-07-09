import { json } from "@/src/utils/fetch";
import { CoreUserMessage } from "ai";
import { fetchWithAuthToken } from "../fetch-with-auth-token";

export async function sendPrompt(body: CoreUserMessage): Promise<Response> {
	return fetchWithAuthToken("chat", {
		method: "POST",
		body: json(body),
	});
}
