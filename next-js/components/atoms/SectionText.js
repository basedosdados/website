import {Text} from "@chakra-ui/react";

export default function SectionText({children, color="#6E6E6E", ...props}){
    return(<Text fontFamily="Lato" fontWeight="400" lineHeight="24px" letterSpacing="0.1em" color={color} {...props}>{children}</Text>)
}