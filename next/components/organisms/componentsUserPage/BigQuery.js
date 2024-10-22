import {
  Stack,
  Box,
  Text,
  FormControl,
  FormErrorMessage,
  Spinner
} from "@chakra-ui/react";
import { useState } from "react";
import cookies from 'js-cookie';
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";
import RoundedButton from "../../atoms/RoundedButton";
import InputForm from "../../atoms/SimpleInput";
import { triggerGAEvent } from "../../../utils";

import Exclamation from "../../../public/img/icons/exclamationIcon";

export default function BigQuery ({ userInfo }) {
  const [emailGcp, setEmailGcp] = useState(userInfo?.gcpEmail || userInfo?.email)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpdateEmailGcp() {
    setErrors({})
    setIsLoading(true)

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    if(!isValidEmail(emailGcp)) { 
      setErrors({emailGcp: "Por favor, insira um e-mail válido."})
    } else {
      const reg = new RegExp("(?<=:).*")
      const [ id ] = reg.exec(userInfo.id)

      let user
      let attempts = 0
      const maxAttempts = 10
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

      const response = await fetch(`/api/user/changeUserGcpEmail?p=${btoa(emailGcp)}`)
        .then(res => res.json())
      
      if(response.ok) {
        if(emailGcp !== userInfo?.email) {
          if(emailGcp !== userInfo?.gcpEmail) {
            triggerGAEvent("troca_do_email_gcp",`section_bigquery`)
          }
        }

        while (!user?.gcpEmail && attempts < maxAttempts) {
          user = await fetch(`/api/user/getUser?p=${btoa(id)}`, { method: "GET" })
            .then((res) => res.json())
  
          if (user?.gcpEmail) {
            cookies.set("userBD", JSON.stringify(user))
            break
          }
  
          attempts++
          await delay(10000)
        }
      } else {
        setErrors({emailGcp: "Por favor, insira um e-mail válido."})
      }
    }
    setIsLoading(false)
  }

  return (
    <Stack>
      <Box display={isLoading ? "flex" : "none"} position="fixed" top="0" left="0" width="100%" height="100%" zIndex="99999"/>

      <Text
        fontFamily="Ubuntu"
        fontWeight="400"
        fontSize="16px"
        lineHeight="22px"
        letterSpacing="0.2px"
        color="#252A32"
      >
        E-mail de acesso ao BigQuery
      </Text>

      <Text
        fontFamily="Ubuntu"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
        letterSpacing="0.3px"
        color="#7D7D7D"
      >
        O seu e-mail precisa ser uma <Text as="span" fontWeight="500">Conta Google</Text> para garantir acesso exclusivo aos dados pelo BigQuery.
      </Text>

      <FormControl isInvalid={!!errors.emailGcp} margin="16px 0 24px !important">
        <InputForm
          id="emailgcp"
          name="emailgcp"
          value={emailGcp}
          onChange={(e) => setEmailGcp(e.target.value)}
          placeholder="Insira o e-mail que deseja utilizar para acessar o BigQuery"
          fontFamily="ubuntu"
          
          maxWidth="480px"
          height="40px"
          fontSize="14px"
          borderRadius="16px"
          _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
        />
        <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
          <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.emailGcp}
        </FormErrorMessage>
      </FormControl>

      <RoundedButton
        borderRadius="30px"
        width={isMobileMod() ? "100%" : "fit-content"}
        _hover={{transform: "none", opacity: 0.8}}
        marginTop="0 !important"
        onClick={() => handleUpdateEmailGcp()}
        isDisabled={isLoading}
      >
        {isLoading ?
          <Spinner />
        :
          "Atualizar e-mail"
        }
      </RoundedButton>
    </Stack>
  )
}
