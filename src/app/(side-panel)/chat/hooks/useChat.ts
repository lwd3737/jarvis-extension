import { useCallback, useRef, useState } from "react";
import {
	CoreAssistantMessage,
	CoreMessage,
	CoreTool,
	CoreUserMessage,
	TextStreamPart,
} from "ai";
import { CHAT_EVENT } from "@/constants/events";
import useConfig from "../../../../hooks/useConfig";
import useStorage from "../../../../hooks/useStorage";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/src/hooks/useAuthGuard";
import { chatApi } from "@/src/app/api/chat/fetch";

export default function useChat() {
	const router = useRouter();

	const config = useConfig();
	const storage = useStorage();
	const guard = useAuthGuard();

	const [messages, setMessages] = useState<CoreMessage[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const eventSourceRef = useRef<EventSource | null>(null);

	const onReplyStreamCompleted = useCallback(() => {
		setLoading(false);

		const source = eventSourceRef.current;
		source?.close();
		eventSourceRef.current = null;
	}, []);

	const processReplyStream = useCallback(async () => {
		const eventSource = (eventSourceRef.current = new EventSource(
			`${config!.backendUrl}/api/chat/reply`,
		));

		let started = false;

		const listener = (event: MessageEvent) => {
			const content = event.data as string;

			if (started) {
				setMessages((prev) => {
					return prev.map((message, idx, origin) => {
						const isStreaming = idx === origin.length - 1;
						if (!isStreaming) return message;

						const streamingMessage = {
							...message,
							content: (message.content as string) + content,
						} as CoreAssistantMessage;

						return streamingMessage;
					});
				});
			} else {
				started = true;

				const newMessage = {
					role: "assistant",
					content,
				} as CoreAssistantMessage;

				setMessages((prev) => [...prev, newMessage]);
			}
		};

		eventSource.addEventListener(CHAT_EVENT.stream, listener);
		eventSource.addEventListener(CHAT_EVENT.finish, () => {
			onReplyStreamCompleted();
		});

		eventSource.addEventListener("error", (e) => {
			console.error(e);

			onReplyStreamCompleted();
		});
	}, [config, onReplyStreamCompleted]);

	const chat = useCallback(
		async (content: string) => {
			if (loading) return;

			setLoading(true);

			const prompt = {
				role: "user",
				content,
			} as CoreUserMessage;

			setMessages((prev) => [...prev, prompt]);

			await guard(async () => {
				await chatApi.prompt(prompt);
				await processReplyStream();
			});
		},
		[guard, processReplyStream, loading],
	);

	const stop = useCallback(() => {
		eventSourceRef.current?.close();
		setLoading(false);
	}, []);

	return { messages, loading, append: chat, stop };
}
