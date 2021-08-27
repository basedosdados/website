import { Link } from "@chakra-ui/react";

export function LinkDash({ children, href }) {
  return (
    <Link
      color="#3AA1EB"
      href={href}
      textDecoration="underline"
      target="_blank"
      letterSpacing="0.1em"
      fontFamily="Lato"
      fontSize="15px"
    >
      {children} {">"} {">"}
    </Link>
  );
}
