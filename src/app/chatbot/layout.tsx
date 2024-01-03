export default function SidePanelLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const env = process.env.NODE_ENV;

	if (env === "development") {
		return (
			<div className="bg-white border border-black border-solid">
				{children}
			</div>
		);
	}

	return (
		<div className="bg-white border border-black border-solid">{children}</div>
	);
}
