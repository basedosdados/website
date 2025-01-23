import {
  Stack,
  Text,
  FormControl,
  List
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';

import {
  LabelTextForm,
  InputForm,
  ErrorMessage,
  Button,
  ListChecked
} from "../../components/molecules/uiUserPage";

import Link from "../../components/atoms/Link";
import { MainPageTemplate } from "../../components/templates/main";

import { EmailRecoveryImage } from "../../public/img/emailImage";
import Exclamation from "../../public/img/icons/exclamationIcon";
import { EyeIcon, EyeOffIcon } from "../../public/img/icons/eyeIcon";

export async function getServerSideProps(context) {
  const { query, locale } = context;
  let confirmed = false;

  if (query.q !== undefined && query.p !== undefined) confirmed = true;

  let uid = query?.q || "";
  let confirmToken = query?.p || "";

  return {
    props: {
      ...(await serverSideTranslations(locale, ['user'])),
      confirmed,
      uid,
      confirmToken,
    },
  };
}

export default function PasswordRecovery({ confirmed, uid, confirmToken }) {
  const router = useRouter();
  const { t } = useTranslation('user');

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
    if(!regexEmail.test(value)) return setError(t('passwordRecovery.invalidEmail'))

    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

    const getIdUser = await fetch(`/api/user/getIdUser?p=${btoa(value)}`, {method: "GET"})
      .then(res => res.json())

    if(getIdUser.error) return setError(t('passwordRecovery.invalidEmail'))

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
      validationErrors.confirmPassword = t('passwordRecovery.confirmPasswordRequired')
    }
    if(/\s/.test(formData.confirmPassword)) {
      validationErrors.password = t('passwordRecovery.passwordNoSpaces')
      validationErrors.confirmPassword = t('passwordRecovery.passwordNoSpaces')
    }
    if(formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = t('passwordRecovery.passwordMismatch')
    }

    if(Object.keys(regexPassword).length > 0) validationErrors.regexPassword = regexPassword

    if(formData.password === "") {
      validationErrors.password = t('passwordRecovery.passwordRequired')
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
      if(res.status === 200) return router.push('/user/login')
    } catch (error) {
      router.push('/user/password-recovery')
    }
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
        width="600px"
        height="100%"
        marginTop="50px"
        marginX="27px"
        spacing="40px"
        alignItems="center"
      >
        <EmailRecoveryImage justifyContent="center" marginBottom="8px"/>

        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="50px"
          lineHeight="60px"
          color="#252A32"
          textAlign="center"
        >
          {t('passwordRecovery.titleConfirmed')}
        </Text>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "550px"
          }}
          onSubmit={handleSubmit}
        >
          <FormControl isInvalid={!!errors.password || !!errors.regexPassword}>
            <LabelTextForm text={t('passwordRecovery.newPasswordLabel')} />
            <InputForm
              type={showPassword ? "password" : "text"}
              id="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => handleInputChange(e, "password")}
              placeholder={t('passwordRecovery.newPasswordPlaceholder')}
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
            <Text 
              margin="8px 0"
              color={errors?.regexPassword ? Object.keys(errors?.regexPassword).length > 0 ? "#BF3434" : "#71757A" : "#71757A" }
              fontFamily="Roboto"
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
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
            </Text>

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

          <FormControl marginTop="40px" isInvalid={!!errors.confirmPassword}>
            <LabelTextForm text={t('passwordRecovery.confirmPasswordLabel')} />
            <InputForm
              type={showConfirmPassword ? "password" : "text"}
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange(e, "confirmPassword")}
              placeholder={t('passwordRecovery.confirmPasswordPlaceholder')}
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

          <Button
            type="submit"
            onClick={() => {}}
            width="100%"
            margin="40px auto 0"
          >
            {t('passwordRecovery.updatePassword')}
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
        width="550px"
        height="100%"
        marginTop="50px"
        marginX="27px"
        spacing="40px"
        alignItems="center"
      >
        <EmailRecoveryImage justifyContent="center" marginBottom="8px"/>

        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="50px"
          lineHeight="60px"
          color="#252A32"
          textAlign="center"
          marginBottom="40px"
        >
          {t('passwordRecovery.title')}
        </Text>

        <Text
          textAlign="center"
          color= "#464A51"
          fontFamily= "Roboto"
          fontWeight= "400"
          fontSize= "18px"
          lineHeight= "26px"
        >
          {t('passwordRecovery.description')}
        </Text>

        <FormControl isInvalid={!!error}>
          <LabelTextForm text={t('passwordRecovery.emailLabel')}/>
          <InputForm
            type="email"
            placeholder={t('passwordRecovery.emailPlaceholder')}
            value={email}
            onKeyDown={handleSpaceKey}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ErrorMessage >
            {error}
          </ErrorMessage>
        </FormControl>

        <Button
          cursor={forwardingDisabled ? "default" : "pointer"}
          _hover={{backgroundColor:forwardingDisabled ? "#2B8C4D" : "#22703E"}}
          backgroundColor={forwardingDisabled ? "#C4C4C4" : "#2B8C4D"}
          pointerEvents={forwardingDisabled ? "none" : ""}
          width="fit-content"
          onClick={() => handleEmailPasswordRecovery(email)}
        >
          {forwardingDisabled ? t('passwordRecovery.waitSeconds', { count }) : t('passwordRecovery.sendResetEmail')}
        </Button>

        <Text
          textAlign="center"
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          color="#252A32"
        >
          {t('passwordRecovery.needHelp')}{' '}
          <Link 
            display="inline"
            fontWeight="400"
            color="#0068C5"
            _hover={{
              color: "#0057A4"
            }}
            href="/contact"
          >
            {t('passwordRecovery.contactUs')}
          </Link>
          .
        </Text>
      </Stack>
    </MainPageTemplate>
  )
}