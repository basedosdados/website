import { Link } from "@chakra-ui/react";

export default function SimpleButton({ onClick, children, isActive, ...props }) {
  return (
    <Link
      display="flex"
      onClick={onClick}
      color={isActive ? "#42B0FF" : "#252A32"}
      width="100%"
      fontFamily="Ubuntu"
      fontWeight="500"
      fontSize="16px"
      letterSpacing="0.2px"
      outline="none"
      _hover={{
        color: "#42B0FF",
        outline:"none",
        textDecoration: "none"
      }}
      _focus={{
        outline:"none",
        textDecoration: "none"
      }}
      {...props}
    >
      {children}
    </Link>
  )
}
