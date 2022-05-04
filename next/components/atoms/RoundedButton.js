import { Button } from "@chakra-ui/react";

export default function RoundedButton({
  onClick,
  children,
  colorScheme = "blue",
  backgroundColor = "#42B0FF",
  _hover = {},
  ...style
}) {
  return (
    <Button
      border="0px"
      colorScheme={colorScheme}
      backgroundColor={backgroundColor}
      onClick={onClick}
      fontFamily="Ubuntu"
      borderRadius="68.6364px"
      boxShadow="0px 1px 0px 0px rgba(64, 60, 67, 0.16)"
      letterSpacing="0.5px"
      _hover={{
        transform: "translateY(-3px)",
        ..._hover,
      }}
      {...style}
    >
      {children}
    </Button>
  );
}
