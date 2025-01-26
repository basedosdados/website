import {
  Stack,
  VStack
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button } from "../../components/molecules/uiUserPage";
import Link from "../../components/atoms/Link";
import { MainPageTemplate } from "../../components/templates/main";
import { EmailConfirmImage, EmailRecoveryImage } from "../../public/img/emailImage";
import Display from "../../components/atoms/Text/Display";
import BodyText from "../../components/atoms/Text/BodyText";

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
      <BodyText
        typography="large"
        color= "#464A51"
        textAlign="center"
      >{children}</BodyText>
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
            <Display
              typography="small"
              textAlign="center"
            >{t('activate.accountActive')}</Display>

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
            <Display
              typography="small"
              textAlign="center"
            >{t('activate.somethingWentWrong')}</Display>

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