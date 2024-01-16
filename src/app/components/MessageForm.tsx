"use client";

import {
	FormEventHandler,
	KeyboardEventHandler,
	useEffect,
	useRef,
	useState,
} from "react";
import ArrowUpIcon from "./ArrowUpIcon";

type MessageFormProps = {
	onSendMessage: (message: string) => void;
};

export default function MessageForm(props: MessageFormProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(function onAutoResize() {
		const el = textareaRef.current;
		if (!el) {
			console.error(ERRORS.textareaElementNotExist);
			return;
		}

		const autoResize = () => {
			if (el.scrollHeight >= MAX_HEIGHT) {
				el.style.overflowY = "scroll";
			} else {
				el.style.height = "auto";
				el.style.height = `${el.scrollHeight}px`;
			}
		};

		el.addEventListener("input", autoResize);
		return () => el.removeEventListener("input", autoResize);
	}, []);

	const [activated, setActivated] = useState<boolean>(false);
	useEffect(function toggleSubmitActivatedOnInput() {
		const el = textareaRef.current;
		if (!el) {
			console.error(ERRORS.textareaElementNotExist);
			return;
		}

		const toggleSubmitActivated = () => {
			const textLength = el.value.length;

			if (textLength > 0) setActivated(true);
			else setActivated(false);
		};

		el.addEventListener("input", toggleSubmitActivated);
		return () => el.removeEventListener("input", toggleSubmitActivated);
	}, []);

	const handleSubmit: FormEventHandler = (e) => {
		e.preventDefault();

		const el = e.target as HTMLTextAreaElement;
		const message = el.value;

		props.onSendMessage(message);
		el.value = "";
		setActivated(false);
	};

	const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();

			if (activated) {
				handleSubmit(e);
			}
		}
	};

	return (
		<form className="px-5 py-3" onSubmit={handleSubmit}>
			<div className="px-[16px] py-[14px] bg-gray-100 rounded-3xl">
				<textarea
					className="w-full leading-[20px] text-[15px] bg-inherit resize-none outline-none"
					ref={textareaRef}
					rows={1}
					wrap="hard"
					onKeyDown={handleKeyDown}
				></textarea>
				<div className="flex justify-end">
					<button
						className={`p-1 border-2 border-${colorBasedOnActivated(
							activated,
						)} border-solid rounded-md`}
						type="submit"
						disabled={!activated}
					>
						<ArrowUpIcon
							className={`w-[13px] h-[13px] fill-${colorBasedOnActivated(
								activated,
							)}`}
						/>
					</button>
				</div>
			</div>
		</form>
	);
}

const MAX_HEIGHT = 150;

const ERRORS = {
	textareaElementNotExist: "textarea element not exist",
};

const colorBasedOnActivated = (activated: boolean) => {
	return activated ? "[#4058FF]" : "[gray]";
};
