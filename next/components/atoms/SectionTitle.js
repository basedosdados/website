import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function SectionTitle({
  children,
  color = "#252A32",
  ...style
}) {

  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <Heading
      fontFamily="Ubuntu"
      fontWeight="400"
      lineHeight="40px"
      fontSize={isMobileMod ? "20px" : "24px"}
      letterSpacing={isMobileMod ? "0.2px" : "0px"}
      color={color}
      {...style}
    >
      {children}
    </Heading>
  );
}
