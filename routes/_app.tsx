import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html translate={false} className="notranslate">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google" content="notranslate" />
        <title>boxdgrid – Letterboxd Collage Generator</title>
        <meta
          name="description"
          content="Create grid-style collages from the films you've logged on Letterboxd. Choose your grid dimensions, display ratings and titles, and share your personalized movie collage with friends. Perfect for showcasing your recent watches, favorites, or themed lists in a visual and organized way."
        />
        <meta
          name="google-site-verification"
          content="IcY_PH21oBJFheavxicQ_xKuV6KvhYU4EVZPWRBY85Q"
        />

        <meta
          property="og:title"
          content="boxdgrid – Letterboxd Collage Generator"
        />
        <meta
          property="og:description"
          content="Create grid-style collages of your latest Letterboxd watches"
        />
        <meta
          property="og:image"
          content="https://boxdgrid.deno.dev/og-image.jpg"
        />
        <meta property="og:url" content="https://boxdgrid.deno.dev/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="boxdgrid" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&family=Noto+Sans+JP:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/styles.css" />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="ca4babd8-9261-4409-a918-53e5219b7777"
        />
      </head>
      <body data-theme="letterboxd">
        <Component />
      </body>
    </html>
  );
}
