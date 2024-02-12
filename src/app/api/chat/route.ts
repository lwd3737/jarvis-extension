import { getChatCompletionService } from "@/src/services";
import { NextRequest, NextResponse } from "next/server";
import { CompletionCreateRequestBody } from "./fetch";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: NextRequest) {
	const service = getChatCompletionService();
	const body = (await req.json()) as CompletionCreateRequestBody;
	//
	const ai = service.getOpenai();
	const res = await ai.chat.completions.create({
		messages: body.messages,
		model: service.getModel(),
		stream: true,
	});
	const stream = OpenAIStream(res);

	return new StreamingTextResponse(stream);
}
