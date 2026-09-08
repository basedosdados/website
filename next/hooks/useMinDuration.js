import { useEffect, useRef, useState } from "react";

/**
 * Keeps a transient "active" state on screen for at least `minMs`, so a state
 * that flips on and off very quickly (e.g. a loading shimmer for a fast
 * request) still reads as "something happened" instead of flickering.
 *
 * Returns a boolean that turns true as soon as `active` is true, and turns
 * false only once `active` is false AND `minMs` has elapsed since it first
 * became true. The hold is a `setTimeout` — it never blocks the event loop.
 */
export default function useMinDuration(active, minMs = 600) {
  const [visible, setVisible] = useState(active);
  const startRef = useRef(active ? Date.now() : null);

  useEffect(() => {
    if (active) {
      if (startRef.current == null) startRef.current = Date.now();
      setVisible(true);
      return undefined;
    }

    if (startRef.current == null) {
      setVisible(false);
      return undefined;
    }

    const remaining = minMs - (Date.now() - startRef.current);
    if (remaining <= 0) {
      startRef.current = null;
      setVisible(false);
      return undefined;
    }

    const id = setTimeout(() => {
      startRef.current = null;
      setVisible(false);
    }, remaining);
    return () => clearTimeout(id);
  }, [active, minMs]);

  return visible;
}
