import OpenAI from "openai";
import { MyConfigService } from ".";
import { IService, getService } from "./service";
import { CompletionMessage, CompletionSystemMessage } from "../models/chat";
import { OpenAIStream, StreamingTextResponse } from "ai";

export class ChatCompletionService implements IService {
	private openai: OpenAI;
	private model: string;
	private messages: CompletionMessage[];
	// private systemMessage: CompletionSystemMessage;

	constructor(
		configService: MyConfigService,
		systemMessage?: CompletionSystemMessage,
	) {
		this.openai = new OpenAI({ apiKey: configService.get().apiKey });
		this.model = configService.get().gptModel;
		// this.systemMessage = systemMessage ?? {
		// 	role: "system",
		// 	content: "너는 한국어로 도움을 주는 조력자야",
		// };
		this.messages = [];
	}

	public async old__createCompletion(
		messages: CompletionMessage[],
	): Promise<StreamingTextResponse> {
		const res = await this.openai.chat.completions.create({
			messages,
			model: this.model,
			stream: true,
		});
		const stream = OpenAIStream(res);
		return new StreamingTextResponse(stream);
	}

	public async createCompletion(
		prompt: CompletionMessage,
	): Promise<StreamingTextResponse> {
		const res = await this.openai.chat.completions.create({
			messages: [...this.messages, prompt],
			model: this.model,
			stream: true,
		});
		const stream = OpenAIStream(res, {
			onStart: () => {
				this.messages.push(prompt);
			},
			onFinal: (completion: string) => {
				console.log("completion", completion);
				this.messages.push({
					role: "system",
					content: completion,
				});
			},
		});

		return new StreamingTextResponse(stream);
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
