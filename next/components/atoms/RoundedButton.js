import { Button } from "@chakra-ui/react";

export default function RoundedButton({
  onClick,
  children,
  colorScheme = "blue",
  backgroundColor = "#3AA1EB",
  ...style
}) {
  return (
    <Button
      border="0px"
      colorScheme={colorScheme}
      backgroundColor={backgroundColor}
      onClick={onClick}
      borderRadius="18px"
      boxShadow="0 2px 5px 1px rgba(64, 60, 67, 0.16)"
      letterSpacing="0.1em"
      {...style}
    >
      {children}
    </Button>
  );
}
