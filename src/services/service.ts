import { ServiceNotBoundExeption } from "../exceptions/service";

export type IServices = Map<string, IService>;

export interface ServiceClass {
	new (...args: any[]): any;
}

export interface IService {}
