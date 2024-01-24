/** @type {import('next').NextConfig} */

const nextConfig = {
	output: "export",
	images: {
		unoptimized: true,
	},
	experimental: {
		instrumentationHook: true,
	},
};

if (process.env.NODE_ENV === "production") {
	nextConfig.distDir = "extension";
}

module.exports = nextConfig;
