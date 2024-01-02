import {
	WORKER_ACTIONS,
	CHANNELS,
	CONTENT_ACTIONS,
	Message,
} from "../constants.js";
import { action } from "../utils.js";

console.info("content-script loaded");

export const renderChatbotToggleButton = () => {
	const rootEl = document.createElement("span");
	rootEl.id = "chatbot-toggle-button-container";
	rootEl.appendChild(createChatbotToggleButton());

	document.body.appendChild(rootEl);
};

const createChatbotToggleButton = (): HTMLButtonElement => {
	// const imageUrl = chrome.runtime.getURL("images/extension_icon.png");
	const template = `
		<button id="chatbot-toggle-button">
			Chatbot
		</button>
	`;
	const buttonEl = new DOMParser().parseFromString(template, "text/html").body
		.firstElementChild as HTMLButtonElement;

	// const port = chrome.runtime.connect({ name: CHANNELS.chatbot });

	// port.onMessage.addListener((msg: Message) => {
	// 	switch (msg.type) {
	// 		case WORKER_ACTIONS.sidePanelChanged:
	// 			{
	// 				const opened = msg.payload;
	// 				if (opened) {
	// 					buttonEl.style.display = "none";
	// 				} else {
	// 					buttonEl.style.display = "inline-block";
	// 				}
	// 			}
	// 			break;
	// 	}
	// });

	buttonEl.addEventListener("click", (e) => {
		chrome.runtime.sendMessage(action(CONTENT_ACTIONS.openSidePanel));
		// console.log("port", port);

		// port.postMessage(action(CONTENT_ACTIONS.openSidePanel));
	});

	return buttonEl;
};
