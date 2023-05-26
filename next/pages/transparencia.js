import {
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { withPages } from "../hooks/pages.hook";
import { MainPageTemplate } from "../components/templates/main";
import Display from "../components/atoms/Display";
import BigTitle from "../components/atoms/BigTitle";
import SectionText from "../components/atoms/SectionText";
import BodyText from "../components/atoms/BodyText";
import Link from "../components/atoms/Link";
import RoundedButton from "../components/atoms/RoundedButton";
import TransparencyImage from "../public/img/transparencyImage";
import DonationImage from "../public/img/donationImage";

export async function getStaticProps(context) {
  return await withPages();
}
  
export default function Transparencia({ pages }) {
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  const SectionBox = ({ children, ...props }) => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ base: "column", lg: "row" }}
        paddingTop={isMobileMod ? "112px" : "56px"}
        width="100%"
        maxWidth="1264px"
        margin="auto"
        {...props}
      >
        {children}
      </Box>
    )
  }

  const GraphicsBox = ({ text, url, ...props }) => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        maxWidth={{ base: "100%", lg: "45%" }}
        width={{base: "350px", lg: "650px"}}
        height={{base: "320px", lg: "400px"}}
        marginTop="0 !important"
        {...props}
      >
        {text &&
          <Text
            width="100%"
            fontFamily="Ubuntu"   
            textAlign={isMobileMod ? "start" : "center"}
            fontSize={{base: "20px", lg: "24px"}}
            fontWeight="400"
            letterSpacing={{base: "0.2px", lg: "0"}}
            minHeight="30px"
            marginBottom={{base: "0px", lg: "32px"}}
            color="#252A32"
          >
            {text}
          </Text>
        }

        <iframe
          src={url}
          frameborder="0"
          width="100%"
          height="100%"
          allowtransparency
        />
      </Box>
    )
  }

  return (
    <MainPageTemplate pages={pages} paddingX="24px" paddingBottom="0">
      <Head>
        <title>Transparência – Base dos Dados</title>
        <meta
          property="og:title"
          content="Transparência – Base dos Dados"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Utilizamos os recursos para facilitar o acesso de milhares de pessoas a dados de qualidade. Nesse espaço, você encontra informações referentes às nossas atividades, receitas e despesas. Acompanhe de perto como garantimos a sustentabilidade da organização e saiba como você também pode nos apoiar."
          key="ogdesc"
        />
      </Head>

      <SectionBox 
        alignItems="center"
      >
        <Stack
          spacing={0}
          maxWidth={{ base: "100%", lg: "45%" }}
        >
          <Display 
            color="#2B8C4D"
            paddingBottom={isMobileMod ? "24px" : "32px" }
            fontSize={isMobileMod ? "34px" : "50px" }
            lineHeight={isMobileMod ? "40px" : "54px"}
            letterSpacing={isMobileMod ? "-0.5px" : "-0.8px" }
          >
            Nossas contas são {isMobileMod ? " " : <br/>} transparentes e abertas {isMobileMod ? " " : <br/>} – como todo o resto.
          </Display>
          <BodyText paddingBottom="24px">
            Somos uma organização não-governamental sem fins lucrativos e <i>open source</i>. A transparência fundamenta todas as nossas ações, desde o trabalho com dados públicos até a prestação de contas. Utilizamos os recursos para facilitar o acesso de milhares de pessoas a dados de qualidade. 
          </BodyText>
          <BodyText paddingBottom="24px">
            Nesse espaço, você encontra informações referentes às nossas atividades, receitas e despesas. Acompanhe de perto como garantimos a sustentabilidade da organização.
          </BodyText>
        </Stack>

        <Stack 
          width={isMobileMod ? "100%" : {base: "445px", lg: "550px"}}
          height={isMobileMod ? "100%" : {base: "356px", lg: "430px"}}
          marginBottom={isMobileMod ? "0" : "104px"}
        >
          <TransparencyImage
            widthImage="100%"
            heightImage="100%"
          />
        </Stack>
      </SectionBox>

      <SectionBox
        paddingTop={isMobileMod ? "112px" : "104px"}
        alignItems="center"
      >
        <Stack
          display={isMobileMod ? "flex" : "none"}
          width="100%"
        >
          <Display
            paddingBottom="40px"
          >
            Indicador de sobrevida
          </Display>
        </Stack>

        <Stack 
          maxWidth={{ base: "100%", lg: "45%" }}
          width={{base: "350px", lg: "450px"}}
          height={{base: "300px", lg: "375px"}}
          marginLeft={{base: "0px", lg: "64px"}}
        >
          <iframe
            src="https://perguntas.basedosdados.org/public/question/80ad0ba9-bfa9-4427-96a0-675fb2252b37#titled=false&bordered=false"
            frameborder="0"
            width="100%"
            height="100%"
            allowtransparency
          />
        </Stack>

        <Stack 
          maxWidth={{ base: "100%", lg: "45%" }}
          paddingTop={{base: "24px", lg: "0px"}}
          spacing={0}
        >
          <Display
            display={isMobileMod ? "none" : "flex"}
            paddingBottom={{base: "8px", lg: "24px"}}
          >
            Indicador de sobrevida
          </Display>
          <BodyText paddingBottom="24px">
            Esse é nosso indicador de sobrevida. Ele mostra o tempo que nossas atividades poderiam se manter caso a organização arrecadasse só o que já está planejado e se continuasse gastando como na média dos três meses anteriores. 
          </BodyText>
          <BodyText paddingBottom="24px">
            Abaixo, você confere os detalhes das fontes e destinações de recursos da organização.
          </BodyText>
        </Stack>
      </SectionBox>

      <SectionBox
        flexDirection="column"
        paddingTop={{ base: "88px", lg: "152px" }}
        alignItems={isMobileMod ? "start" : "center"}
      >
        <Display
          textAlign={isMobileMod ? "start" : "center"}
          paddingBottom={isMobileMod ? "24px" : "8px"}
        >
          Dados da contabilidade
        </Display>
        <BodyText
          textAlign={isMobileMod ? "start" : "center"}
          paddingBottom={isMobileMod ? "24px" : "16px"}
        >
          Como não poderia deixar de ser, todos os microdados{isMobileMod ? " " : <br/>}
          relativos à contabilidade da BD estão disponíveis no <i>datalake</i> público.
        </BodyText>
        <RoundedButton
          fontSize="15px"
          width="fit-content"
          onClick={() => window.open(
            "https://basedosdados.org/dataset/8b6c07fd-af78-44ad-8408-da57e6a0b3d4?table=26480073-cb94-41e2-9dfa-6b4ea76da9d9", "_blank"
          )}
        >
          Acesse
        </RoundedButton>
      </SectionBox>

      <SectionBox
        order={isMobileMod ? 0 : 1}
        paddingTop={{ base: "40px", lg: "64px" }}
        flexDirection="column"
      >
        <Stack
          flexDirection={{ base: "column", lg: "row" }}
          justifyContent="center"
          gridGap={{ base: "64px", lg: "80px" }}
        >
          <GraphicsBox
            text="Receitas acumuladas"
            url="https://perguntas.basedosdados.org/public/question/c41beae5-94d3-41e2-9161-a12492b0cae0#titled=false&bordered=false"
          />

          <GraphicsBox 
            text="Despesas acumuladas"
            url="https://perguntas.basedosdados.org/public/question/312842db-4ea9-455b-be7a-98d96e742ea7#titled=false&bordered=false"
          />
        </Stack>

        <SectionText
          marginRight="24px"
          paddingTop="40px"
          textAlign={isMobileMod ? "start" : "end"}
          fontSize={isMobileMod ? "14px" : "16px"}
        >
          Veja o painel completo <Link fontSize={isMobileMod ? "14px" : "16px"} target="_blank" color="#42B0FF" href="https://perguntas.basedosdados.org/public/dashboard/ab21da85-bff2-435b-a819-953d785167b4"
          > aqui</Link>.
        </SectionText>
      </SectionBox>

      <SectionBox
        paddingTop={{ base: "112px", lg: "104px" }}
        flexDirection="column"
      >
        <Display
          paddingBottom="24px"
        >
          Estatuto e relatórios 
        </Display>

        <Stack
          width="100%"
          flexDirection={isMobileMod ? "column" : "row"}
          justifyContent="space-between"
          spacing={0}
        >
          <BodyText paddingBottom="24px" maxWidth={isMobileMod ? "100%" : "45%"}>
            Em nosso estatuto, estão presentes as diretrizes que regulamentam o funcionamento e o processo de tomada de decisões da organização. O documento inclui também os direitos e deveres dos membros e as competências dos conselhos administrativos e fiscais.
          </BodyText>
        
          <BodyText paddingBottom="24px" maxWidth={isMobileMod ? "100%" : "45%"}>
            Nossos relatórios apresentam todas as atividades empenhadas pela equipe. São diversos projetos que colaboram com a promoção da cultura de transparência, o desenvolvimento socioeconômico e a construção de políticas públicas baseadas em dados e evidências.
          </BodyText>
        </Stack>
      </SectionBox>

      <Stack
        paddingTop="16px"
        width="100%"
        maxWidth="1264px"
        margin="auto"
      >
        <Link
          fontFamily="Ubuntu"
          fontSize="18px"
          letterSpacing="0.3px"
          target="_blank"
          color="#42B0FF"
          href="https://basedosdados-static.s3.us-east-2.amazonaws.com/pdf/BD_Estatuto_Social.pdf"
        >
          BD Estatuto Social
        </Link>
      </Stack>

      <Stack
        paddingTop="16px"
        width="100%"
        maxWidth="1264px"
        margin="auto"
      >
        <Link
          fontFamily="Ubuntu"
          fontSize="18px"
          letterSpacing="0.3px"
          target="_blank"
          color="#42B0FF"
          href="https://basedosdados-static.s3.us-east-2.amazonaws.com/pdf/BD_Relatorio_Anual_2022.pdf"
        >
          BD Relatório Anual 2022
        </Link>
      </Stack>

      <Stack
        paddingTop="16px"
        paddingBottom={{ base: "80px", lg: "104px" }}
        width="100%"
        maxWidth="1264px"
        margin="auto"
      >
        <Link
          fontFamily="Ubuntu"
          fontSize="18px"
          letterSpacing="0.3px"
          target="_blank"
          color="#42B0FF"
          href="https://basedosdados-static.s3.us-east-2.amazonaws.com/pdf/BD_Relatorio_Anual_2021.pdf"
        >
          BD Relatório Anual 2021
        </Link>
      </Stack>

      <Stack
        backgroundColor="#252A32"
        width="100vw"
        position="relative"
        left={isMobileMod ? "-24px" :"-32px"}
        paddingX={isMobileMod ? "24px" :"32px"}
      >
        <Stack
          width="100%"
          maxWidth="1264px"
          paddingTop={{ base: "64px", lg: "80px" }}
          paddingBottom={{ base: "56px", lg: "72px" }}
          justify="space-between"
          direction={{ base: "column", lg: "row" }}
          margin="auto"
        >
          <Stack
            paddingTop={{ base: "0px", lg: "16px" }}
            maxWidth={{ base: "100%", lg: "42%" }}
            spacing={0}
          >
            <BigTitle 
              paddingBottom={{base: "20px", lg: "24px"}}
              color="#FFF"
            >
              Você também acredita no {isMobileMod ? " " : <br/>} acesso a dados de qualidade?
            </BigTitle>
            <BodyText 
              fontSize="16px"
              letterSpacing="0.2px"
              lineHeight="27px"
              paddingBottom="24px"
              color="#FFF"
            >
              Tudo o que fazemos só é possível por conta das pessoas que apoiam o nosso trabalho. Ajude a BD a continuar facilitando o acesso a dados públicos. Com qualquer valor, você contribui para a manutenção dos nossos projetos e a sobrevivência da organização.
            </BodyText>
            <RoundedButton
              backgroundColor="#FF8484"
              width="fit-content"
              height="40px"
              fontSize="15px"
              onClick={() => window.open("https://apoia.se/basedosdados", "_blank")}
            >
              Apoie agora
            </RoundedButton>
          </Stack>

          <Stack 
            maxWidth={{ base: "100%", lg: "45%" }}
            paddingTop={{base: "32px", lg: "0px"}}
          >
            <DonationImage
              paddingRight={{ base: "0px", lg: "120px"}}
              widthImage={{ base: "90%", lg: "326px"}}
              heightImage={{ base: "90%", lg: "307px"}}
            />
          </Stack>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}