import { IService, Service, ServiceMetadata, Services } from "./service";

export default class DIContainer {
	private new__services: Services;

	constructor() {
		this.new__services = new Map<IService, ServiceMetadata>();
	}

	public bind(service: IService, dependencies?: any[]) {
		const instance = dependencies
			? new service(...dependencies)
			: new service();
		this.new__services.set(service, instance);
	}

	public get<T extends Service>(service: IService): T {
		const metadata = this.new__services.get(service);
		if (!metadata)
			throw new Error(`[${DIContainer.name}] ${service.name} is not bound`);

		return metadata.instance as T;
	}
}
