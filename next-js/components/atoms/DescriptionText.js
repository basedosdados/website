import {Text} from "@chakra-ui/react";

export default function DescriptionText({children}){
    return(
        <Text fontSize="14px" fontFamily="Montserrat" lineHeight="20px">
            {children}
        </Text>
    )
}