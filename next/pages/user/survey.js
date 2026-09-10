import {
  Box,
  Stack,
  Progress,
  Spinner
} from "@chakra-ui/react";
import { useState, useCallback } from "react";
import cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import Button from "../../components/atoms/Button";
import Display from "../../components/atoms/Text/Display";
import LabelText from "../../components/atoms/Text/LabelText";
import { MainPageTemplate } from "../../components/templates/main";
import { triggerGAEvent } from "../../utils";

import Exclamation from "../../public/img/icons/exclamationIcon";

import { withPages } from "../../hooks/pages.hook";

export async function getStaticProps({ locale }) {
  const pagesProps = await withPages()
  return {
    ...pagesProps,
    props: {
      ...pagesProps.props,
      ...(await serverSideTranslations(locale, ['survey', 'common', 'menu'])),
    },
  }
}

export default function Survey() {
  const router = useRouter();
  const { t } = useTranslation('survey');
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
      setErr(t('errors.server'))
      console.error(result.errors)
      return setIsLoading(false)
    }

    const userData = await fetch(`/api/user/getUser?p=${btoa(id)}`, { method: "GET" })
      .then(res => res.json())
    cookies.set('userBD', JSON.stringify(userData))
    triggerGAEvent("survey_login", skip === "true" ? "Skipou" : "Respondeu")

    const previousPath = localStorage.getItem('previousPath')
    const isAuthPage = previousPath && (previousPath.includes('/user/login') || previousPath.includes('/user/register'))

    if(previousPath && !isAuthPage) {
      localStorage.removeItem('previousPath')
      return window.location.href = previousPath
    }
    if (previousPath) localStorage.removeItem('previousPath')

    router.push('/')
  }

  // Option codes are sent to the backend and must not be translated; only the
  // labels come from the locale files.
  const questionSpecs = [
    {key: "area", options: ["TECNOLOGIA", "SAUDE", "FINANCEIRO", "EDUCACAO", "VAREJO", "ENERGIA", "JORNALISMO", "OUTRA"]},
    {key: "role", options: ["CEO_DIRETOR", "GERENTE", "COORDENADOR", "ANALISTA", "CONSULTOR", "ESPECIALISTA", "ASSISTENTE", "ESTAGIARIO", "ESTUDANTE", "PROFESSOR_PESQUISADOR", "FREELANCER", "EMPREENDEDOR", "OUTRO"]},
    {key: "companySize", options: ["PEQUENA_1_10", "PEQUENA_11_50", "MEDIA_51_200", "MEDIA_201_500", "GRANDE_MAIS_500"]},
    {key: "tool", options: ["SQL", "PYTHON", "R", "STATA", "EXCEL", "NONE", "OTHER"]},
    {key: "goal", options: ["MARKET_ANALYSIS", "COMPETITOR_MONITORING", "ACADEMIC_RESEARCH", "RISK_MANAGEMENT", "PRODUCT_DEVELOPMENT", "COMPLIANCE_REGULATORY", "PUBLIC_POLICY_ANALYSIS", "OTHER"]},
    {key: "discovery", options: ["SOCIAL_MEDIA", "REFERRAL", "ONLINE_SEARCH", "EVENTS", "ADVERTISING", "OTHER"]},
    {key: "contact", options: ["YES", "NO"]}
  ]

  const question = questionSpecs.map((spec, i) => {
    const isLast = i === questionSpecs.length - 1

    return {
      question: t(`${spec.key}.question`),
      options: spec.options.map((code) => [t(`${spec.key}.options.${code}`), code]),
      buttons: [
        i === 0
          ? {text: t('buttons.skip'), style: "clean", submits: true, function: async () => fetchUpdateProfileSurvey("true")}
          : {text: t('buttons.back'), style: "clean", function: () => setIndex(i - 1)},
        {
          text: isLast ? t('buttons.submit') : t('buttons.continue'),
          submits: isLast,
          function: () => {
            if(stages[i].length === 0) return setErr(t('errors.selectOption'))
            setErr("")
            if(isLast) return fetchUpdateProfileSurvey("false")
            setIndex(i + 1)
          }
        }
      ]
    }
  })

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
      paddingTop={{ base: "24px", md: "70px" }}
      paddingX={{ base: "16px", md: "24px" }}
      paddingBottom={{ base: "32px", md: "50px" }}
      cleanTemplate
    >
      <Stack
        width="100%"
        maxWidth="800px"
        minHeight={{ base: "calc(100dvh - 120px)", md: "auto" }}
        maxHeight={{ base: "none", md: "575px" }}
        margin="0 auto"
        spacing={0}
        marginY={{ base: "16px", md: "40px" }}
        flex="1"
      >
        <Display
          typography="small"
          marginY={{ base: "24px", md: "64px" }}
          fontSize={{ base: "24px", md: "36px" }}
          lineHeight={{ base: "32px", md: "48px" }}
        >
          {question[index].question}
        </Display>

        {err && (
          <LabelText
            typography="large"
            marginBottom="40px !important"
            alignItems="center"
            gap="8px"
            color="#BF3434"
          >
            <Exclamation fill="#BF3434" /> {err}
          </LabelText>
        )}

        <Stack
          flexDirection="row"
          flexWrap="wrap"
          width="100%"
          marginBottom={{ base: "24px", md: "40px" }}
          gap="12px"
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
              border={selectedValueStage(elm[1], index) ? "2px solid #2B8C4D" : "1px solid #DEDFE0"}
              backgroundColor={selectedValueStage(elm[1], index) ? "#D5E8DB" : "#FFF"}
              width={{ base: "100%", sm: "fit-content" }}
              maxWidth="100%"
              padding={selectedValueStage(elm[1], index) ? "11px" : "12px"}
              fontFamily="Roboto"
              fontWeight="500"
              fontSize={{ base: "16px", md: "18px" }}
              lineHeight={{ base: "24px", md: "28px" }}
              color={selectedValueStage(elm[1], index) ? "#2B8C4D" : "#464A51"}
            >
              {elm[0]}
            </Box>
          )}
        </Stack>

        <Stack
          marginTop="auto !important"
          paddingTop={{ base: "24px", md: 0 }}
          flexDirection={{ base: "column", md: "row" }}
          width="100%"
          height={{ base: "auto", md: "60px" }}
          alignItems={{ base: "stretch", md: "center" }}
          justifyContent="space-between"
          gap={{ base: "24px", md: 0 }}
        >
          <Progress
            width={{ base: "100%", md: "200px" }}
            flexShrink={0}
            height="12px"
            borderRadius="100px"
            backgroundColor="#DEDFE0"
            value={progressValue()}
            css={{
              '& > div': {
                background: '#2B8C4D',
              }
            }}
          />

          <Stack
            flexDirection={{ base: "column-reverse", sm: "row" }}
            alignItems={{ base: "stretch", sm: "center" }}
            width={{ base: "100%", md: "auto" }}
            height={{ base: "auto", md: "100%" }}
            gap="16px"
            spacing={0}
          >
            {question[index].buttons.map((elm, i) => 
              <Button
                key={i}
                onClick={elm.function}
                width={{ base: "100%", sm: "fit-content" }}
                height={{ base: "48px", md: "100%" }}
                justifyContent="center"
                fontSize={{ base: "18px", md: "20px" }}
                lineHeight={{ base: "28px", md: "30px" }}
                fontFamily="Roboto"
                fontWeight="500"
                pointerEvents={isLoading ? "none" : "default"}
                color={elm.style ? "#2B8C4D" : "#FFFFFF"}
                backgroundColor={elm.style ? "#FFF" : "#2B8C4D"}
                _hover={{
                  color: elm.style ? "#22703E" : "#FAFAFA",
                  backgroundColor: elm.style ? "" : "#22703E"
                }}
              >
                {isLoading && elm.submits ? <Spinner /> : elm.text}
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
