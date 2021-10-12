import { Box, Heading, HStack, Stack, Text, VStack } from "@chakra-ui/layout";
import Image from "next/image";
import { useState } from "react";
import BigTitle from "../atoms/BigTitle";
import SectionText from "../atoms/SectionText";

export function KnowOurServices({ ...props }) {
  const [currentTab, setCurrentTab] = useState("Captura de dados");
  const tabs = {
    "Captura de dados": {
      image:
        "https://basedosdados-static.s3.us-east-2.amazonaws.com/images/ilustracao_captura_dados-2.png",
      text: "Subimos e disponibilizamos dados sob demanda e com rapidez. Isso significa que você pode aproveitar todo o processamento do Google BigQuery sem precisar criar e manter uma infraestrutura própria. ",
    },
    Análise: {
      image:
        "https://basedosdados-static.s3.us-east-2.amazonaws.com/images/ilustracao_analises.png",
      text: "Preparamos indicadores, consultas e cruzamentos de dados do nosso datalake na forma de tabelas privadas de fácil consulta para seu projeto ou organização.",
    },
    Mentoria: {
      image:
        "https://basedosdados-static.s3.us-east-2.amazonaws.com/images/ilustracao_mentoria.png",
      text: "Ensinamos como aplicar nossa metodologia de limpeza, estruturação e padronização de dados no seu projeto ou organização através de workshops e materiais exclusivos.",
    },
  };
  return (
    <VStack {...props} width="100%">
      <BigTitle textAlign="center" maxWidth="100%" paddingBottom="40px">
        Conheça nossos serviços
      </BigTitle>
      <HStack
        boxShadow="0px 2px 5px 1px rgba(0, 0, 0, 0.25)"
        borderRadius="15px"
        spacing={10}
        zIndex="10"
        position="relative"
        backgroundColor="white"
        padding="0px 5%"
      >
        {Object.keys(tabs).map((tabName) => (
          <Heading
            color="#252A32"
            fontFamily="Ubuntu"
            fontSize="18px"
            height="50px"
            alignItems="center"
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
      <Stack
        width={{ base: "95%", lg: "70%" }}
        maxW="850px"
        backgroundColor="#FAFAFA"
        padding="70px 50px"
        paddingBottom="50px"
        paddingLeft={{ base: "50px", lg: "0px" }}
        borderRadius="22.3575px"
        transform="translateY(-20px)"
        direction={{ base: "column", lg: "row" }}
      >
        <Box minH="200px" flex="1" position="relative">
          <Image
            src={tabs[currentTab].image}
            objectFit="contain"
            layout="fill"
          />
        </Box>
        <SectionText fontWeight="400" flex="1" lineHeight="30px">
          {tabs[currentTab].text}
        </SectionText>
      </Stack>
    </VStack>
  );
}
