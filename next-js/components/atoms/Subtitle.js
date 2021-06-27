import {Heading} from "@chakra-ui/react";

export default function Subtitle({children, color="#6F6F6F", fontWeigth="400", ...props}){
    return(<Heading fontFamily="Montserrat" fontSize="12px" color={color} fontWeight={fontWeigth} {...props}>{children}</Heading>);
}