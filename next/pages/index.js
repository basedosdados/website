import {
  Box,
  Button,
  HStack,
  Stack,
  Text,
  Flex,
  VStack,
  Image as ChakraImage,
} from "@chakra-ui/react";
import Image from "next/image";
import ControlledInput from "../components/atoms/ControlledInput";
import SectionText from "../components/atoms/SectionText";
import BigTitle from "../components/atoms/BigTitle";
import { useEffect, useState } from "react";
import ThemeCatalog from "../components/organisms/ThemeCatalog";
import Title from "../components/atoms/Title";
import SectionTitle from "../components/atoms/SectionTitle";
import Typist from "react-typist";
import {
  getRecentDatalakeDatasets
} from "./api/datasets";
import { ShadowBox } from "../components/atoms/ShadowBox";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
import { ThemeTag } from "../components/atoms/ThemeTag";
import { LinkDash } from "../components/atoms/LinkDash";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { BePartner } from "../components/organisms/BePartner";
import SearchIcon from "../public/img/icons/searchIcon"
import ArrowIcon from "../public/img/icons/arrowIcon"

export async function getStaticProps(context) {
  let recentDatalakeDatasets;
  try {
    recentDatalakeDatasets = await getRecentDatalakeDatasets();
  } catch {
    recentDatalakeDatasets = [];
  }

  return await withPages({
    props: {
      recentDatalakeDatasets,
    },
    revalidate: 60,
  });
}

// function HeroText({ children, iconUrl, height = "100px" }) {
//   return (
//     <VStack alignItems="center" justifyContent="center" maxWidth="400px">
//       <Flex justify="baseline" align="baseline" width="100%" height="130px">
//         <Flex
//           margin="auto"
//           width="100%"
//           height={height}
//           marginBottom="20px"
//           position="relative"
//           justify="baseline"
//           align="baseline"
//         >
//           <Image
//             loading="eager"
//             priority
//             objectFit="contain"
//             layout="fill"
//             src={iconUrl}
//           />
//         </Flex>
//       </Flex>
//       {children}
//     </VStack>
//   );
// }


