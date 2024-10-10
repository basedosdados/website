import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from 'next/link';
import { useRouter } from 'next/router';

export default function Link({
  children,
  href,
  target,
  color = "#252A32",
  fontWeight = "700",
  ...props
}) {
  const { locale } = useRouter();

  return (
    <NextLink href={href || '#'} locale={locale} passHref legacyBehavior>
      <ChakraLink
        target={target}
        fontFamily="Lato"
        fontSize="14px"
        letterSpacing="0.5px"
        color={color}
        _hover={{ textDecoration: "none", opacity:"0.6" }}
        fontWeight={fontWeight}
        {...(href ? {} : { as: 'span' })}
        {...props}
      >
        {children}
      </ChakraLink>
    </NextLink>
  );
}
