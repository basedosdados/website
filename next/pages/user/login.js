import {
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import cookies from 'js-cookie';

import {
  getToken,
  getUser
} from "../api/user";

import Input from "../../components/atoms/SimpleInput";
import Button from "../../components/atoms/RoundedButton";
import ButtonSimple from "../../components/atoms/SimpleButton";
import SectionText from "../../components/atoms/SectionText";
import { MainPageTemplate } from "../../components/templates/main";

import { EyeIcon, EyeOffIcon } from "../../public/img/icons/eyeIcon";

export default function Login() {
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
      validationErrors.email = "O email é necessário"
    } else if (!/^\S+@\S+$/.test(formData.email)) {
      validationErrors.email = "Email inválido"
    }
    if (!formData.password) validationErrors.password = "A senha é necessária"
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      fetchToken(formData)
    }
  }

  const fetchToken = async ({ email, password }) => {
    const result = await getToken({email: "email", password: "password"})

    if(result?.tokenAuth === null || result?.errors?.length > 0) return setErrors({login:"Email ou senha inválida"}) 

    try {
      const userData = await getUser(result.tokenAuth.payload.email)
      cookies.set('user', JSON.stringify(userData));
      window.open("/", "_self")
    } catch (error) {
      console.error(error)
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit()
    }
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
        {errors.login && 
          <Alert
            status="error"
            fontSize="14px"
            fontFamily="lato"
            borderRadius="8px"
            padding="8px"
            marginBottom="24px"
          >
            <AlertIcon />
            {errors.login}
          </Alert>
        }
        <FormControl isInvalid={!!errors.email || !!errors.login}>
          <LabelTextForm text="Email"/>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="exemple@email.com"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password || !!errors.login}>
          <LabelTextForm text="Senha"/>
          <Input
            type={showPassword ? "password" : "text"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
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
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <Stack paddingTop="16px">
          {/* <ButtonSimple
            justifyContent="start"
            fontWeight="400"
            color="#42B0FF"
            _hover={{opacity: "0.6"}}
            onClick={() => window.open("./password-recovery", "_self")}
          >Esqueceu a senha?
          </ButtonSimple> */}

          <SectionText
            width="100%"
            display="flex"
            flexDirection="row"
            fontWeight="500"
            fontSize="14px"
            fontFamily="ubuntu"
          >
            Não tem uma conta?
            <ButtonSimple
              width="none"
              justifyContent="start"
              color="#42B0FF"
              _hover={{opacity: "0.6"}}
              marginLeft="2px"
              onClick={() => window.open("./register", "_self")}
            >{" "}cadastre-se
            </ButtonSimple>
          </SectionText>
        </Stack>

        <Button
          onClick={handleSubmit}
          borderRadius="8px"
          marginTop="24px !important"
        >
          Entrar
        </Button>
      </Stack>
    </MainPageTemplate>
  )
}
