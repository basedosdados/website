import {
  Text,
  Stack,
  VStack
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from "../../components/molecules/uiUserPage";
import Link from "../../components/atoms/Link";
import { MainPageTemplate } from "../../components/templates/main";
import { EmailConfirmImage, EmailRecoveryImage } from "../../public/img/emailImage";

export async function getServerSideProps(context) {
  const { query, locale } = context;

  const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/api/user/activeAccount?q=${query.q}&p=${query.p}`, { method: "GET" })
    .then(res => res.json());
  const data = result;

  return {
    props: {
      ...(await serverSideTranslations(locale, ['user'])),
      data
    }
  }
}

export default function ActiveAccount({ data }) {
  const { t } = useTranslation('user');

  const SectionText = ({ children }) => {
    return (
      <Text
        color= "#464A51"
        fontFamily= "Roboto"
        fontWeight= "400"
        fontSize= "18px"
        lineHeight= "26px"
        textAlign="center"
      >{children}</Text>
    )
  }

  return (
    <MainPageTemplate display="flex" justifyContent="center" cleanTemplate>
      <Stack
        display="flex"
        justifyContent="center"
        width="800px"
        height="100%"
        marginTop={{base: "150px", lg: "50px"}}
        marginX="27px"
        spacing="40px"
        alignItems="center"
      >
        {data?.success === true ?
          <EmailConfirmImage justifyContent="center" marginBottom="8px"/>
        :
          <EmailRecoveryImage justifyContent="center" marginBottom="8px"/>
        }

        {data?.success === true ?
          <VStack spacing={4}>
            <Text
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="36px"
              lineHeight="48px"
              color="#252A32"
              textAlign="center"
            >{t('activate.accountActive')}</Text>

            <SectionText>{t('activate.congratulations')}</SectionText>
            <SectionText>{t('activate.thankYou')}</SectionText>
            <SectionText>{t('activate.welcome')}</SectionText>

            <Link href='/user/login'>
              <Button onClick={() => {}}>
                {t('activate.loginToAccount')}
              </Button>
            </Link>
          </VStack>
        :
          <VStack spacing={4}>
            <Text
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="36px"
              lineHeight="48px"
              color="#252A32"
              textAlign="center"
            >{t('activate.somethingWentWrong')}</Text>

            <SectionText textAlign="center">{t('activate.activationProblem')}</SectionText>
            <Link href='/contact'>
              <Button onClick={() => {}}>
                {t('activate.contactUs')}
              </Button>
            </Link>
          </VStack>
        }
      </Stack>
    </MainPageTemplate>
  )
}