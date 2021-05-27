import {Box, HStack, Image} from "@chakra-ui/react";
import ControlledInput from "../atoms/ControlledInput";
import RoundedButton from "../atoms/RoundedButton";
import Link from "../atoms/Link";

export default function Menu(){
    return(
        <Box padding="30px 60px" position="absolute" top="0px" width="100%" as="nav">
            <HStack spacing={10}>
                <Image flex="2" maxWidth="155px" src="/img/logo.png"/>
                <HStack flex="3" spacing={10}>
                    <Link>Dados</Link>
                    <Link>Comunidade</Link>
                    <Link>Sobre</Link>
                    <Link>Contato</Link>
                    <Link>APOIE</Link>
                </HStack>
                <ControlledInput inputBackgroundColor="#6CA850" rightIcon={<Image src="/img/icon_search.png"/>}/>
                <Link>Entrar</Link>
                <RoundedButton>Cadastrar</RoundedButton>
            </HStack>
        </Box>
    )
}