import { describe } from "node:test";
import OpenAI from "openai";

describe("Assistant API", () => {
	const openai = new OpenAI();

	test("should chat completion be created", async () => {
		const completion = await openai.chat.completions.create({
			messages: [{ role: "system", content: "You are a helpful assistant." }],
			model: "gpt-3.5-turbo",
		});

		expect(completion.choices[0]).toBeTruthy();
	});
});
