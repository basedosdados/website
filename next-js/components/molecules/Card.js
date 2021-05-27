import {Center, Box, VStack} from "@chakra-ui/react";

export function Card({children, tabColor="#E5E5E5", icon, iconBoxColor="#E5E5E5", spacing=5, padding="60px 30px 30px 30px"}){
    return(
        <Box cursor="pointer" width="390px" borderRadius="10px" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)" backgroundColor={tabColor} paddingTop="18px">
            <VStack alignItems="flex-start" spacing={spacing} backgroundColor="#FFFFFF" padding={padding} borderRadius="10px" position="relative">
                {icon ? <Center padding="10px" paddingTop="0px" maxWidth="60px" backgroundColor={iconBoxColor} borderBottomRightRadius="10px" borderBottomLeftRadius="10px" position="absolute" right="35px" top="0px">
                    {icon}
                </Center> : <></>}
                {children}
            </VStack>
        </Box>
    )
}