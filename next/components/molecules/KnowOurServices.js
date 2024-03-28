import { 
  Heading,
  HStack,
  VStack 
} from "@chakra-ui/react";
import { useState } from "react";
import SectionText from "../atoms/SectionText";
import SectionTitle from "../atoms/SectionTitle";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";

export function KnowOurServices({ ...props }) {
  const [currentTab, setCurrentTab] = useState("1. Demanda");
  const tabs = {
    "1. Demanda": {
      title: "Identificação de demandas e necessidades do cliente",
      text: "Trabalhamos colaborativamente para compreender as reais necessidades por trás dos pedidos de nossos clientes. O trabalho de descoberta compreende discussões sobre os objetivos do projeto ou o uso dos dados a serem capturados e analisados. É nesta etapa que fica claro para nossa equipe e para os clientes o objetivo final do serviço.",
    },
    "2. Planejamento": {
      title:
        "Alinhamento de expectativas de negócio, engenharia ou capacitação",
      text: "O segundo passo é entender qual a melhor forma de entregarmos o valor que você precisa. Não trabalhamos com propostas genéricas. Cada projeto é pensado e orientado 100% para as demandas dos clientes, seja no formato de entrega de dados, análises ou capacitações específicas.",
    },
    "3. Orçamento": {
      title: "Orçamento transparente e simplificado",
      text: (
        <>
          Uma vez alinhado o escopo, formato e expectativas, entregamos uma
          proposta de orçamento completamente transparente. Para isso,
          consideramos fatores como a quantidade e complexidade de{" "}
          <i>datasets</i>, trabalho necessário, tamanho da equipe e urgência.
          Tudo explícito de forma direta e em conformidade com o que foi
          determinado até então.
        </>
      ),
    },
    "4. Execução": {
      title: "Execução ágil e entrega de valor",
      text: (
        <>
          Por fim, nossa entrega é comprometida com prazos e, sobretudo,
          qualidade. A comunicação é constante durante toda execução.
          Trabalhando de forma <i>lean</i> e com profissionais experientes na
          área, nossa equipe preza pela satisfação de nossos clientes.
        </>
      ),
    },
  };
  return (
    <VStack {...props} width={{ base: "100%", lg: "75%" }}>
      <HStack
        boxShadow="0px 2px 5px 1px rgba(0, 0, 0, 0.25)"
        borderRadius="15px"
        spacing={10}
        flexDirection={isMobileMod && "column"}
        zIndex="10"
        position="relative"
        backgroundColor="white"
        padding="0px 5%"
        overflowX={{ base: "scroll", lg: "none" }}
        maxW={{ base: "500px", lg: "initial" }}
      >
        {Object.keys(tabs).map((tabName) => (
          <Heading
            color={tabName === currentTab ? "#34A15A" : "#252A32"}
            fontFamily="Ubuntu"
            fontSize="16px"
            height="50px"
            alignItems="center"
            whiteSpace="nowrap"
            display="flex"
            boxSizing="border-box"
            letterSpacing="0.03rem"
            onClick={() => setCurrentTab(tabName)}
            fontWeight={tabName === currentTab ? "700" : "400"}
            borderBottom={
              tabName === currentTab ? "5px solid #34A15A" : "5px solid white"
            }
            transition="0.4s"
            cursor="pointer"
          >
            {tabName}
          </Heading>
        ))}
      </HStack>
      <VStack
        width={{ base: "95%", lg: "100%" }}
        border="2px solid #E3E3E3"
        padding="70px"
        borderRadius="22.3575px"
        transform="translateY(-35px)"
        align="flex-start"
      >
        <SectionTitle fontSize="20px">{tabs[currentTab].title}</SectionTitle>
        <SectionText fontWeight="400" flex="1" lineHeight="30px">
          {tabs[currentTab].text}
        </SectionText>
      </VStack>
    </VStack>
  );
}
