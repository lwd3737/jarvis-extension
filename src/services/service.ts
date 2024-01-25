export type Services = Map<ServiceDefinition, IService>;

export interface ServiceDefinition {
	new (...args: any[]): any;
}

export interface IService {}
