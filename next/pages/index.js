import {
  Box,
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
import Display from "../components/atoms/Display";
import { useEffect, useState } from "react";
import ThemeCatalog from "../components/organisms/ThemeCatalog";
import SectionTitle from "../components/atoms/SectionTitle";
import SectionLink from "../components/atoms/SectionLink"
import Typist from "react-typist";
import {
  getRecentDatalakeDatasets
} from "./api/datasets";
import { getGroupList } from "./api/groups"
import { ShadowBox } from "../components/atoms/ShadowBox";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
import { ThemeTag } from "../components/atoms/ThemeTag";
import { LinkDash } from "../components/atoms/LinkDash";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { BePartner } from "../components/organisms/BePartner";
import SearchIcon from "../public/img/icons/searchIcon";
import ArrowIcon from "../public/img/icons/arrowIcon";
import EnthusiasticImage from "../public/img/enthusiasticImage";
import DatabaseImage from "../public/img/databaseImage";
import MasterOfDatabaseImage from "../public/img/masterOfDatabaseImage";
import ProductsFiltersImage from "../public/img/productsFiltersImage";
import ProcessedDataImage from "../public/img/processedDataImage";
import BDLogoPlusImage from "../public/img/logos/bd_logo_plus"
import RoundedButton from "../components/atoms/RoundedButton";
import Link from "../components/atoms/Link";

export async function getStaticProps(context) {
  const themes = await getGroupList();
  let recentDatalakeDatasets;

  try {
    recentDatalakeDatasets = await getRecentDatalakeDatasets();
  } catch {
    recentDatalakeDatasets = [];
  }

  return await withPages({
    props: {
      recentDatalakeDatasets,
      themes  
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


function Hero({ recentDatalakeDatasets, themes }) {
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
            marginTop={{ base: "100px", lg: "56px" }}
          >
            <Display
              position="relative"
              zIndex="1"
              flex="2"
              textAlign="center"
              marginStart="0px !important"
              marginBottom={isMobileMod ? "32px" : "40px"}
              color="#2B8C4D"
            >
              Encontre os dados que precisa
            </Display>
            <VStack
              maxWidth="650px"
              width="100%"
              spacing={4}
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
                  padding: "24px 64px 24px 32px",
                  height: "80px",
                  borderRadius: "25px",
                  backgroundColor: "#ffffff",
                  fontSize: "24px",
                  border: "0px",
                  boxShadow: "0 1px 8px 1px rgba(64, 60, 67, 0.16) !important",
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
              <HStack paddingLeft={isMobileMod ? "20px" : "32px"}>
                {!isMobileMod &&
                  <Text 
                    fontFamily="Ubuntu"
                    fontSize="13px"
                    fontWeight="300"
                    letterSpacing="0.4px"
                    color="#252A32"
                  >
                    Termos populares: 
                  </Text>
                }
                <ThemeTag name="lei" />
                <ThemeTag name="mortalidade" />
                <ThemeTag name="COVID19" />
              </HStack>
            </VStack>
          </VStack>

          <VStack
            margin="120px 0 0 !important"
            width="100%"
            position="relative"
            id="theme"
          >
            <Text
              fontFamily="Ubuntu"
              fontSize={isMobileMod ? "16px" : "22px"}
              fontWeigth="400"
              letterSpacing={isMobileMod ? "0.2px" : "0.1px"}
              minHeight="30px"
              marginBottom="24px"
              color="#A3A3A3"
              cursor="pointer"
              onClick={() => window.open("#theme", "_self")}
            >
              Busque por tema
            </Text>
            <ThemeCatalog
              themes={themes}
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
              src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/2022/GC_CustomerAwardWinner_SocialImpact+1.png"
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

function Products() {
  const [typistKey, setTypistKey] = useState(0);
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  return (
    <VStack
      width={{ base: "90%", lg: "85%" }}
      maxWidth="1264px"
      margin="auto"
    >
      <VStack id="support" position="relative" width="95%">
        <Display
          position="relative"
          zIndex="1"
          width="100%"
          textAlign="center"
          margin="80px 0px"
        >
          Facilitamos o trabalho para que a distância {!isMobileMod && <br/>}
          entre você e sua análise seja <span style={{color:"#2B8C4D"}}>apenas uma boa pergunta</span>.
        </Display>

        <VStack spacing={isMobileMod ? 8 : 120}>
          <HStack
            flexDirection={isMobileMod && "column"}
            justifyContent="center"
            gridGap={isMobileMod ? "0" : "160px"}
          >
            <Stack maxWidth={isMobileMod ? "300px" : "430px"}>
              <Text
               fontFamily="Ubuntu"
               fontSize="14px"
               fontWeight="300"
               color="#6F6F6F"
               letterSpacing="0.5px"
               lineHeight="24px"
              >
                FILTROS
              </Text>

              <SectionTitle marginTop="0 !important">Busque dados como quiser</SectionTitle>
              <SectionText>
                São vários filtros para ajudar você a encontrar os dados que necessita.
                Ao navegar entre centenas de conjuntos de dados disponíveis na plataforma,
                você pode refinar sua busca por tema, organização, cobertura temporal, nível da observação e mais.
              </SectionText>

              <SectionLink
                marginTop="24px !important"
                href={"/dataset"}
              >
                Comece sua pesquisa
              </SectionLink>
            </Stack>

            <Stack>
              <ProductsFiltersImage
                widthImage={isMobileMod ? "300px" : "550px"}
                heightImage={isMobileMod && "250px"}
              />
            </Stack>
          </HStack>

          <HStack
            flexDirection={isMobileMod && "column"}
            justifyContent="center"
            gridGap={isMobileMod ? "0" : "160px"}
          >
            <Stack 
              order={isMobileMod ? 0 : 1}
              maxWidth={isMobileMod ? "300px" : "430px"}
            >
              <HStack spacing={1}>
                <Text
                  fontFamily="Ubuntu"
                  fontSize="14px"
                  fontWeight="300"
                  color="#6F6F6F"
                  letterSpacing="0.5px"
                  lineHeight="24px"
                >
                  TABELAS TRATADAS
                </Text>

                <BDLogoPlusImage
                  widthImage="40px"
                />
              </HStack>
              
              <SectionTitle marginTop="0 !important">Acesse dados de qualidade</SectionTitle>
              <SectionText>
                Com as tabelas tratadas do nosso <i>datalake</i> público,
                você não precisa mais gastar horas limpando bases.
                Nossa metodologia de padronização permite cruzar facilmente dados de diferentes organizações. Assim, você pode focar no que realmente importa.
              </SectionText>

              <SectionLink
                marginTop="24px !important"
                href={"/dataset?resource_type=bdm_table&order_by=score"}
              >
                Veja os dados disponíveis
              </SectionLink>
            </Stack>

            <Stack order={isMobileMod ? 1 : 0}>
              <ProcessedDataImage
                widthImage={isMobileMod ? "300px" : "550px"}
                heightImage={isMobileMod && "250px"}
              />
            </Stack>
          </HStack>

          <HStack
            flexDirection={isMobileMod && "column"}
            justifyContent="center"
            gridGap={isMobileMod ? "100px" : "160px"}
          >
            <Stack maxWidth={isMobileMod ? "300px" : "430px"}>
              <Text
                fontFamily="Ubuntu"
                fontSize="14px"
                fontWeight="300"
                color="#6F6F6F"
                letterSpacing="0.5px"
                lineHeight="24px"
              >
                PACOTES
              </Text>

              <SectionTitle marginTop="0 !important">Explore na sua linguagem favorita</SectionTitle>
              <SectionText>
                Desenvolvemos pacotes para acesso aos dados tratados em Python, R e linha de comando. Além disso, você pode consultar e filtrar
                dados usando SQL no editor do nosso <i>datalake</i> público no Google BigQuery.
              </SectionText>

              <SectionLink
                marginTop="24px !important"
                href={"https://basedosdados.github.io/mais/"}
              >
                Saiba como acessar
              </SectionLink>
            </Stack>

            <Stack
              maxWidth={isMobileMod ? "320px" : "550px"}
              minWidth={isMobileMod ? "320px" : "550px"}
            >
              <Box
                borderRadius={isMobileMod ? "8px" :"12px"}
                filter="drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.4))"
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
            </Stack>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  )
}

function Support({ pages }) {
  const contactPage = pages.filter((p) => p.Title === "Contato");
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])


  return (
    <VStack
      spacing={20}
      width={{ base: "90%", lg: "85%" }}
      margin="auto"
    >
      <VStack id="support" position="relative" width="95%">
        <Display
          position="relative"
          zIndex="1"
          width="100%"
          textAlign="center"
          margin={isMobileMod ? "80px 0px 40px" : "176px 0px 40px"}
        >
          Existimos através do esforço de pessoas {!isMobileMod && <br/>}
          que acreditam no acesso a dados abertos de qualidade.
        </Display>
        <Text
          position="relative"
          zIndex="1"
          color="#6F6F6F"
          fontFamily="Ubuntu"
          fontSize={isMobileMod ? "16px" : "18px"}
          alignSelf="center"
          letterSpacing="0.1px"
          fontWeight="300"
          margin="0 0 48px !important"
        > Apoie a Base dos Dados você também
        </Text>

        <Stack
          width="100%"
          margin="0 0 56px !important"
          justifyContent="center"
          alignItems="center"
          direction={{ base: "column", lg: "row" }}
          gridGap="48px"
        >
          <ShadowBox
            height="100%"
            image= {
              <EnthusiasticImage
                widthImage="100%"
                heightImage="100%"
              />
            }
            title="Entusiasta"
            spacing={4}
          >
            <SectionText
              textAlign="center"
            >
              Bolso apertado? Apenas R$0,50 por dia para ajudar a manter a iniciativa.
            </SectionText>
            <Link _hover={{ opacity:"none" }} target="_blank" href="https://apoia.se/basedosdados">
              <RoundedButton width="200px">
                  R$ <p style={{fontSize:"24px", margin:"0 5px"}}>15</p>/ mês
              </RoundedButton>
            </Link>
          </ShadowBox>

          <ShadowBox
            height="100%"
            border="2.5px solid #FF8484"
            image= {
              <DatabaseImage
                widthImage="100%"
                heightImage="100%"
                backgroundColor="#FF8484"
              />
            }
            title={
              <a style={{ color:"#FF8484", fontWeight:"500"}}>
                <i>Databaser</i>
              </a>
            }
            spacing={4}
          >
            <SectionText
              display="flex"
              flexDirection="column"
              textAlign="center"
              color="#252A32 !important"
            >
              <b>Doe R$ 1 real por dia</b>
              <p>para fazer <i>databasers</i> felizes.</p>
            </SectionText>
            <Link _hover={{ opacity:"none" }} target="_blank" href="https://apoia.se/basedosdados">
              <RoundedButton backgroundColor="#FF8484" width="200px">
                  R$ <p style={{fontSize:"24px", margin:"0 5px"}}>30</p>/ mês
              </RoundedButton>
            </Link>
          </ShadowBox>

          <ShadowBox
            height="100%"
            image= {
              <MasterOfDatabaseImage
                widthImage="100%"
                heightImage="100%"
              />
            }
            title="Mestre dos dados"
            spacing={4}
          >
            <SectionText
              textAlign="center"
            >
              Menos de R$2 reais por dia para pouparmos ainda mais seu trabalho.
            </SectionText>
            <Link _hover={{ opacity:"none" }} target="_blank" href="https://apoia.se/basedosdados">
              <RoundedButton width="200px">
                  R$ <p style={{fontSize:"24px", margin:"0 5px"}}>50</p>/ mês
              </RoundedButton>
            </Link>
          </ShadowBox>
        </Stack>

        <Box padding="0px">
          <Text
            width="100%"
            textAlign="center"
            fontFamily="Ubuntu"
            fontSize={isMobileMod ? "20px" : "24px"}
            letterSpacing={isMobileMod ? "0.2px" : "0px"}
            color="#252A32"
            fontWeigth="400"
            lineHeight="32px"
            paddingBottom="24px"
          >
            Doe via PIX
          </Text>
          <Stack
            justify="space-between"
            alignItems="flex-start"
            width="100%"
            gridGap={10}
            direction={{ base: "column", lg: "row" }}
            margin={!isMobileMod && "24px 24px 0px"}
          >
            <Stack
              width={{ base: "100%", lg: "initial" }}
              spacing={10}
              direction={{ base: "column", lg: "row" }}
            >
              <ChakraImage
                position="relative"
                top="-5px"
                height="180px"
                objectFit="contain"
                src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/bd_qrcode.png"
              />
              <SectionText
                marginLeft="auto"
                fontWeight="300"
                fontSize="14px"
                flex={1}
              >
                Chave CNPJ<br/>
                <b style={{fontWeight:"500"}}>42494318000116</b> <br/><br/>
                Banco: <b style={{fontWeight:"500"}}>Stone</b> <br/>
                Razão Social: <b style={{fontWeight:"500"}}>Instituto Base dos Dados</b> <br/>
                CNPJ: <b style={{fontWeight:"500"}}>42494318/0001-16</b> <br/>
                Agência: <b style={{fontWeight:"500"}}>0001</b> | Conta: <b style={{fontWeight:"500"}}>6761821-5</b>
              </SectionText>
            </Stack>
            <Stack>
              <SectionText
                fontWeight="300"
                fontSize="14px"
                maxHeight="190px"
                textAlign="start"
                lineHeight={{base:"30px", lg:"30px", xl: "40px"}}
                flex={1}
              >
                1. Abra o app do seu banco<br/>
                2. Escolha a opção de pagamento com PIX QR Code ou chave<br/>
                3. Escaneie o QR Code ou digite a chave ao lado<br/>
                ❤. Faça sua doação!
              </SectionText>
            </Stack>
          </Stack>
        </Box>

        <SectionText
          margin="32px 0 !important"
        >
          💰 Gostaria de apoiar institucionalmente a Base dos Dados?
          <LinkDash
            dash={false}
            textDecoration="none"
            fontWeight="700"
            fontSize="14px"
            href="/contato"
          > Entre em contato conosco.
          </LinkDash>
        </SectionText>
      </VStack>
    </VStack>
  );
}

export default function Home({
  pages,
  popularDatasets,
  recentDatalakeDatasets,
  themes,
}) {
  return (
    <MainPageTemplate backgroundColor="#FFFFFF" pages={pages}>
      <VStack
        alignItems="center"
        width="100%"
        padding="0px 10%"
        marginTop="56px"
        zIndex="10"
        position="relative"
      >
        <Hero
          recentDatalakeDatasets={recentDatalakeDatasets}
          themes={themes}
        />
      </VStack>
      <BePartner />
      <Products />
      <Support pages={pages} />
      <script
        src="/vendor/terminal.js"
        data-termynal-container="#termynal"
      ></script>
    </MainPageTemplate>
  );
}