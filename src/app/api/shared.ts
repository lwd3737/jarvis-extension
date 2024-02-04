type Fetch = typeof fetch;
type BaseFetchInput = Parameters<Fetch>[0];
type BaseFetchInit = Omit<Required<Parameters<Fetch>>[1], "body"> & {
	body?: BodyInit | Record<string, any> | null;
};

export async function baseFetch<R = any>(
	input: BaseFetchInput,
	init?: BaseFetchInit,
): Promise<R> {
	const body = (
		typeof init?.body === "object" && init?.body !== null
			? JSON.stringify(init?.body)
			: init?.body
	) as BodyInit | undefined | null;

	const res = await fetch(toURL(input), {
		...init,
		headers: {
			"Content-Type": "application/json",
			...init?.headers,
		},
		body,
	});
	return res.json();
}

const toURL = (input: string | Request | URL): URL => {
	const base = window ? `${window.origin}/api/` : "/api/";
	if (typeof input === "string") return new URL(base + input);
	if (input instanceof Request) return new URL(base + input.url);
	return new URL(input, base);
};
