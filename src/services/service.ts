export type Services = Map<IService, ServiceMetadata>;

export interface IService {
	new (): any;
	new (...args: any[]): any;
}

export type ServiceMetadata = {
	instance: Service;
	dependencies: any[];
};

export type Service = InstanceType<IService>;
