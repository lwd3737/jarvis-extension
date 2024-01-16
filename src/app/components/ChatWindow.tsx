"use client";

import { useState } from "react";
import ChatHistoryBox from "./ChatHistoryBox";
import MessageForm from "./MessageForm";
import { Message } from "@/src/models/chat";

export default function ChatWindow() {
	const [messages, setMessages] = useState<Message[]>([]);

	const handleSendMessage = (message: string) => {
		setMessages((prev) => [...prev, { sender: "you", content: message }]);
	};

	return (
		<div className="flex flex-col h-full">
			<ChatHistoryBox history={messages} />
			<MessageForm onSendMessage={handleSendMessage} />
		</div>
	);
}
