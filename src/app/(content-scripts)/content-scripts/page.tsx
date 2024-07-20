"use client";
import "@/src/styles/content.css";
import render from "@/src/scripts/content-scripts/render";
import { useEffect } from "react";

export default function ContentScriptsPage() {
	useEffect(() => {
		render();

		return () => {
			const sidePanelOpenBtn = document.getElementById("sidepanel-open-btn");
			sidePanelOpenBtn?.remove();
		};
	}, []);

	return <div></div>;
}
