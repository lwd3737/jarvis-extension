import DIContainer from "./di-container";

export let container: DIContainer;

function bind() {
	if (container) return;

	console.info("[DIContainer] Binding services");

	container = new DIContainer();
}
bind();
