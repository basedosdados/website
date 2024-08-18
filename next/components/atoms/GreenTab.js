import React from "react";
import { Tab } from "@chakra-ui/react";

export default function GreenTab({ children, ...style }) {
  return (
    <Tab
      position="relative"
      top="1px"
      fontFamily="Roboto"
      fontWeight="500"
      fontSize="14px"
      lineHeight="20px"
      color="#71757A"
      fill="#71757A"
      padding="12px 24px 13px"
      _selected={{
        color: "#2B8C4D",
        fill:"#2B8C4D",
        pointerEvents: "none",
        borderBottom: "3px solid #2B8C4D"
      }}
      _hover={{
        color: "#464A51",
        fill: "#464A51"
      }}
      {...style}
    >
      {children}
    </Tab>
  )
}
