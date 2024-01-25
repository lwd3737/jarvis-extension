import { deepFreeze } from "../utils/immutable";
import { IService } from "./service";

type Config = Record<string, any>;

class ConfigServiceBuilder<T extends Config> {
	private config: T;

	constructor(envVarNames: string[]) {
		const envVars = envVarNames.reduce((record, name) => {
			this.validateEnvVar(name);

			record[name] = process.env[name]!;
			return record;
		}, {} as Record<string, string>);

		this.config = envVars as T;
	}

	private validateEnvVar(name: string) {
		if (!(name in process.env))
			throw new Error(`[${ConfigService.name}] ${name} is not set`);
	}

	public build(): ConfigService<T> {
		return new ConfigService(this.config);
	}

	public format(to: (envVars: Record<string, string>) => T): this {
		this.config = to(this.config);
		return this;
	}
}

export default class ConfigService<T extends Config> implements IService {
	private config: T;

	public static builder<T extends Config = Config>(envVarNames: string[]) {
		return new ConfigServiceBuilder<T>(envVarNames);
	}

	constructor(config: T) {
		this.config = deepFreeze(config) as T;
	}

	public get(): T {
		return this.config;
	}
}
