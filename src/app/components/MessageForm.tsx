"use client";

import {
	FormEventHandler,
	KeyboardEventHandler,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import ArrowUpIcon from "./ArrowUpIcon";
import { useChat } from "ai/react";

type MessageFormProps = {
	appendMessage: UseChatHelper["append"];
};
type UseChatHelper = ReturnType<typeof useChat>;

export default memo(function MessageForm(props: MessageFormProps) {
	const formRef = useRef<HTMLFormElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const submitButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(function onAutoResize() {
		const el = textareaRef.current;
		if (!el) {
			console.error(EXCEPTIONS.textareaElementNotExist);
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

			props.appendMessage({
				content: text.toString(),
				role: "assistant",
			});

			const textareaEl = textareaRef.current!;
			textareaEl.value = "";

			setActivated(false);
		},
		[props],
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

	return (
		<form ref={formRef} className="px-5 py-3" onSubmit={handleSubmit}>
			<div className="px-[16px] py-[14px] bg-gray-100 rounded-3xl">
				<textarea
					className="w-full leading-[20px] text-[15px] bg-inherit resize-none outline-none"
					ref={textareaRef}
					name="text-prompt"
					rows={1}
					wrap="hard"
					autoComplete="off"
					onKeyDown={handleKeyDown}
				></textarea>
				<div className="flex justify-end">
					<button
						ref={submitButtonRef}
						className={`p-1 rounded-md ${
							activated
								? "border-2 border-gray-600 border-solid"
								: "border-2 border-gray-300 border-solid"
						}`}
						type="submit"
						disabled={!activated}
					>
						<ArrowUpIcon
							width={13}
							height={13}
							fill={
								activated
									? "rgb(75 85 99 / var(--tw-border-opacity))"
									: "rgb(209 213 219 / var(--tw-border-opacity))"
							}
						/>
					</button>
				</div>
			</div>
		</form>
	);
});

const MAX_HEIGHT = 150;

const EXCEPTIONS = {
	textareaElementNotExist: "textarea element not exist",
};
