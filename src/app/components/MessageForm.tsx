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
		<form>
			<textarea className="w-full resize-none" ref={textareaRef}></textarea>
		</form>
	);
}

const MAX_HEIGHT = 100;
