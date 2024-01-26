export type Services = Map<ServiceClass, IService>;

export interface ServiceClass {
	new (...args: any[]): any;
}

export interface IService {}
