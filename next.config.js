/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
	dest: 'public',
	swSrc: 'service-worker.ts',
});

const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'image.tmdb.org',
				port: '',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3000',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'img.youtube.com',
				port: '',
				pathname: '**',
			},
		],
	},
};

module.exports = withPWA(nextConfig);
