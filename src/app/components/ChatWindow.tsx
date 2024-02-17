"use client";

import ChatHistoryBox from "./ChatHistoryBox";
import MessageForm from "./MessageForm";
import { useChat } from "ai/react";

export type MessageAppendHelper = (content: string) => void;
export type MessageStopHelper = () => void;

export default function ChatWindow() {
	const chat = useChat();

	const appendMessage = (content: string) => {
		chat.append({ role: "user", content });
	};

	return (
		<div className="flex flex-col h-full">
			<ChatHistoryBox history={chat.messages} />
			<MessageForm
				isLoading={chat.isLoading}
				appendMessage={appendMessage}
				stopMessage={chat.stop}
			/>
		</div>
	);
}
