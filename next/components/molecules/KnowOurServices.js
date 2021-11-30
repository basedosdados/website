import { Box, Heading, HStack, Stack, Text, VStack } from "@chakra-ui/layout";
import Image from "next/image";
import { useState } from "react";
import BigTitle from "../atoms/BigTitle";
import SectionText from "../atoms/SectionText";
import SectionTitle from "../atoms/SectionTitle";

export function KnowOurServices({ ...props }) {
  const [currentTab, setCurrentTab] = useState("1. Demanda");
  const tabs = {
    "1. Demanda": {
      title: "Identificação de demandas e necessidades do cliente",
      text: "Trabalhamos colaborativamente para compreender as reais necessidades por trás dos pedidos de nossos clientes. O trabalho de descoberta compreende discussões sobre os objetivos e usos dos dados a serem capturados. É neste passo que fica claro para nós e nossos clientes nosso objetivo final.",
    },
    "2. Planejamento": {
      title: "Alinhamento de expectativas de negócio e de engenharia",
      text: "O segundo passo é entender qual a melhor forma de entregarmos os dados desejados. Explicamos nosso processo padronizado de engenharia e buscamos entregar o valor dos dados da forma mais acessível e completa possível. ",
    },
    "3. Pesquisa de bases": {
      title: "Identificação das bases de dados",
      text: (
        <>
          O próximo passo é realizar uma varredura em bases de dados, sejam elas
          já presentes em nosso <i>datalake</i>, catalogadas em nosso buscador
          ou ainda não disponibilizadas de forma organizada pelo nosso time. O
          objetivo é identificar como extrair todo valor requisitado de maneira
          selecionada e estruturada.
        </>
      ),
    },
    "4. Orçamento": {
      title: "Orçamento transparente e simplificado",
      text: (
        <>
          Uma vez claramente alinhado o escopo, formato e expectativas,
          entregamos uma proposta de orçamento completamente transparente.
          Baseamos nosso trabalho na quantidade e complexidade de{" "}
          <i>datasets</i>, trabalho necessário e urgência. Tudo explícito de
          forma direta e alinhada com o que foi identificado até então.
        </>
      ),
    },
    "5. Execução": {
      title: "Execução ágil e entrega de valor",
      text: (
        <>
          Por fim, nossa entrega é comprometida com prazos e, sobretudo,
          qualidade. A comunicação é constante durante toda execução.
          Trabalhando de forma <i>lean</i> e com profissionais experientes na
          área, nosso time é focado em satisfazer nossos clientes.
        </>
      ),
    },
  };
  return (
    <VStack {...props} width={{ base: "100%", lg: "90%" }}>
      <HStack
        boxShadow="0px 2px 5px 1px rgba(0, 0, 0, 0.25)"
        borderRadius="15px"
        spacing={10}
        zIndex="10"
        position="relative"
        backgroundColor="white"
        padding="0px 5%"
        overflowX={{ base: "scroll", lg: "none" }}
        maxW={{ base: "300px", lg: "initial" }}
      >
        {Object.keys(tabs).map((tabName) => (
          <Heading
            color="#252A32"
            fontFamily="Ubuntu"
            fontSize="18px"
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
