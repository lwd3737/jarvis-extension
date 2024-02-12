"use client";

import ChatHistoryBox from "./ChatHistoryBox";
import MessageForm from "./MessageForm";
import { useChat } from "ai/react";

export default function ChatWindow() {
	const chat = useChat();

	return (
		<div className="flex flex-col h-full">
			<ChatHistoryBox history={chat.messages} />
			<MessageForm appendMessage={chat.append} />
		</div>
	);
}
