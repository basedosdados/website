import { Link as ChakraLink } from "@chakra-ui/react";

export default function Link({
  children,
  href,
  target,
  color = "#252A32",
  fontWeigth = "700",
  ...props
}) {
  return (
    <ChakraLink
      target={target}
      href={href}
      fontFamily="Lato"
      fontSize="14px"
      letterSpacing="0.5px"
      color={color}
      _hover={{ textDecoration: "none", opacity:"0.6" }}
      fontWeight={fontWeigth}
      {...props}
    >
      {children}
    </ChakraLink>
  );
}
