import {
  Stack,
  Box,
  Text,
  FormControl,
} from "@chakra-ui/react";
import { useState } from "react";
import cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import { triggerGAEvent } from "../../../utils";

import {
  TitleTextForm,
  ExtraInfoTextForm,
  Button,
  InputForm,
  ErrorMessage
} from "../../molecules/uiUserPage";


export default function BigQuery ({ userInfo }) {
  const { t } = useTranslation('user');
  const [emailGcp, setEmailGcp] = useState(userInfo?.gcpEmail || userInfo?.email)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpdateEmailGcp() {
    setErrors({})
    setIsLoading(true)

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    if(!isValidEmail(emailGcp)) { 
      setErrors({emailGcp: t('username.errEmailGcp')})
    } else {
      const reg = new RegExp("(?<=:).*")
      const [ id ] = reg.exec(userInfo.id)

      let user
      let attempts = 0
      const maxAttempts = 10
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

      const response = await fetch(`/api/user/changeUserGcpEmail?p=${btoa(emailGcp)}`)
        .then(res => res.json())
      
      if(response.ok) {
        if(emailGcp !== userInfo?.email) {
          if(emailGcp !== userInfo?.gcpEmail) {
            triggerGAEvent("troca_do_email_gcp",`section_bigquery`)
          }
        }

        while (!user?.gcpEmail && attempts < maxAttempts) {
          user = await fetch(`/api/user/getUser?p=${btoa(id)}`, { method: "GET" })
            .then((res) => res.json())
  
          if (user?.gcpEmail) {
            cookies.set("userBD", JSON.stringify(user))
            break
          }
  
          attempts++
          await delay(10000)
        }
      } else {
        setErrors({emailGcp: t('username.errEmailGcp')})
      }
    }
    setIsLoading(false)
  }

  return (
    <Stack>
      <Box display={isLoading ? "flex" : "none"} position="fixed" top="0" left="0" width="100%" height="100%" zIndex="99999"/>

      <TitleTextForm>{t('username.bigquerySectionTitle')}</TitleTextForm>

      <ExtraInfoTextForm>
      {t('username.bigquerySectionSubtitle', { returnObjects: true })[0]}
      <Text as="span" fontWeight="500">
        {t('username.bigquerySectionSubtitle', { returnObjects: true })[1]}
      </Text>
      {t('username.bigquerySectionSubtitle', { returnObjects: true })[2]}
      </ExtraInfoTextForm>

      <FormControl maxWidth={{base: "100%", lg: "480px"}} isInvalid={!!errors.emailGcp} margin="16px 0 24px !important">
        <InputForm
          id="emailgcp"
          name="emailgcp"
          value={emailGcp}
          
          justifyContent="start"
          onChange={(e) => setEmailGcp(e.target.value)}
          placeholder={t('username.bigquerySectionInputPlaceholder')}
        />
        <ErrorMessage>
          {errors.emailGcp}
        </ErrorMessage>
      </FormControl>

      <Button
        width={{base: "100%", sm: "fit-content"}}
        onClick={() => handleUpdateEmailGcp()}
        isLoading={isLoading}
      >
        {t('username.bigquerySectionButton')}
      </Button>
    </Stack>
  )
}
