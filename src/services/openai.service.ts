import OpenAI from "openai";
import { MyConfigService } from ".";
import { IService } from "./service";

export type Thread = OpenAI.Beta.Threads.Thread;
export type ThreadMessage = OpenAI.Beta.Threads.ThreadMessage;

export default class OpenAIService implements IService {
	private openai: OpenAI;
	private thread?: Thread;

	constructor(configService: MyConfigService) {
		const { apiKey } = configService.get();

		this.openai = new OpenAI({ apiKey });
	}

	public get(): OpenAI {
		return this.openai;
	}

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
