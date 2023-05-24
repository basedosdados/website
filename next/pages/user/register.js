import {
  Stack,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  UnorderedList,
  ListItem
} from "@chakra-ui/react";
import { useState } from "react";
import InternalServerError from "../500";

import { registerAccount, getToken } from "../api/token";

import Input from "../../components/atoms/SimpleInput";
import Button from "../../components/atoms/RoundedButton";
import { MainPageTemplate } from "../../components/templates/main";

import { EyeIcon, EyeOffIcon } from "../../public/img/icons/eyeIcon";


export default function Register() {
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    regexPassword: {
      amount: false,
      uppercaseLowercase: false,
      number: false,
      special: false
    },
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(true)
  const [showConfirmPassword, setShowConfirmPassword] = useState(true)

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    const regexPassword = {}
    e.preventDefault()

    let validationErrors = {}
    if (!formData.userName) {
      validationErrors.userName = "O nome de usuário é necessário"
    }
    if (!formData.firstName) {
      validationErrors.firstName = "O primeiro nome é necessário"
    }
    if (!formData.lastName) {
      validationErrors.lastName = "O sobrenome é necessário"
    }
    if (!formData.email) {
      validationErrors.email = "O email é necessário"
    } else if (!/^\S+@\S+$/.test(formData.email)) {
      validationErrors.email = "Email inválido"
    }
    if(!/^.{8,}$/.test(formData.password)) {
      regexPassword = {...regexPassword, amount: true}
    }
    if(!/([a-z].*[A-Z])|([A-Z].*[a-z])/.test(formData.password)) {
      regexPassword = {...regexPassword, uppercaseLowercase: true}
    }
    if(!/(?=.*?[0-9])/.test(formData.password)) {
      regexPassword = {...regexPassword, number: true}
    }
    if(!/(?=.*?[#?!@$%^&*-])/.test(formData.password)) {
      regexPassword = {...regexPassword, special: true}
    }
    if (!formData.password) {
      validationErrors.password = "A senha é necessária"
    }
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Confirma a senha é necessário"
    }
    if(formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = "As senhas tem que ser iguais"
    }

    if (Object.keys(regexPassword).length != 0) validationErrors.regexPassword = regexPassword
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      fetchRegister(formData)
    }
  }

  const fetchRegister = async ({ userName, firstName, lastName, email, password }) => {
    const result = await registerAccount({userName, firstName, lastName, email, password})

    let arrayErrors = {}
    if(result?.errors?.length > 0) {
      result.errors.map((elm) => {
        if(elm.field === "username") arrayErrors = ({...arrayErrors, userName: elm.messages})
        if(elm.field === "email") arrayErrors = ({...arrayErrors, email: elm.messages})
      })
    }
    setErrors(arrayErrors)

    if(result?.errors?.length === 0) {
      const acess = await getToken({email, password})

      if(acess?.errors?.length > 0) return 
      localStorage.setItem("token_user", acess.data.tokenAuth.token)
      window.open("/", "_self")
    }
  }

  const LabelTextForm = ({ text }) => {
    return (
      <FormLabel
        color="#252A32"
        fontFamily="ubuntu"
        letterSpacing="0.2px"
        lineHeight="24px"
      >{text}</FormLabel>
    )
  }

  return (
    <MainPageTemplate display="flex" justifyContent="center">
      <Stack
        display="flex"
        justifyContent="center"
        width="450px"
        height="100%"
        padding="40px"
        boxShadow="0 2px 5px 1px rgba(64, 60, 67, 0.16)"
      >
        <FormControl isInvalid={!!errors.userName}>
          <LabelTextForm text="Nome de usuário"/>
          <Input
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            placeholder="dadinho"
          />
          <FormErrorMessage>{errors.userName}</FormErrorMessage>
        </FormControl>

        <Flex gap="8px">
          <FormControl isInvalid={!!errors.firstName}>
            <LabelTextForm text="Primeiro nome"/>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Dadinho"
            />
            <FormErrorMessage>{errors.firstName}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.lastName}>
            <LabelTextForm text="Sobrenome"/>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Dados"
            />
            <FormErrorMessage>{errors.lastName}</FormErrorMessage>
          </FormControl>
        </Flex>

        <FormControl isInvalid={!!errors.email}>
          <LabelTextForm text="Email" />
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="exemple@email.com"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <LabelTextForm text="Senha" />
          <Input
            type={showPassword ? "password" : "text"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Entre com sua senha"
            styleElmRight={{
              width: "50px",
              height: "48px",
              cursor: "pointer",
              onClick: () => setShowPassword(!showPassword)
            }}
            elmRight={showPassword ?
              <EyeOffIcon
                alt="esconder senha"
                width="26px"
                height="26px"
                fill="#D0D0D0"
              />
            :
              <EyeIcon
                alt="exibir senhar"
                width="26px"
                height="26px"
                fill="#D0D0D0"
              />
            }
          />
          <UnorderedList>
            <ListItem color={errors?.regexPassword?.amount ? "#E53E3E" :"#A3A3A3"} fontSize="14px" marginTop="8px">Ter no mínimo 8 caracteres</ListItem>
            <ListItem color={errors?.regexPassword?.uppercaseLowercase ? "#E53E3E" :"#A3A3A3"} fontSize="14px">Pelo menos uma letra maiúscula e minúscula</ListItem>
            <ListItem color={errors?.regexPassword?.number ? "#E53E3E" :"#A3A3A3"} fontSize="14px">Um dígito</ListItem>
            <ListItem color={errors?.regexPassword?.special ? "#E53E3E" :"#A3A3A3"} fontSize="14px">E um caractere especial</ListItem>
          </UnorderedList>
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <LabelTextForm text="Senha novamente" />
          <Input
            type={showConfirmPassword ? "password" : "text"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Entre com senha novamente"
            styleElmRight={{
              width: "50px",
              height: "48px",
              cursor: "pointer",
              onClick: () => setShowConfirmPassword(!showConfirmPassword)
            }}
            elmRight={showConfirmPassword ?
              <EyeOffIcon
                alt="esconder senha"
                width="26px"
                height="26px"
                fill="#D0D0D0"
              />
            :
              <EyeIcon
                alt="exibir senhar"
                width="26px"
                height="26px"
                fill="#D0D0D0"
              />
            }
          />
          <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
        </FormControl>

        <Button
          onClick={(e) => handleSubmit(e)}
          borderRadius="8px"
          marginTop="24px !important"
        >
          Cadastrar
        </Button>
      </Stack>
    </MainPageTemplate>
  )
}