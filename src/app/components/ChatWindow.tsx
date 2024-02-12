"use client";

import ChatHistoryBox from "./ChatHistoryBox";
import MessageForm from "./MessageForm";
import { useChat } from "ai/react";

export default function ChatWindow() {
	const chat = useChat();

	console.log("chat", chat.messages);

	return (
		<div className="flex flex-col h-full">
			<ChatHistoryBox history={chat.messages} />
			<MessageForm
				value={chat.input}
				onInputChange={chat.handleInputChange}
				onSubmit={chat.handleSubmit}
			/>
		</div>
	);
}
