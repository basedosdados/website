import { useMediaQuery } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export function useCheckMobile() {
  if (typeof navigator === "undefined")
    return useMediaQuery("(max-width: 1024px)")[0];
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export function isMobileMod() {
  const [isMobileMod, setIsMobileMod] = useState(false);
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile);
  }, [isMobile]);

  return isMobileMod;
}
