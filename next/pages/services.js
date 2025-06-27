import {
  Stack,
  VStack,
  Box,
  Skeleton,
  Grid,
  GridItem
} from "@chakra-ui/react";
import Image from "next/image";
import Head from "next/head";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isMobileMod } from "../hooks/useCheckMobile.hook";
import { withPages } from "../hooks/pages.hook";
import { MainPageTemplate } from "../components/templates/main";

import Button from "../components/atoms/Button";
import Link from "../components/atoms/Link";
import Display from "../components/atoms/Text/Display";
import TitleText from "../components/atoms/Text/TitleText";
import LabelText from "../components/atoms/Text/LabelText";
import BodyText from "../components/atoms/Text/BodyText";

const ImageSection = "/img/image-diagnostico-de-maturidade-de-dados.png";
const ImageCard = "/img/fact-check.png";
import CheckIcon from "../public/img/icons/checkIcon";
import PointsIcon from "../public/img/icons/pointsIcon";


export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'services', 'menu'])),
      ...(await withPages()),
    },
  };
}

const SectionSelector = ({ icon, text, anchoring }) => {
  return (
    <GridItem
      as="a"
      href={`#${anchoring}`}
      display="flex"
      flexDirection="row"
      gap="16px"
      justifyContent="flex-start"
      alignItems="center"
      cursor="pointer"
      maxWidth={{base: "100%", md: "480px"}}
      maxHeight="110px"
      padding="35px 24px"
      boxSizing="content-box"
      borderTop="1px solid #DEDFE0"
      borderLeft="1px solid #DEDFE0"
      fill="#878A8E"
      _hover={{
        color: "#2B8C4D",
        backgroundColor: "#D5E8DB",
        fill: "#2B8C4D",
      }}
    >
      {icon}
      <LabelText typography="large" color="current-color">
        {text}
      </LabelText>
    </GridItem>
  )
}

const Section = ({
  id = "",
  title,
  subtitle,
  content = [],
  cards = []
}) => {

  return (
    <Stack
      id={id}
      paddingTop="40px"
      scrollMarginTop="20px"
      spacing={0}
    >
      <Stack
        padding="40px 24px"
        boxSizing="content-box"
        spacing="16px"
        maxWidth="1440px"
        margin="0 auto"
      >
        <Display>
          {title}
        </Display>
        <TitleText typography="large" color="#71757A">
          {subtitle}
        </TitleText>
      </Stack>

      {content[0] && (
        <Stack
          width={{base: "inherit",md: "100%"}}
          maxWidth="1440px"
          alignItems="center"
          margin="0 auto !important"
          padding="80px 24px"
          boxSizing="content-box"
          flexDirection={{base: "column-reverse", md: "row"}}
          justifyContent="space-between"
          spacing={0}
          gap="40px"
        >
          <TitleText typography="large" maxWidth="675px">
            {content[0].text || ""}
          </TitleText>
          {content[0].img.id && 
            <Image
              src={content[0].img.id}
              alt={content[0].img.alt || ""}
              width={content[0].img.width || 600}
              height={content[0].img.height || 300}
              style={{ objectFit: "contain" }}
            />
          }
        </Stack>
      )}

      {content[1] && (
        <Stack
          width="100%"
          backgroundColor="#252A32"
          spacing={0}
        >
          <Stack
            width="100%"
            maxWidth="1440px"
            padding="80px 24px"
            boxSizing="content-box"
            flexDirection={{base: "column", md: "row"}}
            justifyContent="space-between"
            alignItems="center"
            margin="0 auto !important"
            spacing={0}
            gap="40px"
          >
            {(content[1]?.text || content[1]?.subText) && (
              <Stack
                flex={1}
                spacing={0}
              >
                {content[1].text && (
                  <Display typography="large" color="#FFF">
                    {content[1].text}
                  </Display>
                )}
                {content[1].subText && (
                  <TitleText typography="large" color="#EEEEEE">
                    {content[1].subText}
                  </TitleText>
                )}
              </Stack>
            )}
            {content[1]?.mention &&
              <Stack
                flex={1}
                spacing="24px"
              >
                <PointsIcon fill="#2B8C4D" widthImage="25px" heightImage="22px"/>
                {(content[1]?.text || content[1]?.subText) ? 
                  <TitleText typography="large" color="#FFF" maxWidth="1200px">
                    {content[1]?.mention?.content}
                  </TitleText>
                :
                  <Display typography="small" color="#FFF" maxWidth="1200px">
                    {content[1]?.mention?.content}
                  </Display>
                }
                <Stack spacing={0}>
                  <BodyText typography="large" color="#FFF">
                    {content[1]?.mention?.author}
                  </BodyText>
                  <BodyText typography="large" color="#EEEEEE">
                    {content[1]?.mention?.position}
                  </BodyText>
                </Stack>
              </Stack>
            }
          </Stack>
        </Stack>
      )}
      {cards &&
        <Grid
          maxWidth="1440px"
          margin="0 auto !important"
          padding="80px 24px"
          boxSizing="content-box"
          templateColumns={{base: "1fr", md: "1fr 1fr"}}
          gap="24px"
        >
          {cards.map((elm, index) => (
            <GridItem
              key={index}
              boxSizing="content-box"
              padding="32px"
              borderRadius="32px"
              backgroundColor="#E4F2FF"
            >
              <Image src={elm.icon} width={80} height={80}/>
              <TitleText marginTop="8px">{elm.title}</TitleText>
              <TitleText color="#71757A">{elm.content}</TitleText>
            </GridItem>
          ))}
        </Grid>
      }
    </Stack>
  )
}

