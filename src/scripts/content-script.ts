import render from "./content-scripts/render";

async function main() {
	await render();
}

(async () => await main())();
