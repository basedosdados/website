import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from 'next/link';
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import { useRouter } from 'next/router';

export default function SectionLink({
  children,
  href,
  target,
  ...props
}) {
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();
  const { locale } = useRouter();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <NextLink href={href} locale={locale} passHref legacyBehavior>
      <ChakraLink
        width="fit-content"
        target={target}
        fontFamily="Ubuntu"
        fontSize={isMobileMod ? "12px" : "15px"}
        letterSpacing={isMobileMod ? "0.2px" : "0.1px"}
        fontWeight="700"
        color="#42B0FF"
        _hover={{ textDecoration: "none", opacity:"0.6" }}
        paddingBottom="4px"
        borderBottom="1px solid #42B0FF"
        {...props}
      >
        {children}
      </ChakraLink>
    </NextLink>
  );
}
