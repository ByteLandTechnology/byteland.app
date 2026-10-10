import type { AppProps } from "next/app";
import Head from "next/head";
import { MotionConfig } from "framer-motion";
import { useRouter } from "next/router";
import "../index.css";
import { usePageTracking } from "../hooks/usePageTracking";
import { useClarity } from "../hooks/useClarity";
import { useViewTransitions } from "../hooks/useViewTransitions";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { DEFAULT_TITLE, getPageConfig } from "../config/pages";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  usePageTracking();
  useClarity();
  useViewTransitions();
  useScrollToTop();

  // Rendered at build time so static HTML carries the right title.
  // Detail pages override this with their own <Head><title>.
  const config = getPageConfig(router.pathname);
  const title = config?.metaTitle ?? DEFAULT_TITLE;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta
          key="description"
          name="description"
          content="ByteLand Technology builds open-source tools for terminal UIs, WebAssembly layout and Ghidra-powered reverse engineering."
        />
      </Head>
      <MotionConfig reducedMotion="user">
        <Component {...pageProps} />
      </MotionConfig>
    </>
  );
}

export default MyApp;
