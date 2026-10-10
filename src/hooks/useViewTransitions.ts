import { useEffect } from "react";
import Router, { type NextRouter } from "next/router";
import { REDUCED_MOTION_QUERY } from "./useMotionPolicy";

interface ViewTransition {
  updateCallbackDone: Promise<void>;
  finished?: Promise<void>;
  skipTransition?: () => void;
}
type StartViewTransition = (update: () => Promise<void>) => ViewTransition;

const pathOf = (url: unknown) => {
  if (typeof url === "string") return url.split(/[?#]/)[0] || "/";
  if (typeof url === "object" && url !== null) {
    return (
      ((url as { pathname?: string }).pathname ?? "").split(/[?#]/)[0] || "/"
    );
  }
  return "/";
};

/** Wrap client route changes in a cancellable View Transition when allowed. */
export function useViewTransitions() {
  useEffect(() => {
    const router = Router.router;
    if (!router) return;

    const start = (
      document as Document & { startViewTransition?: StartViewTransition }
    ).startViewTransition?.bind(document);
    if (!start) return;

    const preference = window.matchMedia(REDUCED_MOTION_QUERY);
    let active: ViewTransition | undefined;
    let activeId = 0;
    let disposed = false;
    let cleanupActive = () => {};

    const clearActive = (id: number) => {
      if (id !== activeId) return;
      cleanupActive();
      cleanupActive = () => {};
      active = undefined;
      delete document.documentElement.dataset.viewTransition;
    };

    const wrap =
      (navigate: NextRouter["push"]): NextRouter["push"] =>
      (url, as, options) => {
        // Every intent supersedes any pending callback, even when this route
        // itself will navigate without an animation.
        const id = ++activeId;
        const isHashOnly = typeof url === "string" && url.startsWith("#");
        const targetPath = pathOf(as ?? url);
        const currentPath = pathOf(router.asPath);
        const isIntraProject =
          targetPath.startsWith("/opensource/") &&
          currentPath.startsWith("/opensource/");
        const shouldAnimate =
          !options?.shallow &&
          !isHashOnly &&
          !isIntraProject &&
          targetPath !== currentPath &&
          !preference.matches;

        // A new route interrupts the prior snapshot. Reduced-motion and
        // unsupported navigation remain ordinary Next.js navigations.
        if (active) {
          active.skipTransition?.();
          cleanupActive();
          cleanupActive = () => {};
          active = undefined;
          delete document.documentElement.dataset.viewTransition;
        }
        if (!shouldAnimate) return navigate(url, as, options);

        let result: Promise<boolean> = Promise.resolve(false);
        try {
          const transition = start(async () => {
            if (disposed || id !== activeId) return;
            result = navigate(url, as, options);
            await result.catch(() => {});
          });
          active = transition;
          document.documentElement.dataset.viewTransition = "active";

          const onPreferenceChange = (event: MediaQueryListEvent) => {
            if (event.matches && id === activeId) transition.skipTransition?.();
          };
          preference.addEventListener("change", onPreferenceChange);
          cleanupActive = () =>
            preference.removeEventListener("change", onPreferenceChange);
          const finish = () => {
            clearActive(id);
          };
          if (transition.finished) {
            void transition.finished.then(finish, finish);
          } else {
            void transition.updateCallbackDone.then(finish, finish);
          }
          void transition.updateCallbackDone.catch(finish);

          return transition.updateCallbackDone.then(
            () => result,
            () => result,
          );
        } catch {
          clearActive(id);
          return navigate(url, as, options);
        }
      };

    const push = router.push;
    const replace = router.replace;
    router.push = wrap(push.bind(router));
    router.replace = wrap(replace.bind(router));
    return () => {
      disposed = true;
      activeId++;
      active?.skipTransition?.();
      cleanupActive();
      active = undefined;
      delete document.documentElement.dataset.viewTransition;
      router.push = push;
      router.replace = replace;
    };
  }, []);
}
