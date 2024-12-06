import { Button } from "@chakra-ui/react";

export default function RoundedButton({
  onClick,
  children,
  backgroundColor = "#42B0FF",
  _hover = {},
  ...style
}) {
  return (
    <Button
      border="0px"
      backgroundColor={backgroundColor}
      _active={{backgroundColor:"none"}}
      onClick={onClick}
      fontFamily="Ubuntu"
      borderRadius="30px"
      boxShadow="0px 0.5px 0px 0px rgba(64, 60, 67, 0.16)"
      letterSpacing="0.5px"
      color="#FFF"
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
