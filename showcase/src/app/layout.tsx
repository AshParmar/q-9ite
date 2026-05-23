import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Q-9ite — AI-Powered Text-to-3D Asset Pipeline",
  description:
    "An AI research showcase demonstrating a full text-to-3D game asset generation pipeline using Stable Diffusion 1.5 and TripoSR. Built by Ash Parmar.",
  keywords: [
    "AI", "3D generation", "Stable Diffusion", "TripoSR", "game assets",
    "machine learning", "text-to-3D", "generative AI", "mesh synthesis"
  ],
  openGraph: {
    title: "Q-9ite — Text-to-3D Asset Pipeline",
    description: "AI research showcase: Stable Diffusion + TripoSR pipeline for game-ready 3D mesh synthesis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
          async
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

