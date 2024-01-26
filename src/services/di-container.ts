import { IService, ServiceClass, Services } from "./service";

export default class DIContainer {
	private services: Services;

	constructor() {
		this.services = new Map<ServiceClass, IService>();
	}

	public bind(service: ServiceClass, dependencies?: any[]): void {
		const instance = dependencies
			? new service(...dependencies)
			: new service();
		this.services.set(service, instance);

		this.logBound(service);
	}

	public toFactory(
		service: {
			useClass: ServiceClass;
			dependencies?: any[];
		},
		factory: (serviceClass: ServiceClass, dependencies?: any[]) => IService,
	): void {
		const instance = factory(service.useClass, service.dependencies);
		this.services.set(service.useClass, instance);

		this.logBound(service.useClass);
	}

	private logBound(service: ServiceClass) {
		console.info(
			`[${DIContainer.name}] ${service.name} services is bound successfully`,
		);
	}

	public get<T extends IService>(service: ServiceClass): T {
		const instance = this.services.get(service);
		if (!instance)
			throw new Error(`[${DIContainer.name}] ${service.name} is not bound`);

		return instance as T;
	}
}
