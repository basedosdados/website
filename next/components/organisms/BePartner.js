import { Image } from "@chakra-ui/image";
import { HStack, Stack, VStack, Text, Center } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { NamedAvatar } from "../molecules/NamedAvatar";
import { slidesToShowPlugin } from "@brainhubeu/react-carousel";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

const Carousel = dynamic(() => import("@brainhubeu/react-carousel"), {
  ssr: false,
});

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
          width="50px"
          src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/%E2%80%9C.png"
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
          <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/tesouro_nacional.png" />
          <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/ipea.png" />
          <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/alziras.png" />
          <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/fiquem_sabendo.png" />
          <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/bg__lemann.png" />
          <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/rio.png" />
          <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/governosp.png" />
          <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/aponte.png" />
        </Stack>
      </Stack>
      {!isMobile &&
        <HStack 
          w="110%"
          maxWidth="1264px" 
        >
          <Carousel
            plugins={[
              "infinite",
              "arrows",
              "fastSwipe",
              {
                resolve: slidesToShowPlugin,
                options: {
                  numberOfSlides: 1,
                },
              },
            ]}
          >
            <Testimonial
              name="Fernando Barbalho"
              position="Cientista de Dados do Tesouro Nacional"
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/tesouro_nacional.png"
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
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/alziras.png"
            >
              Com o apoio da Base dos Dados realizamos o levantamento das
              desigualdades de gênero e raça nas eleições 2016-2020 e das
              distorções de financiamento de campanhas de prefeitas e vereadoras
              nas últimas eleições, o que resultará no lançamento de uma publicação inédita.
            </Testimonial>
            <Testimonial
              name="Amanda de Albuquerque e Mariana Carvalho"
              position="Co-fundadoras dA Ponte"
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/2022/aponte.png"
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
        </HStack>
      }
    </VStack>
  );
}
