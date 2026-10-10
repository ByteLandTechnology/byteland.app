import type { CSSProperties } from "react";

/**
 * Style that tags an element for the View Transitions API. Elements with the
 * same name on the old and new page morph into each other on navigation.
 * Names must be unique within a page. `text` marks headings, whose snapshots
 * scale by height so they keep their proportions while resizing.
 */
export const vt = (
  kind: string,
  id: string,
  options: { text?: boolean } = {},
): CSSProperties =>
  ({
    viewTransitionName: `${kind}-${id.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`,
    viewTransitionClass: options.text ? "vt-text" : undefined,
  }) as CSSProperties;
