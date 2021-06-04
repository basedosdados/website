import {Heading} from "@chakra-ui/react";

export default function Title({children, color="#3A761E", fontWeigth="700"}){
    return(<Heading fontFamily="Montserrat" fontSize="22px" color={color} fontWeight={fontWeigth}>{children}</Heading>);
}