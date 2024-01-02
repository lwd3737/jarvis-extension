import { CHANNELS, CONTENT_ACTIONS, WORKER_ACTIONS } from "../constants.js";
import { action } from "../utils.js";

console.info("service worker loaded");

const state = {
	sidePanelOpened: false,
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	(async () => {
		switch (msg.type) {
			case CONTENT_ACTIONS.openSidePanel:
				{
					const windowId = sender?.tab?.windowId;
					if (!windowId) return;

					await chrome.sidePanel.open({ windowId });
				}
				break;
		}
	})();
});

// chrome.runtime.onConnect.addListener((port) => {
// 	if (port.name !== CHANNELS.chatbot) return;

// 	port.onMessage.addListener(async (msg, port) => {
// 		(async () => {
// 			switch (msg.type) {
// 				case CONTENT_ACTIONS.openSidePanel:
// 					{
// 						if (state.sidePanelOpened) return;

// 						const windowId = port.sender?.tab?.windowId;
// 						if (!windowId) return;

// 						await chrome.sidePanel.open({ windowId });
// 						state.sidePanelOpened = true;
// 					}
// 					break;
// 			}
// 		})();
// 	});

// 	port.postMessage(
// 		action(WORKER_ACTIONS.sidePanelChanged, state.sidePanelOpened),
// 	);
// });
