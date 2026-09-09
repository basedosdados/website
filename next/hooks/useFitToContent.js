import { useRef } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

/**
 * Collapses a wrapping element to the width of its longest rendered line, so a
 * multi-line bubble hugs its text instead of keeping the full max-width with
 * ragged-right slack.
 *
 * CSS shrink-to-fit (`fit-content`, inline-block, flex items, …) resolves a
 * wrapping box to the *available* width, not to its longest line — there's no
 * CSS for "as wide as the widest line after wrapping", so we measure it: a
 * `Range` over the text returns one client rect per rendered line; we take the
 * widest and pin the element to it (plus its own horizontal padding/border).
 *
 * Returns a ref to attach to the element. `deps` re-measures on content change
 * (e.g. the message text); pass `containerRef` (a content-independent ancestor,
 * e.g. the full-width row) to re-measure on column resize, and it re-runs once
 * web fonts load.
 */
export default function useFitToContent(deps, containerRef) {
  const ref = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let raf = 0;
    const measure = () => {
      // Clear any pinned width so the text re-wraps at its natural max-width,
      // then read the widest line from the text's per-line client rects.
      el.style.width = "";
      const range = document.createRange();
      range.selectNodeContents(el);
      let max = 0;
      for (const rect of range.getClientRects()) {
        max = Math.max(max, rect.width);
      }
      if (max <= 0) return;
      // Rects measure the text (content box); add horizontal padding + border so
      // the element keeps its padding. Math.ceil avoids a sub-pixel shortfall
      // that would force the longest line to re-wrap.
      const cs = getComputedStyle(el);
      const pad =
        parseFloat(cs.paddingLeft) +
        parseFloat(cs.paddingRight) +
        parseFloat(cs.borderLeftWidth) +
        parseFloat(cs.borderRightWidth);
      el.style.width = `${Math.ceil(max) + pad}px`;
    };

    // Defer writes past the observer callback to avoid ResizeObserver loops.
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    measure();

    // Observe a caller-provided content-independent ancestor (a full-width row,
    // not the bubble — observing the bubble would feed back on our own width
    // write). Falls back to the direct parent when no container ref is given.
    const container = containerRef?.current ?? el.parentElement;
    const ro = container ? new ResizeObserver(schedule) : null;
    if (container) ro.observe(container);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(schedule).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
