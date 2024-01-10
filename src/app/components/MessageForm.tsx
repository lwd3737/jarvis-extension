"use client";

import { useEffect, useRef } from "react";

type MessageFormProps = {};

export default function MessageForm(props: MessageFormProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(function onAutoResize() {
		const el = textareaRef.current;
		if (!el) return;

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

	return (
		<form className="px-5 py-3">
			<textarea
				className={`w-full h-[${DEFAULT_HEIGHT}px] min-h-[${DEFAULT_HEIGHT}px] px-[16px] py-[14px] leading-[20px] text-[15px] bg-gray-200 resize-none rounded-3xl`}
				ref={textareaRef}
				rows={1}
			></textarea>
		</form>
	);
}

const MAX_HEIGHT = 150;
const DEFAULT_HEIGHT = 48;
