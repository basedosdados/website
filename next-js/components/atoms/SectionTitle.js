import {Heading} from "@chakra-ui/react";

export default function SectionTitle({children, color="#000000", fontWeigth="500"}){
    return(<Heading fontFamily="Lato" fontSize="36px" letterSpacing="0.1e" color={color} fontWeight={fontWeigth}>{children}</Heading>)
}