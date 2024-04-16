import { getChatCompletionService } from "@/src/services";
import { NextRequest } from "next/server";
import { MessageAppendRequestBody } from "./fetch";
import { StreamingTextResponse } from "ai";

export async function POST(req: NextRequest): Promise<StreamingTextResponse> {
	const prompt = (await req.json()) as MessageAppendRequestBody;
	const service = getChatCompletionService();
	const stream = await service.createCompletion(prompt);
	return new StreamingTextResponse(stream);
}
