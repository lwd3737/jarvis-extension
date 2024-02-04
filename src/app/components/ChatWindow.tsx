"use client";

import { useCallback, useState } from "react";
import ChatHistoryBox from "./ChatHistoryBox";
import MessageForm from "./MessageForm";
import { CompletionMessage } from "@/src/models/chat";
import createChatCompletion from "../api/chat/completion/fetch";

export default function ChatWindow() {
	const [messages, setMessages] = useState<CompletionMessage[]>([]);

	const handleCreateCompletion = useCallback(async (content: string) => {
		const created = await createChatCompletion({ content });
		setMessages((prev) => [...prev, created.to, created.from]);
	}, []);

	return (
		<div className="flex flex-col h-full">
			<ChatHistoryBox history={messages} />
			<MessageForm onSendMessage={handleCreateCompletion} />
		</div>
	);
}
