"use client";

import { useState } from "react";

export default function PopupPage() {
	const [on, setOn] = useState<boolean>(true);

	const handleToggle = () => (on ? setOn(false) : setOn(true));

	const renderState = () => {
		return (
			<span
				className={`absolute pt-[3px] ${
					on ? "left-[7px]" : "right-[5px]"
				}  font-bold text-[11px] text-white`}
			>
				{on ? "ON" : "OFF"}
			</span>
		);
	};

	return (
		<div className="flex justify-center items-center p-4">
			<button
				className={`relative flex items-center ${
					on ? "bg-green-300" : "bg-gray-200"
				}  px-1 border-non rounded-2xl w-[50px] h-[25px] transition-[background-color] duration-300`}
				onClick={handleToggle}
			>
				{renderState()}
				<span
					className={`absolute inline-block bg-white rounded-full w-[19px] h-[19px] transition-[left] duration-300`}
					style={{
						left: on
							? styles.container.width - styles.thumb.size - 2 + "px"
							: styles.container.padding + "px",
					}}
				></span>
			</button>
		</div>
	);
}

const styles = {
	container: {
		width: 50,
		padding: 3,
	},
	thumb: {
		size: 19,
	},
};
