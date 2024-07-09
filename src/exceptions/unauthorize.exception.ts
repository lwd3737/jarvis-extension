export class UnauthorizedException extends Error {
	constructor() {
		super(`[${UnauthorizedException.name}]Unauthorized`);
	}
}
