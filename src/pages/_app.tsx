import type { AppProps } from "next/app";
import Head from "next/head";
import "../index.css";
import { usePageTracking } from "../hooks/usePageTracking";
import { usePageTitle } from "../hooks/usePageTitle";
import ScrollToTop from "../components/ScrollToTop";

function MyApp({ Component, pageProps }: AppProps) {
  usePageTracking();
  usePageTitle();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ByteLand</title>
      </Head>
      <ScrollToTop />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
