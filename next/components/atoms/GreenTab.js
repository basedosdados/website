import React from "react";
import { Tab } from "@chakra-ui/react";

export default function GreenTab({ children, ...style }) {
  return (
    <Tab
      fontFamily="ubuntu"
      fontSize="18px"
      fontWeight="400"
      letterSpacing="0.1px"
      color="#252A32"
      padding="8px 16px 12px"
      _hover={{
        borderBottom: "3px solid #D0D0D0"
      }}
      _selected={{
        color: "#2B8C4D",
        fontWeight: "700",
        borderBottom: "3px solid #2B8C4D",
        pointerEvents: "none"
      }}
      {...style}
    >
      {children}
    </Tab>
  )
}
