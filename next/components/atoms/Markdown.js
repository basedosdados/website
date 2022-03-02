import { Box, VStack } from "@chakra-ui/react";
import { useState } from "react";
import showdown from "showdown";
import { LinkDash } from "./LinkDash";

export function Markdown({
  children,
  limit = false,
  onLimitToggle = () => {},
  ...style
}) {
  const [isLimited, setIsLimited] = useState(true);
  const [converter, _] = useState(new showdown.Converter());
  return (
    <VStack {...style} align="flex-start">
      <Box
        fontFamily="Lato"
        lineHeight="24px"
        letterSpacing="1px"
        fontWeight="400"
        fontSize="14px"
        textAlign="left"
        className="markdown"
        dangerouslySetInnerHTML={{
          __html: converter.makeHtml(children),
        }}
        {...(limit && isLimited
          ? {
              overflow: "hidden",
              textOverflow: "ellipsis",
              h: "50px",
              w: "100%",
              display: "block",
            }
          : {})}
      />
      {limit ? (
        <LinkDash fontSize="14px" onClick={() => setIsLimited(!isLimited)}>
          Ler {isLimited ? "mais" : "menos"}
        </LinkDash>
      ) : (
        <></>
      )}
    </VStack>
  );
}
