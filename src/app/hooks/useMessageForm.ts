import { ChatHelpers } from "@/src/types/chat";
import {
	FormEventHandler,
	KeyboardEventHandler,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

export type MessageAppendHelper = ChatHelpers["append"];
export type MessageStopHelper = ChatHelpers["stop"];

export default function useMessageForm(input: {
	appendMessage: MessageAppendHelper;
	stopMessage: MessageStopHelper;
}) {
	const formRef = useRef<HTMLFormElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const submitButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(function onAutoResize() {
		const textareaEl = textareaRef.current;
		if (!textareaEl) {
			console.error(EXCEPTIONS.textareaElementNotExist);
			return;
		}

		const autoResize = () => {
			if (textareaEl.scrollHeight >= MAX_HEIGHT) {
				textareaEl.style.overflowY = "scroll";
			} else {
				textareaEl.style.height = "auto";
				textareaEl.style.height = `${textareaEl.scrollHeight}px`;
			}
		};

		textareaEl.addEventListener("input", autoResize);
		return () => textareaEl.removeEventListener("input", autoResize);
	}, []);

	const [activated, setActivated] = useState<boolean>(false);

	useEffect(function toggleSubmitActivationOnInput() {
		const el = textareaRef.current;
		if (!el) {
			console.error(EXCEPTIONS.textareaElementNotExist);
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

	const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		(e) => {
			e.preventDefault();

			const formEl = formRef.current;
			if (!formEl) return;

			const formData = new FormData(formEl);
			const text = formData.get("text-prompt");
			if (!text) return;

			input.appendMessage({
				content: text.toString(),
				role: "user",
			});

			const textareaEl = textareaRef.current!;
			textareaEl.value = "";
			textareaEl.dispatchEvent(new Event("input"));

			setActivated(false);
		},
		[input],
	);

	const triggerSubmit = useCallback(() => {
		if (!activated) return;

		const formEl = formRef.current!;
		const btnEl = submitButtonRef.current!;

		formEl.requestSubmit(btnEl);
	}, [activated]);

	const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = useCallback(
		(e) => {
			e.stopPropagation();

			if (e.code === "Enter" && !e.shiftKey) {
				e.preventDefault();
				e.repeat = false;

				// 크롬 브라우저에서 한국어로 입력할 때 2번 호출되는 버그 발생. 비동기로 처리하면 해결됨
				setTimeout(() => {
					triggerSubmit();
				}, 0);
			}
		},
		[triggerSubmit],
	);

	return {
		formRef,
		textareaRef,
		submitButtonRef,
		activated,
		onSubmit: handleSubmit,
		onkeydown: handleKeyDown,
	};
}

const MAX_HEIGHT = 150;

const EXCEPTIONS = {
	textareaElementNotExist: "textarea element not exist",
};
