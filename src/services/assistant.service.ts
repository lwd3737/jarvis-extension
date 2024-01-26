import OpenAI from "openai";
import { MyConfigService } from ".";

type Assistant = OpenAI.Beta.Assistants.Assistant;
type Thread = OpenAI.Beta.Threads.Thread;
type ThreadMessage = OpenAI.Beta.Threads.ThreadMessage;
type AssistantOptions = {
	name?: string;
	instructions?: string;
};
export default class AssistantService {
	private thread?: Thread;

	public static async create(
		configService: MyConfigService,
		options?: AssistantOptions,
	): Promise<AssistantService> {
		const { gptModel } = configService.get();

		const openai = new OpenAI({ apiKey: configService.get().apiKey });
		const assistant = await openai.beta.assistants.create({
			model: gptModel,
			...options,
		});

		return new AssistantService(openai, assistant);
	}

	constructor(private openai: OpenAI, private assistant: Assistant) {}

	public async createThread(): Promise<Thread> {
		if (this.thread) return this.thread;

		this.thread = await this.openai.beta.threads.create();
		return this.thread;
	}

	public async createMessage(content: string): Promise<ThreadMessage> {
		if (!this.thread) await this.createThread();

		return await this.openai.beta.threads.messages.create(this.thread!.id, {
			role: "user",
			content,
		});
	}
}
