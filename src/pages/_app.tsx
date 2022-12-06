import type { AppProps } from "next/app";

import "../styles/tailwind.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className="h-full p-4 bg-neutral-900 z-10 pt-12">
      <div
        data-tauri-drag-region
        className="absolute inset-x-0 top-0 h-12"
      ></div>
      <Component {...pageProps} />
    </main>
  );
}
