"use client";

import { useState } from "react";
import ChatHistoryBox from "./ChatHistoryBox";
import MessageForm from "./MessageForm";

export default function ChatWindow() {
	const [chatHistory, setChatHistory] = useState<string[]>([]);

	const handleSendMessage = (message: string) => {
		setChatHistory((prev) => [...prev, message]);
	};

	return (
		<div className="flex flex-col h-full">
			<ChatHistoryBox />
			<MessageForm onSendMessage={handleSendMessage} />
		</div>
	);
}
