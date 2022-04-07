import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function SectionText({ 
  children, 
  color = "#252A32",
  fontSize="14px",
  fontWeigth = "300",
  ...props
}) {

  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <Text
      fontFamily="Lato"
      lineHeight="24px"
      letterSpacing="0.5px"
      color={color}
      fontSize={fontSize}
      fontWeight={fontWeigth}
      {...props}
    >
      {children}
    </Text>
  );
}
