import { useState, useEffect } from "react";
import { Heading } from "@chakra-ui/react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function Subtitle({
  children,
  color = "#252A32",
  fontWeigth = "400",
  ...props
}) {
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <Heading
      fontFamily="Ubuntu"
      fontSize={isMobileMod ? "16px" : "18px"}
      letterSpacing={isMobileMod ? "0.2px" : "0.1px"}
      color={color}
      fontWeight={fontWeigth}
      {...props}
    >
      {children}
    </Heading>
  );
}
