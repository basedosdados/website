import {Heading} from "@chakra-ui/react";

export default function BigTitle({children, color="#3A761E", fontWeigth="700", letterSpacing="0.1em", ...props}){
    return(<Heading {...props} fontFamily="Lato" fontSize="42px" letterSpacing={letterSpacing} color={color} fontWeight={fontWeigth}>{children}</Heading>)
}