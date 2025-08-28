import {
  Stack,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import TitleText from "../../atoms/Text/TitleText";
import BodyText from "../../atoms/Text/BodyText";

export default function PresentationSolutions() {
  const [state, setState] = useState(0);

  const data = [
    {
      title: "Encontre os dados rapidamente",
      content: "Pesquise diretamente ou aplique filtros — como tema, organização e mais — para encontrar os dados certos para sua análise.",
      img: "image_filtros"
    },
    {
      title: "Trabalhe no ambiente que você já conhece",
      content: "Acesse as tabelas tratadas da nossa plataforma de dados via BigQuery, ou usando os pacotes em Python e R.",
      img: "image_linguagens"
    },
    {
      title: "Automatize a tradução de códigos institucionais",
      content: "Poupe tempo com a tradução automatizada de códigos, como os identificadores de 7 dígitos do IBGE para municípios brasileiros.",
      img: "image_traducao_de_codigos_institucionais"
    },
    {
      title: "Construa análises com apoio dos guias de uso",
      content: "Consulte detalhes sobre séries históricas, possibilidades de cruzamento, mudanças na coleta e outras informações relevantes.",
      img: "image_guia_de_uso"
    }
  ]

  return (
    <Stack
      width="100%"
      spacing={0}
      margin="0 auto"
      boxSizing="border-box"
      paddingX="24px"
    >
      <Stack
        width="100%"
        maxWidth="1440px"
        justifyContent="space-between"
        gap="24px"
        flexDirection={{base: "column", md: "column", lg: "row"}}
        spacing={0}
        margin="0 auto"
      >
        <Stack
          flex={1}
          maxWidth={{md:"100%", lg:"624px"}}
          padding={{md:"30px 0 40px", lg:"30px 24px 40px 0"}}
        >
          <Accordion
            index={state}
            onChange={(e) => setState(e)}
          >
            {data.map((elm, index) => 
              <AccordionItem
                key={index}
                borderTopWidth="0"
                borderBottomWidth="1px"
                padding="10px 0"
              >
                <AccordionButton
                  padding={index === state ? "24px 0 0" : "24px 0"}
                  _hover={{
                    backgroundColor: "transparent"
                  }}
                >
                  <TitleText
                    display="flex"
                    width="100%"
                    flexDirection="row"
                    justifyContent="space-between"
                    color={index === state ? "#252A32" : "#71757A"}
                    _hover={{
                      color: "#252A32"
                    }}
                  >
                    {elm.title}
                  <Text
                    display={state === index ? "none" : "flex"}
                    fontSize="32px"
                    fontWeight="300"
                    color="#2B8C4D"
                  >+</Text>
                  </TitleText>
                </AccordionButton>
                <AccordionPanel
                  padding="0 0 24px"
                >
                  <BodyText typography="large" color="#464A51">
                    {elm.content}
                  </BodyText>
                </AccordionPanel>
              </AccordionItem>
            )}
          </Accordion>
        </Stack>
        <Stack
          flex={1}
          width="100%"
          height="100%"
          maxWidth="700px"
          maxHeight="500px"
          borderRadius="24px"
          overflow="hidden"
        >
          <Image
            width="100%"
            height="100%"
            objectFit="contain"
            loading="lazy"
            alt={data[state].img || ""}
            src={`https://storage.googleapis.com/basedosdados-website/images/${data[state].img}.png` || ""}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
