import { IService, ServiceDefinition, Services } from "./service";

export default class DIContainer {
	private services: Services;

	constructor() {
		this.services = new Map<ServiceDefinition, IService>();
	}

	public bind(service: ServiceDefinition, dependencies?: any[]): void {
		const instance = dependencies
			? new service(...dependencies)
			: new service();
		this.services.set(service, instance);
	}

	public toFactory(
		service: {
			useClass: ServiceDefinition;
			dependencies?: any[];
		},
		factory: (
			serviceClass: ServiceDefinition,
			dependencies?: any[],
		) => IService,
	): void {
		const instance = factory(service.useClass, service.dependencies);
		this.services.set(service.useClass, instance);
	}

	public get<T extends IService>(service: ServiceDefinition): T {
		const instance = this.services.get(service);
		if (!instance)
			throw new Error(`[${DIContainer.name}] ${service.name} is not bound`);

		return instance as T;
	}
}
