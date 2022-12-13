import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function BigTitle({
  children,
  color = "#252A32",
  fontWeight = "500",
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
      fontSize="28px"
      lineHeight="36px"
      letterSpacing="0"
      color={color}
      fontWeight={fontWeight}
      {...props}
    >
      {children}
    </Heading>
  );
}
