import { getChatCompletionService } from "@/src/services";
import { NextRequest } from "next/server";
import { CompletionCreateRequestBody } from "./fetch";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: NextRequest) {
	const service = getChatCompletionService();
	const body = (await req.json()) as CompletionCreateRequestBody;
	const res = await service.createCompletion(body.messages);
	const stream = OpenAIStream(res);
	return new StreamingTextResponse(stream);
}
