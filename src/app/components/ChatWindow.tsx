"use client";

import { useState } from "react";
import ChatHistoryBox from "./ChatHistoryBox";
import MessageForm from "./MessageForm";

export default function ChatWindow() {
	const [messaageFormHeight, setMessageFormHeight] = useState<number>(0);

	const handleResizeMessageForm = () => {};

	return (
		<div>
			<ChatHistoryBox />
			<MessageForm />
		</div>
	);
}
