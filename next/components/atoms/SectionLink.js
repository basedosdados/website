import { Link as ChakraLink } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

export default function Link({
  children,
  href,
  target,
  ...props
  
}) {

  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <ChakraLink
      target={target}
      href={href}
      fontFamily="Ubuntu"
      fontSize={isMobileMod ? "12px" : "15px"}
      letterSpacing={isMobileMod ? "0.2px" : "0.1px"}
      fontWeight="700"
      color="#42B0FF"
      _hover={{ textDecoration: "none", opacity:"0.6" }}
      position="absolute"
      top="10px"
      left="0"
      paddingBottom="4px"
      borderBottom="1px solid #42B0FF"
      {...props}
    >
      {children}
    </ChakraLink>
  );
}
