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

export async function getStaticProps(context) {
  let { data: strapiPages } = await getStrapiPages();

  return {
    props: {
      strapiPages,
    },
  };
}

function HeroText({ children, iconUrl }) {
  return (
    <VStack textAlign="center">
      <Box width="100%" height="140px" marginBottom="10px" position="relative">
        <Image objectFit="contain" layout="fill" src={iconUrl} />
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

  return (
    <VStack
      width="100%"
      height={{ base: "initial", lg: "100vh" }}
      backgroundColor="#FAFAFA"
    >
      <Center paddingTop="100px" height="100%">
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
              top="-0px"
              width="600px"
              height="550px"
            >
              <Image
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
              color="#358C2B"
            >
              Um único lugar para buscar, baixar e acessar os dados que você
              precisa
            </BigTitle>
            <ControlledInput
              value={search}
              onChange={setSearch}
              onEnterPress={openSearchLink}
              flex="3"
              placeholder="Pesquisar palavras-chave, instituições e temas"
              justifyContent="center"
              inputStyle={{
                padding: "40px",
                borderRadius: "50px",
                backgroundColor: "#ffffff",
                fontSize: "20px",
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
          </Stack>
          <Stack
            paddingTop="30px"
            position="relative"
            zIndex="1"
            width="90%"
            direction={{ base: "column", lg: "row" }}
          >
            <HeroText iconUrl="/_nxt/img/icone_busca.png">
              <SectionText>
                Com o <b>mecanismo de busca</b> é possível descobrir informações
                sobre mais de 900 bases de dados de diversos temas e
                organizações.
              </SectionText>
            </HeroText>
            <HeroText iconUrl="/_nxt/img/icone_download.png">
              <SectionText>
                Disponibilizamos o <b>download</b> dos dados tratados e
                atualizados direto do nosso datalake público num só click.
              </SectionText>
            </HeroText>
            <HeroText iconUrl="/_nxt/img/icone_pacotes.png">
              <SectionText>
                Através dos nossos <b>pacotes de programação</b> você pode
                acessar o datalake público BD+ em Python, R ou pela linha de
                comando.
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
        borderRadius="500px"
        width="54px"
        height="60px"
      >
        <Box width="25px" height="25px" position="relative">
          <Image
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
      padding="60px 0px"
      alignItems="flex-start"
      backgroundColor="#FAFAFA"
      spacing={5}
      paddingBottom="160px"
    >
      <BigTitle marginBottom="30px" alignSelf="center">
        Veja as novidades do nosso catálogo
      </BigTitle>
      <CardCatalog
        sections={{
          popular: (popularDatasets.data || []).map((d) => (
            <DatabaseCard
              link={`/dataset/${d.name}`}
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
            />
          )),
        }}
      />
      <CardCatalog
        sections={{
          recentes: (recentDatasets.data || []).map((d) => (
            <DatabaseCard
              link={`/dataset/${d.name}`}
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
      <VStack alignItems="flex-start" flex="2" spacing={5}>
        <BigTitle>Explore na sua linguagem favorita</BigTitle>
        <SectionText>
          Desenvolvemos pacotes para acesso aos dados da BD+ em Python, R e
          linha de comando. Além disso, você pode consultar e filtrar dados
          usando SQL no editor do nosso datalake no Google BigQuery.
        </SectionText>
        <Link paddingTop="10px" color="skyblue" textDecoration="underline">
          Veja mais {">"} {">"}
        </Link>
      </VStack>
      <Box
        flex="2"
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
    <Stack
      width="95%"
      spacing={{ base: 10, lg: 20 }}
      direction={{ base: "column", lg: "row" }}
    >
      <Box
        position="relative"
        display="block"
        height="auto"
        flex="1"
        maxWidth="100%"
      >
        <Image
          objectFit="contain"
          layout="fill"
          src="/_nxt/img/tela_jupyter.png"
        />
      </Box>
      <VStack spacing={5} alignItems="flex-start" flex="1">
        <BigTitle>Aprenda a fazer análise com os dados</BigTitle>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 10, md: 0 }}
        >
          <VStack>
            <SectionText>
              Temos tutoriais no blog e workshops no Youtube sobre como começar
              a mexer com os pacotes e construir análises com nossos dados.
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
              <Link
                paddingTop="20px"
                color="skyblue"
                textDecoration="underline"
              >
                Blog {">"} {">"}
              </Link>
            </HStack>
          </VStack>
          <VStack alignItems="flex-start">
            <SectionText>
              Todos os códigos das análises estão disponíveis no nosso Github
              para você testar e reproduzir localmente.
            </SectionText>
            <Link paddingTop="20px" color="skyblue" textDecoration="underline">
              Veja mais {">"} {">"}
            </Link>
          </VStack>
        </Stack>
      </VStack>
    </Stack>
  );
}

function JoinTheCommunity() {
  return (
    <Stack
      width="95%"
      spacing={{ base: 10, lg: 20 }}
      direction={{ base: "column", lg: "row" }}
      alignItems="center"
    >
      <VStack alignItems="flex-start" flex="1" spacing={5}>
        <BigTitle>
          Faça parte da nossa comunidade, <i>databaser</i>
        </BigTitle>
        <SectionText>
          Acompanhe todas as discussões, tire dúvidas, fale e aprenda direto com
          a equipe da Base dos Dados e faça parte de um grupo de pessoas
          incríveis da nossa comunidade de dados abertos no Discord.
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
        height="auto"
        flex="1"
        width="100%"
        height="300px"
      >
        <Image
          layout="fill"
          objectFit="contain"
          src="/_nxt/img/tela_discord.png"
        />
      </Box>
    </Stack>
  );
}

function Support() {
  function ButtonList({ buttonText, buttonColor, points }) {
    return (
      <VStack spacing={10}>
        <Button
          boxShadow="0px 13.7273px 13.7273px rgba(0, 0, 0, 0.25);"
          borderRadius="68.6364px"
          fontSize="22px"
          padding="30px"
          fontFamily="Ubuntu"
          width="100%"
          fontWeight="400"
          backgroundColor={buttonColor}
          color="white"
        >
          {buttonText}
        </Button>
        <UnorderedList
          spacing={2}
          fontWeight="400"
          fontFamily="Lato"
          color="#6E6E6E"
          letterSpacing="2px"
          fontSize="14px"
        >
          {points.map((p) => (
            <ListItem>{p}</ListItem>
          ))}
        </UnorderedList>
      </VStack>
    );
  }

  return (
    <VStack paddingTop="60px" width="95%" paddingBottom="100px">
      <BigTitle
        width={{ base: "90%", md: "70%" }}
        textAlign="center"
        fontWeigth="300"
      >
        A Base dos Dados só existe com o esforço de diversas pessoas que
      </BigTitle>
      <BigTitle paddingBottom="50px" textAlign="center">
        acreditam no acesso a dados abertos de qualidade.
      </BigTitle>
      <Stack
        width="100%"
        justifyContent="space-around"
        direction={{ base: "column", lg: "row" }}
        spacing={10}
      >
        <ButtonList
          buttonColor="#3AA1EB"
          buttonText="Seja um(a) vonluntário(a)"
          points={[
            "Ajude a manter e aprimorar os pacotes da BD",
            "Suba bases de dados no nosso datalake público",
            "Construa conteúdos e tutoriais para nossas redes",
          ]}
        />
        <ButtonList
          buttonColor="#FF8484"
          buttonText="Apoie o projeto"
          points={["Ajude com doações mensais à Base dos Dados"]}
        />
        <ButtonList
          buttonColor="#3AA1EB"
          buttonText="Seja nosso(a) parceiro(a)"
          points={[
            "Abra os dados de sua organização na BD",
            "Construa projetos de dados abertos conosco",
            "Desenvolva aplicações com nossos dados",
          ]}
        />
      </Stack>
    </VStack>
  );
}

export default function Home({ strapiPages }) {
  return (
    <>
      <SiteHead />
      <Menu strapiPages={strapiPages} />
      <VStack
        alignItems="center"
        width="100%"
        backgroundColor="#fafafa"
        padding="0px 5%"
      >
        <Hero />
        <CatalogNews />
        <VStack spacing={20} width="100%">
          <ExploreInYourFavoriteLanguage />
          <LearnToAnalysis />
          <JoinTheCommunity />
          <Support />
        </VStack>
      </VStack>
      <Footer />
      <script
        src="/_nxt/vendor/terminal.js"
        data-termynal-container="#termynal"
      ></script>
    </>
  );
}
