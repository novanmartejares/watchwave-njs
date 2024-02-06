import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import AppContainer from './AppContainer';
import BottomNavbar from '@/app/components/BottomNavbar';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Toaster } from 'react-hot-toast';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });
import { Analytics } from '@vercel/analytics/react';
import SetDefaultLS from './lib/SetDefaultLS';

export const viewport: Viewport = {
	themeColor: 'black',
	initialScale: 1,
	viewportFit: 'cover',
	width: 'device-width',
	userScalable: false,
	minimumScale: 1,
	maximumScale: 1,
};
export const metadata: Metadata = {
	metadataBase: new URL('https://watchwave-v2.vercel.app/'),
	title: 'WatchWave',
	description: 'WatchWave is a free streaming service for movies and TV shows.',
	keywords:
		'watch movies, movies online, watch TV, TV online, TV shows online, watch TV shows, stream movies, stream tv, instant streaming, watch online, movies, watch movies United States, watch TV online, no download, full length movies watch online, movies online, movies, watch movies online, watch movies, watch movies online free, watch movies for free, watch streaming media, watch tv online, watch movies online, watch movies online free, watch movies for free, watch streaming media, watch tv online',
	icons: {
		icon: '/favicon.svg',
		apple: '/favicon.svg',
	},
	openGraph: {
		type: 'website',
		url: `https://watchwave-v2.vercel.app`,
		images: [
			{
				url: '/Meta.png',
				alt: 'WatchWave Logo',
			},
		],
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-title" content="PWA" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
				<meta name="theme-color" content="#000000" />
				<meta name="google-site-verification" content="Gcyd07cXVfBhdhqUYr1kcvOREY1WCL07XUDzDy1VKdQ" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="icon" type="image/png" sizes="196x196" href="/favicon-196.png" />
				<link rel="apple-touch-icon" href="/apple-icon-180.png" />
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2048-2732.jpg"
					media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2732-2048.jpg"
					media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1668-2388.jpg"
					media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2388-1668.jpg"
					media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1536-2048.jpg"
					media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2048-1536.jpg"
					media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1668-2224.jpg"
					media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2224-1668.jpg"
					media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1620-2160.jpg"
					media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2160-1620.jpg"
					media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1290-2796.jpg"
					media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2796-1290.jpg"
					media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1179-2556.jpg"
					media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2556-1179.jpg"
					media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1284-2778.jpg"
					media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2778-1284.jpg"
					media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1170-2532.jpg"
					media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2532-1170.jpg"
					media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1125-2436.jpg"
					media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2436-1125.jpg"
					media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1242-2688.jpg"
					media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2688-1242.jpg"
					media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-828-1792.jpg"
					media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1792-828.jpg"
					media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1242-2208.jpg"
					media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-2208-1242.jpg"
					media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-750-1334.jpg"
					media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1334-750.jpg"
					media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-640-1136.jpg"
					media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/apple-splash-1136-640.jpg"
					media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				/>
			</head>
			<body style={{ WebkitTapHighlightColor: 'transparent' }} className={inter.className + ' bg-background text-foreground dark'}>
				<AppContainer>
					<Navbar />
					<Toaster />
					<BottomNavbar />
					{children}

					{/* <Analytics /> */}
					<SpeedInsights />
					{/* <SetDefaultLS /> */}
				</AppContainer>
				<GoogleAnalytics gaId="G-G63HCTQHVX" />
			</body>
		</html>
	);
}
