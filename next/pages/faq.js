import {
  Box,
  VStack,
  Stack,
  Divider,
  Collapse,
} from "@chakra-ui/react";
import Link from "../components/atoms/Link";
import Head from "next/head";
import FuzzySearch from 'fuzzy-search';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { useTranslation } from 'next-i18next';
import cookies from "js-cookie";
import Display from "../components/atoms/Text/Display";
import LabelText from "../components/atoms/Text/LabelText";
import BodyText from "../components/atoms/Text/BodyText";
import { MainPageTemplate } from "../components/templates/main";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DebouncedSimpleControlledInput } from "../components/atoms/ControlledInput";

import {
  getAllFAQs,
} from "./api/faqs";

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

export default function FAQ({ faqs }) {
  const { t } = useTranslation('faq');
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [categorySelected, setCategorySelected] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [closeQuestion, setCloseQuestion] = useState(false);

  useEffect(() => {
    setAllQuestions(faqs)
    setQuestions(faqs)
  },[faqs])

  const searcher = new FuzzySearch(
    categorySelected ? questions : allQuestions,
    ["question", "keywords"],
    {sort: true}
  )

  const filterByCategory = (category) => {
    return allQuestions.filter((elm) =>
      elm.categories.includes(category)
    );
  }

  useEffect(() => {
    if(categorySelected) return setQuestions(filterByCategory(categorySelected))
  },[categorySelected])

  useEffect(() => {
    if (categorySelected) {
      const filteredQuestions = filterByCategory(categorySelected);
      setQuestions(filteredQuestions);
    } else {
      setQuestions(allQuestions);
    }
    setSearchFilter("");
  }, [categorySelected, allQuestions]);

  useEffect(() => {
    if(searchFilter.trim() === "") {
      setQuestions(categorySelected ? filterByCategory(categorySelected) : allQuestions);
    } else {
      const result = searcher.search(searchFilter.trim())
      setQuestions(result)
      setCloseQuestion(!closeQuestion)
      window.scrollTo({top: 1})
    }
  },[searchFilter])

  const cleanFilter = () => {
    setSearchFilter("");
    setQuestions(categorySelected ? filterByCategory(categorySelected) : allQuestions);
  }

  const CategoryText = ({ category }) => {
    function handlerClick() {
      if(category === categorySelected) {
        setCategorySelected("")
        setQuestions(allQuestions)
      } else {
        setCategorySelected(category)
      }

      setCloseQuestion(!closeQuestion)
      window.scrollTo({top: 1})
    }

    return (
      <LabelText
        color={categorySelected === category ? "#2B8C4D" :"#71757A"}
        width="max-content"
        cursor="pointer"
        _hover={{
          color: "#2B8C4D"
        }}
        onClick={handlerClick}
      >
        {category}
      </LabelText>
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
        maxWidth="1440px"
        margin="50px auto auto"
        spacing={0}
      >
        <Display
          paddingBottom={{base: "56px", lg: "66px" }}
          color="#2B8C4D"
          textAlign="center"
          typography="small"
        >
          {t('title')}
        </Display>

        <DebouncedSimpleControlledInput
          width="100%"
          maxWidth="600px"
          paddingBottom={{base: "56px", lg: "126px" }}
          value={searchFilter}
          onChange={setSearchFilter}
          placeholder={t('searchPlaceholder')}
          icon={(searchFilter ?
            <CrossIcon
              alt="limpar pesquisa"
              width="17px"
              height="17px"
              cursor="pointer"
              fill="#464A51"
              onClick={() => cleanFilter()}
            />
            :
            <SearchIcon
              alt="pesquisar"
              width="17px"
              height="17px"
              cursor="normal"
              fill="#464A51"
            />
          )}
        />

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
            flexDirection="column"
            gap="16px"
            position={{base: "relative", lg: "sticky"}}
            top={{base: "0", lg: "120px"}}
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
              <LabelText typography="x-large">
                {t('noQuestionsFound')}
              </LabelText>
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
            <BodyText marginTop="60px !important" >
              {t('contactText')} 
              <Link
                display="inline"
                href="/contact"
                color="#0068C5"
                fontSize="16px"
                fontWeight="400"
                lineHeight="24px"
                _hover={{color: "#0057A4"}}
              >
                {t('contactLink')}
              </Link>
            </BodyText>
          </Stack>
        </Stack>
      </VStack>
    </MainPageTemplate>
  )
}
