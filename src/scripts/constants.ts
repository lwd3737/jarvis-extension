export const CHANNELS = {
	chatbot: "chatbot",
} as const;

export type Message = {
	type: string;
	payload: any;
};

export type ContentActions =
	(typeof CONTENT_ACTIONS)[keyof typeof CONTENT_ACTIONS];

export const CONTENT_ACTIONS = {
	openSidePanel: "openSidePanel",
} as const;
