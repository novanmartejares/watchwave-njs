"use client"; // Error components must be Client Components

import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(true);
  useEffect(() => {
    // Log the error to an error reporting service
    console.log(error);
  }, [error]);

  return (
    <div className="fc fixed z-50 h-screen w-screen gap-2 bg-black p-10">
      <h2 className="text-2xl">Something went wrong!</h2>
      <div className="fr gap-2">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
        <Button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide" : "Show"} details
        </Button>
      </div>
      {showDetails && (
        <div className="fr max-w-6xl gap-2 rounded-xl bg-zinc-900 p-5">
          <code className="font-mono text-xs">{error?.stack}</code>
        </div>
      )}
    </div>
  );
}
