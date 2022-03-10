import { Image } from "@chakra-ui/image";
import { HStack, Stack, VStack } from "@chakra-ui/layout";
import dynamic from "next/dynamic";
import BigTitle from "../atoms/BigTitle";
import Link from "../atoms/Link";
import RoundedButton from "../atoms/RoundedButton";
import SectionText from "../atoms/SectionText";
import SectionTitle from "../atoms/SectionTitle";
import { ShadowBox } from "../atoms/ShadowBox";
import { NamedAvatar } from "../molecules/NamedAvatar";
import { slidesToShowPlugin } from "@brainhubeu/react-carousel";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";

const Carousel = dynamic(() => import("@brainhubeu/react-carousel"), {
  ssr: false,
});

function Testimonial({ children, name, position, src }) {
  return (
    <VStack
      padding={{ base: "0px", lg: "30px" }}
      paddingTop={{ base: "0px", lg: "50px" }}
      width="80%"
    >
      <Image
        width="50px"
        paddingBottom="5px"
        alignSelf="flex-start"
        src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/%E2%80%9C.png"
      />
      <SectionText
        paddingLeft="50px"
        paddingBottom="20px"
        fontFamily="Ubuntu"
        fontSize="22px"
        textAlign="center"
        lineHeight="30px"
      >
        {children}
      </SectionText>
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
    <ShadowBox
      align="center"
      justify="center"
      width="120px"
      height="120px"
      padding="0px"
      paddingBottom="20px"
      {...props}
    >
      <Image width="100%" height="100%" objectFit="contain" src={src} />
    </ShadowBox>
  );
}

export function BePartner() {
  const isMobile = useCheckMobile();

  return (
    <VStack width="80%" spacing={7} margin="auto">
      <BigTitle>Como impactamos pessoas e organizações</BigTitle>
      <Stack
        width="100%"
        justifyContent="space-between"
        pt="50px"
        direction={{ base: "column", lg: "row" }}
      >
        <VStack alignItems="flex-start" spacing={6} maxW="500px">
          <SectionTitle fontFamily="Ubuntu" fontSize="28px">
            Faça parte de nossa rede de parceiros e clientes
          </SectionTitle>
          <SectionText letterSpacing="0.5px">
            <b>
              Fortalecemos o uso eficaz e escalável de dados em governos,
              empresas e organizações.
            </b>{" "}
            Abra dados de sua organização, construa projetos de dados abertos
            conosco ou desenvolva aplicações com nossos dados.
          </SectionText>
          <Link textDecoration="none !important" href="/blog/1/">
            <RoundedButton
              fontFamily="Ubuntu"
              fontSize="18px"
              width="250px"
              height="45px"
            >
              Entre em contato
            </RoundedButton>
          </Link>
        </VStack>
        <VStack paddingTop={{ base: "20px", lg: 0 }} spacing={5}>
          <Stack direction={{ base: "column", lg: "row" }} spacing={5}>
            <HStack spacing={5}>
              <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/tesouro_nacional.png" />
              <PartnerBox
                padding="0px 10px"
                src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/fiquem_sabendo.png"
              />
            </HStack>
            <HStack spacing={5}>
              <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/governosp.png" />
              <PartnerBox
                padding="0px 20px"
                src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/bg__lemann.png"
              />
            </HStack>
          </Stack>
          <Stack direction={{ base: "column", lg: "row" }} spacing={5}>
            <HStack spacing={5}>
              <PartnerBox
                padding="0px 20px"
                src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/ipea.png"
              />
              <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/alziras.png" />
            </HStack>
            <HStack spacing={5}>
              <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/rio.png" />
              <PartnerBox src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/aponte.png" />
            </HStack>
          </Stack>
        </VStack>
      </Stack>
      {!isMobile &&
        <HStack w="110%">
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
              name="Marina Barros"
              position="Diretora-Executiva do Instituto Alziras"
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/alziras.png"
            >
              Com o apoio da Base dos Dados realizamos o{" "}
              <SectionText 
                fontFamily="Ubuntu" 
                fontSize="22px" 
                fontWeight="500" 
                textAlign="center"
                lineHeight="30px"
              >
                levantamento das desigualdades de gênero e raça nas eleições 2016-2020 e das distorções de financiamento de campanhas de prefeitas e vereadoras
              </SectionText>
              nas últimas eleições, o que resultará no lançamento de uma
              publicação inédita.
            </Testimonial>
            <Testimonial
              name="Amanda de Albuquerque e Mariana Carvalho"
              position="Co-fundadoras dA Ponte"
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/aponte.png"
            >
              Criamos um importante produto nosso, a{" "}
              <SectionText 
                fontFamily="Ubuntu" 
                fontSize="22px" 
                fontWeight="500" 
                textAlign="center"
                lineHeight="30px"
              >
                Fotografia do Município,{" "}
              </SectionText>
              em parceria com a BD. A Fotografia
              agrega diversos indicadores socioeconômicos dos municípios
              brasileiros. A Ponte fez o planejamento e desenho do relatório,
              enquanto a BD cuidou da parte técnica de visualização e gestão de
              dados.{" "}
              <SectionText 
                fontFamily="Ubuntu" 
                fontSize="22px" 
                fontWeight="500" 
                textAlign="center"
                lineHeight="30px"
              >
                A parceria foi o que nos permitiu avançar rápido no
                desenvolvimento da ferramenta, e garantiu a qualidade de dados
                alta como queríamos desde o início.
              </SectionText>
            </Testimonial>
            <Testimonial
              name="Fernando Barbalho"
              position="Cientista de Dados do Tesouro Nacional"
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/logos/tesouro_nacional.png"
            >
              <SectionText 
                fontFamily="Ubuntu" 
                fontSize="22px" 
                fontWeight="500" 
                textAlign="center"
                lineHeight="30px"
              >
                A siconfiBD é um pacote que traz de forma rápida e programática os
                dados da Secretaria do Tesouro Nacional.
              </SectionText>
              O código é construído de forma <i>open-source</i> pela equipe do Tesouro
              e 
              <SectionText 
                fontFamily="Ubuntu" 
                fontSize="22px" 
                fontWeight="500" 
                textAlign="center"
                lineHeight="30px"
              >
                utiliza as tabelas tratadas BD+ para compor funções em R.
              </SectionText>
              Qual a despesa de pessoal dos 100 municípios brasileiros mais
              populosos? Essas e mais de outras 18 perguntas podem ser consultadas
              diretamente pelo pacote, sem necessidade de SQL.
            </Testimonial>
          </Carousel>
        </HStack>
      }
    </VStack>
  );
}
