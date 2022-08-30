import {
  Box,
  VStack,
  Stack,
  Text,
  Divider,
  Collapse
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { MainPageTemplate } from "../components/templates/main";
import Display from "../components/atoms/Display";
import { DebouncedControlledInput } from "../components/atoms/ControlledInput";
import BodyText from "../components/atoms/BodyText";
import CrossIcon from "../public/img/icons/crossIcon";

const questionsApi = [
  {
    question: "Preciso pagar para utilizar a BD?",
    answer: "Você não precisa pagar para utilizar nenhum serviço oferecido pela Base dos Dados. Porém, para acessar nossos dados você precisa criar um projeto no Google Cloud, um dos serviços que utilizamos, que oferece até 1 Terabyte gratuito por mês para seus usuários. Caso você exceda esse limite, são cobrados 5 dólares por Terabyte de dados que sua consulta irá processar. Ressaltamos que esse limite costuma ser o suficiente, mesmo para análises com bases mais robustas, como a RAIS ou Censo Escolar.",
    categories: ["Sobre a BD", "Infraestrutura"]
  },
  {
    question: "Pergunta?Pergunta?Pergunta?Pergunta?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus erat vitae, rhoncus ante. Quisque rhoncus risus id sagittis tempus. Maecenas vitae eros velit. Curabitur vehicula eu orci at interdum. Etiam nunc enim, pharetra non vestibulum viverra, varius in justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus erat vitae, rhoncus ante. Quisque rhoncus risus id sagittis tempus. Maecenas vitae eros velit. ",
    categories: ["Dados"]
  },
  {
    question: "Pergunta?Pergunta?Pergunta?Pergunta?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus erat vitae, rhoncus ante. Quisque rhoncus risus id sagittis tempus. Maecenas vitae eros velit. Curabitur vehicula eu orci at interdum. Etiam nunc enim, pharetra non vestibulum viverra, varius in justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus erat vitae, rhoncus ante. Quisque rhoncus risus id sagittis tempus. Maecenas vitae eros velit. ",
    categories: ["LGPD"]
  },
  {
    question: "Pergunta?Pergunta?Pergunta?Pergunta?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus erat vitae, rhoncus ante. Quisque rhoncus risus id sagittis tempus. Maecenas vitae eros velit. Curabitur vehicula eu orci at interdum. Etiam nunc enim, pharetra non vestibulum viverra, varius in justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus erat vitae, rhoncus ante. Quisque rhoncus risus id sagittis tempus. Maecenas vitae eros velit. ",
    categories: ["LGPD"]
  },
  {
    question: "Pergunta?Pergunta?Pergunta?Pergunta?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus erat vitae, rhoncus ante. Quisque rhoncus risus id sagittis tempus. Maecenas vitae eros velit. Curabitur vehicula eu orci at interdum. Etiam nunc enim, pharetra non vestibulum viverra, varius in justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus erat vitae, rhoncus ante. Quisque rhoncus risus id sagittis tempus. Maecenas vitae eros velit. ",
    categories: ["LGPD"]
  },
  {
    question: "Pergunta?Pergunta?Pergunta?Pergunta?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus erat vitae, rhoncus ante. Quisque rhoncus risus id sagittis tempus. Maecenas vitae eros velit. Curabitur vehicula eu orci at interdum. Etiam nunc enim, pharetra non vestibulum viverra, varius in justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus erat vitae, rhoncus ante. Quisque rhoncus risus id sagittis tempus. Maecenas vitae eros velit. ",
    categories: ["Sobre a BD", "Infraestrutura"]
  },
]

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
  const [search, setSearch] = useState("")

  useEffect(() => {
    setAllQuestions(questionsApi)
    setQuestions(questionsApi)
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
      <VStack
        width="100%"
        maxWidth="1264px"
        margin="auto"
        spacing={0}
      >
        <Display
          paddingBottom={isMobileMod ? "56px" : "64px" }
          color="#2B8C4D"
        >
          Perguntas Frequentes
        </Display>

        <DebouncedControlledInput
          value={search}
          onChange={(res) => setSearch(res)}
          placeholder="Pesquise"
          justifyContent="center"
          inputStyle={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto 126px",
            padding: "20px",
            borderRadius: "17px",
            backgroundColor: "#FFF",
            color: "#6F6F6F",
            fontSize: "16px",
            height: "50px",
            boxShadow: "0 1px 3px 0.5 rgba(100 93 103 /0.16) !important",
          }}
        />

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