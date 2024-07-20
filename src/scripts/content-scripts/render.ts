import SidePanelOpenButton from "./components/sidepanel-open-button";

console.info("content script loaded");

const render = async () => {
	// const rootEl = document.createElement("div");
	// rootEl.id = "jarvis-container";

	const sidePanelOpenButton = new SidePanelOpenButton() as SidePanelOpenButton;

	// rootEl.appendChild(sidePanelOpenButton.render());
	document.body.appendChild(sidePanelOpenButton.render());
};

export default render;
