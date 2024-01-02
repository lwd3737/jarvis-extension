import { CONTENT_ACTIONS } from "../constants.js";
import { action } from "../utils.js";

console.info("content-script loaded");

export const renderChatbotToggleButton = () => {
	const rootEl = document.createElement("span");
	rootEl.id = "chatbot-toggle-button-container";
	rootEl.appendChild(createChatbotToggleButton());

	document.body.appendChild(rootEl);
};

const createChatbotToggleButton = (): HTMLButtonElement => {
	const template = `
		<button id="chatbot-toggle-button">
			Chatbot
		</button>
	`;
	const buttonEl = new DOMParser().parseFromString(template, "text/html").body
		.firstElementChild as HTMLButtonElement;

	buttonEl.addEventListener("click", (e) => {
		chrome.runtime.sendMessage(action(CONTENT_ACTIONS.openSidePanel));
	});

	return buttonEl;
};
