export default class LocalStorageService {
	private storage: Storage;

	constructor() {
		this.storage = window.localStorage;
	}

	public get<T = any>(key: string): T | null {
		const value = this.storage.getItem(key);
		return value ? JSON.parse(value) : null;
	}

	public set(key: string, value: any): void {
		this.storage.setItem(key, JSON.stringify(value));
	}
}
