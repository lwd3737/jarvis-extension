"use client";

import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import { CompletionMessage, CompletionUserMessage } from "@/src/models/chat";
import { useCallback, useRef, useState } from "react";
import { sendUserMessage } from "../api/chat/fetch";

export type MessageAppendHelper = (content: string) => void;
export type MessageStopHelper = () => void;

export default function ChatWindow() {
	const [messages, setMessages] = useState<CompletionMessage[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const abortControllerRef = useRef<AbortController | null>(null);

	const append = useCallback(async function (content: string) {
		const prompt = {
			role: "user",
			content,
		} as CompletionUserMessage;

		setMessages((prev) => [...prev, prompt]);

		const abortController = (abortControllerRef.current =
			new AbortController());

		const res = await sendUserMessage(prompt, abortController.signal);
		if (!res.ok) {
			console.error("Failed to send user message", res);
			return;
		}

		const stream = res.body as ReadableStream;
		const reader = stream.getReader();
		const decoder = new TextDecoder();

		let isStreamingStarted = false;

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					setLoading(false);
					return;
				}

				const chunk = decoder.decode(value);

				if (!isStreamingStarted) {
					isStreamingStarted = true;
					setLoading(true);
					setMessages((prev) => [
						...prev,
						{ role: "assistant", content: chunk },
					]);
				} else {
					setMessages((prev) => {
						const streamingMessage = prev[prev.length - 1];
						const updatedMessage = {
							...streamingMessage,
							content: streamingMessage.content + chunk,
						};
						return [...prev.slice(0, -1), updatedMessage];
					});
				}
			}
		} catch (e) {
			const error = e as Error;
			if (error.name === "AbortError") return;

			throw error;
		}
	}, []);

	const stop = useCallback(() => {
		if (!abortControllerRef.current) return;

		abortControllerRef.current.abort();
		setLoading(false);
	}, []);

	return (
		<div className="flex flex-col h-full">
			<MessageList messages={messages} />
			<MessageForm isLoading={loading} append={append} stop={stop} />
		</div>
	);
}
