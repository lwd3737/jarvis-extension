import OpenAI from "openai";
import ConfigService from "./config.service";
import { MyConfigService } from ".";
import { config } from "process";

export type Assistant = OpenAI.Beta.Assistants.Assistant;
export type Thread = OpenAI.Beta.Threads.Thread;
type AssistantOptions = {
	name?: string;
	instructions?: string;
};
type AssistantNewProps = {
	openai: OpenAI;
	assistant: Assistant;
};

export default class AssistantService {
	private openai: OpenAI;
	private assistant: Assistant;
	private thread?: OpenAI.Beta.Threads.Thread;

	public static async create(
		configService: MyConfigService,
		options?: AssistantOptions,
	): Promise<AssistantService> {
		const { apiKey, gptModel } = configService.get();

		const openai = new OpenAI({ apiKey });
		const assistant = await openai.beta.assistants.create({
			model: gptModel,
			...options,
		});

		return new AssistantService({ openai, assistant });
	}

	constructor(props: AssistantNewProps) {
		this.openai = props.openai;
		this.assistant = props.assistant;
	}

	public async createThread(): Promise<Thread> {
		if (this.thread) return this.thread;

		this.thread = await this.openai.beta.threads.create();
		return this.thread;
	}

	public async createMessage(content: string) {
		if (!this.thread) await this.createThread();

		const message = await this.openai.beta.threads.messages.create(
			this.thread!.id,
			{
				role: "user",
				content,
			},
		);
	}
}
