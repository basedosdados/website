import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function Display({
  children,
  color = "#252A32",
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
      fontSize={isMobileMod ? "32px" : "38px"}
      lineHeight={isMobileMod ? "40px" : "64px"}
      letterSpacing={isMobileMod ? "0.2px" : "-0.2px"}
      fontWeight="500"
      color={color}
      {...props}
    >
      {children}
    </Heading>
  );
}
