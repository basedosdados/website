import {
  Box,
  Stack,
  Text,
  Progress,
  Spinner
} from "@chakra-ui/react";
import { useState, useCallback } from "react";
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
  const [stages, setStages] = useState(Array(7).fill([]))
  const [isLoading, setIsLoading] = useState(false)

  async function fetchUpdateProfileSurvey(skip) {
    setIsLoading(true)
    const id = JSON.parse(cookies.get("userBD")).id.replace(/\bAccountNode:\b/g, '')
    const params = {
      p: btoa(id),
      f: btoa(stages[0][0] || ""),
      l: btoa(stages[1][0] || ""),
      i: btoa(stages[2][0] || ""),
      t: btoa(stages[3][0] || ""),
      g: btoa(stages[4][0] || ""),
      d: btoa(stages[5][0] || ""),
      e: btoa(stages[6][0] || ""),
      s: skip
    }

    const queryString = new URLSearchParams(params).toString()
    const result = await fetch(`/api/user/updateProfileSurvey?${queryString}`, { method: "GET" })
      .then(res => res.json())

    if(result.errors.length > 0) {
      setErr("Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.")
      console.error(result.errors)
      return setIsLoading(false)
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
      buttons: [
        {text: "Pular", style: "clean",function: async () => fetchUpdateProfileSurvey("true")},
        {text: "Continuar", function: () => {
          if(stages[0].length === 0) return setErr("Por favor, selecione uma das opções abaixo.")
          setErr("")
          setIndex(1)
        }}
      ],
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
      buttons: [
        {text: "Voltar", function: () => setIndex(0), style: "clean"},
        {text: "Continuar", function: () => {
          if(stages[1].length === 0) return setErr("Por favor, selecione uma das opções abaixo.")
          setErr("")
          setIndex(2)
        }}
      ]
    },
    {
      question: "Qual o tamanho da empresa em que você trabalha?",
      options: [
        ["1-10 funcionários", "PEQUENA_1_10"],
        ["11-50 funcionários", "PEQUENA_11_50"],
        ["51-200 funcionários", "MEDIA_51_200"],
        ["201-500 funcionários", "MEDIA_201_500"],
        ["Mais de 500 funcionários", "GRANDE_MAIS_500"],
      ],
      buttons: [
        {text: "Voltar", function: () => setIndex(1), style: "clean"},
        {text: "Continuar", function: () => {
          if(stages[2].length === 0) return setErr("Por favor, selecione uma das opções abaixo.")
          setErr("")
          setIndex(3)
        }}
      ]
    },
    {
      question: "Qual a principal ferramenta que você utiliza para realizar análises de dados?",
      options: [
        ["SQL", "SQL"],
        ["Python", "PYTHON"],
        ["R", "R"],
        ["Stata", "STATA"],
        ["Excel", "EXCEL"],
        ["Nenhuma", "NONE"],
        ["Outra", "OTHER"],
      ],
      buttons: [
        {text: "Voltar", function: () => setIndex(2), style: "clean"},
        {text: "Continuar", function: () => {
          if(stages[3].length === 0) return setErr("Por favor, selecione uma das opções abaixo.")
          setErr("")
          setIndex(4)
        }}
      ]
    },
    {
      question: "Qual o seu principal objetivo com a BD?",
      options: [
        ["Análise de mercado", "MARKET_ANALYSIS"],
        ["Monitoramento de concorrência", "COMPETITOR_MONITORING"],
        ["Pesquisa acadêmica", "ACADEMIC_RESEARCH"],
        ["Gestão de riscos", "RISK_MANAGEMENT"],
        ["Desenvolvimento de produto", "PRODUCT_DEVELOPMENT"],
        ["Compliance e regulatório", "COMPLIANCE_REGULATORY"],
        ["Análise de políticas públicas", "PUBLIC_POLICY_ANALYSIS"],
        ["Outro", "OTHER"],
      ],
      buttons: [
        {text: "Voltar", function: () => setIndex(3), style: "clean"},
        {text: "Continuar", function: () => {
          if(stages[4].length === 0) return setErr("Por favor, selecione uma das opções abaixo.")
          setErr("")
          setIndex(5)
        }}
      ]
    },
    {
      question: "Como você conheceu a BD?",
      options: [
        ["Redes sociais", "SOCIAL_MEDIA"],
        ["Indicação", "REFERRAL"],
        ["Pesquisa online", "ONLINE_SEARCH"],
        ["Eventos", "EVENTS"],
        ["Publicidade", "ADVERTISING"],
        ["Outros", "OTHER"],
      ],
      buttons: [
        {text: "Voltar", function: () => setIndex(4), style: "clean"},
        {text: "Continuar", function: () => {
          if(stages[5].length === 0) return setErr("Por favor, selecione uma das opções abaixo.")
          setErr("")
          setIndex(6)
        }}
      ]
    },
    {
      question: "Estamos sempre buscando aprimorar a plataforma e consideramos fundamental ouvir a nossa comunidade nesse processo. Podemos contatar você para futuras pesquisas?",
      options: [["Sim", "YES"], ["Não", "NO"]],
      buttons: [{text: "Voltar", function: () => setIndex(5), style: "clean"}, {text: "Enviar", function: () => {
        if(stages[6].length === 0) return setErr("Por favor, selecione uma das opções abaixo.")
        setErr("")
        fetchUpdateProfileSurvey("false")
      }}]
    }
  ]

  const handleSelected = useCallback((value, stageIndex) => {
    setStages((prevStages) => prevStages.map((stage, i) => 
      i === stageIndex ? (stage.includes(value) ? [] : [value]) : stage
    ))
  }, [])

  const selectedValueStage = useCallback((value, stageIndex) => {
    return stages[stageIndex].includes(value)
  }, [stages])

  const progressValue = useCallback(() => {
    const values = [15, 30, 45, 60, 75, 90, 100]
    return values[index]
  }, [index])

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
        >
          {question[index].question}
        </Text>

        {err && (
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="18px"
            lineHeight="28px"
            marginBottom="40px !important"
            alignItems="center"
            gap="8px"
            color="#BF3434"
          >
            <Exclamation fill="#BF3434" /> {err}
          </Text>
        )}

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
              onClick={() => handleSelected(elm[1], index)}
              pointerEvents={isLoading ? "none" : "default"}
              borderRadius="16px"
              cursor="pointer"
              border={selectedValueStage(elm[1], index) ? "2px solid #42B0FF" : "1px solid #DEDFE0"}
              backgroundColor={selectedValueStage(elm[1], index) ? "#CFEBFE" : "#FFF"}
              width="fit-content"
              padding={selectedValueStage(elm[1], index) ? "11px" : "12px"}
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
                fontFamily="Roboto"
                fontWeight="500"
                pointerEvents={isLoading ? "none" : "default"}
                color={elm.style ? "#0D99FC" : "#FFFFFF"}
                backgroundColor={elm.style ? "#FFF" : "#0D99FC"}
                _hover={{
                  color: elm.style ? "#0B89E2" : "#FAFAFA",
                  backgroundColor: elm.style ? "" : "#0B89E2"
                }}
              >
                {isLoading ? (elm.text === "Pular" || elm.text === "Enviar")  ? <Spinner /> : elm.text : elm.text}
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
