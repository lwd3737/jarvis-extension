import OpenAI from "openai";

export type CompletionMessage = OpenAI.ChatCompletionMessageParam;

export type CompletionSystemMessage = OpenAI.ChatCompletionSystemMessageParam;

export type CompletionUserMessage = OpenAI.ChatCompletionUserMessageParam;

export type CompletionAssistantMessage =
	OpenAI.ChatCompletionAssistantMessageParam;

export type CompletionContentPart = OpenAI.ChatCompletionContentPart;
