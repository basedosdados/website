import { Heading } from "@chakra-ui/react";

export default function BigTitle({
  children,
  color = "#2B8C4D",
  fontWeigth = "700",
  letterSpacing = "0.1em",
  ...props
}) {
  return (
    <Heading
      fontFamily="Ubuntu"
      fontSize="42px"
      letterSpacing={letterSpacing}
      color={color}
      fontWeight={fontWeigth}
      {...props}
    >
      {children}
    </Heading>
  );
}
