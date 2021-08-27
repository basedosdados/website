import { useMediaQuery } from "@chakra-ui/react";

export function useCheckMobile() {
  return useMediaQuery("(max-width: 1024px)")[0];
}
