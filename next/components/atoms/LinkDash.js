import { Link } from "@chakra-ui/react";

export function LinkDash({ children, href, dash = true, ...style }) {
  return (
    <Link
      color="#3AA1EB"
      href={href}
      textDecoration="none"
      _hover={{ textDecoration: "none", opacity:"0.6" }}
      target="_blank"
      margin="0 !important"
      letterSpacing="0.5px"
      fontFamily="Lato"
      fontSize="15px"
      {...style}
    >
      {children} {dash ? "..." : null}
    </Link>
  );
}
