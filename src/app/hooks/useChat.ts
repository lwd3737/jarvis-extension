import { CompletionMessage, CompletionUserMessage } from "@/src/models/chat";
import { useCallback, useRef, useState } from "react";
import { sendPrompt } from "../api/chat/fetch";

export default function useChat() {
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

		const res = await sendPrompt(prompt, abortController.signal);
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

	return { messages, loading, append, stop };
}
