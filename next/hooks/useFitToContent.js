import { useRef } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

export default function useFitToContent(deps, containerRef) {
  const ref = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let raf = 0;
    const measure = () => {
      el.style.width = "";
      const range = document.createRange();
      range.selectNodeContents(el);
      let max = 0;
      for (const rect of range.getClientRects()) {
        max = Math.max(max, rect.width);
      }
      if (max <= 0) return;
      const cs = getComputedStyle(el);
      const pad =
        parseFloat(cs.paddingLeft) +
        parseFloat(cs.paddingRight) +
        parseFloat(cs.borderLeftWidth) +
        parseFloat(cs.borderRightWidth);
      el.style.width = `${Math.ceil(max) + pad}px`;
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    measure();

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
