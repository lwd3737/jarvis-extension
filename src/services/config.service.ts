import { deepFreeze } from "../utils/immutable";
import { IService } from "./service";

// TODO: builder 패턴으로 변경
export default class ConfigService<T extends Record<string, any>>
	implements IService
{
	private config: T;
	private built: boolean = false;

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

	public build(): T {
		if (this.built) return this.config;

		this.config = deepFreeze(this.config) as T;
		this.built = true;
		return this.config;
	}

	public format(to: (envVars: Record<string, string>) => T): this {
		this.config = to(this.config);
		return this;
	}

	public get(): T {
		if (!this.built)
			throw new Error(`[${ConfigService.name}] Config is not built`);
		return this.config;
	}
}
