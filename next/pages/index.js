import {
  Box,
  Button,
  Center,
  HStack,
  Stack,
  Flex,
  VStack,
  Image as ChakraImage,
} from "@chakra-ui/react";
import Image from "next/image";
import ControlledInput from "../components/atoms/ControlledInput";
import SectionText from "../components/atoms/SectionText";
import BigTitle from "../components/atoms/BigTitle";
import DatabaseCard from "../components/organisms/DatabaseCard";
import { useState } from "react";
import CardCatalog from "../components/organisms/CardCatalog";
import Title from "../components/atoms/Title";
import Typist from "react-typist";
import {
  getPopularDatalakeDatasets,
  getPopularDatasets,
  getRecentDatasets,
  searchDatasets,
} from "./api/datasets";
import { ShadowBox } from "../components/atoms/ShadowBox";
import { MainPageTemplate } from "../components/templates/main";
import { withStrapiPages } from "../hooks/strapi.hook";
import { ThemeTag } from "../components/atoms/ThemeTag";
import { LinkDash } from "../components/atoms/LinkDash";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { isBdPlus } from "../utils";
import Link from "../components/atoms/Link";

export async function getStaticProps(context) {
  const popularDatasets = await getPopularDatasets();
  const popularDatalakeDatasets = await getPopularDatalakeDatasets();

  return await withStrapiPages({
    props: {
      popularDatasets,
      popularDatalakeDatasets,
    },
    revalidate: 60,
  });
}

function HeroText({ children, iconUrl }) {
  return (
    <VStack alignItems="center" justifyContent="center" maxWidth="400px">
      <Box
        margin="auto"
        width="100%"
        height="130px"
        marginBottom="20px"
        position="relative"
      >
        <Image
          loading="eager"
          priority
          objectFit="contain"
          layout="fill"
          src={iconUrl}
        />
      </Box>
      {children}
    </VStack>
  );
}

