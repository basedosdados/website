import {Link as ChakraLink} from "@chakra-ui/react";

export default function Link({children, href, target, color="#ffffff", fontWeigth="500", ...props}){
    return(
        <ChakraLink {...props} href={href} fontFamily="Lato" fontSize="18px" color={color} fontWeight={fontWeigth}>{children}</ChakraLink>
    );
}