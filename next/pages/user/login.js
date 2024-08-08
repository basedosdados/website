import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import cookies from 'js-cookie';

import Display from "../../components/atoms/Display";
import Input from "../../components/atoms/SimpleInput";
import Button from "../../components/atoms/RoundedButton";
import ButtonSimple from "../../components/atoms/SimpleButton";
import SectionText from "../../components/atoms/SectionText";
import { isMobileMod } from "../../hooks/useCheckMobile.hook"
import { MainPageTemplate } from "../../components/templates/main";

import Exclamation from "../../public/img/icons/exclamationIcon";
import { EyeIcon, EyeOffIcon } from "../../public/img/icons/eyeIcon";

import { withPages } from "../../hooks/pages.hook";

export async function getStaticProps() {
  return await withPages()
}

export default function Login() {
  const router = useRouter()
  const { query } = router
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({ email: "", password: "", login: ""})
  const [showPassword, setShowPassword] = useState(true)

  const handleInputChange = (e, field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

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

  async function fetchToken({ email, password }) {
    const result = await fetch(`/api/user/getToken?a=${btoa(email)}&q=${btoa(password)}`, {method: "GET"})
      .then(res => res.json())
    if(result.error) {
      const hasActive = await fetch(`/api/user/getIdUser?p=${btoa(email)}`, {method: "GET"})
        .then(res => res.json())
      if(hasActive.isActive === false)  {
        const reg = new RegExp("(?<=:).*")
        const [ id ] = reg.exec(hasActive.id)

        sessionStorage.setItem('registration_email_bd', `${email}`)
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/account/account_activate/${btoa(id)}/`)
        return window.open("/user/check-email?e=1", "_self")
      }
      return setErrors({login:"E-mail ou senha incorretos."})
    }

    const userData = await fetch(`/api/user/getUser?p=${btoa(result.id)}`, {method: "GET"})
      .then(res => res.json())
    if(userData.error) return setErrors({login:"Não foi possível conectar ao servidor. Tente novamente mais tarde."}) 

    cookies.set('userBD', JSON.stringify(userData))

    if(query.p && query.i) {
      return window.open(`/user/${userData.username}?plans_and_payment&q=${query.q}&i=${query.i}`, "_self")
    }

    if(userData.availableForResearch === null) return window.open("/user/survey", "_self")
    return window.open("/", "_self")
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

  return (
    <MainPageTemplate
      display="flex"
      justifyContent="center"
      paddingTop="70px"
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

        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.email} marginBottom="24px !important">
            <LabelTextForm text="E-mail"/>
            <Input
              id="username"
              name="username"
              type="email"
              autoComplete="username"
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
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
              id="password"
              name="password"
              type={showPassword ? "password" : "text"}
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => handleInputChange(e, "password")}
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
            type="submit"
            width="100%"
            borderRadius="30px"
            marginBottom="24px !important"
            backgroundColor="#42B0FF"
          >
            Entrar
          </Button>
        </form>

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
