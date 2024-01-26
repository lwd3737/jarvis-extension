import OpenAI from "openai";
import { MyConfigService } from ".";
import OpenAIService from "./openai.service";

export type Assistant = OpenAI.Beta.Assistants.Assistant;
export type Thread = OpenAI.Beta.Threads.Thread;
type AssistantOptions = {
	name?: string;
	instructions?: string;
};

export default class AssistantService {
	public static async create(
		configService: MyConfigService,
		openAIService: OpenAIService,
		options?: AssistantOptions,
	): Promise<AssistantService> {
		const { gptModel } = configService.get();

		const openai = openAIService.get();
		const assistant = await openai.beta.assistants.create({
			model: gptModel,
			...options,
		});

		return new AssistantService(openai, assistant);
	}

	constructor(private openai: OpenAI, private assistant: Assistant) {}
}
