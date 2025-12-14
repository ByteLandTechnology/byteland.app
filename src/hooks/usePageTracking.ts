import { useEffect } from "react";
import { useRouter } from "next/router";

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>,
    ) => void;
  }
}

const GA_MEASUREMENT_ID = "G-M02B2FCL1G";

export function usePageTracking() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path:
          router.pathname + router.asPath.split("?")[1]
            ? `?${router.asPath.split("?")[1]}`
            : "",
      });
    }
  }, [router]);
}
