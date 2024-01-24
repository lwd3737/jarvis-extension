import OpenAI from "openai";

export type Assistant = OpenAI.Beta.Assistants.Assistant;
export type Thread = OpenAI.Beta.Threads.Thread;
type AssistantCreateProps = {
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
		props?: AssistantCreateProps,
	): Promise<AssistantService> {
		const { apiKey, model } = this.validateEnvVars();

		const openai = new OpenAI({ apiKey });
		const assistant = await openai.beta.assistants.create({
			model,
			...props,
		});

		return new AssistantService({ openai, assistant });
	}

	private static validateEnvVars() {
		const { OPENAI_API_KEY, GPT_MODEL } = process.env;
		const envVars = { OPENAI_API_KEY, GPT_MODEL };
		Object.entries(envVars).forEach(([name, val]) => {
			if (!val)
				throw new Error(`[${AssistantService.name}] ${name} is not set`);
		});

		return {
			apiKey: OPENAI_API_KEY!,
			model: GPT_MODEL!,
		};
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
