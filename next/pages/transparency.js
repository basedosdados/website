import {
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { useTranslation } from 'next-i18next';
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { withPages } from "../hooks/pages.hook";
import { MainPageTemplate } from "../components/templates/main";
import Link from "../components/atoms/Link";
import RoundedButton from "../components/atoms/RoundedButton";
import TransparencyImage from "../public/img/transparencyImage";
import DonationImage from "../public/img/donationImage";

export async function getStaticProps({ locale }) {
  const pages = await withPages();
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'transparency', 'menu'])),
      pages,
    },
  };
}

export default function Transparency({ pages }) {
  const { t } = useTranslation('transparency');
  const { locale } = useRouter();
  const router = useRouter();

  const SectionBox = ({ children, ...props }) => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ base: "column", lg: "row" }}
        paddingTop={{base: "112px", md: "56px"}}
        width="100%"
        maxWidth="1440px"
        margin="auto"
        {...props}
      >
        {children}
      </Box>
    )
  }

  const Display = ({ children, ...props }) => (
    <Text
      fontFamily="Roboto"
      fontWeight="500"
      fontSize="36px"
      lineHeight="48px"
      color="#2B8C4D"
      {...props}
    >
      {children}
    </Text>
  );

  const TitleSection = ({ children, ...props }) => (
    <Text
      fontFamily="Roboto"
      fontWeight="500"
      fontSize="28px"
      lineHeight="42px"
      color="#252A32"
      {...props}
    >
      {children}
    </Text>
  );

  const BodyText = ({ children, ...props }) => (
    <Text
      fontFamily="Roboto"
      fontWeight="400"
      fontSize="18px"
      lineHeight="26px"
      color="#464A51"
      {...props}
    >
      {children}
    </Text>
  );

  const GraphicsBox = ({ text, url, ...props }) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        maxWidth={{ base: "100%", lg: "45%" }}
        width={{base: "350px", lg: "650px"}}
        height={{base: "320px", lg: "400px"}}
        marginTop="0 !important"
        {...props}
      >
        {text &&
          <Text
            width="100%"
            fontFamily="Roboto"   
            textAlign={{base: "start", md: "center"}}
            fontSize="24px"
            lineHeight="36px"
            fontWeight="500"
            minHeight="30px"
            marginBottom={{base: "0px", lg: "32px"}}
            color="#252A32"
          >
            {text}
          </Text>
        }

        <iframe
          src={url}
          frameBorder="0"
          width="100%"
          height="100%"
          allowtransparency="true"
        />
      </Box>
    )
  }

  const LinkReports = ({ children, url, ...props }) => (
    <Stack
      paddingTop="16px"
      width="100%"
      maxWidth="1440px"
      margin="auto"
      paddingX="24px"
      {...props}
    >
      <Link
        target="_blank"
        color="#0068C5"
        _hover={{color: "#0057A4"}}
        fontSize="18px"
        lineHeight="28px"
        fontWeight="400"
        href={url}
      >
        {children}
      </Link>
    </Stack>
  );

  return (
    <MainPageTemplate paddingBottom="0">
      <Head>
        <title>{t('pageTitle')}</title>
        <meta
          property="og:title"
          content={t('pageTitle')}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={t('ogDescription')}
          key="ogdesc"
        />
      </Head>

      <SectionBox 
        alignItems="center"
        paddingX="24px"
      >
        <Stack
          spacing={0}
          maxWidth={{ base: "100%", lg: "45%" }}
        >
          <Display
            display={{base: "block", md:"flex"}}
            flexDirection="column"
            color="#2B8C4D"
            paddingBottom="32px"
          >
            <Text as="span">{t('mainTitle1')}</Text>
            <Text as="span">{t('mainTitle2')}</Text>
            <Text as="span">{t('mainTitle3')}</Text>
          </Display>
          <BodyText paddingBottom="24px" dangerouslySetInnerHTML={{ __html: t('mainDescription1') }} />
          <BodyText paddingBottom="24px">{t('mainDescription2')}</BodyText>
        </Stack>

        <Stack 
          width={{base: "100%", md: "445px", lg: "550px"}}
          height={{base:"100%", md: "356px", lg: "430px"}}
          marginBottom={{base: "0", md: "104px"}}
        >
          <TransparencyImage
            widthImage="100%"
            heightImage="100%"
          />
        </Stack>
      </SectionBox>

      <SectionBox
        paddingTop={{base: "112px", md: "104px"}}
        paddingX="24px"
        alignItems="center"
      >
        <Stack
          display={{base: "flex", md: "none"}}
          width="100%"
        >
          <TitleSection
            paddingBottom="40px"
          >
            {t('survivalIndicator')}
          </TitleSection>
        </Stack>

        <Stack 
          maxWidth={{ base: "100%", lg: "45%" }}
          width={{base: "350px", lg: "450px"}}
          height={{base: "300px", lg: "375px"}}
          marginLeft={{base: "0px", lg: "64px"}}
        >
          <iframe
            src="https://perguntas.basedosdados.org/public/question/80ad0ba9-bfa9-4427-96a0-675fb2252b37#titled=false&bordered=false"
            frameBorder="0"
            width="100%"
            height="100%"
            allowtransparency="true"
          />
        </Stack>

        <Stack 
          maxWidth={{ base: "100%", lg: "45%" }}
          paddingTop={{base: "24px", lg: "0px"}}
          spacing={0}
        >
          <TitleSection
            display={{base: "none", md: "flex"}}
            paddingBottom={{base: "8px", lg: "24px"}}
          >
            {t('survivalIndicator')}
          </TitleSection>
          <BodyText paddingBottom="24px">
            {t('survivalDescription1')}
          </BodyText>
          <BodyText paddingBottom="24px">
            {t('survivalDescription2')}
          </BodyText>
        </Stack>
      </SectionBox>

      <SectionBox
        flexDirection="column"
        paddingTop={{ base: "88px", lg: "152px" }}
        paddingX="24px"
        alignItems={{base: "start", md: "center"}}
      >
        <TitleSection
          textAlign={{base: "start", md: "center"}}
          paddingBottom={{base: "24px", md: "8px"}}
        >
          {t('accountingData')}
        </TitleSection>
        <BodyText
          display={{base: "block", md:"flex"}}
          flexDirection="column"
          textAlign={{base: "start", md: "center"}}
          paddingBottom={{base: "24px", md: "16px"}}
        >
          <Text as="span">{t('accountingDescription1')}</Text>
          <Text as="span">{t('accountingDescription2')}</Text>
        </BodyText>
        <Link
          locale={locale}
          target="_blank"
          href="/dataset/8b6c07fd-af78-44ad-8408-da57e6a0b3d4?table=26480073-cb94-41e2-9dfa-6b4ea76da9d9"
        >
          <Box
            as="p"
            target="_self"
            display="flex"
            alignItems="center"
            height="54px"
            width="fit-content"
            borderRadius="8px"
            backgroundColor="#0D99FC"
            padding="10px 16px"
            cursor="pointer"
            color="#FFF"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="20px"
            lineHeight="30px"
            _hover={{
              backgroundColor: "#0B89E2"
            }}
          >
            {t('accessButton')}
          </Box>
        </Link>
      </SectionBox>

      <SectionBox
        order={{base: 0, md: 1}}
        paddingTop={{ base: "40px", lg: "64px" }}
        paddingX="24px"
        flexDirection="column"
      >
        <Stack
          flexDirection={{ base: "column", lg: "row" }}
          justifyContent="center"
          gridGap={{ base: "64px", lg: "80px" }}
        >
          <GraphicsBox
            text={t('accumulatedRevenue')}
            url="https://perguntas.basedosdados.org/public/question/c41beae5-94d3-41e2-9161-a12492b0cae0#titled=false&bordered=false"
          />

          <GraphicsBox 
            text={t('accumulatedExpenses')}
            url="https://perguntas.basedosdados.org/public/question/312842db-4ea9-455b-be7a-98d96e742ea7#titled=false&bordered=false"
          />
        </Stack>

        <Text
          marginRight="24px"
          paddingTop="40px"
          textAlign={{base: "start", md: "end"}}
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="16px"
          lineHeight="24px"
          color="#464A51"
        >
          {t('fullDashboard')} <Link
          href="https://perguntas.basedosdados.org/public/dashboard/ab21da85-bff2-435b-a819-953d785167b4"
          display="inline"
          target="_blank"
          color="#0068C5"
          _hover={{color: "#0057A4"}}
          fontSize="16px"
          fontWeight="500"
          > {t('here')}</Link>.
        </Text>
      </SectionBox>

      <SectionBox
        paddingTop={{ base: "112px", lg: "104px" }}
        flexDirection="column"
        paddingX="24px"
      >
        <TitleSection
          paddingBottom="24px"
        >
          {t('statuteReports')}
        </TitleSection>

        <Stack
          width="100%"
          flexDirection={{base:"column", md: "row"}}
          justifyContent="space-between"
          spacing={0}
        >
          <BodyText paddingBottom="24px" maxWidth={{base: "100%", md: "45%"}}>
            {t('statuteDescription')}
          </BodyText>
        
          <BodyText paddingBottom="24px" maxWidth={{base: "100%", md: "45%"}}>
            {t('reportsDescription')}
          </BodyText>
        </Stack>
      </SectionBox>

      <LinkReports
        url="https://storage.googleapis.com/basedosdados-website/pdf/bd_estatuto_social.pdf"
      >
          {t('DBStatute')}
      </LinkReports>

      <LinkReports
        url="https://drive.google.com/file/d/1OvqJWAg-m3IRt3NAYZB20uxemNqXJ_MO/view?usp=drive_link"
      >
          {t('DBReport2023')}
      </LinkReports>

      <LinkReports
        url="https://storage.googleapis.com/basedosdados-website/pdf/bd_relatorio_anual_2022.pdf"
      >
          {t('DBReport2022')}
      </LinkReports>

      <LinkReports
        paddingBottom={{ base: "80px", lg: "104px" }}
        url="https://storage.googleapis.com/basedosdados-website/pdf/bd_relatorio_anual_2021.pdf"
      >
          {t('DBReport2021')}
      </LinkReports>

      <Stack
        backgroundColor="#252A32"
        width="100%"
        paddingX="24px"
      >
        <Stack
          width="100%"
          maxWidth="1440px"
          paddingTop={{ base: "64px", lg: "80px" }}
          paddingBottom={{ base: "56px", lg: "72px" }}
          justify="space-between"
          direction={{ base: "column", lg: "row" }}
          margin="auto"
        >
          <Stack
            paddingTop={{ base: "0px", lg: "16px" }}
            maxWidth={{ base: "100%", lg: "42%" }}
            spacing={0}
          >
            <Text
              display={{base: "block", md:"flex"}}
              flexDirection="column"
              paddingBottom={{base: "20px", lg: "24px"}}
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="28px"
              lineHeight="42px"
              color="#FFF"
            >
              {t('supportTitle1')}
              {t('supportTitle2')}
            </Text>
            <BodyText 
              paddingBottom="24px"
              color="#FFF"
            >
              {t('supportDescription')}
            </BodyText>
            <Link
              locale={locale}
              target="_blank"
              href="/#support"
            >
              <Box
                as="p"
                target="_self"
                display="flex"
                alignItems="center"
                height="54px"
                width="fit-content"
                borderRadius="8px"
                backgroundColor="#0D99FC"
                padding="10px 16px"
                cursor="pointer"
                color="#FFF"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="20px"
                lineHeight="30px"
                _hover={{
                  backgroundColor: "#0B89E2"
                }}
              >
                {t('supportButton')}
              </Box>
            </Link>
          </Stack>

          <Stack 
            maxWidth={{ base: "100%", lg: "45%" }}
            paddingTop={{base: "32px", lg: "0px"}}
          >
            <DonationImage
              paddingRight={{ base: "0px", lg: "120px"}}
              widthImage={{ base: "90%", lg: "326px"}}
              heightImage={{ base: "90%", lg: "307px"}}
            />
          </Stack>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
