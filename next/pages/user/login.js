import {
  Box,
  Stack,
  FormControl,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import {
  LabelTextForm,
  InputForm,
  ErrorMessage,
  Button
} from "../../components/molecules/uiUserPage";
import Link from "../../components/atoms/Link";
import Display from "../../components/atoms/Text/Display";
import BodyText from "../../components/atoms/Text/BodyText";
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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get('login');
    
    if (loginSuccess === 'success') {
      const token = urlParams.get('token')
      if(token) {
        cookies.set('token', token, { expires: 7, path: '/' })
      }
      fetchUser(urlParams.get('id'));
    }
  }, []);

  const handleInputChange = (e, field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }))
  }

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/account/google/login/`;
  };

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

  async function fetchUser(id) {
    const userData = await fetch(`/api/user/getUser?p=${btoa(id)}`, {method: "GET"})
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

    fetchUser(result.id)
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
          as="h1"
          textAlign="center"
          marginBottom="40px"
        >
          {t('login.title')}
        </Display>

        {errors.login && 
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
              {errors.login}
            </BodyText>
          </Box>
        }

        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.email} marginBottom="24px !important">
            <LabelTextForm text={t('login.emailLabel')}/>
            <InputForm
              id="username"
              name="username"
              autoComplete="username"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e, "email")}
              placeholder={t('login.emailPlaceholder')}
            />
            <ErrorMessage>
              {errors.email}
            </ErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password} marginBottom="8px !important">
            <LabelTextForm text={t('login.passwordLabel')}/>
            <InputForm
              type={showPassword ? "password" : "text"}
              id="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => handleInputChange(e, "password")}
              placeholder={t('login.passwordPlaceholder')}
              inputElementStyle={{
                cursor: "pointer",
                onClick: () => setShowPassword(!showPassword)
              }}
              icon={showPassword ?
                <EyeOffIcon
                  alt={t('username.showPassword')}
                  width="20px"
                  height="20px"
                  fill="#464A51"
                />
              :
                <EyeIcon
                  alt={t('username.hidePassword')}
                  width="20px"
                  height="20px"
                  fill="#464A51"
                />
              }
            />
            <ErrorMessage>{errors.password}</ErrorMessage>
          </FormControl>

          <Link
            width="fit-content"
            marginBottom="24px"
            href='/user/password-recovery'
            fontWeight="400"
            color="#0068C5"
            _hover={{
              color: "#0057A4"
            }}
          >
            {t('login.forgotPassword')}
          </Link>

          <Button
            type="submit"
            width="100%"
            onClick={() => {}}
            marginBottom="24px !important"
          >
            {t('login.loginButton')}
          </Button>
        </form>

        <Divider borderColor="#E0E0E0" marginBottom="24px !important"/>

        <Button
          width="100%"
          marginBottom="24px !important"
          isVariant
          onClick={handleGoogleLogin}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar com Google
        </Button>

        <BodyText
          typography="small"
          width="100%"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          textAlign="center"
        >
          {t('login.noAccount')}
          <Link
            marginLeft="2px"
            href='/user/register'
            fontWeight="400"
            color="#0068C5"
            _hover={{
              color: "#0057A4"
            }}
          >{t('login.signUp')}
          </Link>.
        </BodyText>
      </Stack>
    </MainPageTemplate>
  )
}
