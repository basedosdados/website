import {
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

import Display from "../../components/atoms/Display";
import { isMobileMod } from "../../hooks/useCheckMobile.hook"
import { MainPageTemplate } from "../../components/templates/main";

import { EmailConfirmImage } from "../../public/img/emailImage";

export default function CheckEmail() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    setEmail(localStorage.getItem("registration_email_bd") || "")
  }, [])

  return (
    <MainPageTemplate display="flex" justifyContent="center" cleanTemplate>
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
        <EmailConfirmImage justifyContent="center" marginBottom="8px"/>

        <Display
          fontSize={isMobileMod() ? "28px" : "34px"}
          lineHeight={isMobileMod() ? "36px" : "44px"}
          letterSpacing={isMobileMod() ? "0" : "-0.4px"}
          fontWeith="500"
          textAlign="center"
        >Confirme seu endereço de e-mail</Display>

        <Stack spacing="16px">
          <Text
            textAlign="center"
            color= "#7D7D7D"
            fontFamily= "Ubuntu"
            fontSize= "16px"
            fontWeight= "400"
            lineHeight= "16px"
            letterSpacing= "0.2px"
          >
            Enviamos uma confirmação de e-mail para
          </Text>

          <Text
            textAlign="center"
            color= "#252A32"
            fontFamily= "Ubuntu"
            fontSize= "16px"
            fontWeight= "500"
            lineHeight= "16px"
            letterSpacing= "0.2px"
          >
            {email}
          </Text>
        </Stack>

        <Stack spacing="8px">
          <Text
            textAlign="center"
            color= "#7D7D7D"
            fontFamily= "Ubuntu"
            fontSize= "16px"
            fontWeight= "400"
            lineHeight= "24px"
            letterSpacing= "0.2px"
          >
            Confira sua caixa de entrada e siga as instruções enviadas no e-mail para completar o cadastro.
          </Text>

          <Text
            cursor="pointer"
            _hover={{opacity:0.7}}
            textAlign="center"
            fontFamily="ubuntu"
            color="#42B0FF"
            fontSize="16px"
            fontWeight="500"
            lineHeight="30px"
            letterSpacing="0.2px"
          >Reenviar e-mail</Text>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}