function Hero() {
  const [search, setSearch] = useState();
  const isMobile = useCheckMobile();

  function openSearchLink() {
    return window.open(`/dataset?q=${search}`, "_self");
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
            marginStart="0px !important"
          >
            <Box
              position="absolute"
              right="0px"
              top="-80%"
              minWidth="850px"
              minHeight="568px"
            >
              <Image
                priority
                src="/img/home_background.png"
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
              marginStart="0px !important"
            >
              Um único lugar para buscar e acessar os dados que você precisa
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
                placeholder={
                  isMobile
                    ? "Pesquisar dados"
                    : "Pesquisar palavras-chave, instituições ou temas"
                }
                justifyContent="center"
                inputStyle={{
                  padding: "40px",
                  borderRadius: "50px",
                  backgroundColor: "#ffffff",
                  fontSize: "24px",
                  border: "0px",
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
                      src="/img/arrow_black_right.png"
                    />
                  </Box>
                }
              />
              <HStack paddingLeft="45px">
                <SectionText fontSize="14px">Termos populares: </SectionText>
                <ThemeTag name="lei" />
                <ThemeTag name="mortalidade" />
                <ThemeTag name="COVID19" />
              </HStack>
            </VStack>
          </Stack>
          <Stack
            paddingTop="10px"
            position="relative"
            zIndex="1"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            direction={{ base: "column", lg: "row" }}
            spacing={10}
          >
            <HeroText iconUrl="/img/icone_busca.png">
              <SectionText fontSize="14px" textAlign="center">
                Com o mecanismo de busca é possível descobrir informações sobre
                mais de 900 bases de dados de diversos temas e organizações.
              </SectionText>
            </HeroText>
            <HeroText iconUrl="/img/icone_download.png">
              <SectionText fontSize="14px" textAlign="center">
                Disponibilizamos o download dos dados tratados e atualizados
                direto do nosso <i>datalake</i> público num só click.
              </SectionText>
            </HeroText>
            <HeroText iconUrl="/img/icone_pacotes.png">
              <SectionText fontSize="14px" textAlign="center">
                Através dos nossos pacotes de programação você pode acessar o{" "}
                <i>datalake</i> público BD+ em Python, R ou pela linha de
                comando.
              </SectionText>
            </HeroText>
          </Stack>
        </VStack>
      </Center>
      <Center
        display={{ base: "none", lg: "flex" }}
        boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        backgroundColor="#42B0FF"
        borderRadius="1000px"
        width="50px"
        height="50px"
        transform="translateY(35px);"
      >
        <Box width="20px" height="20px" position="relative">
          <Image
            priority
            layout="fill"
            objectFit="contain"
            src="/img/arrow_white_down.png"
          />
        </Box>
      </Center>
    </VStack>
  );
}

function CatalogNews({ popularDatasets, popularDatalakeDatasets }) {
  return (
    <VStack
      width="100%"
      padding="60px 00px"
      alignItems="flex-start"
      backgroundColor="#FAFAFA"
      spacing={5}
      paddingTop="75px"
      paddingBottom="160px"
      position="relative"
    >
      <CardCatalog
        title={
          <Stack direction={{ base: "column", lg: "row" }}>
            <div>Novidades no </div> <i>datalake</i>{" "}
            <ChakraImage
              paddingLeft="10px"
              height={{ base: "80px", lg: "50px" }}
              width={{ base: "200px", lg: "auto" }}
              src="/img/logo_plus.png"
            />
          </Stack>
        }
        text={
          <div>
            Onde você pode acessar <b>tabelas tratadas e prontas para uso</b> de
            forma gratuita.{" "}
            <LinkDash
              fontWeight="700"
              dash={false}
              textDecoration="none"
              href="https://basedosdados.github.io/mais/"
            >
              Entenda.
            </LinkDash>
          </div>
        }
      >
        {popularDatalakeDatasets.map((d) => (
          <DatabaseCard
            link={`/dataset/${d.name}`}
            name={d.title}
            organization={d.organization.title}
            organizationSlug={d.organization.name}
            tags={d.tags.map((g) => g.name)}
            size={
              d.resources.filter((r) => r.bdm_file_size && r.bdm_file_size > 0)
                .length > 0
                ? d.resources.filter((r) => r.bdm_file_size)[0].bdm_file_size
                : null
            }
            tableNum={
              d.resources.filter((r) => r.resource_type === "bdm_table").length
            }
            externalLinkNum={
              d.resources.filter((r) => r.resource_type === "external_link")
                .length
            }
            updatedSince={d.metadata_modified}
            categories={d.groups.map((g) => g.name)}
            isPlus={isBdPlus(d)}
          />
        ))}
      </CardCatalog>
      <CardCatalog
        title="Outras novidades no catálogo"
        text={
          <div>
            Onde você também pode acessar metadados de diversas bases públicas
            num só lugar.{" "}
            <LinkDash
              fontWeight="700"
              dash={false}
              textDecoration="none"
              href="https://basedosdados.github.io/mais/"
            >
              Entenda.
            </LinkDash>
          </div>
        }
      >
        {popularDatasets.map((d) => (
          <DatabaseCard
            link={`/dataset/${d.name}`}
            name={d.title}
            organization={d.organization.title}
            organizationSlug={d.organization.name}
            tags={d.tags.map((g) => g.name)}
            size={
              d.resources.filter((r) => r.bdm_file_size && r.bdm_file_size > 0)
                .length > 0
                ? d.resources.filter((r) => r.bdm_file_size)[0].bdm_file_size
                : null
            }
            tableNum={
              d.resources.filter((r) => r.resource_type === "bdm_table").length
            }
            externalLinkNum={
              d.resources.filter((r) => r.resource_type === "external_link")
                .length
            }
            updatedSince={d.metadata_modified}
            updatedAuthor="Ricardo Dahis"
            categories={d.groups.map((g) => g.name)}
            isPlus={isBdPlus(d)}
          />
        ))}
      </CardCatalog>
    </VStack>
  );
}

function ImageSection({ leftColumn, rightColumn, isReversed = false }) {
  return (
    <Flex
      width="95%"
      flexDirection={{
        base: isReversed ? "column-reverse" : "column",
        lg: "row",
      }}
    >
      <Box
        marginRight="5%"
        marginBottom={{ base: isReversed ? "0%" : "5%", lg: "0%" }}
        marginTop={{ base: isReversed ? "5%" : "0%", lg: "0%" }}
        flex={isReversed ? "3" : "2"}
      >
        {leftColumn}
      </Box>
      <Box height="100%" flex={isReversed ? "2" : "3"}>
        {rightColumn}
      </Box>
    </Flex>
  );
}

function ExploreInYourFavoriteLanguage() {
  const [typistKey, setTypistKey] = useState(0);

  return (
    <ImageSection
      leftColumn={
        <VStack alignItems="flex-start" spacing={5}>
          <Title maxWidth="100%" fontSize="30px" letterSpacing="0.1em">
            Explore tudo na sua linguagem favorita
          </Title>
          <SectionText textAlign="justify">
            Desenvolvemos <b>pacotes para acesso aos dados da BD+</b> em Python,
            R e linha de comando. Além disso, você pode{" "}
            <b>consultar e filtrar dados usando SQL</b> no editor do nosso
            <i>datalake</i> no Google BigQuery.
          </SectionText>
          <LinkDash href="https://basedosdados.github.io/mais/access_data_packages">
            Veja mais
          </LinkDash>
        </VStack>
      }
      rightColumn={
        <Box
          borderRadius="26.2245"
          filter="drop-shadow(0px 2.2449px 2.2449px rgba(0, 0, 0, 0.4))"
          maxHeight={{ base: "none", md: "200px" }}
          padding={{ base: "60px 20px", lg: "60px 30px" }}
          fontSize={{ base: "12px", lg: "inherit" }}
          id="termynal"
          data-termynal
          data-ty-typeDelay="40"
          data-ty-lineDelay="700"
          width="100%"
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
      }
    />
  );
}

function LearnToAnalysis() {
  return (
    <ImageSection
      isReversed={true}
      leftColumn={
        <Box
          position="relative"
          height="auto"
          maxHeight={{ base: "400px", lg: null }}
          minHeight={{ base: "300px", lg: null }}
          alignItems="flex-start"
          justifyContent="flex-start"
          zIndex="1"
        >
          <Image
            priority
            objectFit="contain"
            objectPosition="0"
            layout="fill"
            src="/img/tela_jupyter.png"
          />
        </Box>
      }
      rightColumn={
        <VStack spacing={5} alignItems="flex-start" position="relative">
          <Box
            position="absolute"
            right="0px"
            top="-50%"
            minWidth="850px"
            minHeight="568px"
            zIndex="0px"
          >
            <Image
              priority
              src="/img/home_background.png"
              layout="fill"
              objectFit="contain"
            />
          </Box>
          <Title
            zIndex="1"
            position="relative"
            maxWidth="100%"
            fontSize="30px"
            letterSpacing="0.1em"
          >
            Aprenda a construir análises com os dados
          </Title>
          <VStack spacing={4} zIndex="1" position="relative">
            <SectionText textAlign="justify">
              Produzimos{" "}
              <b> tutoriais e ensaios no blog, workshops no Youtube</b> e{" "}
              <b>análises nas redes sociais</b> com nossos dados.
              Disponibilizamos os <b>códigos completos</b> no nosso GitHub para
              você testar e reproduzir localmente
            </SectionText>
            <HStack alignItems="flex-start" width="100%" spacing={5}>
              <LinkDash href="https://www.youtube.com/c/BasedosDados/videos">
                YouTube
              </LinkDash>
              <LinkDash href="https://dev.to/basedosdados">Blog</LinkDash>
              <LinkDash href="https://github.com/basedosdados">GitHub</LinkDash>
            </HStack>
          </VStack>
        </VStack>
      }
    />
  );
}

function JoinTheCommunity() {
  return (
    <ImageSection
      leftColumn={
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
            Acompanhe todas as discussões, tire dúvidas, fale e aprenda direto
            com a equipe da Base dos Dados e faça parte de um grupo de pessoas
            incríveis da nossa <b>comunidade de dados abertos no Discord.</b>
          </SectionText>
          <LinkDash href="https://discord.gg/huKWpsVYx4">Discord</LinkDash>
        </VStack>
      }
      rightColumn={
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
            src="/img/tela_discord.png"
          />
        </Box>
      }
    />
  );
}

function Support({ strapiPages }) {
  const contactPage = strapiPages.filter((p) => p.Title === "Contato");

  function SupportButton({
    onClick,
    link,
    children,
    colorScheme = "blue",
    backgroundColor = "#3AA1EB",
    target = "_blank",
  }) {
    return (
      <a href={link} target={target}>
        <Button
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
          borderRadius="68.6364px"
          colorScheme={colorScheme}
          backgroundColor={backgroundColor}
          padding="25px"
          fontFamily="Ubuntu"
          fontWeight="700"
          fontSize="18px"
          minWidth="250px"
          letterSpacing="0.1em"
        >
          {children}
        </Button>
      </a>
    );
  }

  return (
    <VStack position="relative" paddingTop="60px" width="95%">
      <BigTitle position="relative" zIndex="1" width="90%" textAlign="center">
        Como colaborar conosco
      </BigTitle>
      <SectionText
        position="relative"
        zIndex="1"
        fontSize="17px"
        alignSelf="center"
        letterSpacing="0.05em"
        fontWeight="500"
        paddingBottom="60px"
      >
        Existimos através do esforço de{" "}
        <b>pessoas que acreditam no acesso a dados abertos de qualidade</b>.
      </SectionText>
      <Box
        position="absolute"
        right="0px"
        top="20%"
        minWidth="850px"
        minHeight="568px"
        zIndex="0px"
      >
        <Image
          priority
          src="/img/home_background.png"
          layout="fill"
          objectFit="contain"
        />
      </Box>
      <Stack
        width="100%"
        justifyContent="space-around"
        direction={{ base: "column", lg: "row" }}
        spacing={10}
      >
        <ShadowBox height="270px" title="Voluntariado">
          <SectionText fontSize="14px" height="100px">
            Ajude a manter e aprimorar pacotes, suba bases no nosso{" "}
            <i>datalake</i> ou construa análises e tutoriais para nossas redes.
          </SectionText>
          <SupportButton link="https://basedosdados.github.io/mais/colab/">
            Comece aqui
          </SupportButton>
        </ShadowBox>
        <ShadowBox height="270px" title="Parceria">
          <SectionText fontSize="14px" height="100px">
            Abra dados de sua organização, construa projetos de dados abertos
            conosco ou desenvolva aplicações com nossos dados.
          </SectionText>
          <SupportButton
            link={contactPage.length > 0 ? "/blog/" + contactPage[0].id : ""}
            target="_self"
          >
            Entre em contato
          </SupportButton>
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
            Apoio mensal
          </SupportButton>
          <SupportButton
            link={contactPage.length > 0 ? "/blog/" + contactPage[0].id : ""}
            target="_self"
          >
            Apoio institucional
          </SupportButton>
        </ShadowBox>
      </Stack>
    </VStack>
  );
}

export default function Home({
  strapiPages,
  popularDatasets,
  popularDatalakeDatasets,
}) {
  return (
    <MainPageTemplate strapiPages={strapiPages}>
      <VStack
        alignItems="center"
        width="100%"
        backgroundColor="#FAFAFA"
        padding="0px 10%"
        marginTop="55px"
        zIndex="10"
        position="relative"
      >
        <Hero />
      </VStack>
      <VStack padding="0px 5%">
        <CatalogNews
          popularDatasets={popularDatasets}
          popularDatalakeDatasets={popularDatalakeDatasets}
        />
      </VStack>
      <VStack
        spacing={20}
        transform="translateY(-100px)"
        width={{ base: "90%", lg: "85%" }}
        margin="auto"
      >
        <VStack width="100%">
          <BigTitle textAlign="center" maxWidth="100%" paddingBottom="10px">
            Explore, aprenda e participe
          </BigTitle>
          <SectionText
            fontSize="17px"
            alignSelf="center"
            letterSpacing="0.05em"
            fontWeight="500"
            paddingBottom="20px"
          >
            Facilitamos o trabalho para que a distância entre você e sua análise
            seja <b>apenas uma boa pergunta</b>.
          </SectionText>
        </VStack>
        <ExploreInYourFavoriteLanguage />
        <LearnToAnalysis />
        <JoinTheCommunity />
        <Support strapiPages={strapiPages} />
      </VStack>
      <script
        src="/vendor/terminal.js"
        data-termynal-container="#termynal"
      ></script>
    </MainPageTemplate>
  );
}
