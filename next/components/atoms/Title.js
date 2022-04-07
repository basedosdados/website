import { Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function Title({
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
      fontSize="18px"
      lineHeight="22px"
      fontWeigth="700"
      letterSpacing="0.2px"
      color={color}
      {...style}
    >
      {children}
    </Heading>
  );
}
