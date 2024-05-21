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

	const eventSourceRef = useRef<EventSource | null>(null);

	const handleStream = useCallback(() => {
		const eventSource = (eventSourceRef.current = new EventSource(
			`${config!.backendUrl}/api/chat/stream`,
		));

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
	}, [config]);

	const append = useCallback(
		async (content: string) => {
			if (loading) return;
			else setLoading(true);

			const prompt = {
				role: "user",
				content,
			} as CoreUserMessage;

			setMessages((prev) => [...prev, prompt]);
			handleStream();

			const res = await sendPrompt(prompt);
			if (!res.ok) {
				console.error("Failed to send prompt", res);
				return;
			}
		},
		[handleStream, loading],
	);

	const stop = useCallback(() => {
		if (!eventSourceRef.current) return;
		eventSourceRef.current.close();
		setLoading(false);
	}, []);

	return { messages, loading, append, stop };
}
