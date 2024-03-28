import {
  Stack,
  VStack,
  Text,
  Center,
  Box,
  Image
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { NamedAvatar } from "../molecules/NamedAvatar";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import Carousel from "../atoms/Carousel";

function Testimonial({ children, name, position, src }) {
  return (
    <VStack
      margin={{ base: "0px", lg: "80px 32px 32px" }}
      width="80%"
    >
      <Stack
        alignItems="center"
      >
        <Image
          alt="aspas"
          width="50px"
          height="36px"
          src="https://storage.googleapis.com/basedosdados-website/images/quote.png"
        />
      </Stack>
      <Text
        margin="32px 16px 48px !important"
        fontFamily="Ubuntu"
        fontSize="28px"
        fontWeight="300"
        letterSpacing="-0.1px"
        textAlign="center"
        lineHeight="45px"
        color="#252A32"
      >
        {children}
      </Text>
      <NamedAvatar
        alignSelf="flex-end"
        name={name}
        position={position}
        src={src}
      />
    </VStack>
  );
}

function PartnerBox({ src, ...props }) {
  return (
    <Stack
      width="100%"
      height="100%"
      minWidth="100px"
      minHeight="100px"
      maxWidth="100px"
      maxHeight="100px"
      align="center"
      justify="center"
      padding="0px"
      filter="grayscale(100%)"
    >
      <Image
        width="100%"
        height="100%"
        objectFit="contain"
        src={src}
        {...props}
      />
    </Stack>
  );
}

export function BePartner() {
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <VStack width="80%" margin="auto">
      {/* <BigTitle>Como impactamos pessoas e organizações</BigTitle> */}
      <Stack
        width="100%"
        maxWidth="1264px"
        justifyContent="space-between"
        marginTop="40px"
        direction="column"
        spacing={10}
      >
        <Center width="100%">
          <Text
            zIndex={2}
            fontFamily="Ubuntu"
            fontSize={isMobileMod ? "16px" : "18px"}
            fontWeight="300"
            letterSpacing={isMobileMod ? "0.2px" : "0.1px"}
            color="#7D7D7D"
          >
            Parcerias com
          </Text>
        </Center>
        <Stack
          direction="row"
          width="100%"
          maxWidth="1264px"
          spacing={0}
          gridGap="30px"
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
        >
          <PartnerBox alt="tesouro nacional" src="https://storage.googleapis.com/basedosdados-website/logos/2022/tesouro_nacional.png" />
          <PartnerBox alt="ipea" src="https://storage.googleapis.com/basedosdados-website/logos/2022/ipea.png" />
          <PartnerBox alt="alziras" src="https://storage.googleapis.com/basedosdados-website/logos/2022/alziras.png" />
          <PartnerBox alt="fiquem sabendo" src="https://storage.googleapis.com/basedosdados-website/logos/2022/fiquem_sabendo.png" />
          <PartnerBox alt="bg lemann" src="https://storage.googleapis.com/basedosdados-website/logos/2022/bg__lemann.png" />
          <PartnerBox alt="rio" src="https://storage.googleapis.com/basedosdados-website/logos/2022/rio.png" />
          <PartnerBox alt="governosp" src="https://storage.googleapis.com/basedosdados-website/logos/2022/governosp.png" />
          <PartnerBox alt="aponte" src="https://storage.googleapis.com/basedosdados-website/logos/2022/aponte.png" />
        </Stack>
      </Stack>
      {!isMobile &&
        <Center 
          width="100%"
          maxWidth="1264px" 
        >
          <Carousel
            settings={{
              loop: true,
              autoplay: true,
              pagination: {
                clickable: true,
              }
            }}
          >
              <Testimonial
                name="Fernando Barbalho"
                position="Cientista de Dados do Tesouro Nacional"
                src="https://storage.googleapis.com/basedosdados-website/logos/2022/tesouro_nacional.png"
              >
                O siconfiBD é um pacote que traz de forma rápida e programática os
                dados da Secretaria do Tesouro Nacional.
                O código é construído de forma <i>open-source</i> pela equipe do Tesouro
                e utiliza as tabelas tratadas BD+ para compor funções em R.
                Qual a despesa de pessoal dos 100 municípios brasileiros mais
                populosos? Essas e mais de outras 18 perguntas podem ser consultadas
                diretamente pelo pacote, sem necessidade de SQL.
              </Testimonial>

              <Testimonial
                name="Marina Barros"
                position="Diretora-Executiva do Instituto Alziras"
                src="https://storage.googleapis.com/basedosdados-website/logos/2022/alziras.png"
              >
                Com o apoio da Base dos Dados realizamos o levantamento das
                desigualdades de gênero e raça nas eleições 2016-2020 e das
                distorções de financiamento de campanhas de prefeitas e vereadoras
                nas últimas eleições, o que resultará no lançamento de uma publicação inédita.
              </Testimonial>

              <Testimonial
                name="Amanda de Albuquerque e Mariana Carvalho"
                position="Co-fundadoras dA Ponte"
                src="https://storage.googleapis.com/basedosdados-website/logos/2022/aponte.png"
              >
                Criamos um importante produto nosso, a Fotografia do Município,
                em parceria com a BD. A Fotografia
                agrega diversos indicadores socioeconômicos dos municípios
                brasileiros. A Ponte fez o planejamento e desenho do relatório,
                enquanto a BD cuidou da parte técnica de visualização e gestão de
                dados. A parceria foi o que nos permitiu avançar rápido no
                desenvolvimento da ferramenta, e garantiu a qualidade de dados
                alta como queríamos desde o início.
              </Testimonial>
          </Carousel>
        </Center>
      }
    </VStack>
  );
}
