import { Heading } from "@chakra-ui/react";

export default function Display({
  children,
  color = "#252A32",
  ...props
}) {

  return (
    <Heading
      fontFamily="Ubuntu"
      fontSize={{ base: "28px", md: "34px" }}
      lineHeight={{base: "36px", md: "44px"}}
      letterSpacing={{base: "0", md: "-0.5px"}}
      fontWeight="500"
      color={color}
      {...props}
    >
      {children}
    </Heading>
  )
}
