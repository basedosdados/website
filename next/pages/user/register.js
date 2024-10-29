import {
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  UnorderedList,
  ListItem,
  VStack,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { triggerGAEvent } from "../../utils";
import { useRouter } from 'next/router';

import Input from "../../components/atoms/SimpleInput";
import Button from "../../components/atoms/RoundedButton";
import Display from "../../components/atoms/Display";
import { MainPageTemplate } from "../../components/templates/main";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import { cleanString } from "../../utils";

import { EyeIcon, EyeOffIcon } from "../../public/img/icons/eyeIcon";
import Exclamation from "../../public/img/icons/exclamationIcon";
import Link from "../../components/atoms/Link";

import { withPages } from "../../hooks/pages.hook";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['user'])),
      ...(await withPages()),
    },
  };
}

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation('user');

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({
    firstName: "",
    username: "",
    email: "",
    password: "",
    regexPassword: {},
    confirmPassword: "",
    register: ""
  })
  const [showPassword, setShowPassword] = useState(true)
  const [showConfirmPassword, setShowConfirmPassword] = useState(true)

  const handleInputChange = (e, field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    triggerGAEvent("user_register", "register_try")

    const regexPassword = {}
    const validationErrors = {}

    if (!formData.firstName) {
      validationErrors.firstName = t('signup.errors.firstName')
    }
    if (!formData.username) {
      validationErrors.username = t('signup.errors.username.invalid')
    }
    if(/\s/.test(formData.username)) {
      validationErrors.username = t('signup.errors.username.noSpaces')
    }
    if (!formData.email) {
      validationErrors.email = t('signup.errors.email.invalid')
    } 
    if (!/^\S+@\S+$/.test(formData.email)) {
      validationErrors.email = t('signup.errors.email.invalid')
    }
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
      validationErrors.confirmPassword = t('signup.errors.confirmPassword.required')
    }
    if(/\s/.test(formData.confirmPassword)) {
      validationErrors.password = t('signup.errors.password.noSpaces')
      validationErrors.confirmPassword = t('signup.errors.password.noSpaces')
    }
    if(formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = t('signup.errors.confirmPassword.mismatch')
    }

    if(Object.keys(regexPassword).length > 0) validationErrors.regexPassword = regexPassword
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      createRegister({
        firstName: cleanString(formData.firstName),
        lastName: cleanString(formData?.lastName) || "null",
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
    } else {
      triggerGAEvent("user_register", "register_err")
    }
  }

  const createRegister = async ({ firstName, lastName, username, email, password }) => {
    try {
      const result = await fetch(`/api/user/registerAccount?f=${btoa(firstName)}&l=${btoa(lastName)}&u=${btoa(username)}&e=${btoa(email)}&p=${btoa(password)}`, { method: "GET" })
        .then(res => res.json())

      let arrayErrors = {}
      if(result?.success === false) {
        arrayErrors = ({register: t('signup.errors.register')})
      }
      if(result?.errors?.length > 0) {
        result.errors.map((elm) => {
          if(elm.field === "email") arrayErrors = ({...arrayErrors, email: t('signup.errors.email.exists')})
          if(elm.field === "username") arrayErrors = ({...arrayErrors, username: t('signup.errors.username.exists')})
        })
      }
      setErrors(arrayErrors)

      if(result?.success === true) {
        sessionStorage.setItem('registration_email_bd', `${email}`)
        triggerGAEvent("user_register", "register_success")
        router.push('/user/check-email')
      }
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
        lineHeight="16px"
        fontWeight="400"
        fontSize="16px"
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
      >
        <Display
          fontSize={isMobileMod() ? "34px" : "60px"}
          lineHeight={isMobileMod() ? "44px" : "72px"}
          letterSpacing={isMobileMod() ? "-0.4px" : "-1.5px"}
          marginBottom="40px"
          textAlign="center"
        >{t('signup.title')}</Display>

        <form onSubmit={handleSubmit}>
          <VStack
            spacing={0}
            gap="24px"
          >
            <FormControl isInvalid={!!errors.firstName} >
              <LabelTextForm text={t('signup.firstName')}/>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
                placeholder={t('signup.placeholders.firstName')}
                fontFamily="ubuntu"
                height="40px"
                fontSize="14px"
                borderRadius="16px"
                _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
              />
              <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
                <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.firstName}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
              <LabelTextForm text={t('signup.lastName')}/>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
                placeholder={t('signup.placeholders.lastName')}
                fontFamily="ubuntu"
                height="40px"
                fontSize="14px"
                borderRadius="16px"
                _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
              />
              <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
                <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.lastName}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <LabelTextForm text={t('signup.email')} />
              <Input
                id="username"
                name="username"
                type="email"
                autoComplete="username"
                value={formData.email}
                onChange={(e) => handleInputChange(e, "email")}
                placeholder={t('signup.placeholders.email')}
                fontFamily="ubuntu"
                height="40px"
                fontSize="14px"
                borderRadius="16px"
                _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
              />
              <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
                <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.email}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.username} >
              <LabelTextForm text={t('signup.username')}/>
              <Input
                id="user"
                name="user"
                type="text"
                autoComplete="off"
                value={formData.username}
                onChange={(e) => handleInputChange(e, "username")}
                placeholder={t('signup.placeholders.username')}
                fontFamily="ubuntu"
                height="40px"
                fontSize="14px"
                borderRadius="16px"
                _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
              />
              <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
                <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.username}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <LabelTextForm text={t('signup.password')} />
              <Input
                type={showPassword ? "password" : "text"}
                id="password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => handleInputChange(e, "password")}
                placeholder={t('signup.placeholders.password')}
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
              ><Exclamation width="14px" height="14px" fill="#D93B3B" display={ errors?.regexPassword ? Object.keys(errors?.regexPassword).length > 0 ? "flex" : "none" : "none"}/> {t('signup.errors.password.requirements')}</Text>
              <UnorderedList fontSize="12px" fontFamily="Ubuntu" position="relative" left="2px">
                <ListItem fontSize="12px" color={errors?.regexPassword?.amount ? "#D93B3B" :"#7D7D7D"}>{t('signup.errors.password.chars')}</ListItem>
                <ListItem fontSize="12px" color={errors?.regexPassword?.upperCase ? "#D93B3B" :"#7D7D7D"}>{t('signup.errors.password.uppercase')}</ListItem>
                <ListItem fontSize="12px" color={errors?.regexPassword?.lowerCase ? "#D93B3B" :"#7D7D7D"}>{t('signup.errors.password.lowercase')}</ListItem>
                <ListItem fontSize="12px" color={errors?.regexPassword?.number ? "#D93B3B" :"#7D7D7D"}>{t('signup.errors.password.digit')}</ListItem>
                <ListItem fontSize="12px" color={errors?.regexPassword?.special ? "#D93B3B" :"#7D7D7D"}>{t('signup.errors.password.special')}</ListItem>
              </UnorderedList>
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword}>
              <LabelTextForm text={t('signup.confirmPassword')} />
              <Input
                type={showConfirmPassword ? "password" : "text"}
                id="confirmPassword"
                name="password"
                autoComplete="current-password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange(e, "confirmPassword")}
                placeholder={t('signup.placeholders.confirmPassword')}
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
          </VStack>

          <Button
            type="submit"
            width="100%"
            borderRadius="30px"
            marginTop="24px !important"
            backgroundColor={errors?.register ? "#D93B3B" : "#42B0FF"}
          >
            {t('signup.register')}
          </Button>
        </form>

        {errors?.register &&
          <Text fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
            <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.register}
          </Text>
        }

        <Text
          textAlign="center"
          color= "#7D7D7D"
          fontFamily= "Ubuntu"
          fontSize= "12px"
          fontWeight= "400"
          lineHeight= "16px"
          letterSpacing= "0.3px"
          marginTop="16px !important"
        >
          {t('signup.termsAgreement.part1')}
          <Link display="inline" fontSize="12px" lineHeight="normal" fontFamily="ubuntu" color="#42B0FF" href="/terms?section=terms" target="_blank">
            {t('signup.termsAgreement.termsLink')}
          </Link>
          {t('signup.termsAgreement.part2')}
          <Link display="inline" fontSize="12px" lineHeight="normal" fontFamily="ubuntu" color="#42B0FF" href="/terms?section=privacy" target="_blank">
            {t('signup.termsAgreement.privacyLink')}
          </Link>
          {t('signup.termsAgreement.part3')}
        </Text>

        <Text
          textAlign="center"
          color= "#252A32"
          fontFamily= "Ubuntu"
          fontSize= "14px"
          fontWeight= "400"
          lineHeight= "27px"
          letterSpacing= "0.3px"
          marginTop="24px !important"
        >
          {t('signup.alreadyHaveAccount')} <Link display="inline" lineHeight="normal" fontFamily="ubuntu" color="#42B0FF" href="/user/login">{t('signup.login')}</Link>.
        </Text>
      </Stack>
    </MainPageTemplate>
  )
}