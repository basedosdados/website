import { Button, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { SimpleTable } from "../atoms/SimpleTable";

export function ExpandableTable({ headers, values, containerStyle }) {
  const [expanded, setExpanded] = useState(false);

  if (values.length <= 5)
    return (
      <SimpleTable
        headers={headers}
        values={values}
        containerStyle={containerStyle}
      />
    );

  return (
    <VStack width="100%" spacing={5}>
      <SimpleTable
        headers={headers}
        values={expanded ? values : values.slice(0, Math.min(5, values.length))}
        containerStyle={containerStyle}
      />
      <Button
        minHeight="40px"
        maxHeight="40px"
        width="100%"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Ver menos" : "Ver mais"}
      </Button>
    </VStack>
  );
}
