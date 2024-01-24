export default class ConfigService<T = Record<string, any>> {
	private config: T;

	constructor(
		envVarNames: string[],
		toConfig: (envVars: Record<string, string>) => T,
	) {
		const envVars = envVarNames.reduce((envVars, envVar) => {
			if (!(envVar in process.env))
				throw new Error(`[${ConfigService.name}] ${envVar} is not set`);

			envVars[envVar] = process.env[envVar]!;
			return envVars;
		}, {} as Record<string, string>);

		this.config = toConfig(envVars);
	}

	public get(): T {
		return this.config;
	}
}
