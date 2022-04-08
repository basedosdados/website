import { Box, VStack } from "@chakra-ui/react";
import { useState } from "react";
import showdown from "showdown";
import { LinkDash } from "./LinkDash";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export function Markdown({
  children,
  limit = false,
  onLimitToggle = () => {},
  styleText ={},
  ...style
}) {

  const [isLimited, setIsLimited] = useState(true);
  const [converter, _] = useState(new showdown.Converter());
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <VStack {...style} align="flex-start">
      <Box
        fontFamily="Lato"
        fontSize={isMobileMod ? "14px" : "16px"}
        fontWeight="300"
        lineHeight="24px"
        letterSpacing="0.5px"
        color="#252A32"
        textAlign="left"
        className="markdown"
        style={styleText}
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
        <LinkDash onClick={() => setIsLimited(!isLimited)}>
          Ler {isLimited ? "mais" : "menos"}
        </LinkDash>
      ) : (
        <></>
      )}
    </VStack>
  );
}
