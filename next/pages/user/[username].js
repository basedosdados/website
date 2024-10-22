import {
  Stack,
  Box,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { serialize } from 'cookie';
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../../components/templates/main";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import BigTitle from "../../components/atoms/BigTitle";
import SectionTitle from "../../components/atoms/SectionTitle";

import {
  ProfileConfiguration,
  Account,
  NewPassword,
  PlansAndPayment,
  BigQuery
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

  return {
    props: {
      ...(await serverSideTranslations(locale, ['menu', 'user', 'prices', 'common'])),
      getUser,
    }
  }
}

export default function UserPage({ getUser }) {
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

  const isUserPro = () => {
    if(getUser?.internalSubscription?.edges?.[0]?.node?.isActive === true) return true
    return false
  }

  const choices = [
    {bar: t('username.publicProfile'), title: t('username.publicProfile'), value: "profile", index: 0},
    {bar: t('username.account'), title: t('username.account'), value: "account", index: 1},
    {bar: t('username.changePassword'), title: t('username.changePassword'), value: "new_password", index: 2},
    {bar: t('username.plansAndPayment'), title: t('username.plansAndPayment'), value: "plans_and_payment", index: 3},
    isUserPro() && {bar: "BigQuery", title: "BigQuery", value: "big_query", index: 4},
  ].filter(Boolean)

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
        flexDirection="column"
        margin="0 auto"
        gap="8px"
        spacing={0}
      >
        <BigTitle display={isMobileMod() ? "none" : "flex"}>{t('username.settings')}</BigTitle>

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          spacing={0}
          gap="80px"
          width="100%"
          marginBottom={isMobileMod() ? "0px" : "80px !important"}
        >
          <Stack
            display={isMobileMod() ? "none" : "flex"}
            width="fit-content"
          >
            {choices.map((section, index) => (
              <Box
                key={index}
                borderLeft={ sectionSelected === index ? "3px solid #2B8C4D" : "transparent" }
                width="100%"
              >
                <Text
                  fontFamily="Ubuntu"
                  fontSize="16px"
                  lineHeight="27px"
                  letterSpacing="0.2px"
                  cursor="pointer"
                  fontWeight={sectionSelected === index ? "500" : "300"}
                  color={sectionSelected === index ? "#2B8C4D" : "#7D7D7D"}
                  _hover={sectionSelected !== index && {  opacity: "0.6" , fontWeight: "500" }}
                  padding="0 24px"
                  width="100%"
                  onClick={() => router.push({pathname: `/user/${userInfo.username}`, query: section.value})}
                >
                  {section.bar}
                </Text>
              </Box>
            ))}
          </Stack>

          <Stack
            flex={1}
            maxWidth="800px"
            width="100%"
            spacing={0}
          >
            <SectionTitle marginBottom="8px">{choices[sectionSelected].title}</SectionTitle>
            <Divider marginBottom={isMobileMod() ? "40px !important" : "32px !important"} borderColor="#DEDFE0"/>

            {sectionSelected === 0 && <ProfileConfiguration userInfo={userInfo}/>}
            {sectionSelected === 1 && <Account userInfo={userInfo}/>}
            {sectionSelected === 2 && <NewPassword userInfo={userInfo}/>}
            {sectionSelected === 3 && <PlansAndPayment userData={userInfo}/>}
            {sectionSelected === 4 && <BigQuery userInfo={userInfo}/>}
          </Stack>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
