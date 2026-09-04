import { Box } from "@chakra-ui/react";

import VegaChart from "./VegaChart";

/**
 * A rendered chart, framed in a bordered card. `spec` is a complete Vega-Lite spec
 * with data already bound by the backend.
 */
export function ChartCard({ spec }) {
  if (!spec || typeof spec !== "object") return null;

  return (
    <Box
      width="100%"
      minWidth={0}
      padding={{ base: "12px", md: "16px" }}
      borderRadius="12px"
      border="1px solid #E5E7EB"
      backgroundColor="#FFFFFF"
    >
      <VegaChart spec={spec} />
    </Box>
  );
}
