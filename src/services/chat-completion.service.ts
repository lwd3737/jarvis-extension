import OpenAI from "openai";
import { MyConfigService } from ".";
import { IService, getService } from "./service";
import {
	CompletionCreateResult,
	CompletionMessage,
	CompletionSystemMessage,
	CompletionUserMessage,
} from "../models/chat";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { Stream } from "openai/streaming.mjs";

export class ChatCompletionService implements IService {
	private openai: OpenAI;
	private model: string;
	private messages: CompletionMessage[];
	// private systemMessage: CompletionSystemMessage;

	constructor(
		configService: MyConfigService,
		systemMessage?: CompletionSystemMessage,
	) {
		console.log("model", configService.get().gptModel);
		this.openai = new OpenAI({ apiKey: configService.get().apiKey });
		this.model = configService.get().gptModel;
		// this.systemMessage = systemMessage ?? {
		// 	role: "system",
		// 	content: "너는 한국어로 도움을 주는 조력자야",
		// };
		this.messages = [];
	}

	public async createCompletion(
		messages: CompletionMessage[],
	): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
		return this.openai.chat.completions.create({
			messages: [...this.messages, ...messages],
			model: this.model,
			stream: true,
		});
	}

	public clearMessages(): void {
		this.messages = [];
	}

	public displayRole(role: string) {
		return role[0].toUpperCase() + role.slice(1);
	}
}

export const getChatCompletionService = () => {
	return getService<ChatCompletionService>(ChatCompletionService);
};
