import { MyConfig } from ".";
import { ChatCompletionService } from "./chat-completion.service";
import { ConfigService } from "./config.service";
import { DIContainer } from "./di-container";

export async function bind() {
	console.info(`[DIContainer]Binding services for ${getRuntime()} runtime`);

	const container = new DIContainer();

	container.toFactory(
		{
			useClass: ConfigService,
			dependencies: ["OPENAI_API_KEY", "GPT_MODEL"],
		},
		(serviceClass, dependencies) => {
			const configServiceClass = serviceClass as typeof ConfigService;
			return configServiceClass
				.builder<MyConfig>(dependencies as string[])
				.format(({ OPENAI_API_KEY, GPT_MODEL }) => ({
					apiKey: OPENAI_API_KEY,
					gptModel: GPT_MODEL,
				}))
				.build();
		},
	);

	container.bind(ChatCompletionService, [container.get(ConfigService)]);

	globalThis.__container = container;
}

function getRuntime() {
	if (typeof window !== "undefined") {
		return "browser";
	} else if (typeof global !== "undefined") {
		return "node";
	} else {
		return "unknown";
	}
}
