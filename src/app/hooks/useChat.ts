import { CompletionMessage, CompletionUserMessage } from "@/src/models/chat";
import { useCallback, useRef, useState } from "react";
import { sendPrompt } from "../api/chat/fetch";
import { CoreTool, TextStreamPart } from "ai";

export default function useChat() {
	const [messages, setMessages] = useState<CompletionMessage[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const abortControllerRef = useRef<AbortController | null>(null);

	const append = useCallback(async (content: string) => {
		if (loading) return;
		else setLoading(true);

		const prompt = {
			role: "user",
			content,
		} as CompletionUserMessage;

		setMessages((prev) => [...prev, prompt]);

		const eventSource = new EventSource(
			"http://localhost:8000/api/chat/stream",
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
						} as CompletionMessage;

						setMessages((prev) => [...prev, newMessage]);
					} else {
						setMessages((prev) => {
							const streamingMessage = prev[prev.length - 1];
							const updatedMessage = {
								...streamingMessage,
								content: streamingMessage.content + data.textDelta,
							} as CompletionMessage;

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

		// const stream = res.body as ReadableStream;
		// const reader = stream.getReader();
		// const decoder = new TextDecoder();

		// let isStreamingStarted = false;

		// try {
		// 	while (true) {
		// 		const { done, value } = await reader.read();
		// 		if (done) {
		// 			setLoading(false);
		// 			return;
		// 		}

		// 		const chunk = decoder.decode(value);

		// 		if (!isStreamingStarted) {
		// 			isStreamingStarted = true;
		// 			setLoading(true);
		// 			setMessages((prev) => [
		// 				...prev,
		// 				{ role: "assistant", content: chunk },
		// 			]);
		// 		} else {
		// 			setMessages((prev) => {
		// 				const streamingMessage = prev[prev.length - 1];
		// 				const updatedMessage = {
		// 					...streamingMessage,
		// 					content: streamingMessage.content + chunk,
		// 				};
		// 				return [...prev.slice(0, -1), updatedMessage];
		// 			});
		// 		}
		// 	}
		// } catch (e) {
		// 	const error = e as Error;
		// 	if (error.name === "AbortError") return;

		// 	throw error;
		// }
	}, []);

	const stop = useCallback(() => {
		if (!abortControllerRef.current) return;

		abortControllerRef.current.abort();
		setLoading(false);
	}, []);

	return { messages, loading, append, stop };
}
