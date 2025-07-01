import {
  Stack,
  VStack,
  Grid,
  GridItem,
  Box
} from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isMobileMod, useCheckMobile } from "../hooks/useCheckMobile.hook";
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
import PointsIcon from "../public/img/icons/pointsIcon";
import SpeedIcon from "../public/img/icons/speedIcon";
import DnsIcon from "../public/img/icons/dnsIcon";
import FlowsheetIcon from "../public/img/icons/flowsheetIcon";
import TableChartViewIcon from "../public/img/icons/tableChartViewIcon";
import RobotIcon from "../public/img/icons/robotIcon";
import SchoolIcon from "../public/img/icons/schoolIcon";
import ChevronIcon from "../public/img/icons/chevronIcon";


export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'services', 'menu'])),
      ...(await withPages()),
    },
  };
}

const SectionSelector = ({ icon, text, anchoring, variant = false, active = false }) => {
  return (
    <GridItem
      as="a"
      href={`#${anchoring}`}
      display="flex"
      cursor="pointer"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      padding={variant ? "12px 24px" : "35px 24px"}
      height={variant ? "24px" : "auto"}
      gap={variant ? "4px" : "16px"}
      borderBottom={(variant && active) ? "3px solid #2B8C4D" : "none"}
      maxWidth={{base: "100%", md: "480px"}}
      maxHeight="110px"
      boxSizing="content-box"
      borderTop={variant ? "none" : "1px solid #DEDFE0"}
      borderLeft={variant ? "none" : "1px solid #DEDFE0"}
      fill={active ? "#2B8C4D" : "#878A8E"}
      backgroundColor={active && !variant ? "#D5E8DB" : "transparent"}
      color={active ? "#2B8C4D" : "inherit"}
      _hover={{
        color: "#2B8C4D",
        backgroundColor: variant ? "transparent" : "#D5E8DB",
        fill: "#2B8C4D",
      }}
      transition="background 0.2s, color 0.2s"
    >
      {icon}
      <LabelText 
        width="fit-content"
        typography={variant ? "small" : "large"} 
        color="current-color"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
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
    <VStack
      id={id}
      display="flex"
      paddingTop="40px"
      scrollMarginTop="20px"
      spacing={0}
    >
      <Stack
        padding={{base: "40px 24px 24px", md: "40px 24px"}}
        boxSizing="content-box"
        spacing="16px"
        maxWidth="1440px"
        margin="0 auto"
      >
        {!isMobileMod() ?
          <Display>
            {title}
          </Display>
        :
          <TitleText typography="large">
            {title}
          </TitleText>
        }
        <TitleText
          typography={isMobileMod() ? "small" : "large"}
          color="#71757A"
        >
          {subtitle}
        </TitleText>
      </Stack>

      {content[0] && (
        <Stack
          width="100%"
          alignItems="center"
          padding={{base: "0 24px 24px", md: "80px 24px"}}
          spacing={0}
        >
          <Stack
            width="100%"
            maxWidth="1440px"
            flexDirection={{base: "column-reverse", md: "row"}}
            justifyContent="space-between"
            margin="0 auto !important"
            gap="24px"
            spacing={0}
          >
            <TitleText
              display="flex"
              alignItems="center"
              typography={isMobileMod() ? "small" : "large"}
              maxWidth="675px"
            >
              {content[0].text || ""}
            </TitleText>
            {content[0].img.id && 
              <Image
                src={content[0].img.id}
                alt={content[0].img.alt || ""}
                width={content[0].img.width || 600}
                height={content[0].img.height || 300}
              />
            }
          </Stack>
        </Stack>
      )}

      {content[1]?.mention && (
        <Stack
          width="100%"
          backgroundColor="#252A32"
          padding={{base: "40px 24px", md: "80px 24px"}}
          spacing={0}
        >
          <Stack
            width="100%"
            maxWidth="1440px"
            flexDirection="column"
            margin="0 auto !important"
            spacing={0}
            gap="24px"
          >
            <PointsIcon fill="#2B8C4D" width="25px" height="22px"/>
            {!isMobileMod() ?
              <Display
                typography="small"
                color="#FFF"
                maxWidth="1200px"
              >
                {content[1].mention?.content || ""}
              </Display>
            :
              <TitleText
                typography="small"
                color="#FFF"
              >
                {content[1].mention?.content || ""}
              </TitleText>
            }
            <Stack spacing={0}>
              <BodyText typography="large" color="#FFF">
                {content[1].mention?.author || ""}
              </BodyText>
              <BodyText typography="large" color="#EEEEEE">
                {content[1].mention?.position || ""}
              </BodyText>
            </Stack>
          </Stack>
        </Stack>
      )}
      {cards &&
        <Grid
          maxWidth="1440px"
          margin="0 auto !important"
          padding={{base:"40px 24px", md:"80px 24px"}}
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
              <TitleText
                typography={isMobileMod() ? "small" : "medium"}
                marginTop="8px"
              >{elm.title}</TitleText>
              <TitleText
                typography={isMobileMod() ? "small" : "medium"}
                color="#71757A"
              >{elm.content}</TitleText>
            </GridItem>
          ))}
        </Grid>
      }
    </VStack>
  )
}

