import {
  Box,
  Center,
  Stack,
  VStack,
  Text,
} from "@chakra-ui/react";
import React, { useState, useEffect} from "react";
import { MainPageTemplate } from "../components/templates/main";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { withPages } from "../hooks/pages.hook";
import Display from "../components/atoms/Display";
import SectionText from "../components/atoms/SectionText";
import Link from "../components/atoms/Link";
import Carousel from "../components/atoms/Carousel";
import WebIcon  from "../public/img/icons/webIcon";
import TwitterIcon  from "../public/img/icons/twitterIcon";
import LinkedinIcon  from "../public/img/icons/linkedinIcon";
import GitIcon  from "../public/img/icons/gitIcon";

export async function getStaticProps(context) {
  return await withPages();
}

const HistoryBox = ({ title, date, text }) => {
  const isMobile = useCheckMobile();
  const [isMobileMod, setIsMobileMod] = useState(false)
  
  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <Box
      display="flex"
      flexDirection="column"
      padding="48px 0"
    >
      <Box
        backgroundColor="#CECECE"
        borderRadius="20px"
        width={isMobileMod ? "90vw" : "500px"}
        height={isMobileMod ? "200px" : "300px"}
        boxShadow="0 2px 20px 0 #00000026"
      >

      </Box>
      
      <Box padding={isMobileMod ? "20px 24px 0" :"40px 48px 0"}>
        <Text
          fontFamily="ubuntu"
          maxWidth="400px"
          color="#252A32"
          fontSize="20px"
          letterSpacing="0.2px"
          marginBottom="8px"
        >{title}</Text>
        <SectionText fontSize="16px" color="#6F6F6F" marginBottom="16px">{date}</SectionText>
        
        <SectionText fontSize="16px" >{text}</SectionText>
      </Box>
    </Box>
  )
}

const team = {
  "nome-do-time" : [
    {
      name:"Adicionar Nome",
      role:"Adicionar Funcoes",
      description:"Adicionar Descricao",
      website:"Adicionar Site",
      twitter:"Adicionar conta do twitter",
      linkedin:"Adicionar conta do linkedin",
      github:"Adicionar usuario Github"
    }
  ]
}

