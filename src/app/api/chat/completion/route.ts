import { getChatCompletionService } from "@/src/services";
import { NextRequest, NextResponse } from "next/server";
import { CompletionCreateRequestBody } from "./fetch";

export async function POST(req: NextRequest) {
	const service = getChatCompletionService();
	const body = (await req.json()) as CompletionCreateRequestBody;
	const created = await service.createCompletion(body.content);
	return NextResponse.json(created, { status: 201 });
}
