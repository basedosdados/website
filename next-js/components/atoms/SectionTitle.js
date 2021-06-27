import {Heading} from "@chakra-ui/react";

export default function SectionTitle({children, color="#000000", fontWeigth="500", ...props}){
    return(<Heading fontFamily="Lato" fontSize="32px" letterSpacing="0.1e" color={color} fontWeight={fontWeigth} {...props}>{children}</Heading>)
}