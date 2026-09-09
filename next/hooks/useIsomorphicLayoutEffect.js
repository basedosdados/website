import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect on the client (measure before paint, no flicker); useEffect on
// the server so SSR doesn't warn about useLayoutEffect.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
