import type { Metadata, Viewport } from "next";
import "@/assets/styles.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "boxdgrid – Letterboxd Collage Generator",
  description:
    "Create grid-style collages from the films you've logged on Letterboxd. Choose your grid dimensions, display ratings and titles, and share your personalized movie collage with friends. Perfect for showcasing your recent watches, favorites, or themed lists in a visual and organized way.",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    title: "boxdgrid",
  },
  openGraph: {
    title: "boxdgrid – Letterboxd Collage Generator",
    description: "Create grid-style collages of your latest Letterboxd watches",
    url: "https://boxdgrid.com/",
    siteName: "boxdgrid",
    images: [{ url: "https://boxdgrid.com/og-image.jpg" }],
    type: "website",
  },
  alternates: {
    canonical: "https://boxdgrid.com/",
  },
  other: {
    google: "notranslate",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&family=Noto+Sans:wght@400;600;700&family=Noto+Sans+Symbols:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="ca4babd8-9261-4409-a918-53e5219b7777"
          data-performance="true"
        />
      </head>
      <body className="bg min-h-dvh text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

