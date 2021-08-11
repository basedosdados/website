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
      {...props}
      target={target}
      href={href}
      fontFamily="Lato"
      fontSize="15px"
      letterSpacing="0.15em"
      color={color}
      fontWeight={fontWeigth}
    >
      {children}
    </ChakraLink>
  );
}
