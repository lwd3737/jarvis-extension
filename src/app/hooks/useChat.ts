import { useCallback, useRef, useState } from "react";
import { sendPrompt } from "../api/chat/fetch";
import {
	CoreAssistantMessage,
	CoreMessage,
	CoreTool,
	CoreUserMessage,
	TextStreamPart,
} from "ai";
import useConfig from "./useConfig";

export default function useChat() {
	const config = useConfig();
	const [messages, setMessages] = useState<CoreMessage[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const abortControllerRef = useRef<AbortController | null>(null);

	const append = useCallback(
		async (content: string) => {
			if (loading) return;
			else setLoading(true);

			const prompt = {
				role: "user",
				content,
			} as CoreUserMessage;

			setMessages((prev) => [...prev, prompt]);

			const eventSource = new EventSource(
				`${config!.backendUrl}/api/chat/stream`,
			);

			let started = false;
			const listener = (event: MessageEvent) => {
				const data = JSON.parse(event.data) as TextStreamPart<
					Record<string, CoreTool<any, any>>
				>;

				switch (data.type) {
					case "text-delta":
						if (!started) {
							started = true;

							const newMessage = {
								role: "assistant",
								content: data.textDelta,
							} as CoreAssistantMessage;

							setMessages((prev) => [...prev, newMessage]);
						} else {
							setMessages((prev) => {
								const streamingMessage = prev[prev.length - 1];
								const updatedMessage = {
									...streamingMessage,
									content: streamingMessage.content + data.textDelta,
								} as CoreAssistantMessage;

								return [...prev.slice(0, -1), updatedMessage];
							});
						}
						break;
					case "finish":
						setLoading(false);
						started = false;
						eventSource.close();
						eventSource.removeEventListener("chat.stream", listener);
						break;
					case "error":
						console.error(data.error);
						break;
					case "tool-call":
						break;
				}
			};

			eventSource.addEventListener("chat.stream", listener);

			eventSource.onerror = (e) => {
				console.error(e);
				eventSource.removeEventListener("chat.stream", listener);
				eventSource.close();
			};

			const abortController = (abortControllerRef.current =
				new AbortController());

			const res = await sendPrompt(prompt, abortController.signal);
			if (!res.ok) {
				console.error("Failed to send prompt", res);
				return;
			}
		},
		[config, loading],
	);

	const stop = useCallback(() => {
		if (!abortControllerRef.current) return;

		abortControllerRef.current.abort();
		setLoading(false);
	}, []);

	return { messages, loading, append, stop };
}
