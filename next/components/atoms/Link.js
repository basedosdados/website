import { Text } from "@chakra-ui/react";
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

  const isExternalLink = (() => {
    try {
      const linkUrl = new URL(href, window.location.origin);
      return linkUrl.origin !== window.location.origin;
    } catch (error) {
      return false;
    }
  })();

  if (isExternalLink) {
    return (
      <Text
        as="a"
        href={href}
        target={target || "_blank"}
        rel="noopener noreferrer"
        display="flex"
        flexDirection="row"
        alignItems="center"
        fontFamily="Roboto"
        cursor="pointer"
        fontSize="14px"
        lineHeight="20px"
        fontWeight={fontWeight}
        color={color}
        {...props}
      >
        {children}
      </Text>
    );
  }

  return (
    <NextLink href={href || '#'} locale={locale} passHref legacyBehavior>
      <Text
        as="a"
        display="flex"
        flexDirection="row"
        alignItems="center"
        fontFamily="Roboto"
        cursor="pointer"
        fontSize="14px"
        lineHeight="20px"
        fontWeight={fontWeight}
        color={color}
        target={target}
        {...props}
      >
        {children}
      </Text>
    </NextLink>
  );
}
