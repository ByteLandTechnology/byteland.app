import { useEffect, useRef } from "react";
import Router from "next/router";
import { useMotionPolicy } from "./useMotionPolicy";

const SCROLL_KEY = "__bytelandScrollKey";
type ScrollPosition = { x: number; y: number };

function currentEntryKey(): string {
  const state = (window.history.state ?? {}) as Record<string, unknown>;
  // Next.js assigns a unique key to each router history entry. Including the
  // URL also distinguishes native hash entries, which clone the prior state.
  if (typeof state.key === "string") {
    return `${state.key}:${window.location.href}`;
  }
  const existing = state[SCROLL_KEY];
  if (typeof existing === "string") return existing;

  const key = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.history.replaceState(
    { ...state, [SCROLL_KEY]: key },
    "",
    window.location.href,
  );
  return key;
}

function scrollToHash(hash: string, reducedMotion: boolean) {
  let id = hash;
  try {
    id = decodeURIComponent(hash);
  } catch {
    // Keep the original fragment if it contains malformed percent escapes.
  }
  const target = document.getElementById(id);
  if (!target) return false;

  const top = target.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({
    top: Math.max(0, top),
    left: 0,
    behavior: reducedMotion ? "instant" : "smooth",
  });
  return true;
}

/** Centralize route scroll, in-page links, and per-history-entry restoration. */
export function useScrollToTop() {
  const { reducedMotion } = useMotionPolicy();
  const reducedMotionRef = useRef(reducedMotion);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const positions = new Map<string, ScrollPosition>();
    let entryKey = currentEntryKey();
    let isPopNavigation = false;
    let pendingFrame = 0;
    let lastHandledUrl = "";
    let lastHandledEntryKey = "";
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const savePosition = () => {
      // Next may replace the initial state with its own keyed entry after this
      // hook mounts. Refresh the identity while still on the current entry;
      // during popstate, keep the outgoing identity until restoration begins.
      if (!isPopNavigation) entryKey = currentEntryKey();
      positions.set(entryKey, { x: window.scrollX, y: window.scrollY });
    };

    const preparePopNavigation = () => {
      isPopNavigation = true;
      // history.state already identifies the destination when popstate fires.
      // Save against the outgoing key before adopting the destination below.
      savePosition();
      return true;
    };
    const onPopState = (event: PopStateEvent) => {
      // Next's listener can finish a cached route before a later window
      // listener runs in Chromium. Router entries use beforePopState instead;
      // plain browser fragment entries still need this native fallback.
      if (!event.state?.__N) preparePopNavigation();
    };

    const applyNavigation = (url: string, shallow = false) => {
      if (shallow) return;

      const hashIndex = url.indexOf("#");
      const hash = hashIndex >= 0 ? url.slice(hashIndex + 1) : "";
      const shouldRestore = isPopNavigation;
      isPopNavigation = false;

      const targetEntryKey = currentEntryKey();

      // Next's hash events and the browser's hashchange can report the same
      // navigation. Process that history entry only once.
      if (
        !shouldRestore &&
        url === lastHandledUrl &&
        targetEntryKey === lastHandledEntryKey
      ) {
        return;
      }
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      entryKey = targetEntryKey;
      lastHandledUrl = url;
      lastHandledEntryKey = entryKey;
      const savedPosition = shouldRestore
        ? positions.get(targetEntryKey)
        : undefined;

      const restoreOrScroll = () => {
        // A history entry's saved position wins over its fragment. This keeps
        // back/forward navigation at the exact point the visitor left it.
        if (savedPosition) {
          window.scrollTo({
            left: savedPosition.x,
            top: savedPosition.y,
            behavior: "instant",
          });
        } else if (hash) {
          scrollToHash(hash, reducedMotionRef.current);
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
        savePosition();
      };

      if (shouldRestore || hash) {
        pendingFrame = requestAnimationFrame(restoreOrScroll);
      } else {
        restoreOrScroll();
      }
    };

    const onRouteStart = () => savePosition();
    const onHashStart = () => savePosition();
    const onRouteComplete = (url: string, { shallow }: { shallow: boolean }) =>
      applyNavigation(url, shallow);
    const onHashComplete = (url: string) => applyNavigation(url);
    const onNativeHashChange = () =>
      applyNavigation(
        `${window.location.pathname}${window.location.search}${window.location.hash}`,
      );

    window.addEventListener("scroll", savePosition, { passive: true });
    window.addEventListener("popstate", onPopState, true);
    window.addEventListener("hashchange", onNativeHashChange);
    Router.beforePopState(preparePopNavigation);
    Router.events.on("routeChangeStart", onRouteStart);
    Router.events.on("routeChangeComplete", onRouteComplete);
    Router.events.on("hashChangeStart", onHashStart);
    Router.events.on("hashChangeComplete", onHashComplete);

    // Browsers may have already scrolled an initial fragment before React
    // mounts; resolve it again after the page content has committed.
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      pendingFrame = requestAnimationFrame(() => {
        scrollToHash(initialHash, reducedMotionRef.current);
        savePosition();
      });
    }

    return () => {
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      window.removeEventListener("scroll", savePosition);
      window.removeEventListener("popstate", onPopState, true);
      window.removeEventListener("hashchange", onNativeHashChange);
      Router.beforePopState(() => true);
      Router.events.off("routeChangeStart", onRouteStart);
      Router.events.off("routeChangeComplete", onRouteComplete);
      Router.events.off("hashChangeStart", onHashStart);
      Router.events.off("hashChangeComplete", onHashComplete);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);
}