export default function Services() {
  const { t } = useTranslation('services');
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const sectionsNav = [
    {icon: <SpeedIcon width="40px" height="40px"/>, text: "Diagnóstico de Maturidade de Dados", anchoring: "diagnostico-de-maturidade-de-dados"},
    {icon: <DnsIcon width="40px" height="40px"/>, text: "Arquitetura de Dados", anchoring: "arquitetura-de-dados"},
    {icon: <FlowsheetIcon width="40px" height="40px"/>, text: "Portal de Dados", anchoring: "portal-de-dados"},
    {icon: <TableChartViewIcon width="40px" height="40px"/>, text: "Painel Gerencial", anchoring: "painel-gerencial"},
    {icon: <RobotIcon width="40px" height="40px"/>, text: "Chatbot", anchoring: "chatbot"},
    {icon: <SchoolIcon width="40px" height="40px"/>, text: "Formação", anchoring: "formacao"}
  ]

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-40px 0px 0px 0px" }
    );
    if (navRef.current) {
      observer.observe(navRef.current);
    }
    return () => {
      if (navRef.current) observer.unobserve(navRef.current);
    };
  }, []);

  useEffect(() => {
    const sectionIds = sectionsNav.map(s => s.anchoring);
    
    const handleIntersect = (entries) => {
      if (isScrolling) return;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setSelectedSection(entry.target.id);
        }
      });
    };

    const observer = new window.IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.1
    });

    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sectionIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [isScrolling]);

  useEffect(() => {
    if (!isScrolling) return;
    let timeout = null;
    const handleScroll = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [isScrolling]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('[data-dropdown]')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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
          {t("hero-title")}
        </Display>
        <TitleText
          as="h2"
          typography={isMobileMod() ? "small" : "medium"}
          color="#71757A"
          paddingBottom="32px"
        >
          {t("hero-subtitle")}
        </TitleText>
        <Link
          href="/contact-consulting"
          target="_blank"
          width={isMobileMod() ? "100%" : "fit-content"}
        >
          <Button
            height="54px"
            width="100%"
            justifyContent="center"
          >
            <LabelText typography="x-large" color="currentColor">
              {t("hero-button")}
            </LabelText>
          </Button>
        </Link>
      </Stack>

      <Stack
        ref={navRef}
        spacing={0}
        width="100%"
        backgroundColor="#F7F7F7"
        margin="24px 0 40px"
      >
        <Grid
          display={{base: "flex", md: "grid"}}
          flexDirection="column"
          width="100%"
          maxWidth="1440px"
          templateColumns="1fr 1fr 1fr"
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

      {isSticky && (
        useCheckMobile() ?
          <Stack
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            zIndex="1000"
            backgroundColor="#FFF"
            boxShadow="0 1.6px 16px 0 rgba(100, 96, 103, 0.16)"
          >
            <Box position="relative" width="100%" data-dropdown>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                padding="24px"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="18px"
                lineHeight="28px"
                color="#252A32"
                cursor="pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                _hover={{ backgroundColor: "#F7F7F7" }}
              >
                <LabelText
                  typography="large"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  flex="1"
                >
                  {selectedSection ? sectionsNav.find(s => s.anchoring === selectedSection)?.text || "Selecione uma seção" : "Selecione uma seção"}
                </LabelText>
                <ChevronIcon
                  width="20px"
                  height="20px"
                  transform={isDropdownOpen ? "rotate(270deg)" : "rotate(90deg)"}
                  transition="transform 0.2s"
                />
              </Box>
              
              {isDropdownOpen && (
                <Box
                  position="absolute"
                  top="100%"
                  left="0"
                  right="0"
                  backgroundColor="#FFF"
                  border="1px solid #DEDFE0"
                  borderRadius="0 0 8px 8px"
                  boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                  zIndex="1001"
                  overflowY="auto"
                >
                  {sectionsNav.map((elm, index) => (
                    <Box
                      key={`mobile_${elm.text}_${index}`}
                      padding="12px 24px"
                      cursor="pointer"
                      _hover={{ backgroundColor: "#F7F7F7" }}
                      onClick={() => {
                        setIsScrolling(true);
                        setSelectedSection(elm.anchoring);
                        setIsDropdownOpen(false);
                        const el = document.getElementById(elm.anchoring);
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                    >
                      <LabelText
                        typography="large"
                        color="#252A32"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {elm.text}
                      </LabelText>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Stack>
        :
        <Stack
          position="fixed"
          top="0"
          left="0"
          width="100%"
          zIndex="1000"
          backgroundColor="#FFF"
          padding="12px 24px"
          boxShadow="0 1.6px 16px 0 rgba(100, 96, 103, 0.16)"
        >
          <Stack
            direction="row"
            width="100%"
            maxWidth="1440px"
            margin="0 auto"
            alignItems="center"
            overflowX="auto"
            whiteSpace="nowrap"
            spacing={0}
          >
            {sectionsNav.map((elm, index) => (
              <SectionSelector
                key={`sticky_${elm.text}_${index}`}
                icon={elm.icon}
                text={elm.text}
                anchoring={elm.anchoring}
                variant
                active={selectedSection === elm.anchoring}
                minWidth="180px"
                flexShrink={0}
              />
            ))}
            <Button
              css={{
                '@media (max-width: 1500px)': {
                  display: 'none !important',
                },
              }}
              marginLeft="auto !important"
            >
              <LabelText typography="small" color="#FFF">
                Solicite uma proposta
              </LabelText>
            </Button>
          </Stack>
        </Stack>
      )}

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

      <Stack
        padding={{base: "24px 0 0", md: "24px 24px 0"}}
        spacing={0}
      >
        <Stack
          width="100%"
          maxWidth="1440px"
          spacing={0}
          boxSizing="border-box"
          padding={{base: "56px 24px", md: "80px 40px"}}
          margin="0 auto"
          backgroundColor="#252A32"
          borderRadius={{base: "0", md: "32px"}}
        >
          <Display
            typography={isMobileMod() ? "small" : "large"}
            color="#FFF"
            paddingBottom="16px"
          >
            {t("data-team-support-title")}
          </Display>
          <TitleText
            typography={isMobileMod() ? "small" : "medium"}
            color="#FFF"
            maxWidth="875px"
          >
            {t("data-team-support-content")}
          </TitleText>
          <TitleText
            typography={isMobileMod() ? "small" : "medium"}
            color="#FFF"
            paddingBottom="24px"
            maxWidth="875px"
          >
            {t("data-team-support-content_1")}
          </TitleText>
          <Link
            href="/contact-consulting"
            target="_blank"
            padding="8px 0"
            width={isMobileMod() ? "100%" : "fit-content"}
          >
            <Button
              height="54px"
              width="100%"
              justifyContent="center"
            >
              <LabelText typography="x-large" color="currentColor">
                {t("data-team-support-button")}
              </LabelText>
            </Button>
          </Link>
        </Stack>
      </Stack>
      <BodyText
        boxSizing="content-box"
        maxWidth="1440px"
        margin="0 auto !important"
        typography="large"
        color="#464A51"
        padding={{base: "80px 24px", md: "80px 24px"}}
      >
        {t("chatbot-warning-msg")}
      </BodyText>
    </MainPageTemplate>
  )
}
