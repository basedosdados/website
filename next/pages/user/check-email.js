import {
  Stack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Display from "../../components/atoms/Text/Display";
import BodyText from "../../components/atoms/Text/BodyText";

import { MainPageTemplate } from "../../components/templates/main";

import { EmailConfirmImage } from "../../public/img/emailImage";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['user'])),
    },
  };
}

export default function CheckEmail() {
  const router = useRouter();
  const { t } = useTranslation('user');
  const [email, setEmail] = useState("")
  const [count, setCount] = useState(0)
  const [forwardingDisabled, setForwardingDisabled] = useState(false)

  useEffect(() => {
    const res = sessionStorage.getItem("registration_email_bd") || "" 
    if(res === "") return router.push('/')
    setEmail(res)
  }, [router])

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

  async function handleEmailConfirm() {
    if(email === "") return null
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

    const getIdUser = await fetch(`/api/user/getIdUser?p=${btoa(email)}`, {method: "GET"})
      .then(res => res.json())

    if(getIdUser.error) return

    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(getIdUser?.id)

    await axios.post(`${API_URL}/account/account_activate/${btoa(id)}/`)
    setForwardingDisabled(true)
    setCount(60)
  }

  return (
    <MainPageTemplate display="flex" justifyContent="center" cleanTemplate>
      <Stack
        display="flex"
        justifyContent="center"
        width="560px"
        height="100%"
        marginTop={{base: "150px", lg: "50px"}}
        marginX="27px"
        spacing="40px"
        alignItems="center"
      >
        <EmailConfirmImage justifyContent="center" marginBottom="8px"/>

        <Display
          typography="small"
          textAlign="center"
        >{t('checkEmail.confirmEmail')}</Display>

        <Stack spacing="16px">
          <BodyText
            typography="large"
            color= "#464A51"
            textAlign="center"
          >
            {t('checkEmail.sentConfirmation')}
          </BodyText>

          <BodyText
            typography="large"
            textAlign="center"
            fontWeight= "500"
          >
            {email}
          </BodyText>
        </Stack>

        <Stack spacing="8px">
          <BodyText
            typography="large"
            textAlign="center"
            color= "#464A51"
          >
            {t('checkEmail.checkInbox')}
          </BodyText>

          <BodyText
            typography="large"
            cursor={forwardingDisabled ? "default" : "pointer"}
            _hover={{color:forwardingDisabled ? "#0068C5" : "#0057A4"}}
            pointerEvents={forwardingDisabled ? "none" : ""}
            textAlign="center"
            color={forwardingDisabled ? "#252A32" : "#0068C5"}
            onClick={() => handleEmailConfirm()}
          >{forwardingDisabled ? t('checkEmail.waitSeconds', { count }) : t('checkEmail.resendEmail')}</BodyText>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
