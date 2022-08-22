import { Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function BodyText({ 
  children, 
  color = "#252A32",
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
      fontFamily="ubuntu"
      fontSize={isMobileMod ? "17px" : "18px"}
      lineHeight={isMobileMod ? "27px" : "28px"}
      letterSpacing="0.1px"
      color={color}
      fontWeight={fontWeigth}
      {...props}
    >
      {children}
    </Text>
  );
}
