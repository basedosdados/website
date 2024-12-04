import {
  Box,
  VStack,
  Stack,
  Text,
  Divider,
  Collapse,
} from "@chakra-ui/react";
import Link from "../components/atoms/Link";
import Head from "next/head";
import FuzzySearch from 'fuzzy-search';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { isMobileMod } from "../hooks/useCheckMobile.hook";
import { MainPageTemplate } from "../components/templates/main";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import {
  getAllFAQs,
} from "./api/faqs";

import { DebouncedControlledInput } from "../components/atoms/ControlledInput";
import Display from "../components/atoms/Display";
import BodyText from "../components/atoms/BodyText";

import CrossIcon from "../public/img/icons/crossIcon";
import SearchIcon from "../public/img/icons/searchIcon";
import styles from "../styles/faq.module.css";

export async function getStaticProps({ locale }) {
  const faqs = await getAllFAQs(locale)

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu', 'faq', 'user'])),
      faqs
    },
    revalidate: 30
  }
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
    if(router.asPath === `/faq#${id}`) return setIsActive(true)
  },[id])

  useEffect(() => {
    if(router.asPath === `/faq#${id}`) return scrollFocus(id)
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
        justifyContent="space-between"
        onClick={() => OpenCloseQuestion()}
      >
        <Text
          fontFamily="ubuntu"
          fontSize={isMobileMod() ? "18px" : "20px"}
          fontWeight="400"
          lineHeight={isMobileMod() ? "28px" :"22px"}
          letterSpacing={isMobileMod() ? "0.1px" : "0.2px"}
          color="#252A32"
        >
          {question}
        </Text>
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
          fontFamily="ubuntu"
          color="#252A32"
          letterSpacing="0.1px"
          fontSize="18px"
          lineHeight="28px"
          fontWeight="300"
        >
          <ReactMarkdown>{answer}</ReactMarkdown>
        </Box>
      </Collapse>
      <Divider borderColor="#DEDFE0"/>
    </Stack>
  )
}

export default function FAQ({ faqs }) {
  const { t } = useTranslation('faq');
  const [allQuestions, setAllQuestions] = useState([])
  const [questions, setQuestions] = useState([])
  const [categorySelected, setCategorySelected] = useState("")
  const [searchFilter, setSearchFilter] = useState("")
  const [closeQuestion, setCloseQuestion] = useState(false)

  useEffect(() => {
    setAllQuestions(faqs)
    setQuestions(faqs)
  },[faqs])

  useEffect(() => {
    if(categorySelected) return setQuestions(filterByCategory(categorySelected))
  },[categorySelected])

  const searcher = new FuzzySearch(
    categorySelected ? questions : allQuestions, ["question", "keywords"], {sort: true}
  )

  useEffect(() => {
    if(searchFilter.trim() === "") {
      setSearchFilter("")
      setQuestions(faqs)
    } else {
      const result = searcher.search(searchFilter.trim())
      setQuestions(result)
      setCloseQuestion(!closeQuestion)
      window.scrollTo({top: 1})
    }
  },[searchFilter])

  const filterByCategory = (category) => {
    const filtedCategory = allQuestions.filter((elm) => {
      const indexCategory = elm.categories.findIndex((res) => res === category)
      if(indexCategory > -1) return elm.categories[indexCategory]
    })
    return filtedCategory
  }

  const cleanFilter = () => {
    setSearchFilter("")

    if(categorySelected) return setQuestions(filterByCategory(categorySelected))

    setQuestions(allQuestions)
  }

  const CategoryText = ({ category }) => {
    function handlerClick(elm) {
      if(elm === categorySelected) {
        setCategorySelected("")
        setQuestions(allQuestions)
        setCloseQuestion(!closeQuestion)
        window.scrollTo({top: 1})
      } else {
        setCategorySelected(elm)
        setCloseQuestion(!closeQuestion)
        window.scrollTo({top: 1})
      }
    }

    return (
      <Text
        fontSize="16px"
        color={categorySelected === category ? "#2B8C4D" :"#6F6F6F"}
        fontFamily="ubuntu"
        fontWeight="500"
        width="max-content"
        cursor="pointer"
        letterSpacing="0.2px"
        onClick={() => handlerClick(category)}
      >
        {category}
      </Text>
    )
  }

  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>{t('pageTitle')}</title>
        <meta
          property="og:title"
          content={t('pageTitle')}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={t('pageDescription')}
          key="ogdesc"
        />
      </Head>

      <VStack
        width="100%"
        maxWidth="1264px"
        margin="50px auto auto"
        spacing={0}
      >
        <Display
          paddingBottom={isMobileMod() ? "56px" : "66px" }
          color="#2B8C4D"
        >
          {t('title')}
        </Display>

        <DebouncedControlledInput
          value={searchFilter}
          onChange={(val) => setSearchFilter(val)}
          paddingBottom={isMobileMod() ? "56px" : "126px" }
          maxWidth="600px"
          placeholder={t('searchPlaceholder')}
          inputStyle={{
            padding: "12px 32px 12px 16px",
            height: "48px",
            borderRadius: "18px",
            backgroundColor: "#ffffff",
            fontSize: "16px",
            border: "1px solid #DEDFE0 !important",
            _placeholder:{ color: "#6F6F6F" }
          }}
          inputElementStyle={{
            height: "48px"
          }}
          rightIcon={
            (searchFilter ?
              <CrossIcon
                alt="limpar pesquisa"
                width="22px"
                height="22px"
                cursor="pointer"
                fill="#252A32"
                onClick={() => cleanFilter()}
              />
              :
              <SearchIcon
                alt="pesquisar"
                width="20px"
                height="20px"
                cursor="normal"
                fill="#D0D0D0"
              />
            )
          }
        />

        <Stack
          width="100%"
          position="relative"
          gridGap={isMobileMod() ? "64px" : "120px"}
          spacing={0}
          flexDirection={isMobileMod() ? "column" :"row"} 
          paddingBottom="32px"
        >
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            gridGap="16px"
            position={isMobileMod() ? "relative" : "sticky"}
            top={isMobileMod()? "0" : "120px"}
          >
            <CategoryText category="Dados"/>
            <CategoryText category="Planos Pagos"/>
            <CategoryText category="BigQuery"/>
            <CategoryText category="BD Lab"/>
            <CategoryText category="BD Edu"/>
            <CategoryText category="Institucional"/>
          </Box>

          <Stack
            width="100%"
            spacing={8}
          >
            {questions.length === 0 ?
              <BodyText color="#7D7D7D">
                {t('noQuestionsFound')}
              </BodyText>
            :
              questions.map((elm, i) => 
                <QuestionsBox
                  key={i}
                  question={elm.question}
                  answer={elm.content}
                  id={elm.id && elm.id}
                  active={closeQuestion}
                />
            )}
            <Text
              marginTop="60px !important"
              color="#252A32"
              fontFamily="ubuntu"
              fontSize="16px"
              fontWeight="500"
              lineHeight="16px"
              letterSpacing="0.2px"
            >
              {t('contactText')} 
              <Link
                display="inline"
                href="/contact"
                color="#42B0FF"
                fontFamily="ubuntu"
                fontSize="16px"
                fontWeight="500"
              >
                {t('contactLink')}
              </Link>
            </Text>
          </Stack>
        </Stack>
      </VStack>
    </MainPageTemplate>
  )
}
