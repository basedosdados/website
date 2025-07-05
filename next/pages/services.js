import {
  Stack,
  VStack,
  HStack,
  Grid,
  GridItem,
  Box,
  Collapse,
  Divider
} from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isMobileMod, useCheckMobile } from "../hooks/useCheckMobile.hook";
import { withPages } from "../hooks/pages.hook";
import { MainPageTemplate } from "../components/templates/main";

import {
  getAllFAQs,
} from "./api/faqs";

import Button from "../components/atoms/Button";
import Link from "../components/atoms/Link";
import Display from "../components/atoms/Text/Display";
import TitleText from "../components/atoms/Text/TitleText";
import LabelText from "../components/atoms/Text/LabelText";
import BodyText from "../components/atoms/Text/BodyText";

import PointsIcon from "../public/img/icons/pointsIcon";
import SpeedIcon from "../public/img/icons/speedIcon";
import DnsIcon from "../public/img/icons/dnsIcon";
import FlowsheetIcon from "../public/img/icons/flowsheetIcon";
import TableChartViewIcon from "../public/img/icons/tableChartViewIcon";
import RobotIcon from "../public/img/icons/robotIcon";
import SchoolIcon from "../public/img/icons/schoolIcon";
import ChevronIcon from "../public/img/icons/chevronIcon";
import ReturnIcon from "../public/img/icons/returnIcon";
import CrossIcon from "../public/img/icons/crossIcon";
import styles from "../styles/faq.module.css";

export async function getStaticProps({ locale }) {
  const faqs = await getAllFAQs(locale, "services/FAQ")

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'services', 'menu'])),
      ...(await withPages()),
      faqs
    },
    revalidate: 30
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
      {!variant && icon}
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
        width={{base: "auto", md: "100%"}}
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
          maxWidth="1120px"
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

const QuestionsBox = ({ question, answer, id, active }) => {
  const [isActive, setIsActive] = useState(false)
  const router = useRouter()

  const scrollFocus = (idElement) => {
    const targetElement = document.getElementById(idElement).getBoundingClientRect()
    const heightScreen = window.innerHeight
    const positionTarget = targetElement.top

    window.scrollTo(0, positionTarget - (heightScreen/2))
  }

  useEffect(() => {
    setIsActive(false)
  },[active])

  useEffect(() => {
    if(router.asPath === `/services#${id}`) return setIsActive(true)
  },[id])

  useEffect(() => {
    if(router.asPath === `/services#${id}`) return scrollFocus(id)
  },[isActive])

  const OpenCloseQuestion = () => {
    setIsActive(!isActive)
  }

  return (
    <Stack
      spacing={0}
      className={styles.questionContainer}
    >
      <Box
        display="flex"
        cursor="pointer"
        marginBottom="24px"
        gap="20px"
        justifyContent="space-between"
        onClick={() => OpenCloseQuestion()}
      >
        <LabelText typography="x-large">
          {question}
        </LabelText>
        <CrossIcon
          alt={isActive ? "fecha pergunta" : "abrir pergunta"}
          color="#252A32"
          transform={!isActive && "rotate(45deg)"}
          width="20px"
          height="20px"
        />
      </Box>
      <Collapse in={isActive} animateOpacity>
        <Box
          id={id}
          as="div"
          height={isActive ? "100%" : "0"}
          marginBottom={isActive && "32px !important"}
          overflow="hidden"
          transition="all 1s ease"
          fontFamily="Roboto"
          color="#464A51"
          fontSize="18px"
          lineHeight="28px"
          fontWeight="400"
        >
          <ReactMarkdown>{answer}</ReactMarkdown>
        </Box>
      </Collapse>
      <Divider borderColor="#DEDFE0"/>
    </Stack>
  )
}

