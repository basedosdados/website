import {
  Stack,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { serialize } from 'cookie';
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../../components/templates/main";
import TitleText from "../../components/atoms/Text/TitleText";
import LabelText from "../../components/atoms/Text/LabelText";

import {
  ProfileConfiguration,
  Account,
  NewPassword,
  PlansAndPayment,
  BigQuery,
  Accesses,
  DataAPI
} from "../../components/organisms/componentsUserPage";

export async function getServerSideProps(context) {
  const { req, res, locale } = context
  let user = null

  if(req.cookies.userBD) user = JSON.parse(req.cookies.userBD)

  if (user === null || Object.keys(user).length < 0) {
    res.setHeader('Set-Cookie', serialize('token', '', {maxAge: -1, path: '/', }))

    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      }
    }
  }

  const validateTokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/api/user/validateToken?p=${btoa(req.cookies.token)}`, {method: "GET"})
  const validateToken = await validateTokenResponse.json()

  if(validateToken.error) {
    const refreshTokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/api/user/refreshToken?p=${btoa(req.cookies.token)}`, {method: "GET"})
    const refreshToken = await refreshTokenResponse.json()

    if(refreshToken.error) {
      res.setHeader('Set-Cookie', serialize('token', '', {maxAge: -1, path: '/', }))
      res.setHeader('Set-Cookie', serialize('userBD', '', { maxAge: -1, path: '/', }))

      return {
        redirect: {
          destination: "/user/login",
          permanent: false,
        }
      }
    }
  }

  const reg = new RegExp("(?<=:).*")
  const [ id ] = reg.exec(user.id)

  const getUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/api/user/getUser?p=${btoa(id)}&q=${btoa(req.cookies.token)}`, {method: "GET"})
  const getUser = await getUserResponse.json()

  if(getUser.errors) {
    res.setHeader('Set-Cookie', serialize('token', '', {maxAge: -1, path: '/', }))
    res.setHeader('Set-Cookie', serialize('userBD', '', { maxAge: -1, path: '/', }))

    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      }
    }
  }

  const userDataString = JSON.stringify(getUser)
  res.setHeader('Set-Cookie', serialize('userBD', userDataString, { maxAge: 60 * 60 * 24 * 7, path: '/'}))

  const isUserPro = getUser?.isSubscriber;
  const haveInterprisePlan = getUser?.proSubscription === "bd_pro_empresas"

  return {
    props: {
      ...(await serverSideTranslations(locale, ['menu', 'user', 'prices', 'common'])),
      getUser,
      isUserPro,
      haveInterprisePlan
    }
  }
}

export default function UserPage({ getUser, isUserPro, haveInterprisePlan }) {
  const { t, ready } = useTranslation('user')
  const router = useRouter()
  const { query } = router
  const [userInfo, setUserInfo] = useState({})
  const [sectionSelected, setSectionSelected] = useState("profile")

  if (!ready) return null

  useEffect(() => {
    if (getUser) {
      setUserInfo(getUser)
    }
  }, [getUser])

  const choices = [
    {bar: t('username.publicProfile'), title: t('username.publicProfile'), value: "profile", id: "profile"},
    {bar: t('username.account'), title: t('username.account'), value: "account", id: "account"},
    {bar: t('username.changePassword'), title: t('username.changePassword'), value: "new_password", id: "password"},
    {bar: t('username.plansAndPayment'), title: t('username.plansAndPayment'), value: "plans_and_payment", id: "plans"},
    isUserPro && {bar: "BigQuery", title: "BigQuery", value: "big_query", id: "bigquery"},
    haveInterprisePlan && {bar: t('username.access'), title: t('username.access'), value: "accesses", id: "accesses"},
    userInfo?.keys?.edges?.length > 0 && {bar: t('dataAPI.title'), title: t('dataAPI.title'), value: "data_api", id: "dataapi"}
  ].filter(Boolean)

  useEffect(() => {
    const key = Object.keys(query)
    const removeElem = key.indexOf("username")
    if (removeElem !== -1) key.splice(removeElem, 1)

    if (key.length === 0) return

    for (const elements of choices) {
      if (elements && elements.value === key[0]) {
        setSectionSelected(elements.id)
      }
    }
  }, [query])

  return (
    <MainPageTemplate padding="70px 24px 40px !important" userTemplate footerTemplate="simple">
      <Stack
        paddingTop="40px"
        width="100%"
        maxWidth="1440px"
        flexDirection="row"
        margin="0 auto"
        spacing={0}
      >
        <Stack
          display={{base: "none", lg:"flex"}}
          flexDirection="column"
          spacing="8px"
          padding="4px 24px 0 0"
          width="272px"
          boxSizing="content-box"
        >
          <TitleText
            typography="large"
            display={{base: "none", lg: "flex"}}
            paddingLeft="15px"
          >
            {t('username.settings')}
          </TitleText>

          <Stack width="267px" spacing={0}>
            {choices.map((section) => (
              <Stack
                key={section.id}
                flexDirection="row"
                alignItems="center"
                paddingRight="5px"
                spacing={0}
                gap="4px"
                cursor="pointer"
                pointerEvents={sectionSelected === section.id ? "none" : "default"}
              >
                <Box 
                  width="3px"
                  height="24px"
                  backgroundColor={sectionSelected === section.id && "#2B8C4D"}
                  borderRadius="10px"
                />
                <LabelText
                  typography="small"
                  width="100%"
                  color={sectionSelected === section.id ? "#2B8C4D" : "#71757A"}
                  backgroundColor={sectionSelected === section.id && "#F7F7F7"}
                  _hover={{
                    backgroundColor:sectionSelected === section.id ? "#F7F7F7" :"#EEEEEE",
                  }}
                  borderRadius="8px"
                  padding="6px 8px"
                  onClick={() => router.replace(
                    { pathname: `/user/${userInfo.username}`, query: section.value },
                    undefined,
                    { shallow: true }
                  )}
                >
                  { section.bar }
                </LabelText>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack
          flex={1}
          width="100%"
          padding={{base: "", lg: "56px 0 0 24px"}}
          spacing={0}
        >
          <TitleText marginBottom="8px">
            {choices.find(choice => choice.id === sectionSelected)?.title}
          </TitleText>
          <Divider marginBottom="24px !important" borderColor="#DEDFE0"/>

          {sectionSelected === "profile" && <ProfileConfiguration userInfo={userInfo}/>}
          {sectionSelected === "account" && <Account userInfo={userInfo}/>}
          {sectionSelected === "password" && <NewPassword userInfo={userInfo}/>}
          {sectionSelected === "plans" && <PlansAndPayment userData={userInfo}/>}
          {sectionSelected === "bigquery" && <BigQuery userInfo={userInfo}/>}
          {sectionSelected === "accesses" && <Accesses userInfo={userInfo}/>}
          {sectionSelected === "dataapi" && <DataAPI userInfo={userInfo}/>}
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
