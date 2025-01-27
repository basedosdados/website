import { Center } from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import FiveHundredTemplate from "../components/templates/500";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../components/templates/main";
import Button from "../components/atoms/Button";
import Display from "../components/atoms/Text/Display";
import TitleText from "../components/atoms/Text/TitleText";
import BodyText from "../components/atoms/Text/BodyText";
import Link from "../components/atoms/Link";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu',])),
    },
  };
}

export default function InternalServerError() {
  const { t } = useTranslation('common');

  return (
    <MainPageTemplate>
      <FiveHundredTemplate 
        alignItems={{base: "flex-end", lg: "center"}}
        marginTop={{base: "120px", md: "0"}}
        padding="80px 24px"
      >
        <Display marginBottom="24px">{t('error.ops')}</Display>
        <Center flexDirection="column" marginBottom="24px" gap="8px">
          <TitleText typography="large">{t('error.system')}</TitleText>
          <BodyText typography="large">{t('error.verifyStatusSystem')}</BodyText>
        </Center>
        <Link
          target="_blank"
          href="https://status.basedosdados.org/"
        >
          <Button
            height="54px"
            backgroundColor="#0D99FC"
            padding="10px 16px"
            fontSize="20px"
            lineHeight="30px"
            _hover={{
              backgroundColor: "#0B89E2"
            }}
          >
            {t('error.checkStatus')}
          </Button>
        </Link>
      </FiveHundredTemplate>
    </MainPageTemplate>
  )
}