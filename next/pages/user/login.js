import {
  Box,
  Stack,
  VStack,
  FormControl,
  Divider,
  Spinner,
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
import GoogleIcon from "../../public/img/icons/googleIcon";

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
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginSuccess = urlParams.get('login');

    if (loginSuccess === 'success') {
      setIsLoading(true)
      const token = urlParams.get('token')
      if(token) {
        cookies.set('token', token, { expires: 7, path: '/' })
      }
      fetchUser(urlParams.get('id'));
    }

    const error = urlParams.get('error');
    if (error) {
      let errorMessage = '';
      switch (error) {
        case 'auth_failed':
          errorMessage = t('login.googleAuthFailed');
          break;
        case 'user_info_failed':
          errorMessage = t('login.googleUserInfoFailed');
          break;
        case 'account_creation_failed':
          errorMessage = t('login.googleAccountCreationFailed');
          break;
        case 'internal_server_error':
        default:
          errorMessage = t('login.serverError');
      }
      setErrors({ login: errorMessage });
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
      setIsLoading(true)
      fetchToken(formData)
    }
  }

  async function fetchUser(id) {
    const userData = await fetch(`/api/user/getUser?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())
    if(userData.error) {
      setIsLoading(false)
      return setErrors({login: t('login.serverError')}) 
    }

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
      setIsLoading(false)
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

        {isLoading &&
          <VStack spacing={4} justify="center" h="300px">
            <Spinner
              thickness="4px"
              speed="0.65s"
              color="#2B8C4D"
              width="200px"
              height="200px"
            />
          </VStack>
        }

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

        {!isLoading && 
          <>
            <Button
              width="100%"
              marginBottom="16px !important"
              isVariant
              onClick={handleGoogleLogin}
            >
              <GoogleIcon width="18px" height="18px"/>
              {t('login.googleLogin')}
            </Button>

            <BodyText
              width="100%"
              textAlign="center"
              color="#71757A"
              marginBottom="16px !important"
            >
              {t('login.or')}
            </BodyText>
          </>
        }

        {!isLoading && <form onSubmit={handleSubmit}>
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
        </form>}

        {!isLoading && <>
          <Divider borderColor="#E0E0E0" marginBottom="24px !important"/>

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
        </>}
      </Stack>
    </MainPageTemplate>
  )
}
