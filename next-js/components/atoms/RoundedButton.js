import {Button} from "@chakra-ui/react";

export default function RoundedButton({onClick, children, colorScheme="blue", backgroundColor="#3AA1EB"}){
    return (
        <Button border="0px" colorScheme={colorScheme} backgroundColor={backgroundColor} onClick={onClick} borderRadius="20px" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)">
            {children}
        </Button>
    );
}