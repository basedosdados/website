import {
  Stack,
  Text,
  FormControl,
  FormLabel,
  Input
} from "@chakra-ui/react";
import { useState } from "react";

import Display from "../../components/atoms/Display";
import Link from "../../components/atoms/Link";
import Button from "../../components/atoms/RoundedButton";
import { isMobileMod } from "../../hooks/useCheckMobile.hook"
import { MainPageTemplate } from "../../components/templates/main";

import { EmailRecoveryImage } from "../../public/img/emailImage";

export default function PasswordRecovery() {
  const [email, setEmail] = useState("")

  return (
    <MainPageTemplate display="flex" justifyContent="center">
      <Stack
        display="flex"
        justifyContent="center"
        width="510px"
        height="100%"
        marginTop={isMobileMod() ? "150px" : "50px"}
        marginX="27px"
        spacing="40px"
        alignItems="center"
      >
        <EmailRecoveryImage justifyContent="center" marginBottom="8px"/>

        <Display
          fontSize={isMobileMod() ? "28px" : "34px"}
          lineHeight={isMobileMod() ? "16px" : "44px"}
          letterSpacing={isMobileMod() ? "0" : "-0.4px"}
          fontWeith="500"
          textAlign="center"
        >Redefina sua senha</Display>

        <Text
          textAlign="center"
          color= "#7D7D7D"
          fontFamily= "Ubuntu"
          fontSize= "16px"
          fontWeight= "400"
          lineHeight= "24px"
          letterSpacing= "0.2px"
        >
          Insira o endereço de e-mail que você usou para cadastrar sua conta. Enviaremos as instruções para você redefinir sua senha.
        </Text>

        <FormControl
          fontFamily="ubuntu"
          color="#252A32"
          fontSize="16px"
          fontWeight="400"
          lineHeight="16px"
          letterSpacing="0.2px"
        >
          <FormLabel fontWeight="400">E-mail</FormLabel>
          <Input
            type="email"
            placeholder="Insira seu e-mail"
            _placeholder={{color: "#A3A3A3"}}
            _focus={{border:"2px solid #42B0FF !important" }}
            _hover={{border:"2px solid #42B0FF !important" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            padding="8px 12px 8px 16px"
            borderRadius="16px"
            fontSize="14px"
            lineHeight="27px"
            letterSpacing="0.3px"
            border="1px solid #DEDFE0 !important"
          />
        </FormControl>

        <Button
          onClick={() => console.log("evento")}
          borderRadius="30px"
          width="fit-content"
        >
          Enviar e-mail de redefinição
        </Button>

        <Text
          textAlign="center"
          color= "#252A32"
          fontFamily= "Ubuntu"
          fontSize= "14px"
          fontWeight= "400"
          lineHeight= "27px"
          letterSpacing= "0.3px"
        >
          Se ainda precisar de ajuda, <Link fontFamily="ubuntu" color="#42B0FF" href="/contato">entre em contato</Link>.
        </Text>
      </Stack>
    </MainPageTemplate>
  )
}