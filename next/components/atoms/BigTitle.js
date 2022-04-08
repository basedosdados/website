import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function BigTitle({
  children,
  color = "#252A32",
  fontWeigth = "500",
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
      fontSize={isMobileMod ? "20px" : "28px"}
      lineHeight={isMobileMod ? "24px" : "40px"}
      letterSpacing={isMobileMod ? "0.2px" : "0.1px"}
      color={color}
      fontWeight={fontWeigth}
      {...props}
    >
      {children}
    </Heading>
  );
}
