import {
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useTranslation } from 'next-i18next';
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { withPages } from "../hooks/pages.hook";
import { MainPageTemplate } from "../components/templates/main";
import Display from "../components/atoms/Display";
import BigTitle from "../components/atoms/BigTitle";
import SectionText from "../components/atoms/SectionText";
import BodyText from "../components/atoms/BodyText";
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
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  const SectionBox = ({ children, ...props }) => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ base: "column", lg: "row" }}
        paddingTop={isMobileMod ? "112px" : "56px"}
        width="100%"
        maxWidth="1264px"
        margin="auto"
        {...props}
      >
        {children}
      </Box>
    )
  }

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
            fontFamily="Ubuntu"   
            textAlign={isMobileMod ? "start" : "center"}
            fontSize={{base: "20px", lg: "24px"}}
            fontWeight="400"
            letterSpacing={{base: "0.2px", lg: "0"}}
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
            color="#2B8C4D"
            paddingBottom={isMobileMod ? "24px" : "32px" }
            fontSize={isMobileMod ? "34px" : "50px" }
            lineHeight={isMobileMod ? "40px" : "54px"}
            letterSpacing={isMobileMod ? "-0.5px" : "-0.8px" }
          >
            {t('mainTitle1')} {isMobileMod ? " " : <br/>}
            {t('mainTitle2')} {isMobileMod ? " " : <br/>}
            {t('mainTitle3')}
          </Display>
          <BodyText paddingBottom="24px" dangerouslySetInnerHTML={{ __html: t('mainDescription1') }} />
          <BodyText paddingBottom="24px">{t('mainDescription2')}</BodyText>
        </Stack>

        <Stack 
          width={isMobileMod ? "100%" : {base: "445px", lg: "550px"}}
          height={isMobileMod ? "100%" : {base: "356px", lg: "430px"}}
          marginBottom={isMobileMod ? "0" : "104px"}
        >
          <TransparencyImage
            widthImage="100%"
            heightImage="100%"
          />
        </Stack>
      </SectionBox>

      <SectionBox
        paddingTop={isMobileMod ? "112px" : "104px"}
        paddingX="24px"
        alignItems="center"
      >
        <Stack
          display={isMobileMod ? "flex" : "none"}
          width="100%"
        >
          <Display
            paddingBottom="40px"
          >
            {t('survivalIndicator')}
          </Display>
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
          <Display
            display={isMobileMod ? "none" : "flex"}
            paddingBottom={{base: "8px", lg: "24px"}}
          >
            {t('survivalIndicator')}
          </Display>
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
        alignItems={isMobileMod ? "start" : "center"}
      >
        <Display
          textAlign={isMobileMod ? "start" : "center"}
          paddingBottom={isMobileMod ? "24px" : "8px"}
        >
          {t('accountingData')}
        </Display>
        <BodyText
          textAlign={isMobileMod ? "start" : "center"}
          paddingBottom={isMobileMod ? "24px" : "16px"}
        >
          {t('accountingDescription1')} {isMobileMod ? " " : <br/>} {t('accountingDescription2')}
        </BodyText>
        <Link
          as={RoundedButton}
          fontSize="15px"
          width="fit-content"
          href="/dataset/8b6c07fd-af78-44ad-8408-da57e6a0b3d4?table=26480073-cb94-41e2-9dfa-6b4ea76da9d9"
          target="_blank"
          locale={locale}
          color="#FFFFFF"
        >
          {t('accessButton')}
        </Link>
      </SectionBox>

      <SectionBox
        order={isMobileMod ? 0 : 1}
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

        <SectionText
          marginRight="24px"
          paddingTop="40px"
          textAlign={isMobileMod ? "start" : "end"}
          fontSize={isMobileMod ? "14px" : "16px"}
        >
          {t('fullDashboard')} <Link display="inline" fontSize={isMobileMod ? "14px" : "16px"} target="_blank" color="#42B0FF" href="https://perguntas.basedosdados.org/public/dashboard/ab21da85-bff2-435b-a819-953d785167b4"
          > {t('here')}</Link>.
        </SectionText>
      </SectionBox>

      <SectionBox
        paddingTop={{ base: "112px", lg: "104px" }}
        flexDirection="column"
        paddingX="24px"
      >
        <Display
          paddingBottom="24px"
        >
          {t('statuteReports')}
        </Display>

        <Stack
          width="100%"
          flexDirection={isMobileMod ? "column" : "row"}
          justifyContent="space-between"
          spacing={0}
        >
          <BodyText paddingBottom="24px" maxWidth={isMobileMod ? "100%" : "45%"}>
            {t('statuteDescription')}
          </BodyText>
        
          <BodyText paddingBottom="24px" maxWidth={isMobileMod ? "100%" : "45%"}>
            {t('reportsDescription')}
          </BodyText>
        </Stack>
      </SectionBox>

      <Stack
        paddingTop="16px"
        width="100%"
        maxWidth="1264px"
        margin="auto"
        paddingX="24px"
      >
        <Link
          fontFamily="Ubuntu"
          fontSize="18px"
          letterSpacing="0.3px"
          target="_blank"
          color="#42B0FF"
          href="https://storage.googleapis.com/basedosdados-website/pdf/bd_estatuto_social.pdf"
        >
          {t('DBStatute')}
        </Link>
      </Stack>

      <Stack
        paddingTop="16px"
        width="100%"
        maxWidth="1264px"
        margin="auto"
        paddingX="24px"
      >
        <Link
          fontFamily="Ubuntu"
          fontSize="18px"
          letterSpacing="0.3px"
          target="_blank"
          color="#42B0FF"
          href="https://drive.google.com/file/d/1OvqJWAg-m3IRt3NAYZB20uxemNqXJ_MO/view?usp=drive_link"
        >
          {t('DBReport2023')}
        </Link>
      </Stack>

      <Stack
        paddingTop="16px"
        width="100%"
        maxWidth="1264px"
        margin="auto"
        paddingX="24px"
      >
        <Link
          fontFamily="Ubuntu"
          fontSize="18px"
          letterSpacing="0.3px"
          target="_blank"
          color="#42B0FF"
          href="https://storage.googleapis.com/basedosdados-website/pdf/bd_relatorio_anual_2022.pdf"
        >
          {t('DBReport2022')}
        </Link>
      </Stack>

      <Stack
        paddingTop="16px"
        paddingX="24px"
        paddingBottom={{ base: "80px", lg: "104px" }}
        width="100%"
        maxWidth="1264px"
        margin="auto"
      >
        <Link
          fontFamily="Ubuntu"
          fontSize="18px"
          letterSpacing="0.3px"
          target="_blank"
          color="#42B0FF"
          href="https://storage.googleapis.com/basedosdados-website/pdf/bd_relatorio_anual_2021.pdf"
        >
          {t('DBReport2021')}
        </Link>
      </Stack>

      <Stack
        backgroundColor="#252A32"
        width="100%"
        paddingX="24px"
      >
        <Stack
          width="100%"
          maxWidth="1264px"
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
            <BigTitle 
              paddingBottom={{base: "20px", lg: "24px"}}
              color="#FFF"
            >
              {t('supportTitle1')} {isMobileMod ? " " : <br/>} {t('supportTitle2')}
            </BigTitle>
            <BodyText 
              fontSize="16px"
              letterSpacing="0.2px"
              lineHeight="27px"
              paddingBottom="24px"
              color="#FFF"
            >
              {t('supportDescription')}
            </BodyText>
            <RoundedButton
              backgroundColor="#FF8484"
              width="fit-content"
              height="40px"
              fontSize="15px"
              onClick={() => router.push("/#support")}
            >
              {t('supportButton')}
            </RoundedButton>
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