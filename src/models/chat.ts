export interface ChatHistory {
	messages: Message[];
}

export interface Message {
	sender: "you" | "bot";
	content: string;
}
