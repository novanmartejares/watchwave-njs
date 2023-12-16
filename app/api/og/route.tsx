/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { ImageResponse } from 'next/og';
// App router includes @vercel/og.
// No need to install it.

export const runtime = 'edge';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const img = searchParams.get('img');
	const title = searchParams.get('title');
	if (!img) {
		return new ImageResponse(<>Visit with &quot;?username=vercel&quot;</>, {
			width: 1200,
			height: 630,
		});
	}
	const font = await fetch(new URL('./inter-v12-latin-700.ttf', import.meta.url).toString()).then((res) => res.arrayBuffer());

	return new ImageResponse(
		(
			// <div
			// 	style={{
			// 		display: 'flex',
			// 		background: 'black',
			// 		width: '100%',
			// 		height: '100%',
			// 		color: 'white',
			// 		flexDirection: 'row',
			// 		padding: '2rem 2.5rem',
			// 		justifyContent: 'space-between',
			// 		alignItems: 'center',
			// 	}}
			// >
			// 	<div
			// 		style={{
			// 			display: 'flex',
			// 			flexDirection: 'column',
			// 			justifyContent: 'flex-start',
			// 			alignItems: 'flex-start',
			// 			height: '100%',
			// 		}}
			// 	>
			// 		<svg width="200px" height="200px" viewBox="0 0 865 865" fill="none" xmlns="http://www.w3.org/2000/svg">
			// 			<circle cx="432.5" cy="432.5" r="432.5" fill="black" />
			// 			<path
			// 				d="M113 253.199C174.551 217.737 253.202 237.53 290.541 297.879L527.7 681.181C466.149 716.643 387.498 696.851 350.159 636.502L113 253.199Z"
			// 				fill="white"
			// 			/>
			// 			<path
			// 				d="M325.667 256.707C387.129 221.296 465.677 241.275 502.655 301.724L648.211 539.67C586.748 575.082 508.201 555.103 471.223 494.653L325.667 256.707Z"
			// 				fill="white"
			// 			/>
			// 			<path
			// 				d="M585.165 275.706C614.542 229.518 675.187 214.655 722.664 242.008L748.229 256.738L648.839 428.528L584.681 322.956C575.832 308.393 576.019 290.084 585.165 275.706Z"
			// 				fill="white"
			// 			/>
			// 		</svg>
			// 		<div
			// 			style={{
			// 				display: 'flex',
			// 				flexDirection: 'column',
			// 				justifyContent: 'flex-start',
			// 				alignItems: 'flex-start',
			// 				maxWidth: '600px',
			// 			}}
			// 		>
			// 			<h1
			// 				style={{
			// 					color: 'white',
			// 					fontSize: '4rem',
			// 					fontWeight: 'bold',
			// 					margin: '0',
			// 					padding: '0',
			// 				}}
			// 			>
			// 				{title}
			// 			</h1>
			// 			<h2
			// 				style={{
			// 					color: 'white',
			// 					fontSize: '1.5rem',
			// 					fontWeight: '700',
			// 					margin: '0',
			// 					padding: '0',
			// 				}}
			// 			>
			// 				Watch for free on WatchWave
			// 			</h2>
			// 		</div>
			// 	</div>
			// 	<img
			// 		src={`https://image.tmdb.org/t/p/w1280${img}`}
			// 		style={{
			// 			height: '600px',
			// 			width: '400px',
			// 			borderRadius: '20px',
			// 		}}
			// 	/>
			// 	<div
			// 		style={{
			// 			position: 'absolute',
			// 			display: 'flex',
			// 			bottom: '20px',
			// 			left: '3rem',
			// 			fontSize: '1.5rem',
			// 		}}
			// 	>
			// 		Created by Vihaan
			// 	</div>
			// </div>
			<div
				style={{
					display: 'flex',
					background: 'black',
					width: '100%',
					height: '100%',
					color: 'white',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<div
					style={{
						display: 'flex',
						position: 'absolute',
						width: '100%',
						height: '100%',
						zIndex: 0,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<img
						src={`https://image.tmdb.org/t/p/w1280${img}`}
						style={{
							height: '100%',
							width: '100%',
							position: 'absolute',
							objectFit: 'cover',
							objectPosition: 'center',
							filter: 'brightness(.7)',
						}}
					/>
				</div>
				<svg
					style={{
						zIndex: '10',
					}}
					width="200px"
					height="200px"
					viewBox="0 0 865 865"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle cx="432.5" cy="432.5" r="432.5" fill="black" />
					<path
						d="M113 253.199C174.551 217.737 253.202 237.53 290.541 297.879L527.7 681.181C466.149 716.643 387.498 696.851 350.159 636.502L113 253.199Z"
						fill="white"
					/>
					<path
						d="M325.667 256.707C387.129 221.296 465.677 241.275 502.655 301.724L648.211 539.67C586.748 575.082 508.201 555.103 471.223 494.653L325.667 256.707Z"
						fill="white"
					/>
					<path
						d="M585.165 275.706C614.542 229.518 675.187 214.655 722.664 242.008L748.229 256.738L648.839 428.528L584.681 322.956C575.832 308.393 576.019 290.084 585.165 275.706Z"
						fill="white"
					/>
				</svg>
			</div>
		),
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Inter',
					data: font,
					weight: 700,
				},
			],
		}
	);
}
