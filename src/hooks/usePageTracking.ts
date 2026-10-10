import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
  }
}

const GA_MEASUREMENT_ID = "G-M02B2FCL1G";

export function usePageTracking() {
  const router = useRouter();
  const initialPath = useRef(router.asPath);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // The analytics script may be installed by the hosting environment
      // after this hook mounts. Keep listening and check availability per route.
      if (typeof window.gtag !== "function") return;
      window.gtag("config", GA_MEASUREMENT_ID, { page_path: url });
    };

    handleRouteChange(initialPath.current);
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
}
