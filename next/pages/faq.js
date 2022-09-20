import {
  Box,
  VStack,
  Stack,
  Text,
  Divider,
  Collapse
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { MainPageTemplate } from "../components/templates/main";
import Display from "../components/atoms/Display";
import { QuestionFAQ } from "../context/faq";
import BodyText from "../components/atoms/BodyText";
import CrossIcon from "../public/img/icons/crossIcon";

const QuestionsBox = ({ question, answer }) => {
  const [isActive, setIsActive] = useState(false)

  const OpenCloseQuestion = () => {
    setIsActive(!isActive)
  }

  return (
    <Stack
      spacing={0} 
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
          fontSize="20px"
          fontWeight="400"
          lineHeight="22px"
          letterSpacing="0.2px"
          color="#252A32"
        >
          {question}
        </Text>
        <CrossIcon
          color="#252A32"
          rotation={!isActive && "rotate(45deg)"}
          widthIcon="20px"
          heightIcon="20px"
        />
      </Box>
      <Collapse in={isActive} animateOpacity>
        <BodyText
          height={isActive ? "100%" : "0"}
          marginBottom={isActive && "32px !important"}
          overflow="hidden"
          transition="all 1s ease"
        >
          {answer}
        </BodyText>
      </Collapse>
      <Divider borderColor="#DEDFE0"/>
    </Stack>
  )
}

export default function FAQ({}) {
  const isMobile = useCheckMobile();
  const [isMobileMod, setIsMobileMod] = useState(false)
  
  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])
  
  const [allQuestions, setAllQuestions] = useState([])
  const [questions, setQuestions] = useState([])
  const [categorySelected, setCategorySelected] = useState("")

  useEffect(() => {
    setAllQuestions(QuestionFAQ)
    setQuestions(QuestionFAQ)
  },[])

  useEffect(() => {
    if(categorySelected) return filterByCategory(categorySelected)
  },[categorySelected])

  const filterByCategory = (category) => {
    const filtedCategory = allQuestions.filter((elm) => {
      const indexCategory = elm.categories.findIndex((res) => res === category)
      if(indexCategory > -1) return elm.categories[indexCategory]
    })
    setQuestions(filtedCategory)
  }

  const CategoryText = ({ category }) => {

    function handlerClick(elm) {
      if(elm === categorySelected) {
        setCategorySelected("")
        setQuestions(allQuestions)
      } else {
        setCategorySelected(elm)
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
        onClick={() => handlerClick(category)}
      >
        {category}
      </Text>
    )
  }

  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>FAQ – Base dos Dados</title>
        <meta
          property="og:title"
          content="FAQ – Base dos Dados"
          key="ogtitle"
        />
      </Head>

      <VStack
        width="100%"
        maxWidth="1264px"
        margin="auto"
        paddingTop={isMobileMod && "75px"}
        spacing={0}
      >
        <Display
          paddingBottom={isMobileMod ? "56px" : "126px" }
          color="#2B8C4D"
        >
          Perguntas Frequentes
        </Display>

        <Stack
          width="100%"
          position="relative"
          gridGap="96px"
          spacing={0}
          flexDirection={isMobileMod ? "column" :"row"} 
          paddingBottom="32px"
        >
          <Box
            display="flex"
            height="100%"
            flexDirection="column"
            gridGap="16px"
            position={isMobileMod ? "relative" : "sticky"}
            top={isMobileMod? "0" : "120px"}
          >
            <CategoryText category="Sobre a BD"/>
            <CategoryText category="Infraestrutura"/>
            <CategoryText category="Dados"/>
            <CategoryText category="LGPD"/>
          </Box>

          <Stack
            width="100%"
            spacing={8}
          >
            {
              questions.length === 0 
              ?
                <BodyText color="#7D7D7D">
                  Infelizmente, não encontramos nenhuma pergunta relacionada à sua busca.
                </BodyText>
              :
                questions.map((elm) => 
                  <QuestionsBox
                    question={elm.question}
                    answer={elm.answer}
                  />
                )}
          </Stack>
        </Stack>
      </VStack>
    </MainPageTemplate>
  )
}