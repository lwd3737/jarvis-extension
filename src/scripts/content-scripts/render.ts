import SidePanelOpenButton from "./components/sidepanel-open-button";

console.info("content script loaded");

const render = async () => {
	const sidePanelOpenButton = new SidePanelOpenButton() as SidePanelOpenButton;
	document.body.appendChild(sidePanelOpenButton.render());
};

export default render;
