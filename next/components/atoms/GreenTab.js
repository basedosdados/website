import React from "react";
import { Tab } from "@chakra-ui/tabs";

export default function GreenTab({ children }) {
  return (
    <Tab
      marginRight="20px"
      fontSize="17px"
      letterSpacing="0.05em"
      _selected={{
        color: "rgba(43, 140, 77, 1)",
        fontWeight: "bold",
        borderBottom: "3px solid rgba(43, 140, 77, 1)",
      }}
    >
      {children}
    </Tab>
  );
}
