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
      fontSize={isMobileMod ? "28px" : "34px"}
      lineHeight={isMobileMod ? "34px" : "44px"}
      letterSpacing={isMobileMod ? "0" : "-0.5px"}
      fontWeight="500"
      color={color}
      {...props}
    >
      {children}
    </Heading>
  );
}
