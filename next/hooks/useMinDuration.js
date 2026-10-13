import { useEffect, useRef, useState } from "react";

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