export default function Services({ faqs }) {
  const { t } = useTranslation('services');
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [categorySelected, setCategorySelected] = useState("Arquitetura de Dados");
  const [closeQuestion, setCloseQuestion] = useState(false);
  const prevScrollY = useRef(0);

  useEffect(() => {
    setAllQuestions(faqs)
    setQuestions(faqs)
  },[faqs])

  const filterByCategory = (category) => {
    return allQuestions.filter((elm) =>
      elm.categories.includes(category)
    );
  }

  useEffect(() => {
    const filteredQuestions = filterByCategory(categorySelected);
    setQuestions(filteredQuestions);
  }, [categorySelected, allQuestions]);

  const CategoryText = ({ category }) => {
    function handlerClick() {
      setCategorySelected(category)
      setCloseQuestion(!closeQuestion)
    }

    return (
      <HStack
        spacing="4px"
        cursor="pointer"
        pointerEvents={categorySelected === category ? "none" : "default"}
      >
        <Box 
          width="3px"
          height="24px"
          backgroundColor={categorySelected === category && "#2B8C4D"}
          borderRadius="10px"
        />
        <LabelText
          typography="small"
          onClick={handlerClick}
          width="100%"
          color={categorySelected === category  ? "#2B8C4D" : "#71757A"}
          backgroundColor={categorySelected === category  && "#F7F7F7"}
          _hover={{
            backgroundColor: categorySelected === category  ? "#F7F7F7" :"#EEEEEE",
          }}
          borderRadius="8px"
          padding="6px 8px"
        >
          {category}
        </LabelText>
      </HStack>
    )
  }

  const sectionsNav = [
    {icon: <SpeedIcon width="40px" height="40px"/>, text: t("diagnostico-title"), anchoring: "diagnostico-de-maturidade"},
    {icon: <DnsIcon width="40px" height="40px"/>, text: t("arquitetura-title"), anchoring: "arquitetura-de-dados"},
    {icon: <FlowsheetIcon width="40px" height="40px"/>, text: t("portal-title"), anchoring: "portal-de-dados"},
    {icon: <TableChartViewIcon width="40px" height="40px"/>, text: t("painel-title"), anchoring: "painel-gerencial"},
    {icon: <RobotIcon width="40px" height="40px"/>, text: t("chatbot-title"), anchoring: "chatbot"},
    {icon: <SchoolIcon width="40px" height="40px"/>, text: t("formacao-title"), anchoring: "formacao"}
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
        } else if (entry.target.id === 'formacao') {
          if (window.scrollY > prevScrollY.current) {
            setSelectedSection("");
          }
        }
      });
      prevScrollY.current = window.scrollY;
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

  const handleScrollToSection = (sectionId) => {
    setIsScrolling(true);
    setSelectedSection(sectionId);
    setIsDropdownOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const prefixImgUrl = (id) => { return `https://storage.googleapis.com/basedosdados-website/services/${id}`}

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
              {t("request-a-quote-button")}
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
          selectedSection && (
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
                    {selectedSection ? sectionsNav.find(s => s.anchoring === selectedSection)?.text : ""}
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
                        onClick={() => handleScrollToSection(elm.anchoring)}
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
          )
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
            <Link
              href="/contact-consulting"
              target="_blank"
              marginLeft="auto !important"
            >
              <Button
                width="100%"
                justifyContent="center"
              >
                <LabelText typography="small" color="currentColor">
                  {t("request-a-quote-button")}
                </LabelText>
              </Button>
            </Link>
          </Stack>
        </Stack>
      )}

      {(isSticky && useCheckMobile()) && (
        <Stack
          position="fixed"
          bottom="0"
          left="0"
          width="100vw"
          zIndex="1000"
          padding="16px 24px"
          backgroundColor="#FFF"
          boxShadow="0 1.6px 16px 0 rgba(100, 96, 103, 0.16)"
        >
          <Link
            href="/contact-consulting"
            target="_blank"
          >
            <Button
              height="54px"
              width="100%"
              justifyContent="center"
            >
              <LabelText typography="x-large" color="currentColor">
                {t("request-a-quote-button")}
              </LabelText>
            </Button>
          </Link>
        </Stack>
      )}

      <Section
        id="diagnostico-de-maturidade"
        title={t("diagnostico-title")}
        subtitle={t("diagnostico-subtitle")}
        content={[
          {
            text: t("diagnostico-content"),
            img: {
              id: prefixImgUrl("image-diagnostico-de-maturidade-de-dados.svg"),
              alt: "diagnostico-de-maturidade",
              width: 600,
              height: 300,
            }
          }
        ]}
        cards={[
          {
            icon: prefixImgUrl("strategy.svg"),
            title: t("diagnostico-card-1-title"),
            content: t("diagnostico-card-1-content")
          },
          {
            icon: prefixImgUrl("fact-check.svg"),
            title: t("diagnostico-card-2-title"),
            content: t("diagnostico-card-2-content")
          }
        ]}
      />

      <Section
        id="arquitetura-de-dados"
        title={t("arquitetura-title")}
        subtitle={t("arquitetura-subtitle")}
        content={[
          {
            text: t("arquitetura-content"),
            img: {
              id: prefixImgUrl("image-arquitetura-de-dados.svg"),
              alt: "arquitetura-de-dados",
              width: 600,
              height: 300,
            }
          }
        ]}
        cards={[
          {
            icon: prefixImgUrl("cloud-done.svg"),
            title: t("arquitetura-card-1-title"),
            content: t("arquitetura-card-1-content")
          },
          {
            icon: prefixImgUrl("schema.svg"),
            title: t("arquitetura-card-2-title"),
            content: t("arquitetura-card-2-content")
          }
        ]}
      />

      <Section
        id="portal-de-dados"
        title={t("portal-title")}
        subtitle={t("portal-subtitle")}
        content={[
          {
            text: t("portal-content"),
            img: {
              id: prefixImgUrl("image-portal-de-dados.svg"),
              alt: "portal-de-dados",
              width: 600,
              height: 300,
            }
          }
        ]}
        cards={[
          {
            icon: prefixImgUrl("organized-consistent.svg"),
            title: t("portal-card-1-title"),
            content: t("portal-card-1-content")
          },
          {
            icon: prefixImgUrl("secure-access.svg"),
            title: t("portal-card-2-title"),
            content: t("portal-card-2-content")
          }
        ]}
      />

      <Section
        id="painel-gerencial"
        title={t("painel-title")}
        subtitle={t("painel-subtitle")}
        content={[
          {
            text: t("painel-content"),
            img: {
              id: prefixImgUrl("image-painel-gerencial.svg"),
              alt: "painel-gerencial",
              width: 600,
              height: 300,
            }
          },
          {
            mention: {
              content: t("painel-mention-content"),
              author: t("painel-mention-author"),
              position: t("painel-mention-position")
            }
          }
        ]}
        cards={[
          {
            icon: prefixImgUrl("efficient-communication.svg"),
            title: t("painel-card-1-title"),
            content: t("painel-card-1-content")
          },
          {
            icon: prefixImgUrl("accessible-place.svg"),
            title: t("painel-card-2-title"),
            content: t("painel-card-2-content")
          }
        ]}
      />

      <Section
        id="chatbot"
        title={t("chatbot-title")}
        subtitle={t("chatbot-subtitle")}
        content={[
          {
            text: t("chatbot-content"),
            img: {
              id: prefixImgUrl("image-chatbot.svg"),
              alt: "chatbot",
              width: 600,
              height: 300,
            }
          },
          {
            mention: {
              content: t("chatbot-mention-content"),
              author: t("chatbot-mention-author"),
              position: t("chatbot-mention-position")
            }
          }
        ]}
        cards={[
          {
            icon: prefixImgUrl("flexible-consultations.svg"),
            title: t("chatbot-card-1-title"),
            content: t("chatbot-card-1-content")
          },
          {
            icon: prefixImgUrl("inclusion-democratization.svg"),
            title: t("chatbot-card-2-title"),
            content: t("chatbot-card-2-content")
          }
        ]}
      />

      <Section
        id="formacao"
        title={t("formacao-title")}
        subtitle={t("formacao-subtitle")}
        content={[
          {
            text: t("formacao-content"),
            img: {
              id: prefixImgUrl("image-formacao.svg"),
              alt: "formacao",
              width: 600,
              height: 300,
            }
          }
        ]}
        cards={[
          {
            icon: prefixImgUrl("practical-content.svg"),
            title: t("formacao-card-1-title"),
            content: t("formacao-card-1-content")
          },
          {
            icon: prefixImgUrl("continuous-learning.svg"),
            title: t("formacao-card-2-title"),
            content: t("formacao-card-2-content")
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
                {t("request-a-quote-button")}
              </LabelText>
            </Button>
          </Link>
        </Stack>
      </Stack>
      <BodyText
        boxSizing="content-box"
        display="flex"
        alignItems={{base: "flex-end", md: "center"}}
        maxWidth="1440px"
        margin="0 auto !important"
        typography="large"
        color="#464A51"
        padding={{base: "80px 24px", md: "80px 24px"}}
      >
        {t("chatbot-warning-msg")}
        <ReturnIcon
          cursor="pointer"
          fill="#0068C5"
          _hover={{fill: "#0057A4"}}
          width="24px"
          height="24px"
          onClick={() => handleScrollToSection("chatbot")}
          style={{
            display: 'inline-flex',
            verticalAlign: 'middle',
            marginLeft: '4px'
          }}
        />
      </BodyText>

      <VStack
        boxSizing="content-box"
        maxWidth="1440px"
        padding="0 24px"
        margin="0 auto"
        spacing={0}
      >
        <Stack
          width="100%"
          position="relative"
          gap={{base: "64px", lg: "160px"}}
          spacing={0}
          flexDirection={{base: "column", lg: "row"} }
          paddingBottom="32px"
        >
          <Box
            display="flex"
            height="100%"
            width={{base: "100%", md: "250px"}}
            flexDirection="column"
            gap="16px"
            position={{base: "relative", lg: "sticky"}}
            top={{base: "0", lg: "120px"}}
          >
            <CategoryText category="Arquitetura de Dados"/>
            <CategoryText category="Portal de Dados"/>
            <CategoryText category="Painel Gerencial"/>
            <CategoryText category="Chatbot"/>
            <CategoryText category="Formação"/>
          </Box>

          <Stack
            width="100%"
            spacing={8}
          >
            {questions && questions.map((elm, i) => 
              <QuestionsBox
                key={i}
                question={elm.question}
                answer={elm.content}
                id={elm.id && elm.id}
                active={closeQuestion}
              />
            )}
          </Stack>
        </Stack>
      </VStack>
    </MainPageTemplate>
  )
}
