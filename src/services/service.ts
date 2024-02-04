import { ServiceNotBoundExeption } from "../exceptions/service";

export type IServices = Map<string, IService>;

export interface ServiceClass {
	new (...args: any[]): any;
}

export interface IService {}

export function getService<Service extends IService = IService>(
	serviceClass: ServiceClass,
) {
	const service = globalThis.__container.get<Service>(serviceClass);
	if (!service) throw new ServiceNotBoundExeption(service);
	return service;
}
