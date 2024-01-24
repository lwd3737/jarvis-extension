export default class OpenAIService {
	private static validateEnvVars() {
		const { OPENAI_API_KEY, GPT_MODEL } = process.env;
		const envVars = { OPENAI_API_KEY, GPT_MODEL };

		Object.entries(envVars).forEach(([name, val]) => {
			if (!val) throw new Error(`[${OpenAIService.name}] ${name} is not set`);
		});

		return {
			apiKey: OPENAI_API_KEY!,
			model: GPT_MODEL!,
		};
	}
}
