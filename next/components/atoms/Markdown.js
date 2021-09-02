import { Box } from "@chakra-ui/react";
import { useState } from "react";
import showdown from "showdown";

export function Markdown({ children }) {
  const [converter, _] = useState(new showdown.Converter());
  return (
    <Box
      fontFamily="Lato"
      lineHeight="24px"
      letterSpacing="0.1em"
      fontWeight="400"
      fontSize="14px"
      textAlign="left"
      className="markdown"
      dangerouslySetInnerHTML={{
        __html: converter.makeHtml(children),
      }}
    />
  );
}
