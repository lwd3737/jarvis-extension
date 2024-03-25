import { getChatCompletionService } from "@/src/services";
import { NextRequest } from "next/server";
import { MessageAppendRequestBody } from "./fetch";

export async function POST(req: NextRequest) {
	const prompt = (await req.json()) as MessageAppendRequestBody;
	const service = getChatCompletionService();
	return service.createCompletion(prompt);

	// const body = await req.json();
	// console.log("messages", body.messages);
	// return service.createCompletion(messages);
	// return service.old__createCompletion(body.messages);
}
