import { useCallback, useRef, useState } from "react";
import { sendPrompt } from "../../../api/chat/fetch";
import {
	CoreAssistantMessage,
	CoreMessage,
	CoreTool,
	CoreUserMessage,
	TextStreamPart,
} from "ai";
import { CHAT_EVENT } from "@/constants/events";
import useConfig from "../../hooks/useConfig";
import useStorage from "../../hooks/useStorage";
import { useRouter } from "next/navigation";

export default function useChat() {
	const router = useRouter();

	const config = useConfig();
	const storage = useStorage();

	const [messages, setMessages] = useState<CoreMessage[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const eventSourceRef = useRef<EventSource | null>(null);

	const handleStream = useCallback(async () => {
		const accessToken = await storage?.get("accessToken");
		if (!accessToken) {
			router.replace("/login");
			return;
		}

		const eventSource = (eventSourceRef.current = new EventSource(
			// TODO: 보안 이슈로 인해 accessToken을 query string으로 전달하는 것은 좋지 않으므로 수정이 필요
			`${config!.backendUrl}/api/chat/stream?accessToken=${accessToken}`,
		));

		eventSource.onopen = () => {
			// TODO: access token을 전송해서 인증. 실패하면 연결 종룧하고 로그인 페이지로 이동
		};

		eventSource.onerror = (event) => {
			console.error(event);
			eventSource.close();
		};

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
					eventSource.removeEventListener(CHAT_EVENT.stream, listener);
					break;
				case "error":
					console.error(data.error);
					break;
				case "tool-call":
					break;
			}
		};

		eventSource.addEventListener(CHAT_EVENT.stream, listener);

		eventSource.onerror = (e) => {
			console.error(e);
			eventSource.removeEventListener(CHAT_EVENT.stream, listener);
			eventSource.close();
		};
	}, [config, storage, router]);

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

				if (res.statusText === "Unauthorized") router.replace("/login");

				return;
			}
		},
		[handleStream, loading, router],
	);

	const stop = useCallback(() => {
		if (!eventSourceRef.current) return;
		eventSourceRef.current.close();
		setLoading(false);
	}, []);

	return { messages, loading, append, stop };
}
