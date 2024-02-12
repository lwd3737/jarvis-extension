import { Message, StreamingTextResponse } from "ai";
import OpenAI from "openai";

export interface ChatHistory {
	messages: Message[];
}

export type CompletionMessage = OpenAI.ChatCompletionMessageParam;

export type CompletionSystemMessage = OpenAI.ChatCompletionSystemMessageParam;

export type CompletionUserMessage = OpenAI.ChatCompletionUserMessageParam;

export type CompletionAssistantMessage =
	OpenAI.ChatCompletionAssistantMessageParam;

export type CompletionCreateResult = {
	to: CompletionUserMessage;
	from: {
		role: "assistant";
		content: StreamingTextResponse;
	};
};

export type CompletionContentPart = OpenAI.ChatCompletionContentPart;
