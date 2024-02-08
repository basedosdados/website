import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import cookies from 'js-cookie';

import {
  getToken,
  getUser
} from "../api/user";

import Display from "../../components/atoms/Display";
import Input from "../../components/atoms/SimpleInput";
import Button from "../../components/atoms/RoundedButton";
import ButtonSimple from "../../components/atoms/SimpleButton";
import SectionText from "../../components/atoms/SectionText";
import { isMobileMod } from "../../hooks/useCheckMobile.hook"
import { MainPageTemplate } from "../../components/templates/main";

import Exclamation from "../../public/img/icons/exclamationIcon";
import { EyeIcon, EyeOffIcon } from "../../public/img/icons/eyeIcon";

export default function Login() {
  const router = useRouter()
  const { query } = router
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({ email: "", password: "", login: ""})
  const [showPassword, setShowPassword] = useState(true)

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = () => {
    let validationErrors = {}
    if (!formData.email) {
      validationErrors.email = "Por favor, insira um endereço de e-mail válido."
    } else if (!/^\S+@\S+$/.test(formData.email)) {
      validationErrors.email = "Por favor, insira um endereço de e-mail válido."
    }
    if (!formData.password) validationErrors.password = "Por favor, insira a senha."
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      fetchToken(formData)
    }
  }

  const fetchToken = async ({ email, password }) => {
    const result = await getToken({email: email, password: password})

    if(result?.tokenAuth === null || result?.errors?.length > 0) return setErrors({login:"E-mail ou senha incorretos."}) 

    try {
      const userData = await getUser(result.tokenAuth.payload.email)
      cookies.set('userBD', JSON.stringify(userData))
      if(query.p === "plans") return window.open(`/user/${userData.username}?plans_and_payment`, "_self")
      window.open("/", "_self")
    } catch (error) {
      console.error(error)
    }
  }

  const LabelTextForm = ({ text, ...props }) => {
    return (
      <FormLabel
        color="#252A32"
        fontFamily="ubuntu"
        letterSpacing="0.2px"
        fontSize="16px"
        fontWeight="400"
        lineHeight="16px"
        {...props}
      >{text}</FormLabel>
    )
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <MainPageTemplate
      display="flex"
      justifyContent="center"
      paddingTop="72px"
      cleanTemplate
    >
      <Stack
        display="flex"
        justifyContent="center"
        width="320px"
        height="100%"
        marginTop="50px"
        marginX="27px"
        spacing={0}
      >
        <Display
          fontSize={isMobileMod() ? "34px" : "60px"}
          lineHeight={isMobileMod() ? "44px" : "72px"}
          letterSpacing={isMobileMod() ? "-0.4px" : "-1.5px"}
          marginBottom="40px"
          textAlign="center"
        >Faça login</Display>

        {errors.login && 
          <Box
            display="flex"
            flexDirection="row"
            gap="8px"
            alignItems="center"
            fontSize="12px"
            fontFamily="ubuntu"
            marginBottom="24px !important"
            color="#D93B3B"
          >
            <Exclamation fill="#D93B3B"/>
            {errors.login}
          </Box>
        }

        <FormControl isInvalid={!!errors.email} marginBottom="24px !important">
          <LabelTextForm text="E-mail"/>
          <Input
            id="username"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Insira seu e-mail"
            fontFamily="ubuntu"
            height="40px"
            fontSize="14px"
            borderRadius="16px"
            _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
          />
          <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
            <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.email}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password} marginBottom="24px !important">
          <Box
            display="flex"
            flexDirection="row"
            width="100%"
            marginBottom="8px"
          >
            <LabelTextForm text="Senha" margin="0 !important"/>
            <ButtonSimple
              position="relative"
              top="-2px"
              width="fit-content"
              marginLeft="auto !important"
              fontWeight="700"
              color="#42B0FF"
              letterSpacing="0.3px"
              fontSize="14px"
              justifyContent="end"
              _hover={{opacity: "0.6"}}
              onClick={() => window.open("./password-recovery", "_self")}
            >Esqueceu a senha?
            </ButtonSimple>
          </Box>

          <Input
            type={showPassword ? "password" : "text"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Insira sua senha"
            fontFamily="ubuntu"
            height="40px"
            fontSize="14px"
            borderRadius="16px"
            _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
            styleElmRight={{
              width: "50px",
              height: "40px",
              cursor: "pointer",
              onClick: () => setShowPassword(!showPassword)
            }}
            elmRight={showPassword ?
              <EyeOffIcon
                alt="esconder senha"
                width="20px"
                height="20px"
                fill="#D0D0D0"
              />
            :
              <EyeIcon
                alt="exibir senhar"
                width="20px"
                height="20px"
                fill="#D0D0D0"
              />
            }
          />
          <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
            <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.password}
          </FormErrorMessage>
        </FormControl>

        <Button
          onClick={() => handleSubmit()}
          borderRadius="30px"
          marginBottom="24px !important"
          backgroundColor="#42B0FF"
        >
          Entrar
        </Button>

        <SectionText
          width="100%"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          fontWeight="500"
          fontSize="14px"
          fontFamily="ubuntu"
        >
          Não tem uma conta?
          <ButtonSimple
            width="none"
            fontSize="14px"
            justifyContent="start"
            fontWeight="700"
            color="#42B0FF"
            _hover={{opacity: "0.6"}}
            marginLeft="2px"
            onClick={() => window.open("./register", "_self")}
          >{" "}Cadastre-se
          </ButtonSimple>.
        </SectionText>
      </Stack>
    </MainPageTemplate>
  )
}
