import {
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";

import Input from "../../components/atoms/SimpleInput";
import Button from "../../components/atoms/RoundedButton";
import { MainPageTemplate } from "../../components/templates/main";

import { EyeIcon, EyeOffIcon } from "../../public/img/icons/eyeIcon";


export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(true)

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    let validationErrors = {}
    if (!formData.email) {
      validationErrors.email = "O email é necessário"
    } else if (!/^\S+@\S+$/.test(formData.email)) {
      validationErrors.email = "Email inválido"
    }
    if (!formData.password) {
      validationErrors.password = "A senha é necessária"
    }
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = "Confirma a senha é necessária"
    }
    if(formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = "As senhas tem que ser iguais"
    }
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      fetchToken(formData)
    }
  }

  return null

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
        <FormControl isInvalid={!!errors.email || !!errors.login}>
          <FormLabel
            color="#252A32"
            fontFamily="ubuntu"
            letterSpacing="0.2px"
            lineHeight="24px"
          > Email</FormLabel>
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
          <FormLabel
            color="#252A32"
            fontFamily="ubuntu"
            letterSpacing="0.2px"
            lineHeight="24px"
          >Senha</FormLabel>
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
          <FormErrorMessage>{errors.password}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel
            color="#252A32"
            fontFamily="ubuntu"
            letterSpacing="0.2px"
            lineHeight="24px"
          >Senha novamente</FormLabel>
          <Input
            type={showPassword ? "password" : "text"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Entre com senha novamente"
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