"use client";

import ChatHistoryBox from "./ChatHistoryBox";
import MessageForm from "./MessageForm";

export default function ChatWindow() {
	return (
		<div className="flex flex-col h-full">
			<ChatHistoryBox />
			<MessageForm />
		</div>
	);
}
