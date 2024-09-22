import {
  Stack,
  VStack
} from "@chakra-ui/react";
import Display from "../../components/atoms/Display";
import RoundedButton from "../../components/atoms/RoundedButton";
import SectionText from "../../components/atoms/SectionText";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import { MainPageTemplate } from "../../components/templates/main";
import { EmailConfirmImage, EmailRecoveryImage } from "../../public/img/emailImage";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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

  return (
    <MainPageTemplate display="flex" justifyContent="center" cleanTemplate>
      <Stack
        display="flex"
        justifyContent="center"
        width="570px"
        height="100%"
        marginTop={isMobileMod() ? "150px" : "50px"}
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
            <Display
              fontSize={isMobileMod() ? "28px" : "34px"}
              lineHeight={isMobileMod() ? "36px" : "44px"}
              letterSpacing={isMobileMod() ? "0" : "-0.4px"}
              fontweith="500"
              textAlign="center"
            >{t('activate.accountActive')}</Display>

            <SectionText>{t('activate.congratulations')}</SectionText>
            <SectionText>{t('activate.thankYou')}</SectionText>
            <SectionText>{t('activate.welcome')}</SectionText>

            <RoundedButton
              borderRadius="30px"
              onClick={() => window.open("/user/login", "_self")}
            >
              {t('activate.loginToAccount')}
            </RoundedButton>
          </VStack>
        :
          <VStack spacing={4}>
            <Display
              fontSize={isMobileMod() ? "28px" : "34px"}
              lineHeight={isMobileMod() ? "36px" : "44px"}
              letterSpacing={isMobileMod() ? "0" : "-0.4px"}
              fontweith="500"
              textAlign="center"
            >{t('activate.somethingWentWrong')}</Display>

            <SectionText textAlign="center">{t('activate.activationProblem')}</SectionText>
            <RoundedButton
              borderRadius="30px"
              onClick={() => window.open("/contato", "_self")}
            >
              {t('activate.contactUs')}
            </RoundedButton>
          </VStack>
        }
      </Stack>
    </MainPageTemplate>
  )
}