/** @type {import('next').NextConfig} */

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

const nextConfig = {
	output: "export",
	// distDir: "next",
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

module.exports = nextConfig;
