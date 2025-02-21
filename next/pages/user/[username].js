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

  // Remove comment markers and restore token validation
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

  // Replace getUser function call with direct fetch
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
  const [sectionSelected, setSectionSelected] = useState(0)

  if (!ready) return null

  useEffect(() => {
    if (getUser) {
      setUserInfo(getUser)
    }
  }, [getUser])

  const choices = [
    {bar: t('username.publicProfile'), title: t('username.publicProfile'), value: "profile"},
    {bar: t('username.account'), title: t('username.account'), value: "account"},
    {bar: t('username.changePassword'), title: t('username.changePassword'), value: "new_password"},
    {bar: t('username.plansAndPayment'), title: t('username.plansAndPayment'), value: "plans_and_payment"},
    isUserPro && {bar: "BigQuery", title: "BigQuery", value: "big_query"},
    haveInterprisePlan && {bar: t('username.access'), title: t('username.access'), value: "accesses"},
    userInfo?.keys?.edges?.length > 0 && {bar: t('dataAPI.title'), title: t('dataAPI.title'), value: "data_api"}
  ]
    .filter(Boolean)
    .map((choice, index) => ({ ...choice, index }))

  useEffect(() => {
    const key = Object.keys(query)
    const removeElem = key.indexOf("username")
    if (removeElem !== -1) key.splice(removeElem, 1)

    if (key.length === 0) return

    for (const elements of choices) {
      if (elements && elements.value === key[0]) {
        setSectionSelected(elements.index)
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
            {choices.map((section, index) => (
              <Stack
                key={index}
                flexDirection="row"
                alignItems="center"
                paddingRight="5px"
                spacing={0}
                gap="4px"
                cursor="pointer"
                pointerEvents={sectionSelected === index ? "none" : "default"}
              >
                <Box 
                  width="3px"
                  height="24px"
                  backgroundColor={sectionSelected === index && "#2B8C4D"}
                  borderRadius="10px"
                />
                <LabelText
                  typography="small"
                  width="100%"
                  color={sectionSelected === index ? "#2B8C4D" : "#71757A"}
                  backgroundColor={sectionSelected === index && "#F7F7F7"}
                  _hover={{
                    backgroundColor:sectionSelected === index ? "#F7F7F7" :"#EEEEEE",
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
            {choices[sectionSelected].title}
          </TitleText>
          <Divider marginBottom="24px !important" borderColor="#DEDFE0"/>

          {choices[sectionSelected].value === "profile" && <ProfileConfiguration userInfo={userInfo}/>}
          {choices[sectionSelected].value === "account" && <Account userInfo={userInfo}/>}
          {choices[sectionSelected].value === "new_password" && <NewPassword userInfo={userInfo}/>}
          {choices[sectionSelected].value === "plans_and_payment" && <PlansAndPayment userData={userInfo}/>}
          {choices[sectionSelected].value === "big_query" && <BigQuery userInfo={userInfo}/>}
          {choices[sectionSelected].value === "accesses" && <Accesses userInfo={userInfo}/>}
          {choices[sectionSelected].value === "data_api" && <DataAPI userInfo={userInfo}/>}
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
