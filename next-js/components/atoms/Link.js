import { Link as ChakraLink } from "@chakra-ui/react";

export default function Link({
  children,
  href,
  target,
  color = "#ffffff",
  fontWeigth = "700",
  ...props
}) {
  return (
    <ChakraLink
      {...props}
      target={target}
      href={href}
      fontFamily="Lato"
      fontSize="16px"
      color={color}
      fontWeight={fontWeigth}
    >
      {children}
    </ChakraLink>
  );
}