function Hero({ recentDatalakeDatasets }) {
  const [search, setSearch] = useState();
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  function openSearchLink() {
    return window.open(`/dataset?q=${search}`, "_self");
  }

  return (
    <VStack width="100%">
      <VStack
        width="100%"
        height="100%"
      >
        <VStack
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          spacing={20}
        >
          <VStack
            position="relative"
            width="100%"
            marginStart="0px !important"
            direction="column"
            marginTop={{ base: "100px", lg: "50px" }}
          >
            <BigTitle
              position="relative"
              zIndex="1"
              fontWeigth="500"
              fontFamily="Ubuntu"
              flex="2"
              fontSize="34px"
              letterSpacing={{ base: "0", lg: "0.5px" }}
              textAlign="center"
              marginStart="0px !important"
              marginBottom={isMobileMod ? "30px" : "50px"}
            >
              Encontre os dados que você precisa
            </BigTitle>
            <VStack
              maxWidth="650px"
              width="100%"
              spacing={3}
              alignItems="flex-start"
              flex="3"
            >
              <ControlledInput
                value={search}
                width="100%"
                onChange={setSearch}
                onEnterPress={openSearchLink}
                alignSelf="center"
                justifyContent="center"
                inputStyle={{
                  padding: "20px 65px 20px 30px",
                  height: "80px",
                  borderRadius: "25px",
                  backgroundColor: "#ffffff",
                  fontSize: "24px",
                  border: "0px",
                  boxShadow: "0 2px 5px 1px rgba(64, 60, 67, 0.16) !important",
                }}
                rightIcon={
                  (search ?
                    <ArrowIcon
                      widthIcon="28px"
                      heightIcon="28px"
                      fill="#252A32"
                      marginRight="20px"
                      cursor="pointer"
                      onClick={openSearchLink}
                    />
                    :
                    <SearchIcon
                      widthIcon="28px"
                      heightIcon="28px"
                      fill="#252A32"
                      marginRight="25px"
                    />
                  )
                }
              />
              <HStack paddingLeft={isMobileMod ? "20px" : "40px"}>
                {!isMobileMod &&
                  <SectionText fontSize="14px">Termos populares: </SectionText>
                }
                <ThemeTag name="lei" />
                <ThemeTag name="mortalidade" />
                <ThemeTag name="COVID19" />
              </HStack>
            </VStack>
          </VStack>

          <VStack
            margin="0 !important"
            paddingTop="120px"
            width="100%"
            position="relative"
            id="theme"
          >
            <Title
              fontSize="22px"
              fontWeigth="400"
              minHeight="30px"
              marginBottom="20px"
              color="#9c9c9c"
              letterSpacing="1px"
            >
              Busque por tema
            </Title>
            <ThemeCatalog
              recentDatalakeDatasets={recentDatalakeDatasets}
            />
          </VStack>
        </VStack>

        <Stack
          position={{ base: "relative", lg: "absolute" }}
          top={{ base: "-35px", lg: "-120px", xl: "-120px" }}
          marginBottom={{ base: "70px !important", lg: "" }}
          right="0"
        >
          <Box
            margin={{ base: "50px 0", lg: "40px", }}
            width={{ base: "200px", lg: "140px", xl: "160px" }}
            height={{ base: "200px", lg: "140px", xl: "160px" }}
          >
            <Image
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/GC_CustomerAwardWinner_SocialImpact+1.png"
              width="227px"
              height="336px"
              loading="eager"
              priority
            />
          </Box>

        </Stack>

      </VStack>
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
          <SectionTitle maxWidth="100%" fontSize="28px" letterSpacing="0.5px">
            Explore tudo na sua linguagem favorita
          </SectionTitle>
          <SectionText textAlign="justify">
            Desenvolvemos <b>pacotes para acesso aos dados da BD+</b> em Python,
            R e linha de comando. Além disso, você pode{" "}
            <b>consultar e filtrar dados usando SQL</b> no editor do nosso
            <i>datalake</i> no Google BigQuery.
          </SectionText>
          <LinkDash href="https://basedosdados.github.io/mais/access_data_packages">
            <b>Veja mais</b>
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
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/fundo_rede.png"
              layout="fill"
              objectFit="contain"
            />
          </Box>
          <SectionTitle
            zIndex="1"
            position="relative"
            maxWidth="100%"
            fontSize="28px"
            letterSpacing="0.5px"
          >
            Aprenda a construir análises com os dados
          </SectionTitle>
          <VStack spacing={4} zIndex="1" position="relative">
            <SectionText textAlign="justify">
              Produzimos{" "}
              <b> tutoriais e análises no blog, workshops no YouTube</b> e e
              muito mais com nossos dados. O código completo de todos os
              exemplos fica disponível no nosso GitHub para você testar e
              reproduzir localmente.
            </SectionText>
            <HStack alignItems="flex-start" width="100%" spacing={5}>
              <LinkDash href="https://www.youtube.com/c/BasedosDados/videos">
                <b>YouTube</b>
              </LinkDash>
              <LinkDash href="https://medium.com/basedosdados">
                <b>Blog</b>
              </LinkDash>
              <LinkDash href="https://github.com/basedosdados">
                <b>GitHub</b>
              </LinkDash>
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
          <SectionTitle maxWidth="80%" fontSize="28px" letterSpacing="0.5px">
            Faça parte da nossa comunidade, <i>databaser</i>
          </SectionTitle>
          <SectionText textAlign="justify">
            Acompanhe todas as discussões, tire dúvidas, fale e aprenda direto
            com a equipe e a comunidade da Base dos Dados pelo Discord. Para ir
            além, seja voluntário(a) da BD e colabore com dados, análises ou
            infraestrutura.
          </SectionText>
          <HStack alignItems="flex-start" width="100%" spacing={5}>
            <LinkDash href="https://basedosdados.github.io/mais/colab/">
              <b>Voluntariado</b>
            </LinkDash>
            <LinkDash href="https://discord.gg/huKWpsVYx4">
              <b>Discord</b>
            </LinkDash>
          </HStack>
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

function Support({ pages }) {
  const contactPage = pages.filter((p) => p.Title === "Contato");

  function SupportButton({
    onClick,
    link,
    children,
    colorScheme = "blue",
    backgroundColor = "#3AA1EB",
    target = "_blank",
    ...props
  }) {
    return (
      <a href={link} target={target}>
        <Button
          boxShadow="0 2px 5px 1px rgba(64, 60, 67, 0.16)"
          borderRadius="68.6364px"
          colorScheme={colorScheme}
          backgroundColor={backgroundColor}
          padding="23px"
          fontFamily="Ubuntu"
          fontWeight="700"
          display="flex"
          fontSize="18px"
          minWidth="200px"
          letterSpacing="0.5px"
          _hover={{
            transform: "translateY(-3px);",
          }}
        >
          {children}
        </Button>
      </a>
    );
  }

  return (
    <VStack id="support" position="relative" paddingTop="40px" width="95%">
      <BigTitle position="relative" zIndex="1" width="90%" textAlign="center">
        Apoie a Base dos Dados
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
        Existimos através do esforço de pessoas que acreditam no acesso a dados
        abertos de qualidade.
      </SectionText>
      <Stack
        width="100%"
        paddingBottom="30px"
        justifyContent="space-around"
        direction={{ base: "column", lg: "row" }}
        spacing={10}
      >
        <ShadowBox height="250px" title="Entusiasta 🤩">
          <SectionText
            fontWeight="400"
            padding="10px 0px"
            fontSize="14px"
            height="100px"
          >
            Bolso apertado? Doe apenas R$0,50 por dia e ajude a manter a
            iniciativa.
          </SectionText>
          <SupportButton
            alignItems="flex-end"
            link="https://apoia.se/basedosdados"
          >
            <Flex paddingBottom="10px" align="flex-end">
              R${" "}
              <Text
                fontSize="30px"
                margin="0px"
                padding="0px 10px"
                marginBottom="-5px"
              >
                15
              </Text>{" "}
              / mês
            </Flex>
          </SupportButton>
        </ShadowBox>
        <ShadowBox
          height="250px"
          border="2.5px solid #FF8484"
          title={
            <Text color="#FF8484">
              <b><i>Databaser</i> 🎲</b>
            </Text>
          }
        >
          <SectionText
            fontWeight="400"
            padding="10px 0px"
            fontSize="14px"
            height="100px"
          >
            Dobre sua doação:{" "}
            <b>R$ 1 real por dia para fazer databasers felizes.</b>
          </SectionText>
          <SupportButton
            colorScheme="red"
            backgroundColor="#FF8484"
            alignItems="flex-end"
            link="https://apoia.se/basedosdados"
          >
            <Flex paddingBottom="10px" align="flex-end">
              R${" "}
              <Text
                fontSize="30px"
                margin="0px"
                padding="0px 10px"
                marginBottom="-5px"
              >
                30
              </Text>{" "}
              / mês
            </Flex>
          </SupportButton>
        </ShadowBox>
        <ShadowBox
          height="250px"
          title={
            <Text>
              Mestre dos dados 🔮
            </Text>
          }
        >
          <SectionText
            fontWeight="400"
            padding="10px 0px"
            fontSize="14px"
            height="80px"
          >
            Já poupamos algumas horas do seu trabalho? Que tal doar R$50 para
            ajudarmos ainda mais pessoas?
          </SectionText>
          <SupportButton
            alignItems="flex-end"
            link="https://apoia.se/basedosdados"
          >
            <Flex paddingBottom="10px" align="flex-end">
              R${" "}
              <Text
                fontSize="30px"
                margin="0px"
                padding="0px 10px"
                marginBottom="-5px"
              >
                50
              </Text>{" "}
              / mês
            </Flex>
          </SupportButton>
        </ShadowBox>
      </Stack>
      <ShadowBox padding="0px">
        <BigTitle padding="0px" fontSize="24px" color="#252A32">
          Doe via PIX
        </BigTitle>
        <Stack
          align="center"
          justify="space-between"
          width="100%"
          direction={{ base: "column", lg: "row" }}
          padding="0px 50px"
        >
          <Stack
            width={{ base: "100%", lg: "initial" }}
            spacing={10}
            direction={{ base: "column", lg: "row" }}
          >
            <ChakraImage
              height="180px"
              objectFit="contain"
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/bd_qrcode.png"
            />

            <SectionText
              padding={{ base: "0px 0px", lg: "10px 0px" }}
              marginLeft="auto"
              fontWeight="400"
              fontSize="14px"
            >
              <b>
                Chave CNPJ
                <br /> 42494318000116
              </b>
              <br />
              <br />
              Banco: Stone
              <br /> Razão Social: Instituto Base dos Dados
              <br /> CNPJ: 42494318/0001-16
              <br />
              Agência: 0001 | Conta: 6761821-5
            </SectionText>
          </Stack>
          <SectionText fontWeight="400" fontSize="14px">
            1. Abra o app do seu banco
            <br />
            <br />
            2. Escolha a opção de pagamento com PIX QR Code ou chave
            <br />
            <br />
            3. Escaneie o QR Code ou digite a chave ao lado
            <br />
            <br />
            💚. Faça sua doação!
            <br />
            <br />
          </SectionText>
        </Stack>
      </ShadowBox>
      <SectionText
        paddingTop="20px"
        paddingBottom="30px"
        fontWeight="400"
        fontSize="14px"
      >
        Gostaria de apoiar institucionalmente a Base dos Dados?{" "}
        <LinkDash
          dash={false}
          textDecoration="none"
          fontWeight="bolder"
          fontSize="14px"
          href="/blog/1/"
        >
          Entre em contato conosco.
        </LinkDash>
      </SectionText>
    </VStack>
  );
}

export default function Home({
  pages,
  popularDatasets,
  recentDatalakeDatasets,
}) {
  return (
    <MainPageTemplate backgroundColor="#FFFFFF" pages={pages}>
      <VStack
        alignItems="center"
        width="100%"
        padding="0px 10%"
        marginTop="55px"
        zIndex="10"
        position="relative"
      >
        <Hero
          recentDatalakeDatasets={recentDatalakeDatasets}
        />
      </VStack>
      <BePartner />
      <VStack
        paddingTop="70px"
        pb="60px"
        spacing={20}
        width={{ base: "90%", lg: "85%" }}
        margin="auto"
      >
        <Support pages={pages} />
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
      </VStack>
      <script
        src="/vendor/terminal.js"
        data-termynal-container="#termynal"
      ></script>
    </MainPageTemplate>
  );
}
