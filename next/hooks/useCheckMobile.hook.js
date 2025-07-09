import { useState, useEffect } from "react";

const MOBILE_UA_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Samsung|SM-|Pixel|Nexus|Windows Phone|Silk|Kindle|PlayBook|BB10|Opera Mobi|Opera Tablet|Fennec|UCWEB|Blazer|Dolfin|Dolphin|Palm|Symbian|Series40|MeeGo|Maemo|Tizen|Bada|Touch/i;

export function useCheckMobile() {
  const isBrowser = typeof window !== "undefined" && typeof navigator !== "undefined";
  let isMobile = false;

  if (isBrowser) {
    const userAgentIsMobile = MOBILE_UA_REGEX.test(navigator.userAgent);

    const mediaQuery = "(max-width: 1024px)";
    const mediaQueryMatches = window.matchMedia 
      ? window.matchMedia(mediaQuery).matches 
      : false;

    isMobile = mediaQueryMatches || userAgentIsMobile;
  }

  return isMobile;
}

export function isMobileMod() {
  const [isMobileMod, setIsMobileMod] = useState(false);
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile);
  }, [isMobile]);

  return isMobileMod;
}
