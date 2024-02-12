import { CompletionContentPart } from "@/src/models/chat";
import { Message } from "ai";
import { memo } from "react";

type ChatHistoryBoxProps = {
	history: Message[];
};

export default memo(function ChatHistoryBox(props: ChatHistoryBoxProps) {
	return (
		<div className="flex-grow border border-gray-100 border-solid">
			{props.history.map((message, i) => (
				<div
					className="flex items-start p-5 whitespace-pre-wrap border-b border-gray-100 border-solid gap-x-3"
					key={i}
				>
					<div className="leading-[1.2] text-[13px] font-bold">
						{formatRole(message.role)}
					</div>
					<div className="text-[15px]">{parseContent(message.content)}</div>
				</div>
			))}
		</div>
	);
});

const formatRole = (role: string) => {
	return role[0].toUpperCase() + role.slice(1);
};

const parseContent = (
	content: string | Array<CompletionContentPart> | null,
): string => {
	if (Array.isArray(content)) {
		const textContent = content
			.filter((part) => part.type === "text")
			.join("\n");
		return textContent;
	}
	return content ?? "";
};
