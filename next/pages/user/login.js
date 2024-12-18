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
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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

export async function getStaticProps({ locale }) {
  const pages = await withPages();
  return {
    props: {
      ...pages,
      ...(await serverSideTranslations(locale, ['user'])),
    },
  };
}

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation('user');
  const { query } = useRouter()
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
      validationErrors.email = t('login.emailError');
    } else if (!/^\S+@\S+$/.test(formData.email)) {
      validationErrors.email = t('login.emailError');
    }
    if (!formData.password) validationErrors.password = t('login.passwordError');
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
        return router.push('/user/check-email?e=1')
      }
      return setErrors({login: t('login.loginError')})
    }

    const userData = await fetch(`/api/user/getUser?p=${btoa(result.id)}`, {method: "GET"})
      .then(res => res.json())
    if(userData.error) return setErrors({login: t('login.serverError')}) 

    cookies.set('userBD', JSON.stringify(userData))

    if(query.i) {
      return router.push({
        pathname: '/user/[username]',
        query: { 
          username: userData.username,
          plans_and_payment: '',
          i: query.i
        }
      })
    }

    if(userData.workDataTool === null) {
      return router.push('/user/survey')
    }
    
    return router.push('/')
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
        >{t('login.title')}</Display>

        {errors.login && 
          <Box
            display="flex"
            flexDirection="row"
            gap="8px"
            alignItems="center"
            fontSize="12px"
            fontFamily="ubuntu"
            marginBottom="24px !important"
            color="#BF3434"
          >
            <Exclamation fill="#BF3434"/>
            {errors.login}
          </Box>
        }

        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.email} marginBottom="24px !important">
            <LabelTextForm text={t('login.emailLabel')}/>
            <Input
              id="username"
              name="username"
              type="email"
              autoComplete="username"
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
              placeholder={t('login.emailPlaceholder')}
              fontFamily="ubuntu"
              height="40px"
              fontSize="14px"
              borderRadius="16px"
              _invalid={{boxShadow:"0 0 0 2px #BF3434"}}
            />
            <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#BF3434" display="flex" flexDirection="row" gap="4px" alignItems="center">
              <Exclamation marginTop="3px" fill="#BF3434"/>{errors.email}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password} marginBottom="24px !important">
            <Box
              display="flex"
              flexDirection="row"
              width="100%"
              marginBottom="8px"
            >
              <LabelTextForm text={t('login.passwordLabel')} margin="0 !important"/>
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
                onClick={() => router.push('/user/password-recovery')}
              >{t('login.forgotPassword')}
              </ButtonSimple>
            </Box>

            <Input
              id="password"
              name="password"
              type={showPassword ? "password" : "text"}
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => handleInputChange(e, "password")}
              placeholder={t('login.passwordPlaceholder')}
              fontFamily="ubuntu"
              height="40px"
              fontSize="14px"
              borderRadius="16px"
              _invalid={{boxShadow:"0 0 0 2px #BF3434"}}
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
            <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#BF3434" display="flex" flexDirection="row" gap="4px" alignItems="center">
              <Exclamation marginTop="3px" fill="#BF3434"/>{errors.password}
            </FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            width="100%"
            borderRadius="30px"
            marginBottom="24px !important"
            backgroundColor="#42B0FF"
          >
            {t('login.loginButton')}
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
          {t('login.noAccount')}
          <ButtonSimple
            width="none"
            fontSize="14px"
            justifyContent="start"
            fontWeight="700"
            color="#42B0FF"
            _hover={{opacity: "0.6"}}
            marginLeft="2px"
            onClick={() => router.push('/user/register')}
          >{t('login.signUp')}
          </ButtonSimple>.
        </SectionText>
      </Stack>
    </MainPageTemplate>
  )
}
