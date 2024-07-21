/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");
const path = require("path");

const ifProd = (on) => {
	if (process.env.NODE_ENV === "production") {
		on();
	}
};

const ifDev = (on) => {
	if (process.env.NODE_ENV === "development") {
		on();
	}
};

const nextConfig = () => {
	const envFilePath = path.resolve(__dirname, `.env.${process.env.NODE_ENV}`);
	const env = dotenv.config({ path: envFilePath }).parsed;

	return {
		output: "export",
		env,
		images: {
			unoptimized: true,
		},
		webpack: (config, { isServer }) => {
			if (!isServer) {
				ifProd(() => {
					config.output.publicPath = "/next/";
				});
			}
			return config;
		},

		experimental: {
			instrumentationHook: true,
		},
	};
};

module.exports = nextConfig;
