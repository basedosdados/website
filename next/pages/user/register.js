import {
  Stack,
  FormControl,
  List,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { triggerGAEvent } from "../../utils";
import { useRouter } from 'next/router';

import {
  LabelTextForm,
  InputForm,
  ErrorMessage,
  Button,
  ListChecked
} from "../../components/molecules/uiUserPage";

import Link from "../../components/atoms/Link";
import Display from "../../components/atoms/Text/Display";
import BodyText from "../../components/atoms/Text/BodyText";
import { MainPageTemplate } from "../../components/templates/main";
import { cleanString } from "../../utils";

import { EyeIcon, EyeOffIcon } from "../../public/img/icons/eyeIcon";
import Exclamation from "../../public/img/icons/exclamationIcon";

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
          textAlign="center"
          marginBottom="40px"
        >
          {t('signup.title')}
        </Display>

        <form onSubmit={handleSubmit}>
          <VStack
            spacing={0}
            gap="24px"
          >
            <FormControl isInvalid={!!errors.firstName} >
              <LabelTextForm text={t('signup.firstName')}/>
              <InputForm
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
                placeholder={t('signup.placeholders.firstName')}
              />
              <ErrorMessage>
                {errors.firstName}
              </ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.lastName}>
              <LabelTextForm text={t('signup.lastName')}/>
              <InputForm
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
                placeholder={t('signup.placeholders.lastName')}
              />
              <ErrorMessage>
                {errors.lastName}
              </ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <LabelTextForm text={t('signup.email')} />
              <InputForm
                id="username"
                name="username"
                type="email"
                autoComplete="username"
                value={formData.email}
                onChange={(e) => handleInputChange(e, "email")}
                placeholder={t('signup.placeholders.email')}
              />
              <ErrorMessage>
                {errors.email}
              </ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.username} >
              <LabelTextForm text={t('signup.username')}/>
              <InputForm
                id="user"
                name="user"
                type="text"
                autoComplete="off"
                value={formData.username}
                onChange={(e) => handleInputChange(e, "username")}
                placeholder={t('signup.placeholders.username')}
              />
              <ErrorMessage>
                {errors.username}
              </ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <LabelTextForm text={t('signup.password')} />
              <InputForm
                type={showPassword ? "password" : "text"}
                id="password"
                name="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => handleInputChange(e, "password")}
                placeholder={t('signup.placeholders.password')}
                inputElementStyle={{
                  cursor: "pointer",
                  onClick: () => setShowPassword(!showPassword)
                }}
                icon={showPassword ?
                  <EyeOffIcon
                    alt="esconder senha"
                    width="20px"
                    height="20px"
                    fill="#464A51"
                  />
                :
                  <EyeIcon
                    alt="exibir senhar"
                    width="20px"
                    height="20px"
                    fill="#464A51"
                  />
                }
              />
              <BodyText
                typography="small" 
                margin="8px 0"
                color={errors?.regexPassword ? Object.keys(errors?.regexPassword).length > 0 ? "#BF3434" : "#71757A" : "#71757A" }
                display="flex"
                flexDirection="row"
                gap="8px"
                alignItems="flex-start"
              >
                <Exclamation
                  display={errors?.regexPassword ? Object.keys(errors?.regexPassword).length > 0 ? "flex" : "none" : "none"}
                  width="18px"
                  height="18px"
                  fill="#BF3434"
                /> {t('username.passwordRequirements')}
              </BodyText>

              <List
                fontFamily="Roboto"
                fontSize="14px"
                fontWeight="400"
                lineHeight="20px"
                position="relative"
                left="2px"
                display="flex"
                flexDirection="column"
                gap="8px"
              >
                <ListChecked 
                  checked={formData.password.length >= 8}
                  err={errors?.regexPassword?.amount}
                >
                  {t('username.minCharacters')}
                </ListChecked>
                <ListChecked
                  checked={/[A-Z]/.test(formData.password)}
                  err={errors?.regexPassword?.upperCase}
                >
                  {t('username.uppercaseLetter')}
                </ListChecked>
                <ListChecked
                  checked={/[a-z]/.test(formData.password)}
                  err={errors?.regexPassword?.lowerCase}
                >
                  {t('username.lowercaseLetter')}
                </ListChecked>
                <ListChecked
                  checked={/\d/.test(formData.password)}
                  err={errors?.regexPassword?.number}
                >
                  {t('username.digit')}
                </ListChecked>
                <ListChecked
                  checked={/[!@#?%&*]/.test(formData.password)}
                  err={errors?.regexPassword?.special}
                >
                  {t('username.specialCharacter')}
                </ListChecked>
              </List>

              {errors.password &&
                <ErrorMessage>{errors.password}</ErrorMessage>
              }
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword}>
              <LabelTextForm text={t('signup.confirmPassword')} />
              <InputForm
                type={showConfirmPassword ? "password" : "text"}
                id="confirmPassword"
                name="password"
                autoComplete="current-password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange(e, "confirmPassword")}
                placeholder={t('signup.placeholders.confirmPassword')}
                inputElementStyle={{
                  cursor: "pointer",
                  onClick: () => setShowConfirmPassword(!showConfirmPassword)
                }}
                icon={showConfirmPassword ?
                  <EyeOffIcon
                    alt="esconder senha"
                    width="20px"
                    height="20px"
                    fill="#464A51"
                  />
                :
                  <EyeIcon
                    alt="exibir senhar"
                    width="20px"
                    height="20px"
                    fill="#464A51"
                  />
                }
              />
              <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
            </FormControl>
          </VStack>

          <Button
            type="submit"
            onClick={() => {}}
            width="100%"
            marginTop="24px !important"
            backgroundColor={errors?.register ? "#BF3434" : "#2B8C4D"}
          >
            {t('signup.register')}
          </Button>
        </form>

        {errors?.register &&
          <Box
            display="flex"
            flexDirection="row"
            gap="8px"
            alignItems="center"
            marginBottom="24px !important"
          >
            <Exclamation width="19px" height="19px" fill="#BF3434"/>
            <BodyText
              typography="small"
              color="#BF3434"
            >
              {errors.register}
            </BodyText>
          </Box>
        }

        <BodyText
          typography="small"
          textAlign="center"
          color="#71757A"
          marginTop="16px !important"
        >
          {t('signup.termsAgreement.part1')}
          <Link
            display="inline"
            fontWeight="400"
            color="#0068C5"
            _hover={{
              color: "#0057A4"
            }}
            href="/terms?section=terms" target="_blank"
          >
            {t('signup.termsAgreement.termsLink')}
          </Link>
          {t('signup.termsAgreement.part2')}
          <Link
            display="inline"
            fontWeight="400"
            color="#0068C5"
            _hover={{
              color: "#0057A4"
            }}
            href="/terms?section=privacy" target="_blank"
          >
            {t('signup.termsAgreement.privacyLink')}
          </Link>
          {t('signup.termsAgreement.part3')}
        </BodyText>

        <BodyText
          typography="small"
          textAlign="center"
          marginTop="24px !important"
        >
          {t('signup.alreadyHaveAccount')} <Link
            display="inline"
            fontWeight="400"
            color="#0068C5"
            _hover={{
              color: "#0057A4"
            }}
            href="/user/login"
          >
            {t('signup.login')}
          </Link>.
        </BodyText>
      </Stack>
    </MainPageTemplate>
  )
}