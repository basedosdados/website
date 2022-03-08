import { Heading } from "@chakra-ui/react";

export default function BigTitle({
  children,
  color = "#2B8C4D",
  fontWeigth = "500",
  letterSpacing = "0.5px",
  ...props
}) {
  return (
    <Heading
      fontFamily="Ubuntu"
      fontSize="32px"
      lineHeight="55px"
      letterSpacing={letterSpacing}
      color={color}
      fontWeight={fontWeigth}
      {...props}
    >
      {children}
    </Heading>
  );
}
