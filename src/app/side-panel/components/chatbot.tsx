"use client";

import { useEffect } from "react";

export default function Chatbot() {
	useEffect(() => {
		window.alert("Chatbot");
	}, []);
	return <div>Chatbot</div>;
}
