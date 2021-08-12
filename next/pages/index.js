import {
  Box,
  Button,
  Center,
  HStack,
  List,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  Flex,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import Menu from "../components/molecules/Menu";
import SiteHead from "../components/atoms/SiteHead";
import ControlledInput from "../components/atoms/ControlledInput";
import SectionText from "../components/atoms/SectionText";
import BigTitle from "../components/atoms/BigTitle";
import SectionTitle from "../components/atoms/SectionTitle";
import DatabaseCard from "../components/organisms/DatabaseCard";
import NewsCard from "../components/organisms/NewsCard";
import Footer from "../components/molecules/Footer";
import { useState } from "react";
import CardCatalog from "../components/organisms/CardCatalog";
import Title from "../components/atoms/Title";
import Link from "../components/atoms/Link";
import Typist from "react-typist";
import { useQuery } from "react-query";
import { getPopularDatasets, getRecentDatasets } from "./api/datasets";
import { getStrapiPages } from "./api/strapi";
import { ShadowBox } from "../components/atoms/ShadowBox";
import { Tag } from "../components/atoms/Tag";
import { MainPageTemplate } from "../components/templates/main";
import { withStrapiPages } from "../hooks/strapi.hook";

export async function getStaticProps(context) {
  return await withStrapiPages();
}

function HeroText({ children, iconUrl }) {
  return (
    <VStack maxWidth="350px" textAlign="center">
      <Box width="100%" height="140px" marginBottom="10px" position="relative">
        <Image priority objectFit="contain" layout="fill" src={iconUrl} />
      </Box>
      {children}
    </VStack>
  );
}

function Hero() {
  const [search, setSearch] = useState();

  function openSearchLink() {
    return window.open(`/_nxt/search?q=${search}`, "_self");
  }

  function HeroTag({ children }) {
    return (
      <Tag
        padding="5px 10px"
        minWidth="40px"
        backgroundColor="#DEDFE0"
        color="#252A32"
      >
        {children}
      </Tag>
    );
  }

  return (
    <VStack width="100%" backgroundColor="#FAFAFA">
      <Center height="100%">
        <VStack
          height="100%"
          justifyContent="center"
          alignItems="center"
          spacing={20}
        >
          <Stack
            position="relative"
            width="100%"
            direction={{ base: "column", lg: "row" }}
            alignItems="center"
            spacing={50}
          >
            <Box
              position="absolute"
              right="0px"
              top="-50%"
              minWidth="800px"
              minHeight="568px"
            >
              <Image
                priority
                src="/_nxt/img/home_background.png"
                layout="fill"
                objectFit="contain"
              />
            </Box>
            <BigTitle
              position="relative"
              zIndex="1"
              fontFamily="Lato"
              flex="2"
              fontSize="38px"
            >
              Um único lugar para buscar, baixar e acessar os dados que você
              precisa
            </BigTitle>
            <VStack
              width={{ base: "100%", lg: "initial" }}
              spacing={3}
              alignItems="flex-start"
              flex="3"
            >
              <ControlledInput
                value={search}
                width="100%"
                onChange={setSearch}
                onEnterPress={openSearchLink}
                placeholder="Pesquisar palavras-chave, instituições e temas"
                justifyContent="center"
                inputStyle={{
                  padding: "40px",
                  borderRadius: "50px",
                  backgroundColor: "#ffffff",
                  fontSize: "20px",
                  boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
                rightIcon={
                  <Box
                    transform="translateX(-15px)"
                    width="50px"
                    height="50px"
                    position="relative"
                  >
                    <Image
                      onClick={openSearchLink}
                      layout="fill"
                      objectFit="contain"
                      src="/_nxt/img/arrow_black_right.png"
                    />
                  </Box>
                }
              />
              <HStack paddingLeft="45px">
                <SectionText fontSize="14px">Termos populares: </SectionText>
                <HeroTag>lei</HeroTag>
                <HeroTag>mortalidade</HeroTag>
                <HeroTag>covid</HeroTag>
              </HStack>
            </VStack>
          </Stack>
          <Stack
            paddingTop="30px"
            position="relative"
            zIndex="1"
            justifyContent="space-evenly"
            alignItems="center"
            width="100%"
            direction={{ base: "column", lg: "row" }}
            spacing={10}
          >
            <HeroText iconUrl="/_nxt/img/icone_busca.png">
              <SectionText>
                Com o mecanismo de busca é possível descobrir informações sobre
                mais de 900 bases de dados de diversos temas e organizações.
              </SectionText>
            </HeroText>
            <HeroText iconUrl="/_nxt/img/icone_download.png">
              <SectionText>
                Disponibilizamos o download dos dados tratados e atualizados
                direto do nosso datalake público num só click.
              </SectionText>
            </HeroText>
            <HeroText iconUrl="/_nxt/img/icone_pacotes.png">
              <SectionText>
                Através dos nossos pacotes de programação você pode acessar o
                datalake público BD+ em Python, R ou pela linha de comando.
              </SectionText>
            </HeroText>
          </Stack>
        </VStack>
      </Center>
      <Center
        display={{ base: "none", lg: "flex" }}
        transform="translateY(-20px)"
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        backgroundColor="#42B0FF"
        borderRadius="1000px"
        width="50px"
        height="50px"
      >
        <Box width="20px" height="20px" position="relative">
          <Image
            priority
            objectFit="contain"
            layout="fill"
            src="/_nxt/img/arrow_white_down.png"
          />
        </Box>
      </Center>
    </VStack>
  );
}

function CatalogNews() {
  const recentDatasets = useQuery("recentDatasets", getRecentDatasets);
  const popularDatasets = useQuery("popularDatasets", getPopularDatasets);

  return (
    <VStack
      width="100%"
      padding="60px 00px"
      alignItems="flex-start"
      backgroundColor="#FAFAFA"
      spacing={5}
      paddingBottom="160px"
    >
      <BigTitle textAlign="center" marginBottom="0px" alignSelf="center">
        Novidades no catálogo de dados
      </BigTitle>
      <CardCatalog
        sections={{
          populares: (popularDatasets.data || []).map((d) => (
            <DatabaseCard
              link={`/_nxt/dataset/${d.name}`}
              name={d.title}
              organization={d.organization.title}
              tags={d.tags.map((g) => g.name)}
              size={
                d.resources.filter((r) => r.size).length > 0
                  ? d.resources.filter((r) => r.size)[0].size
                  : null
              }
              tableNum={
                d.resources.filter((r) => r.resource_type === "bdm_table")
                  .length
              }
              externalLinkNum={
                d.resources.filter((r) => r.resource_type === "external_link")
                  .length
              }
              updatedSince={d.metadata_modified}
              updatedAuthor="Ricardo Dahis"
              categories={d.groups.map((g) => g.name)}
              isPlus={d.download_type === "BD Mais"}
            />
          )),
        }}
      />
      <CardCatalog
        sections={{
          recentes: (recentDatasets.data || []).map((d) => (
            <DatabaseCard
              link={`/_nxt/dataset/${d.name}`}
              name={d.title}
              organization={d.organization.title}
              tags={d.tags.map((g) => g.name)}
              size={
                d.resources.filter((r) => r.size).length > 0
                  ? d.resources.filter((r) => r.size)[0].size
                  : null
              }
              tableNum={
                d.resources.filter((r) => r.resource_type === "bdm_table")
                  .length
              }
              externalLinkNum={
                d.resources.filter((r) => r.resource_type === "external_link")
                  .length
              }
              updatedSince={d.metadata_modified}
              updatedAuthor="Ricardo Dahis"
              categories={d.groups.map((g) => g.name)}
              isPlus={d.download_type === "BD Mais"}
            />
          )),
        }}
      />
    </VStack>
  );
}

function ExploreInYourFavoriteLanguage() {
  const [typistKey, setTypistKey] = useState(0);

  return (
    <Stack
      width="95%"
      spacing={{ base: 10, lg: 140 }}
      direction={{ base: "column", lg: "row" }}
    >
      <VStack maxWidth="400px" alignItems="flex-start" flex="1" spacing={5}>
        <Title maxWidth="100%" fontSize="30px" letterSpacing="0.1em">
          Explore tudo na sua linguagem favorita
        </Title>
        <SectionText textAlign="justify">
          Desenvolvemos <b>pacotes para acesso aos dados da BD+</b> em Python, R
          e linha de comando. Além disso, você pode{" "}
          <b>consultar e filtrar dados usando SQL</b> no editor do nosso
          datalake no Google BigQuery.
        </SectionText>
        <Link paddingTop="10px" color="skyblue" textDecoration="underline">
          Veja mais {">"} {">"}
        </Link>
      </VStack>
      <Box
        flex="1"
        borderRadius="26.2245"
        filter="drop-shadow(0px 2.2449px 2.2449px rgba(0, 0, 0, 0.4))"
        maxHeight={{ base: "none", md: "200px" }}
        fontSize={{ base: "14px", md: "inherit" }}
        padding={{ base: "60px 20px", lg: "60px 30px" }}
        fontSize={{ base: "12px", lg: "inherit" }}
        width="100%"
        id="termynal"
        data-termynal
        data-ty-typeDelay="40"
        data-ty-lineDelay="700"
      >
        <Typist
          key={typistKey}
          onTypingDone={() => setTypistKey(typistKey + 1)}
        >
          <span>$ pip install basedosdados</span>
          <Typist.Backspace count={30} delay={1000} />
          <Typist.Delay ms={500} />
          <span>{">"} install.packages("basedosdados")</span>
          <Typist.Backspace count={30} delay={1000} />
        </Typist>
      </Box>
    </Stack>
  );
}

function LearnToAnalysis() {
  return (
    <Stack width="95%" direction={{ base: "column", lg: "row" }}>
      <Box
        position="relative"
        display="block"
        height="auto"
        flex="1"
        maxWidth={{ base: "100%", lg: "850px" }}
        minWidth="300px"
        width={{ base: "100%", lg: "auto" }}
        maxHeight={{ base: "400px", lg: null }}
        minHeight={{ base: "300px", lg: null }}
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Image
          priority
          objectFit="contain"
          objectPosition="0"
          layout="fill"
          src="/_nxt/img/tela_jupyter.png"
        />
      </Box>
      <VStack
        maxWidth={{ base: "100%", lg: "500px" }}
        spacing={5}
        alignItems="flex-start"
        flex="1"
      >
        <Title maxWidth="100%" fontSize="30px" letterSpacing="0.1em">
          Aprenda a construir análises com os dados
        </Title>
        <VStack>
          <SectionText textAlign="justify">
            Produzimos tutoriais e ensaios no blog, workshops no Youtube e
            análises nas redes sociais com nossos dados. Disponibilizamos os
            códigos completos no nosso Github para você testar e reproduzir
            localmente
          </SectionText>
          <HStack alignItems="flex-start" width="100%" spacing={5}>
            <Link
              paddingTop="20px"
              color="skyblue"
              textDecoration="underline"
              href="https://www.youtube.com/c/BasedosDados/videos"
              target="_blank"
            >
              Youtube {">"} {">"}
            </Link>
            <Link paddingTop="20px" color="skyblue" textDecoration="underline">
              Blog {">"} {">"}
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </Stack>
  );
}

function JoinTheCommunity() {
  return (
    <Stack
      width="95%"
      spacing={{ base: 10, lg: 20 }}
      direction={{ base: "column-reverse", lg: "row" }}
      alignItems="center"
    >
      <VStack
        maxWidth={{ base: "100%", lg: "450px" }}
        alignItems="flex-start"
        flex="1"
        spacing={5}
      >
        <Title maxWidth="80%" fontSize="30px" letterSpacing="0.1em">
          Faça parte da nossa comunidade, <i>databaser</i>
        </Title>
        <SectionText textAlign="justify">
          Acompanhe todas as discussões, tire dúvidas, fale e aprenda direto com
          a equipe da Base dos Dados e faça parte de um grupo de pessoas
          incríveis da nossa <b>comunidade de dados abertos no Discord.</b>
        </SectionText>
        <Link
          href="https://discord.gg/huKWpsVYx4"
          target="_blank"
          paddingTop="10px"
          color="skyblue"
          textDecoration="underline"
        >
          Discord {">"} {">"}
        </Link>
      </VStack>
      <Box
        position="relative"
        display="block"
        flex={{ base: null, lg: "1" }}
        width="100%"
        height={{ base: "200px", lg: "300px" }}
      >
        <Image
          priority
          layout="fill"
          objectFit="contain"
          src="/_nxt/img/tela_discord.png"
        />
      </Box>
    </Stack>
  );
}

function Support() {
  function SupportButton({
    onClick,
    link,
    children,
    colorScheme = "blue",
    backgroundColor = "#3AA1EB",
  }) {
    return (
      <a href={link} target="_blank">
        <Button
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          borderRadius="68.6364px"
          colorScheme={colorScheme}
          backgroundColor={backgroundColor}
          padding="25px"
          fontFamily="Ubuntu"
          fontWeight="700"
          fontSize="20px"
          minWidth="250px"
        >
          {children}
        </Button>
      </a>
    );
  }
  return (
    <VStack paddingTop="60px" width="95%">
      <BigTitle width="90%" textAlign="center" paddingBottom="60px">
        Existimos através do esforço de pessoas que acreditam no acesso a dados
        abertos de qualidade.
      </BigTitle>
      <Stack
        width="100%"
        justifyContent="space-around"
        direction={{ base: "column", lg: "row" }}
        spacing={10}
      >
        <ShadowBox height="270px" title="Voluntariado">
          <SectionText height="100px">
            Ajude a manter e aprimorar pacotes, suba bases no nosso datalake ou
            construa análises e tutoriais para nossas redes.
          </SectionText>
          <SupportButton link="https://basedosdados.github.io/mais/colab_data/">
            Comece Aqui
          </SupportButton>
        </ShadowBox>
        <ShadowBox height="270px" title="Parceria">
          <SectionText height="100px">
            Abra dados de sua organização, construa projetos de dados abertos
            conosco ou desenvolva aplicações com nossos dados.
          </SectionText>
          <SupportButton>Entre em contato</SupportButton>
        </ShadowBox>
        <ShadowBox height="270px" spacing={4} title="Doações">
          <SupportButton
            link="https://drive.google.com/file/d/1aIJhJBSsufArqApvgoYFpevlu8uF5nqm/view?usp=sharing"
            backgroundColor="#FF8484"
            colorScheme="red"
          >
            Doe via PIX
          </SupportButton>
          <SupportButton link="https://apoia.se/basedosdados">
            Apoio Mensal
          </SupportButton>
          <SupportButton>Apoio Institucional</SupportButton>
        </ShadowBox>
      </Stack>
    </VStack>
  );
}

export default function Home({ strapiPages }) {
  return (
    <MainPageTemplate strapiPages={strapiPages}>
      <VStack
        alignItems="center"
        width="100%"
        backgroundColor="#FAFAFA"
        padding="0px 5%"
        marginTop="30px"
      >
        <Hero />
      </VStack>
      <CatalogNews />
      <VStack
        spacing={20}
        transform="translateY(-100px)"
        width="90%"
        margin="auto"
      >
        <BigTitle textAlign="center" maxWidth="70%" paddingBottom="20px">
          Mais do que organizar dados, nós reinventamos a forma de trabalhar com
          eles
        </BigTitle>
        <ExploreInYourFavoriteLanguage />
        <LearnToAnalysis />
        <JoinTheCommunity />
        <Support />
      </VStack>
      <script
        src="/_nxt/vendor/terminal.js"
        data-termynal-container="#termynal"
      ></script>
    </MainPageTemplate>
  );
}
