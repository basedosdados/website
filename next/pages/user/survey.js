import {
  Box,
  Stack,
  Text,
  Progress,
  Spinner
} from "@chakra-ui/react";
import { useState } from "react";
import cookies from 'js-cookie';

import Button from "../../components/atoms/Button";
import { MainPageTemplate } from "../../components/templates/main";
import { triggerGAEvent } from "../../utils";

import Exclamation from "../../public/img/icons/exclamationIcon";

import { withPages } from "../../hooks/pages.hook";

export async function getStaticProps() {
  return await withPages()
}

export default function Survey() {
  const [err, setErr] = useState("")
  const [index, setIndex] = useState(0)
  const [stageOne, setStageOne] = useState([])
  const [stageTwo, setStageTwo] = useState([])
  const [stageThree, setStageThree] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  async function fetchUpdateProfileSurvey(skip) {
    setIsLoading(true)
    const id = JSON.parse(cookies.get("userBD")).id.replace(new RegExp('\\bAccountNode:\\b', 'gi'), '')
    const result = await fetch(`/api/user/updateProfileSurvey?p=${btoa(id)}&f=${btoa(stageOne[0] || "")}&l=${btoa(stageTwo[0] || "")}&e=${btoa(stageThree[0] || "")}&s=${skip}`, { method: "GET" })
      .then(res => res.json())

    if(result.errors.length > 0) {
      setErr("Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.")
      console.error(result.errors)
      setIsLoading(false)
    }

    const userData = await fetch(`/api/user/getUser?p=${btoa(id)}`, { method: "GET" })
      .then(res => res.json())
    cookies.set('userBD', JSON.stringify(userData))
    triggerGAEvent("survey_login", skip === "true" ? "Skipou" : "Respondeu")
    window.open("/", "_self")
  }

  const question  = [
    {
      question: "Em que área você atua?",
      options: [
        ["Tecnologia", "TECNOLOGIA"],
        ["Saúde", "SAUDE"],
        ["Financeiro", "FINANCEIRO"],
        ["Educação", "EDUCACAO"],
        ["Varejo", "VAREJO"],
        ["Energia", "ENERGIA"],
        ["Jornalismo", "JORNALISMO"],
        ["Outra", "OUTRA"]
      ],
      buttons: [{ text: "Pular", style: "clean",function: async () => fetchUpdateProfileSurvey("true")},
      {text: "Continuar", function: () => {
        if(stageOne.length === 0) return setErr("Por favor, selecione uma das opções abaixo.")
        setErr("")
        setIndex(1)
      }}],
      stage: setStageOne
    },
    {
      question: "Qual o seu cargo?",
      options: [
        ["CEO/Diretor(a)", "CEO_DIRETOR"],
        ["Gerente", "GERENTE"],
        ["Coordenador(a)", "COORDENADOR"],
        ["Analista", "ANALISTA"],
        ["Consultor(a)", "CONSULTOR"],
        ["Especialista", "ESPECIALISTA"],
        ["Assistente", "ASSISTENTE"],
        ["Estagiário(a)", "ESTAGIARIO"],
        ["Estudante", "ESTUDANTE"],
        ["Professor(a)/Pesquisador(a)", "PROFESSOR_PESQUISADOR"],
        ["Freelancer", "FREELANCER"],
        ["Empreendedor(a)", "EMPREENDEDOR"],
        ["Outro", "OUTRO"]
      ],
      buttons: [{text: "Voltar", function: () => setIndex(0), style: "clean"}, {text: "Continuar", function: () => {
        if(stageTwo.length === 0) return setErr("Por favor, selecione uma das opções abaixo.")
        setErr("")
        setIndex(2)
      }}],
      stage: setStageTwo
    },
    {
      question: "Estamos sempre buscando aprimorar a plataforma e consideramos fundamental ouvir a nossa comunidade nesse processo. Podemos contatar você para futuras pesquisas?",
      options: [["Sim", "YES"], ["Não", "NO"]],
      buttons: [{text: "Voltar", function: () => setIndex(1), style: "clean"}, {text: "Enviar", function: () => {
        if(stageThree.length === 0) return setErr("Por favor, selecione uma das opções abaixo.")
        setErr("")
        fetchUpdateProfileSurvey("false")
      }}],
      stage: setStageThree
    }
  ]

  const selectedValueStage = (elm) => {
    if(index === 0) return stageOne.includes(elm)
    if(index === 1) return stageTwo.includes(elm)
    if(index === 2) return stageThree.includes(elm)
  }

  const progressValue = () => {
    const value = [20, 60, 100]
    return value[index]
  }

  function handleSelected(value, setStage) {
    setStage((stage) => {
      if (stage.includes(value)) {
        return []
      } else {
        return [value]
      }
    })
  }

  return (
    <MainPageTemplate
      display="flex"
      justifyContent="center"
      paddingTop="70px"
      paddingX="24px"
      cleanTemplate
    >
      <Stack
        width="800px"
        maxWidth="1264px"
        maxHeight="575px"
        margin="0 auto"
        spacing={0}
        marginY="40px"
      >
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="36px"
          lineHeight="48px"
          marginY="64px"
          color="#252A32"
        >{question[index].question}</Text>

        <Text
          display={err ? "flex" : "none"}
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="18px"
          lineHeight="28px"
          marginBottom="40px !important"
          alignItems="center"
          gap="8px"
          color="#D93B3B"
        ><Exclamation fill="#D93B3B"/>{err}</Text>

        <Stack
          flexDirection="row"
          flexWrap="wrap"
          width="700px"
          marginBottom="40px !important"
          gap="16px"
          spacing={0}
        >
          {question[index].options.map((elm, i) => 
            <Box
              key={i}
              value={elm[1]}
              onClick={() => handleSelected(elm[1], question[index].stage)}
              pointerEvents={isLoading ? "none" : "default"}
              borderRadius="16px"
              cursor="pointer"
              border={selectedValueStage(elm[1]) ? "2px solid #42B0FF" : "1px solid #DEDFE0"}
              backgroundColor={selectedValueStage(elm[1]) ? "#CFEBFE" : "#FFF"}
              width="fit-content"
              padding={selectedValueStage(elm[1]) ? "11px" : "12px"}
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="18px"
              lineHeight="28px"
              color="#464A51"
            >
              {elm[0]}
            </Box>
          )}
        </Stack>

        <Stack
          marginTop="auto !important"
          flexDirection="row"
          width="100%"
          height="60px"
          alignItems="center"
          justifyContent="space-between"
        >
          <Progress
            width="200px"
            height="12px"
            borderRadius="100px"
            backgroundColor="#DEDFE0"
            value={progressValue()}
          />

          <Stack
            flexDirection="row"
            alignItems="center"
            height="100%"
            gap="16px"
            spacing={0}
          >
            {question[index].buttons.map((elm, i) => 
              <Button
                key={i}
                onClick={elm.function}
                height="100%"
                fontSize="20px"
                lineHeight="30px"
                pointerEvents={isLoading ? "none" : "default"}
                color={elm.style ? "#0D99FC" : "#FFFFFF"}
                backgroundColor={elm.style ? "#FFF" : "#0D99FC"}
                _hover={{
                  color: elm.style ? "#0B89E2" : "#FAFAFA",
                  backgroundColor: elm.style ? "" : "#0B89E2"
                }}
              >
                {isLoading ? elm.text === "Pular" || elm.text === "Enviar"  ? <Spinner /> : elm.text : elm.text}
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
