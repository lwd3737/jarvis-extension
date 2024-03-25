"use client";

import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import { useChat } from "ai/react";
import {
	CompletionAssistantMessage,
	CompletionMessage,
	CompletionUserMessage,
} from "@/src/models/chat";
import { useState } from "react";
import { sendUserMessage } from "../api/chat/fetch";

export type MessageAppendHelper = (content: string) => void;
export type MessageStopHelper = () => void;

export default function ChatWindow() {
	const [messages, setMessages] = useState<CompletionMessage[]>([]);
	const chat = useChat();
	chat.messages;

	const sendPrompt = async (content: string) => {
		const prompt = {
			role: "user",
			content,
		} as CompletionUserMessage;
		setMessages((prev) => [...prev, prompt]);

		const res = await sendUserMessage(prompt);
		if (!res.ok) {
			console.error("Failed to send user message", res);
			return;
		}

		const stream = res.body as ReadableStream;
		const reader = stream.getReader();
		const decoder = new TextDecoder();

		let isStreamingStarted = false;
		while (true) {
			const { done, value } = await reader.read();
			if (done) return;

			const chunk = decoder.decode(value);

			if (!isStreamingStarted) {
				isStreamingStarted = true;
				setMessages((prev) => [...prev, { role: "assistant", content: chunk }]);
			} else {
				setMessages((prev) => {
					const lastMessage = prev[prev.length - 1];
					const updatedMessage = {
						...lastMessage,
						content: lastMessage.content + chunk,
					};
					return [...prev.slice(0, -1), updatedMessage];
				});
			}
		}
	};

	return (
		<div className="flex flex-col h-full">
			<MessageList messages={messages} />
			<MessageForm
				isLoading={chat.isLoading}
				appendMessage={sendPrompt}
				stopMessage={chat.stop}
			/>
		</div>
	);
}
