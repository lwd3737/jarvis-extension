/** @type {import('next').NextConfig} */

const nextConfig = {
	output: "export",
};

if (process.env.NODE_ENV === "production") {
	nextConfig.distDir = "extension";
}

module.exports = nextConfig;
