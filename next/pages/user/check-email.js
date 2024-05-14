import {
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

import Display from "../../components/atoms/Display";
import { isMobileMod } from "../../hooks/useCheckMobile.hook"
import { MainPageTemplate } from "../../components/templates/main";

import { EmailConfirmImage } from "../../public/img/emailImage";

export default function CheckEmail() {
  const [email, setEmail] = useState("")
  const [count, setCount] = useState(0)
  const [forwardingDisabled, setForwardingDisabled] = useState(false)

  useEffect(() => {
    const res = sessionStorage.getItem("registration_email_bd") || "" 
    if(res === "") return window.open("/", "_self")
    setEmail(res)
  }, [])

  useEffect(() => { 
    if(count > 0) {
      const time = setTimeout(() => {
        setCount(count - 1)
      }, 1000)
      return () => clearTimeout(time)
    } else {
      setForwardingDisabled(false)
    }
  }, [count])

  async function handleEmailConfirm() {
    if(email === "") return null
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

    const getIdUser = await fetch(`/api/user/getIdUser?p=${btoa(email)}`, {method: "GET"})
      .then(res => res.json())

    if(getIdUser.error) return

    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(getIdUser?.id)

    await axios.post(`${API_URL}/account/account_activate/${btoa(id)}/`)
    setForwardingDisabled(true)
    setCount(60)
  }

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
          fontweith="500"
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
            cursor={forwardingDisabled ? "default" : "pointer"}
            _hover={{opacity:forwardingDisabled ? 1 : 0.7}}
            pointerEvents={forwardingDisabled ? "none" : ""}
            textAlign="center"
            fontFamily="ubuntu"
            color={forwardingDisabled ? "#252A32" : "#42B0FF"}
            fontSize="16px"
            fontWeight="500"
            lineHeight="30px"
            letterSpacing="0.2px"
            onClick={() => handleEmailConfirm()}
          >{forwardingDisabled ? `Espere ${count} segundos...` :"Reenviar e-mail"}</Text>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}