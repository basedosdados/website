import { Button } from "@chakra-ui/react";

export default function RoundedButton({
  onClick,
  children,
  colorScheme = "blue",
  backgroundColor = "#3AA1EB",
  _hover = {},
  ...style
}) {
  return (
    <Button
      border="0px"
      colorScheme={colorScheme}
      backgroundColor={backgroundColor}
      onClick={onClick}
      borderRadius="68.6364px"
      boxShadow="1px 1px 1px 1px rgba(64, 60, 67, 0.16)"
      letterSpacing="0.1em"
      _hover={{
        ..._hover,
        transform: "translateY(-3px);",
      }}
      {...style}
    >
      {children}
    </Button>
  );
}
