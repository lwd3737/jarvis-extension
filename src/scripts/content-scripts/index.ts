async function run() {
	const src = chrome.runtime.getURL("scripts/content-scripts/script.js");
	const { renderChatbotToggleButton } = await import(src);

	// renderChatbotToggleButton();
}
(async () => await run())();
