import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthContextProvider } from "./context/AuthContext";
import AppContainer from "./AppContainer";
import Dialog from "@/components/Dialog";
import BottomNavbar from "@/components/BottomNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://d87b-142-115-122-93.ngrok-free.app/"),
  title: "WatchWave",
  description: "WatchWave is a free streaming service for movies and TV shows.",
  keywords:
    "watch movies, movies online, watch TV, TV online, TV shows online, watch TV shows, stream movies, stream tv, instant streaming, watch online, movies, watch movies United States, watch TV online, no download, full length movies watch online, movies online, movies, watch movies online, watch movies, watch movies online free, watch movies for free, watch streaming media, watch tv online, watch movies online, watch movies online free, watch movies for free, watch streaming media, watch tv online",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    url: `https://d87b-142-115-122-93.ngrok-free.app`,
    images: [
      {
        url: "/Meta.png",
        alt: "WatchWave Logo",
      },
    ],
  },
  // add image
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={inter.className + " bg-background text-foreground dark"}>
        <AppContainer>
          <Navbar />
          <BottomNavbar />
          {children}
        </AppContainer>
      </body>
    </html>
  );
}