export default function Services() {
  const { t } = useTranslation('services');

  const sectionsNav = [
    {icon: <CheckIcon/>, text: "Diagnóstico de Maturidade de Dados", anchoring: "diagnostico-de-maturidade-de-dados"},
    {icon: <CheckIcon/>, text: "Arquitetura de Dados", anchoring: "arquitetura-de-dados"},
    {icon: <CheckIcon/>, text: "Portal de Dados", anchoring: "portal-de-dados"},
    {icon: <CheckIcon/>, text: "Painel Gerencial", anchoring: "painel-gerencial"},
    {icon: <CheckIcon/>, text: "Chatbot", anchoring: "chatbot"},
    {icon: <CheckIcon/>, text: "Formação", anchoring: "formacao"}
  ]

  return (
    <MainPageTemplate>
      <Head>
        <title>{t('pageTitle')}</title>
        <meta
          property="og:title"
          content={t('metaTitle')}
          key="ogtitle"
        />
      </Head>

      <Stack
        spacing={0}
        padding={{base: "40px 24px 8px", md: "40px 24px 40px"}}
        maxWidth="1440px"
        margin="0 auto"
        boxSizing="content-box"
      >
        <Display
          as="h1"
          typography={isMobileMod() ? "small" : "large"}
          paddingBottom="16px"
        >
          {t("section-1-title")}
        </Display>
        <TitleText
          as="h2"
          typography={isMobileMod() ? "small" : "medium"}
          color="#71757A"
          paddingBottom="32px"
        >
          {t("section-1-subtitle")}
        </TitleText>
        <Link
          href=""
          target="_blank"
          width={isMobileMod() ? "100%" : "fit-content"}
        >
          <Button
            height="54px"
            width="100%"
            justifyContent="center"
          >
            <LabelText typography="x-large" color="currentColor">
              {t("section-1-button")}
            </LabelText>
          </Button>
        </Link>
      </Stack>

      <Stack
        spacing={0}
        width="100%"
        backgroundColor="#F7F7F7"
        margin="24px 0 40px"
      >
        <Grid
          width="100%"
          maxWidth="1440px"
          templateColumns={{base: "1fr", md: "1fr 1fr 1fr"}}
          margin="0 auto"
          borderBottom="1px solid #DEDFE0"
          borderRight="1px solid #DEDFE0"
        >
          {sectionsNav.map((elm, index) => (
            <SectionSelector
              key={`${elm.text}_${index}`}
              icon={elm.icon}
              text={elm.text}
              anchoring={elm.anchoring}
            />
          ))}
        </Grid>
      </Stack>

      <Section
        id="diagnostico-de-maturidade-de-dados"
        title="Diagnóstico de Maturidade de Dados"
        subtitle="Entregamos uma análise técnica e independente, com diagnóstico detalhado e um plano de ação claro para fortalecer sua gestão de dados com eficiência e estratégia."
        content={[
          {
            text: "Avaliamos o estágio de maturidade da sua organização em múltiplos eixos, como governança, cultura, competências, processos e tecnologia. O diagnóstico acompanha um plano de ação concreto para o curto, médio e longo prazo.",
            img: {
              id: ImageSection,
              alt: "diagnostico-de-maturidade-de-dados",
              width: 600,
              height: 300,
            }
          },
          {
            text: "5x métrica",
            subText: "texto complementar para a métrica",
            mention: {
              content: "Os painéis estão diretamente integrados ao nosso datalake, o que garante atualizações contínuas, otimizando o monitoramento de indicadores e facilitando a tomada de decisões por parte das diferentes equipes da Fundação Lemann.",
              author: "Nome",
              position: "Cargo"
            }
          }
        ]}
        cards={[
          {
            icon: ImageCard,
            title: "Diagnóstico completo e plano de ação aplicável.",
            content: "Mapeamos práticas, fluxos e ferramentas de dados para identificar gargalos e oportunidades, oferecendo recomendações realistas e adaptadas ao seu contexto."
          },
          {
            icon: ImageCard,
            title: "Base para decisões mais estratégicas.",
            content: "Recomendamos perfis profissionais, melhorias organizacionais e opções tecnológicas para orientar investimentos e fortalecer a gestão de dados da sua organização."
          }
        ]}
      />

      <Section
        id="arquitetura-de-dados"
        title="Arquitetura de Dados"
        subtitle="Configuramos toda a infraestrutura necessária para a ingestão, modelagem, tratamento e consumo dos seus dados — com eficiência, segurança e privacidade — para gerar valor em qualquer análise ou produto digital."
        content={[
          {
            text: "Estruturamos ambientes em nuvem, desenhamos a modelagem dos dados e implementamos pipelines e APIs para ingestão, tratamento e integração entre dados públicos e privados.",
            img: {
              id: ImageSection,
              alt: "arquitetura-de-dados",
              width: 600,
              height: 300,
            }
          },
          {
            mention: {
              content: "Os painéis estão diretamente integrados ao nosso datalake, o que garante atualizações contínuas, otimizando o monitoramento de indicadores e facilitando a tomada de decisões por parte das diferentes equipes da Fundação Lemann.",
              author: "Nome",
              position: "Cargo"
            }
          }
        ]}
        cards={[
          {
            icon: ImageCard,
            title: "Diagnóstico completo e plano de ação aplicável.",
            content: "Mapeamos práticas, fluxos e ferramentas de dados para identificar gargalos e oportunidades, oferecendo recomendações realistas e adaptadas ao seu contexto."
          },
          {
            icon: ImageCard,
            title: "Base para decisões mais estratégicas.",
            content: "Recomendamos perfis profissionais, melhorias organizacionais e opções tecnológicas para orientar investimentos e fortalecer a gestão de dados da sua organização."
          }
        ]}
      />
    </MainPageTemplate>
  )
}
