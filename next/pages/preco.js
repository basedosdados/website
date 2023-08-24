import {
  Box,
  VStack,
  Stack,
  Text
} from "@chakra-ui/react";
import Head from "next/head";
import Display from "../components/atoms/Display";
import BigTitle from "../components/atoms/BigTitle"
import BodyText from "../components/atoms/BodyText";
import RoundedButton from "../components/atoms/RoundedButton";
import { MainPageTemplate } from "../components/templates/main";
  

export default function Price() {

  const CardPrice = ({
    colorBanner,
    title,
    subTitle,
    price,
    person,
    textResource,
    resources = [],
    button
  }) => {

    return (
      <Box
        position="relative"
        width="440px"
        height="720px"
        borderRadius="16px"
        boxShadow="0 2px 16px 0 rgba(100, 96, 103, 0.16)"
        padding="40px 24px"
        textAlign="center"
      >
        <Box
          position="absolute"
          borderRadius="16px 16px 0 0"
          height="8px"
          width="100%"
          top="0"
          left="0"
          backgroundColor={colorBanner}
        />
        <BigTitle marginBottom="8px">{title}</BigTitle>
        <BodyText marginBottom="24px">{subTitle}</BodyText>
        <Box
          justifyContent="center"
          display="flex"
          flexDirection="row"
          height="50px"
          alignItems="center"
          marginBottom="24px"
        >
          <Text
            color="#252A32"
            fontSize="50px"
            fontWeight="500"
            fontHeight="54px"
            letterSpacing="-0.8px"
            fontFamily="Ubuntu"
          >R$ {price}</Text>
          <Text
            position="relative"
            top="10px"
            color="#252A32"
            fontSize="18px"
            fontWeight="700"
            fontHeight="22px"
            letterSpacing="0.3px"
            fontFamily="Ubuntu"
          >/mês</Text>
        </Box>
        <BodyText
          fontSize="16px"
          lineHeight="16px"
          letterSpacing="0.2px"
          fontWeight="400"
          marginBottom="24px"
        >inclui {person} pessoa</BodyText>

        <Box
          height="40px"
          backgroundColor="red"
          marginBottom="40px"
        >

        </Box>

        <Box
          textAlign="start"
        >
          <Text
            color="#6F6F6F"
            fontSize="14px"
            fontWeight="400"
            fontHeight="27px"
            letterSpacing="0.3px"
            fontFamily="Ubuntu"
            marginBottom="20px"
          >
            {textResource}
          </Text>

          {resources.map((elm, i) => {
            return (
              <Box key={i} marginBottom="16px">
                <BodyText
                  fontSize="16px"
                  lineHeight="16px"
                  letterSpacing="0.2px"
                  fontWeight="400"
                >
                  {elm.name}
                </BodyText>
              </Box>
            )
          })}

          <RoundedButton
            width="100%"
            marginTop="auto"
            color={button.colorText || "#FFF"}
            backgroundColor={button.color || "#42B0FF"}
            onClick={() => window.open(button.href, "_blank")}
            border={button.color && `1px solid ${button.colorText}`}
          >
            {button.text}
          </RoundedButton>
        </Box>
      </Box>
    )
  }
  
  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>Preço – Base dos Dados</title>
        <meta
          property="og:title"
          content="Preço – Base dos Dados"
          key="ogtitle"
        />
      </Head>

      <Stack
        gridGap={{base:"40px", lg: "100px"}}
        paddingTop="90px"
        width="100%"
        maxWidth="1264px"
        flexDirection="column"
        margin="auto"
      >
        <Display
          width="100%"
          fontSize="60px"
          textAlign="center"
          lineHeight="72px"
          letterSpacing="-1.5px"
        >
          Compare os planos
        </Display>

        <Stack
          justifyContent="center"
          flexDirection="row"
          gap="80px"
          spacing={0}
        >
          <CardPrice
            colorBanner="#2B8C4D"
            title="BD Grátis"
            subTitle={`Para você descobrir o potencial da \nplataforma de dados`}
            price="0"
            person={1}
            textResource="Recursos:"
            resources={[
              {name: "Tabelas tratadas"},
              {name: "Dados integrados"},
              {name: "Acesso em nuvem"},
              {name: "Acesso via SQL, Python, R e Stata"},
              {name: "Integração com ferramentas BI"},
              {name: "Download até 200.000 linhas"},
              {name: "Até 1TB de processamento"}
            ]}
            button={{
              text: "Começar",
              href: "",
              color: "#FFF",
              colorText: "#42B0FF"
            }}
          />

          <CardPrice
            colorBanner="#9C8400"
            title="BD Pro"
            subTitle={`Para você ou sua equipe avançarem \nnas análises de dados`}
            price="250"
            person={2}
            textResource="Todos os recursos da BD Grátis, mais:"
            resources={[
              {name: "Dezenas de bases de alta frequência atualizadas"},
              {name: "Cashback para processamento"},
              {name: "Suporte prioritário"},
            ]}
            button={{
              text: "Iniciar teste grátis",
              href: ""
            }}
          />
        </Stack>
      </Stack>
    </MainPageTemplate>
)
}