const TeamBox = ({ index, bio }) => {
  const isMobile = useCheckMobile();
  const [isMobileMod, setIsMobileMod] = useState(false)
  
  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  const hasLeftSpacing = (index % 2 == 0) ? false : true

  const keyIcons = (ref) => {
    let href = ""

    if(ref.website) { href = `https://${ref.website}` }
    if(ref.twitter) {
      const twitter = ref.twitter.replace(/(https:)\/\/(twitter.com)\//gim, "")
      href = `https://twitter.com/${twitter}`
    }
    if(ref.linkedin) {
      const linkedin = ref.linkedin.replace(/(https:)\/\/(linkedin.com)\/(in)\//gim, "")
      href = `https://linkedin.com/in/${linkedin}`
    }
    if(ref.github) {
      const github = ref.github.replace(/(https:)\/\/(github.com)\//gim, "")
      href = `https://github.com/${github}` 
    }

    return {
      cursor: "pointer",
      widthIcon:"22px",
      heightIcon:"22px",
      fill: "#42B0FF",
      onClick: () => {window.open(href)}
    }
  }

  const iconLinks = () => {
    return (
      <Box display="flex" flexDirection="row" gridGap="5px">
        {bio.website ? <WebIcon {...keyIcons({website: bio.website})}/> : null}
        {bio.twitter ? <TwitterIcon {...keyIcons({twiiter: bio.twitter})}/> : null}
        {bio.linkedin ? <LinkedinIcon {...keyIcons({linkedin: bio.linkedin})}/> : null}
        {bio.github ? <GitIcon {...keyIcons({github: bio.github})}/> : null}
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection={isMobileMod ? "column" : "row"}
      maxWidth="900px"
      marginLeft={isMobileMod ? "" : hasLeftSpacing && "200px !important"}
    >
      <Box
        backgroundColor="#F0F0F0"
        minWidth="160px"
        maxWidth="160px"
        minHeight="160px"
        maxHeight="160px"
        borderRadius="16px"
        marginRight="32px"
        marginBottom={isMobileMod && "20px"}
      />
      <Box display="flex" flexDirection="column">
        <Box marginBottom="8px" display="flex" flexDirection="row">
          <SectionText fontSize="18px" fontFamily="ubuntu" color="#6F6F6F" marginRight="16px">{bio.name}</SectionText>
          {!isMobileMod && iconLinks()}
        </Box>
        <SectionText marginBottom="16px" fontSize="18px" fontFamily="ubuntu">{bio.role}</SectionText>
        <SectionText marginBottom="16px" fontSize="16px">{bio.description}</SectionText>
        {isMobileMod && iconLinks()}
      </Box>
    </Box>
  )
}
  
export default function QuemSomos({ pages }) {
  const isMobile = useCheckMobile();
  const [isMobileMod, setIsMobileMod] = useState(false)

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <MainPageTemplate pages={pages} paddingX="24px">
      <Stack
        paddingTop={{ base: "80px", lg: "0px" }}
        paddingBottom={{ base: "10px", lg: "50px" }}
        width="100%"
        maxWidth="1264px"
        justify="space-between"
        direction={{ base: "column", lg: "row" }}
        margin="auto"
      >
        <VStack maxWidth={{ base: "100%", lg: "45%" }}>
          <Box contentAlign="flex-start">
          <Display 
                color="#2B8C4D"
                paddingBottom="24px"
              >
              Quem somos
            </Display>
            <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
              A Base dos Dados é uma organização não-governamental, sem fins lucrativos, <i>open source</i> e colaborativa. Nossa missão é universalizar o acesso a dados públicos de qualidade para que <b>a distância entre qualquer pessoa e uma análise seja apenas uma boa pergunta</b>.
            </SectionText>
            <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
              Atuamos nesse objetivo catalogando e organizando bases de dados públicas que podem ser encontradas através do nosso mecanismo de busca, com informações estruturadas dos conjuntos de dados e a possibilidade de download direto.
            </SectionText>
            <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
              Além disso, nossa iniciativa conta com um <i>datalake</i> público, em que disponibilizamos diversas <b>bases de dados já limpas</b>, <b>integradas e compatibilizadas</b>. Através dele, você pode acessar e cruzar tabelas de diferentes organizações de maneira simples e rápida usando <b>nossos pacotes</b> em <b>Python</b>, <b>R</b> ou direto pelo <b>BigQuery</b>. Nós estruturamos dados públicos para você poder focar no que realmente importa, sua análise (artigo científico, matéria de jornal, painel de visualização, integrações etc).
            </SectionText>
          </Box>
        </VStack>
        <VStack maxWidth={{ base: "100%", lg: "45%" }}>
          <Box 
            contentAlign="flex-start" 
            paddingTop={{ base: "0px", lg: "80px" }}
          >
            <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
              A ideia de catalogar bases de dados importantes começou em <b>2019</b>, com nosso co-fundador <b>Ricardo Dahis</b>, que enxergou a necessidade de uma plataforma com capacidade de busca e filtragem de diferentes conjuntos de dados e iniciou esse trabalho.
            </SectionText>
            <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
              Mediante uma proposta do <b>João Carabetta</b>, também co-fundador da Base dos Dados, para estruturar um <i>datalake</i> pelo BigQuery e usar o mecanismo de busca para catalogação dos metadados, nossa iniciativa começou a tomar forma. 
            </SectionText>
            <SectionText fontSize="14px" fontWeight="300" paddingBottom="20px">
              Depois de um trabalho em conjunto estruturando as primeiras bases de dados com a <b>Fernanda Scovino</b>, <b>Fred Israel</b> e <b>Diego Oliveira</b>, todos co-fundadores da BD, lançamos nosso <i>datalake</i> público em <b>outubro de 2020</b>. Desde então, nossa organização vem crescendo em qualidade e quantidade de dados, número de colaboradores, parceiros e usuários. Faça parte dessa história também!
            </SectionText>
            <Link
              href="https://drive.google.com/file/d/1JNcr4psQr42EV9mTafn512TD8p87ZP3a/view?usp=sharing"
              textDecoration="none"
              color="#42B0FF"
              target="_blank"
            >
              Veja nosso estatuto.
            </Link>
          </Box>
        </VStack>
      </Stack>

      <Stack
        width="100vw"
        height="100%"
        alignItems="center"
        position="relative"
        left={isMobileMod ? "-24px" : "-32px"}
        marginBottom="160px"
        bgGradient="linear(#34A15A 62%, #FFF 62%)"
      >
        <Center flexDirection="column">
          <Display textAlign="center" paddingTop="60px" color="#FFF">
            Nossa história
          </Display>
          <Text
            fontFamily="ubuntu"
            maxWidth="650px"
            fontSize="20px"
            letterSpacing="0.2px"
            fontWeight="300"
            textAlign="center"
            color="#FFF"
            margin="8px 0 32px"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ornare nibh vel ex porta pulvinar. Vivamus a urna vestibulum, luctus.</Text>
        </Center>
      
        <Center
          width="100%"
        >
          <Carousel
            settings={{
              spaceBetween: isMobileMod ? 100 : 400,
              slidesPerView: isMobileMod ? 1 : 3,
              centeredSlides: true,
              mousewheel: true
            }}
          >
            <HistoryBox
              title="Adicionar Titulo"
              date="Adicionar Data"
              text="Adicionar Texto"
            />
            <HistoryBox
              title="Adicionar Titulo"
              date="Adicionar Data"
              text="Adicionar Texto"
            />
            <HistoryBox
              title="Adicionar Titulo"
              date="Adicionar Data"
              text="Adicionar Texto"
            />
          </Carousel>
        </Center>
      </Stack>

      <Stack 
        width="100%"
        maxWidth="1264px"
        spacing="100px"
        paddingBottom="80px"
        margin="auto"
      >
        {team["nome-do-time"].map((elm, index) => (
          <TeamBox
            index={index}
            bio={elm}
          />
        ))}
      </Stack>

    </MainPageTemplate>
  )
}