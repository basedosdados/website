import {
  Stack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  UnorderedList,
  ListItem
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import InputForm from "../../components/atoms/SimpleInput";

import Display from "../../components/atoms/Display";
import Link from "../../components/atoms/Link";
import Button from "../../components/atoms/RoundedButton";
import { isMobileMod } from "../../hooks/useCheckMobile.hook"
import { MainPageTemplate } from "../../components/templates/main";

import { EmailRecoveryImage } from "../../public/img/emailImage";
import Exclamation from "../../public/img/icons/exclamationIcon";
import { EyeIcon, EyeOffIcon } from "../../public/img/icons/eyeIcon";

export async function getServerSideProps(context) {
  const { query } = context
  let confirmed = false

  if(query.q !== undefined && query.p !== undefined) confirmed = true

  let uid = query?.q || ""
  let confirmToken = query?.p || ""

  return {
    props: {
      confirmed,
      uid,
      confirmToken
    }
  }
}

export default function PasswordRecovery({ confirmed, uid, confirmToken }) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [count, setCount] = useState(0)
  const [forwardingDisabled, setForwardingDisabled] = useState(false)

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(true)
  const [showConfirmPassword, setShowConfirmPassword] = useState(true)

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

  async function handleEmailPasswordRecovery(value) {
    if(value === "") return null

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!regexEmail.test(value)) return setError("Endereço de e-mail inválido.")

    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

    const getIdUser = await fetch(`/api/user/getIdUser?p=${btoa(value)}`, {method: "GET"})
      .then(res => res.json())

    if(getIdUser.error) return setError("Endereço de e-mail inválido.")

    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(getIdUser?.id)

    try {
      await axios.post(`${API_URL}/account/password_reset/${btoa(id)}/`)
      setError("")
      setForwardingDisabled(true)
      setCount(60)
    } catch (error) {
      console.error(error)
    }
  }

  const handleInputChange = (e, field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }))
  }

  const handleSpaceKey = (e) => {
    if(e.key === " ") { e.preventDefault() }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    let regexPassword = {}
    let validationErrors = {}

    if(!/^.{8,}$/.test(formData.password)) {
      regexPassword = {...regexPassword, amount: true}
    }
    if(!/[A-Z]/.test(formData.password)) {
      regexPassword = {...regexPassword, upperCase: true}
    }
    if(!/[a-z]/.test(formData.password)) {
      regexPassword = {...regexPassword, lowerCase: true}
    }
    if(!/(?=.*?[0-9])/.test(formData.password)) {
      regexPassword = {...regexPassword, number: true}
    }
    if(!/[!@#?!%&*]/.test(formData.password)) {
      regexPassword = {...regexPassword, special: true}
    }
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Confirmar a senha é necessário"
    }
    if(/\s/.test(formData.confirmPassword)) {
      validationErrors.password = "As senhas inseridas não podem conter espaçamentos."
      validationErrors.confirmPassword = "As senhas inseridas não podem conter espaçamentos."
    }
    if(formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = "A senha inserida não coincide com a senha criada no campo acima. Por favor, verifique se não há erros de digitação e tente novamente."
    }

    if(Object.keys(regexPassword).length > 0) validationErrors.regexPassword = regexPassword

    if(formData.password === "") {
      validationErrors.password = "Por favor, insira a senha."
    }

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return null

    const API_URL= `${process.env.NEXT_PUBLIC_API_URL}`

    const options = {
      method: "POST",
      url: `${API_URL}/account/password_reset_confirm/${uid}/${confirmToken}/`,
      data: {"password":`${formData.password}`}
    }

    try {
      const res = await axios.request(options)
      if(res.status === 200) return window.open("/user/login", "_self")
    } catch (error) {
      window.open("/user/password-recovery", "_self")
    }
  }

  function LabelTextForm ({ text, ...props }) {
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

  if(confirmed) return (
    <MainPageTemplate
      display="flex"
      justifyContent="center"
      paddingTop="70px"
      cleanTemplate
    >
      <Stack
        display="flex"
        justifyContent="center"
        width="510px"
        height="100%"
        marginTop="50px"
        marginX="27px"
        spacing="40px"
        alignItems="center"
      >
        <EmailRecoveryImage justifyContent="center" marginBottom="8px"/>

        <Display
          fontSize={isMobileMod() ? "28px" : "34px"}
          lineHeight={isMobileMod() ? "16px" : "44px"}
          letterSpacing={isMobileMod() ? "0" : "-0.4px"}
          fontweith="500"
          textAlign="center"
        >Redefina sua nova senha</Display>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%"
          }}
          onSubmit={handleSubmit}
        >
          <FormControl isInvalid={!!errors.password || !!errors.regexPassword}>
            <LabelTextForm text="Nova Senha" />
            <InputForm
              type={showPassword ? "password" : "text"}
              id="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => handleInputChange(e, "password")}
              placeholder="Crie uma nova senha"
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
            <Text 
              margin="8px 0"
              color= { errors?.regexPassword ? Object.keys(errors?.regexPassword).length > 0 ? "#D93B3B" : "#7D7D7D" : "#7D7D7D" }
              fontFamily= "Ubuntu"
              fontSize= "12px"
              fontWeight= "400"
              lineHeight= "16px"
              letterSpacing= "0.3px"
              display="flex"
              flexDirection="row"
              gap="4px"
              alignItems="flex-start"
            ><Exclamation width="14px" height="14px" fill="#D93B3B" display={ errors?.regexPassword ? Object.keys(errors?.regexPassword).length > 0 ? "flex" : "none" : "none"}/> Certifique-se que a senha tenha no mínimo:</Text>
            <UnorderedList fontSize="12px" fontFamily="Ubuntu" position="relative" left="2px">
              <ListItem fontSize="12px" color={errors?.regexPassword?.amount ? "#D93B3B" :"#7D7D7D"}>8 caracteres</ListItem>
              <ListItem fontSize="12px" color={errors?.regexPassword?.upperCase ? "#D93B3B" :"#7D7D7D"}>Uma letra maiúscula</ListItem>
              <ListItem fontSize="12px" color={errors?.regexPassword?.lowerCase ? "#D93B3B" :"#7D7D7D"}>Uma letra minúscula</ListItem>
              <ListItem fontSize="12px" color={errors?.regexPassword?.number ? "#D93B3B" :"#7D7D7D"}>Um dígito</ListItem>
              <ListItem fontSize="12px" color={errors?.regexPassword?.special ? "#D93B3B" :"#7D7D7D"}>Um caractere especial, dentre ! @ # ? ! % & *</ListItem>
            </UnorderedList>
            {errors.password &&
              <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
                <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.password}
              </FormErrorMessage>
            }
          </FormControl>

          <FormControl marginTop="40px" isInvalid={!!errors.confirmPassword}>
            <LabelTextForm text="Confirme a nova senha" />
            <InputForm
              type={showConfirmPassword ? "password" : "text"}
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange(e, "confirmPassword")}
              placeholder="Insira a senha novamente"
              fontFamily="ubuntu"
              height="40px"
              fontSize="14px"
              borderRadius="16px"
              _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
              styleElmRight={{
                width: "50px",
                height: "40px",
                cursor: "pointer",
                onClick: () => setShowConfirmPassword(!showConfirmPassword)
              }}
              elmRight={showConfirmPassword ?
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
              <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.confirmPassword}
            </FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            borderRadius="30px"
            margin="40px auto 0"
            _hover={{transform: "none", opacity: 0.8}}
            width="fit-content"
          >
            Atualizar senha
          </Button>
        </form>
      </Stack>
    </MainPageTemplate>
  )

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
        width="510px"
        height="100%"
        marginTop="50px"
        marginX="27px"
        spacing="40px"
        alignItems="center"
      >
        <EmailRecoveryImage justifyContent="center" marginBottom="8px"/>

        <Display
          fontSize={isMobileMod() ? "28px" : "34px"}
          lineHeight={isMobileMod() ? "16px" : "44px"}
          letterSpacing={isMobileMod() ? "0" : "-0.4px"}
          fontweith="500"
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
          isInvalid={!!error}
        >
          <FormLabel fontWeight="400">E-mail</FormLabel>
          <Input
            type="email"
            placeholder="Insira seu e-mail"
            _placeholder={{color: "#A3A3A3"}}
            _focus={{border:"2px solid #42B0FF !important" }}
            _hover={{border:"2px solid #42B0FF !important" }}
            value={email}
            onKeyDown={handleSpaceKey}
            onChange={(e) => setEmail(e.target.value)}
            padding="8px 12px 8px 16px"
            borderRadius="16px"
            fontSize="14px"
            lineHeight="27px"
            letterSpacing="0.3px"
            border="1px solid #DEDFE0 !important"
          />
          <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
            <Exclamation marginTop="4px" fill="#D93B3B"/>{error}
          </FormErrorMessage>
        </FormControl>

        <Button
          cursor={forwardingDisabled ? "default" : "pointer"}
          _hover={{opacity:forwardingDisabled ? 1 : 0.7, transform: forwardingDisabled ? "none" : "translateY(-3px)"}}
          backgroundColor={forwardingDisabled ? "#C4C4C4" : "#42B0FF"}
          pointerEvents={forwardingDisabled ? "none" : ""}
          borderRadius="30px"
          width="fit-content"
          onClick={() => handleEmailPasswordRecovery(email)}
        >
          {forwardingDisabled ? `Espere ${count} segundos...` :"Enviar e-mail de redefinição"}
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