import OpenAI from "openai";
import { MyConfigService } from ".";
import { IService } from "./service";

type ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
type ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam;
type ChatCompletionUserMessageParam = OpenAI.ChatCompletionUserMessageParam;
type CompletionCreateResult = {
	to: ChatCompletionUserMessageParam;
	from: ChatCompletionMessageParam;
};

export default class ChatCompletionService implements IService {
	private openai: OpenAI;
	private model: string;
	private messages: ChatCompletionMessageParam[];
	private systemMessage: ChatCompletionSystemMessageParam;

	constructor(
		configService: MyConfigService,
		systemMessage?: ChatCompletionSystemMessageParam,
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
		message: ChatCompletionUserMessageParam,
	): Promise<CompletionCreateResult> {
		const completion = await this.openai.chat.completions.create({
			messages: [this.systemMessage, ...this.messages],
			model: this.model,
		});

		const responseMessage = completion.choices[0].message;
		this.messages.push(message, responseMessage);

		return {
			to: message,
			from: responseMessage,
		};
	}

	public clearMessages(): void {
		this.messages = [];
	}
}
