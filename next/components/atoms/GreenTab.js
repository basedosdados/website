import React from "react";
import { Tab } from "@chakra-ui/tabs";

export default function GreenTab({ children }) {
  return (
    <Tab
      fontSize="18px"
      fontWeight="400"
      letterSpacing="0.5px"
      paddingBottom="10px"
      _hover={{
        borderBottom: "3px solid #CECECE"
      }}
      _selected={{
        color: "#2B8C4D",
        fontWeight: "600",
        borderBottom: "3px solid #2B8C4D",
        pointerEvents: "none"
      }}
    >
      {children}
    </Tab>
  );
}
