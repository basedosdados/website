import { useState, useEffect } from "react";
import { Heading } from "@chakra-ui/react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function Subtitle({
  children,
  color = "#252A32",
  fontWeight = "400",
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
      fontSize={{base: "16px", md: "18px"}}
      letterSpacing={{base: "0.2px", md: "0.1px"}}
      color={color}
      fontWeight={fontWeight}
      {...props}
    >
      {children}
    </Heading>
  );
}
