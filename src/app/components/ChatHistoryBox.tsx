import { Message } from "@/src/models/chat";

type ChatHistoryBoxProps = {
	history: Message[];
};

export default function ChatHistoryBox(props: ChatHistoryBoxProps) {
	return (
		<div className="flex-grow border border-gray-100 border-solid">
			{props.history.map((message, i) => (
				<div
					className="flex items-start p-5 whitespace-pre-wrap border-b border-gray-100 border-solid gap-x-3"
					key={i}
				>
					<div className="leading-[1.2] text-[13px] font-bold">
						{formatSender(message.sender)}
					</div>
					<div className="text-[15px]">{message.content}</div>
				</div>
			))}
		</div>
	);
}

const formatSender = (sender: string) => {
	return sender[0].toUpperCase() + sender.slice(1);
};
