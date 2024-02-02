'use client'; // Error components must be Client Components

import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const [showDetails, setShowDetails] = useState(false);
	useEffect(() => {
		// Log the error to an error reporting service
		console.log(error);
	}, [error]);

	return (
		<div className="fc fixed z-50 h-screen w-screen gap-2 bg-black p-6">
			<div className="fc gap-2">
				<h2 className="text-2xl">Something went wrong!</h2>
				<div className="fr gap-2 w-full h-full">
					<Button
						onClick={
							// Attempt to recover by trying to re-render the segment
							() => reset()
						}
					>
						Try again
					</Button>
					<Button onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Hide' : 'Show'} details</Button>
				</div>
			</div>
			{showDetails && (
				<div className="w-full h-full rounded-2xl p-5 bg-zinc-900 fc">
					<div className="fr w-full h-full overflow-y-scroll gap-2">
						<code className="font-mono text-xs">{error?.stack}</code>
					</div>
				</div>
			)}
		</div>
	);
}
