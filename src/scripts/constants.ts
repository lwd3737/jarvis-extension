export const CHANNELS = {
	chatbot: "chatbot",
} as const;

export type Message = {
	type: WorkerActions;
	payload: any;
};

export type ContentActions =
	(typeof CONTENT_ACTIONS)[keyof typeof CONTENT_ACTIONS];

export const CONTENT_ACTIONS = {
	openSidePanel: "openSidePanel",
} as const;

export type WorkerActions =
	(typeof WORKER_ACTIONS)[keyof typeof WORKER_ACTIONS];

export const WORKER_ACTIONS = {
	sidePanelChanged: "sidePanelChanged",
} as const;
