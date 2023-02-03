import {
  Box,
  HStack,
  Stack,
  Text,
  VStack,
  Grid,
  GridItem,
  useClipboard,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Typist from "react-typist";
import {
  getPopularDatalakeDatasets,
  getPopularTags
} from "./api/datasets";
import { getGroupList } from "./api/groups"
import { withPages } from "../hooks/pages.hook";
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { useMediaQuery } from "@chakra-ui/react";
import BodyText from "../components/atoms/BodyText";
import ControlledInput from "../components/atoms/ControlledInput";
import Display from "../components/atoms/Display";
import Link from "../components/atoms/Link";
import SectionText from "../components/atoms/SectionText";
import SectionTitle from "../components/atoms/SectionTitle";
import SectionLink from "../components/atoms/SectionLink"
import { ShadowBox } from "../components/atoms/ShadowBox";
import RoundedButton from "../components/atoms/RoundedButton";
import { ThemeTag } from "../components/atoms/ThemeTag";
import ThemeCatalog from "../components/molecules/ThemeCatalog";
import { BePartner } from "../components/organisms/BePartner";
import { MainPageTemplate } from "../components/templates/main";

import SearchIcon from "../public/img/icons/searchIcon";
import ArrowIcon from "../public/img/icons/arrowIcon";
import { CopySolidIcon } from "../public/img/icons/copyIcon";
import BDLogoImage from "../public/img/logos/bd_logo";
import EnthusiasticImage from "../public/img/enthusiasticImage";
import DatabaseImage from "../public/img/databaseImage";
import MasterOfDatabaseImage from "../public/img/masterOfDatabaseImage";
import ProductsFiltersImage from "../public/img/productsFiltersImage";
import ProcessedDataImage from "../public/img/processedDataImage";
import BDLogoPlusImage from "../public/img/logos/bd_logo_plus"

export async function getStaticProps(context) {
  const themes = await getGroupList()
  const popularTags = await getPopularTags()
  let popularDatalakeDatasets;

  try {
    popularDatalakeDatasets = await getPopularDatalakeDatasets()
  } catch {
    popularDatalakeDatasets = []
  }

  return await withPages({
    props: {
      popularDatalakeDatasets,
      popularTags,
      themes  
    },
    revalidate: 60,
  });
}

function Hero({ popularDatalakeDatasets, popularTags, themes }) {
  const [search, setSearch] = useState();
  const [isMobileMod, setIsMobileMod] = useState(false)
  const [tags, setTags] = useState([])
  const isMobile = useCheckMobile();
  const [mediumQuery] = useMediaQuery("(max-width: 1366px)")

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

  function openSearchLink() {
    return window.open(`/dataset?q=${search}`, "_self");
  }

  useEffect(() => {
    if(isMobile) return null
    return document.getElementById("searchDatabases").focus()
  },[])

  useEffect(() => {
    if(popularTags === null) return ""
    const newPopularTags = Object.keys(popularTags)
    if(isMobile) return setTags(newPopularTags.slice(0,3))
    setTags(newPopularTags.slice(0,5))
  },[popularTags])

  return (
    <VStack
      alignItems="center"
      width="100%"
      padding="0px 10%"
      marginTop="56px"
      zIndex="10"
      position="relative"
    >
      <VStack
        position="relative"
        width="100%"
        maxWidth="1264px"
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
            marginTop={
              isMobileMod ? "64px" : 
              mediumQuery ? "16px" : "80px"
            }
          >
            <BDLogoImage 
              widthImage={isMobileMod ? "160px" : "200px"}
              heightImage={isMobileMod ? "75px" : "94px"}
              marginBottom="24px"
            />
            <VStack
              maxWidth="650px"
              width={isMobileMod ? "100vw" : "100%"}
              paddingX={isMobileMod && "24px"}
              spacing={4}
              alignItems="flex-start"
              flex="3"
            >
              <ControlledInput
                value={search}
                placeholder={isMobileMod ? "Encontre os dados" : "Encontre os dados que você precisa"}
                width="100%"
                onChange={setSearch}
                onEnterPress={openSearchLink}
                alignSelf="center"
                justifyContent="center"
                isBorderColor={false}
                inputStyle={{
                  "aria-label": "Search",
                  id: "searchDatabases",
                  fontFamily: "ubuntu",
                  padding: isMobileMod ? "24px 48px 24px 20px " : "24px 64px 24px 32px",
                  height: isMobileMod ? "50px" :"80px",
                  borderRadius: isMobileMod ? "18px" : "25px",
                  backgroundColor: "#ffffff",
                  fontSize: isMobileMod ? "18px" : "22px",
                  letterSpacing: isMobileMod? "0.1px" : "0",
                  border: "0px",
                  boxShadow: "0 1px 8px 1px rgba(64, 60, 67, 0.16) !important",
                  _placeholder:isMobileMod ? {color:"#6F6F6F !important"} : {color: "#A3A3A3"}
                }}
                rightIcon={
                  (search ?
                    <ArrowIcon
                      alt=""
                      width={isMobileMod ? "18px" : "28px"}
                      height={isMobileMod ? "18px" : "28px"}
                      fill="#252A32"
                      marginRight={isMobileMod ? "10px" : "20px"}
                      cursor="pointer"
                      onClick={openSearchLink}
                    />
                    :
                    <SearchIcon
                      alt="pesquisar"
                      width={isMobileMod ? "18px" : "28px"}
                      height={isMobileMod ? "18px" : "28px"}
                      fill="#252A32"
                      marginRight={isMobileMod ? "10px" : "25px"}
                    />
                  )
                }
              />
              <HStack display={tags.length === 0 ? "none" : "flex"} paddingLeft={isMobileMod ? "20px" : "32px"}>
                {!isMobileMod &&
                  <Text 
                    fontFamily="Ubuntu"
                    fontSize="13px"
                    fontWeight="300"
                    letterSpacing="0.4px"
                    color="#575757"
                  >
                    Termos populares: 
                  </Text>
                }
                {tags.map(elm => 
                  <ThemeTag name={elm} />
                )}
              </HStack>
            </VStack>
          </VStack>

          <VStack
            margin="0 !important"
            paddingTop={isMobileMod ? "80px" : "120px"}
            width="100%"
            position="relative"
            id="theme"
          >
            <Text
              fontSize={isMobileMod ? "16px" : "22px"}
              letterSpacing={isMobileMod ? "0.1px" : "0"}
              fontFamily="Ubuntu"
              fontWeight="300"
              minHeight="30px"
              marginBottom={isMobileMod ? "8px" : "24px"}
              color="#575757"
              cursor="pointer"
              onClick={() => window.open("#theme", "_self")}
            >
              Busque por tema
            </Text>
            <ThemeCatalog
              themes={themes}
              popularDatalakeDatasets={popularDatalakeDatasets}
            />
          </VStack>
        </VStack>
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
      margin="0 auto 36px"
    >
      <VStack position="relative" width="95%">
        <Display
          fontSize={isMobileMod ? "32px" : "38px"}
          letterSpacing={isMobileMod ? "0.2px" : "-0.2px"}
          lineHeight={isMobileMod ? "40px" : "64px"}
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
              <SectionText fontSize="16px">
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
              <SectionText fontSize="16px">
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
            spacing={0}
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
              <SectionText fontSize="16px">
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
                minHeight={{ base: "200px", md: "none" }}
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

export function TextPix ({ title, text }) {

  return (
    <Box>
      <BodyText fontSize="16px" letterSpacing="0.2px" color="#FF8484" fontWeight="500">
        {title}
      </BodyText>
      <BodyText fontSize="16px" letterSpacing="0.2px" marginBottom="8px">
        {text}
      </BodyText>
    </Box>
  )
}

export function StepText ({index, text}) {
  return (
    <Box marginBottom="20px !important">
      <BodyText
        fontSize="16px" letterSpacing="0.2px"
        display="flex"
        gridGap="8px"
      >
        <Text
          color="#FF8484"
          fontWeight="500"
        >
          {index}
        </Text>
        {text}
      </BodyText>
    </Box>
  )
}

function Support({ pages }) {
  const contactPage = pages.filter((p) => p.Title === "Contato");
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  const { hasCopied, onCopy } = useClipboard("42494318000116")

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
          letterSpacing={isMobileMod ? "0.2px" : "-0.4px"}
          position="relative"
          zIndex="1"
          width="100%"
          textAlign="center"
          margin={isMobileMod ? "80px 0px 24px" : "104px 0px 24px"}
        >
          Existimos através do esforço de pessoas que {!isMobileMod && <br/>}
          acreditam no acesso a dados abertos de qualidade.
        </Display>
        <Text
          position="relative"
          zIndex="1"
          color="#6F6F6F"
          fontFamily="Ubuntu"
          fontSize={isMobileMod ? "16px" : "18px"}
          alignSelf="center"
          letterSpacing={isMobileMod ? "0.2px" : "0.1px"}
          fontWeight="300"
          margin="0 0 48px !important"
        > Apoie a Base dos Dados você também
        </Text>

        <Stack
          width="100%"
          margin="0 0 80px !important"
          justifyContent="center"
          alignItems="center"
          direction={{ base: "column", lg: "row" }}
          gridGap="48px"
        >
          <ShadowBox
            width="266px"
            height="400px"
            image= {
              <EnthusiasticImage
                widthImage="100%"
                heightImage="100%"
              />
            }
            title="Entusiasta"
            spacing={4}
          >
            <BodyText
              textAlign="center"
              fontWeight="300"
              fontSize="14px"
              letterSpacing="0.2px"
              margin="10px 0 24px !important"
              lineHeight="24px"
            >
              Bolso apertado? Apenas R$0,50 por <br/>dia para nos ajudar a manter a iniciativa.
            </BodyText>
            <Link
              _hover={{ opacity:"none" }}
              margin="0 !important"
              target="_blank"
              href="https://apoia.se/support/basedosdados/new/15"
            >
              <RoundedButton backgroundColor="#FF8484" width="200px">
                  R$ <p style={{fontSize:"24px", margin:"0 5px"}}>15</p>/ mês
              </RoundedButton>
            </Link>
          </ShadowBox>

          <ShadowBox
            width={isMobileMod ? "266px" : "320px"}
            height={isMobileMod ? "400" : "428px"}
            image={
              <DatabaseImage 
                widthImage="100%"
                heightImage="100%"
                backgroundColor="#FF8484"
              />
            }
            title="Databaser"
            titleStyle={{
              fontSize:"22px",
              color:"#FF8484",
              fontWeight:"500",
              letterSpacing:"0.1px"
            }}
            spacing={4}
          >
            <BodyText
              display="flex"
              flexDirection="column"
              textAlign="center"
              fontSize="16px"
              margin="16px 0 24px !important"
              letterSpacing="0.2px"
            >
              <b style={{fontWeight:"500"}}>Doe R$ 1 real por dia</b>
              <p>para fazer databasers felizes.</p>
            </BodyText>
            <Link
              _hover={{ opacity:"none" }}
              marginTop="0 !important"
              target="_blank"
              href="https://apoia.se/support/basedosdados/new/30"
            >
              <RoundedButton
                backgroundColor="#FF8484"
                width="200px"
              >
                  R$ <p style={{fontSize:"24px", margin:"0 5px"}}>30</p>/ mês
              </RoundedButton>
            </Link>
          </ShadowBox>
          
          <ShadowBox
            width="266px"
            height="400px"
            image= {
              <MasterOfDatabaseImage
                widthImage="100%"
                heightImage="100%"
              />
            }
            title="Mestre dos dados"
            spacing={4}
          >
            <BodyText
              textAlign="center"
              fontWeight="300"
              fontSize="14px"
              letterSpacing="0.2px"
              margin="10px 0 24px !important"
              lineHeight="24px"
            >
              Menos de R$2 reais por dia para pouparmos ainda mais seu trabalho.
            </BodyText>
            <Link
              _hover={{ opacity:"none" }}
              marginTop="0 !important"
              target="_blank"
              href="https://apoia.se/support/basedosdados/new/50"
            >
              <RoundedButton backgroundColor="#FF8484" width="200px">
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
            fontSize="20px"
            letterSpacing="0.2px"
            color="#7D7D7D"
            fontWeight="400"
            lineHeight="32px"
            paddingBottom={!isMobileMod && "32px"}
          >
            Doe qualquer valor via PIX
          </Text>

          <Grid
            templateColumns={isMobileMod ? "repeat(1, 3fr)" : "repeat(3, 1fr)"}
            gridGap={isMobileMod && "40px"}
            justifyItems="center"
            width="100%"
          >
            <GridItem
              marginTop={isMobileMod && "32px !important"}
              justifyContent="center"
              alignItems="flex-start"
            >
              <TextPix title="Razão Social" text="Instituto Base dos Dados"/>
              <TextPix title="CNPJ" text="42494318/0001-16"/>
              <TextPix title="Banco" text="PagSeguro"/>
              <Box display="flex" gridGap="48px">
                <TextPix title="Agência" text="0001"/>
                <TextPix title="Conta" text="31401653-6"/>
              </Box>
            </GridItem>

            <GridItem marginBottom={isMobileMod && "24px"}>
              <ChakraImage
                alt="QR code para apoiador"
                position="relative"
                top="-5px"
                width="250px"
                height="250px"
                objectFit="contain"
                boxShadow="0 1.6px 16px rgba(100, 96, 103, 0.16)"
                src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/bd_qrcode.png"
              />
              <RoundedButton 
                fontSize="15px"
                fontWeight="700"
                backgroundColor="#FF8484"
                paddingX="30px"
                width="100%"
                gridGap="6px"
                onClick={onCopy}
                opacity={hasCopied && "0.8"}
                marginTop="32px"
              >
                <CopySolidIcon alt="copiar chave PIX" width="22px" height="22px" fill="#FFF"/>
                  {hasCopied ? "Copiada chave PIX" :"Copiar chave PIX"}
              </RoundedButton>
            </GridItem>

            <GridItem display={isMobileMod && "none"}>
              <BodyText letterSpacing="0.2px" fontSize="16px" color="#FF8484" fontWeight="500" marginBottom="24px">Siga o passo a passo</BodyText>
              <StepText index="1" text=" Abra o app do seu banco;"/>
              <StepText index="2" text=" Escolha a opção de pagamento com PIX;"/>
              <StepText index="3" text=" Escaneie o QR Code ou digite a chave ao lado;"/>
              <StepText index="❤" text=" Faça sua doação!"/>
            </GridItem>
          </Grid>

          <BodyText
            fontSize="16px"
            letterSpacing="0.2px"
            textAlign="center"
            margin="32px 0 !important"
          >
            💰 Gostaria de apoiar a BD institucionalmente?
            <Link
              dash={false}
              fontFamily="ubuntu"
              textDecoration="none"
              fontWeight="500"
              fontSize="16px"
              letterSpacing="0.2px"
              color="#42B0FF"
              href="/contato"
            > Entre em contato conosco.
            </Link>
          </BodyText>
        </Box>
      </VStack>
    </VStack>
  );
}

function GoogleCloud () {
  const [baseQuery] = useMediaQuery("(max-width: 1090px)")

  return (
    <Stack
      width="100%"
      maxWidth="1264px"
      height={baseQuery ? "100%" : {base: "100%" , lg: "0"}}
      alignItems="center"
      paddingX={{base: "0" , lg: "30px", xl: "0"}}
      order={baseQuery ? 1 : {base: 1 , lg: 0}}
    >
      <Stack
        width="100%"
        alignItems={baseQuery ? "center" : {base:"center", lg:"flex-end"}}
        marginBottom={{base:"95px", lg:"0"}}
      >
        <ChakraImage
          alt="google cloud"
          src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/2022/GC_CustomerAwardWinner_SocialImpact+1.png"
          width="171px"
          height="245px"
          loading="eager"
          priority
        />
      </Stack>
    </Stack>
  )
}

export default function Home({
  pages,
  popularDatalakeDatasets,
  popularTags,
  themes,
}) {
  return (
    <MainPageTemplate id="home" backgroundColor="#FFFFFF" pages={pages}>
      <VStack>
        <GoogleCloud/>
        <Hero
          popularDatalakeDatasets={popularDatalakeDatasets}
          popularTags={popularTags}
          themes={themes}
        />
      </VStack>
      <BePartner />
      <Products />
      <Support pages={pages} />
      <link href="/vendor/terminal.css" rel="stylesheet" />
    </MainPageTemplate>
  );
}