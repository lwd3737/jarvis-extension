import AssistantService from "./assistant.service";
import ConfigService from "./config.service";
import DIContainer from "./di-container";

type MyConfig = { apiKey: string; gptModel: string };
export type MyConfigService = ConfigService<MyConfig>;

export let container: DIContainer;

function bind() {
	if (container) return;

	console.info("[DIContainer] Binding services");

	container = new DIContainer();

	const configService = ConfigService.builder<MyConfig>([
		"OPENAI_API_KEY",
		"GPT_MODEL",
	])
		.format(({ OPENAI_API_KEY, GPT_MODEL }) => ({
			apiKey: OPENAI_API_KEY,
			gptModel: GPT_MODEL,
		}))
		.build();

	container.bind(ConfigService);
	// container.toFactory(
	// 	{ useClass: AssistantService, dependencies: [configService] },
	// 	(serviceClass, dependencies) => {
	// 		const Service = serviceClass as typeof AssistantService;
	// 		const configService = dependencies?.[0] as MyConfigService;

	// 		return Service.create(configService);
	// 	},
	// );
}
bind();
