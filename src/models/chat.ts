import OpenAI from "openai";

export interface ChatHistory {
	messages: CompletionMessage[];
}

export type CompletionMessage =
	| CompletionSystemMessage
	| CompletionUserMessage
	| CompletionAssistantMessage;

export type CompletionSystemMessage = OpenAI.ChatCompletionSystemMessageParam;

export type CompletionUserMessage = OpenAI.ChatCompletionUserMessageParam;

export type CompletionAssistantMessage =
	OpenAI.ChatCompletionAssistantMessageParam;

export type CompletionCreateResult = {
	to: CompletionUserMessage;
	from: CompletionMessage;
};

export type CompletionContentPart = OpenAI.ChatCompletionContentPart;
