import ConfigService from "./config.service";
import DIContainer from "./di-container";

type MyConfig = { apiKey: string; gptModel: string };
export type MyConfigService = ConfigService<MyConfig>;

export let container: DIContainer;

function bind() {
	if (container) return;

	console.info("[DIContainer] Binding services");

	container = new DIContainer();

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
