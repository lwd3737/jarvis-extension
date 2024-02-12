"use client";

import ChatHistoryBox from "./ChatHistoryBox";
import MessageForm from "./MessageForm";
import { useChat } from "ai/react";

export default function ChatWindow() {
	const chat = useChat();

	return (
		<div className="flex flex-col h-full">
			<div className="h-[85%]">
				<ChatHistoryBox history={chat.messages} />
			</div>
			<div className="fixed bottom-0 left-0 right-0 h-[15%]">
				<MessageForm
					isLoading={chat.isLoading}
					onAppendMessage={chat.append}
					onStopMessage={chat.stop}
				/>
			</div>
		</div>
	);
}
