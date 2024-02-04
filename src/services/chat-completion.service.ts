import OpenAI from "openai";
import { MyConfigService } from ".";
import { IService, getService } from "./service";
import {
	CompletionCreateResult,
	CompletionMessage,
	CompletionSystemMessage,
	CompletionUserMessage,
} from "../models/chat";

export class ChatCompletionService implements IService {
	private openai: OpenAI;
	private model: string;
	private messages: CompletionMessage[];
	private systemMessage: CompletionSystemMessage;

	constructor(
		configService: MyConfigService,
		systemMessage?: CompletionSystemMessage,
	) {
		this.openai = new OpenAI({ apiKey: configService.get().apiKey });
		this.model = configService.get().gptModel;
		this.systemMessage = systemMessage ?? {
			role: "system",
			content: "너는 한국어로 도움을 주는 조력자야",
		};
		this.messages = [];
	}

	public async createCompletion(
		messageContent: string,
	): Promise<CompletionCreateResult> {
		const userMessage: CompletionUserMessage = {
			role: "user",
			content: messageContent,
		};
		const completion = await this.openai.chat.completions.create({
			messages: [this.systemMessage, ...this.messages, userMessage],
			model: this.model,
		});

		const assistantMessage = completion.choices[0].message;

		this.messages.push(userMessage, assistantMessage);

		return {
			to: userMessage,
			from: assistantMessage,
		};
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
