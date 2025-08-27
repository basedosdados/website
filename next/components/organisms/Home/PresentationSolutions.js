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
import { useTranslation } from 'next-i18next';
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";
import TitleText from "../../atoms/Text/TitleText";
import BodyText from "../../atoms/Text/BodyText";
import CrossIcon from "../../../public/img/icons/crossIcon";

export default function PresentationSolutions() {
  const { t } = useTranslation("home");
  const [state, setState] = useState(0);

  console.log(state)

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
      maxWidth="1440px"
      justifyContent="space-between"
      gap="24px"
      flexDirection="row"
      spacing={0}
      margin="0 auto"
    >
      <Stack
        flex={1}
        maxWidth="624px"
        paddingY="40px"
      >
        <Accordion
          index={state}
          onChange={(e) => setState(e)}
        >
          {data.map((elm, index) => 
            <AccordionItem key={index}>
              <AccordionButton>
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
                  fontSize="26px"
                  fontWeight="500"
                  color="#2B8C4D"
                >+</Text>
                </TitleText>
              </AccordionButton>
              <AccordionPanel>
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
  )
}
