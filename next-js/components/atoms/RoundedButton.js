import {Button} from "@chakra-ui/react";

export default function RoundedButton({onClick, children, backgroundColor="#3AA1EB", color="#ffffff"}){
    return (
        <Button border="0px" color={color} onClick={onClick} backgroundColor={backgroundColor} borderRadius="20px" boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)">
            {children}
        </Button>
    );
}