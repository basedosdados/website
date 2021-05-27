import {Center, Image} from "@chakra-ui/react";

export function Card({children, tabColor="#E5E5E5", icon, iconBoxColor="transparent"}){
    <Box borderRadius="10px" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" backgroundColor={tabColor} paddingTop="18px">
        <Box padding="102px 40px 40px 40px" borderRadius="10px" position="relative">
            <Center backgroundColor={iconBoxColor} borderBottomRightRadius="10px" borderBottomLeftRadius="10px" position="absolute" right="35px" top="0px">
                {icon}
            </Center>
            {children}
        </Box>
    </Box>
}