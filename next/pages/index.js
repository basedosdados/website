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
import { useState } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import { isMobileMod } from "../hooks/useCheckMobile.hook";
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
import { triggerGAEvent } from "../utils";

import {
  getAllThemes,
  getAllDatasets
} from "./api/themes/index"

import SearchIcon from "../public/img/icons/searchIcon";
import ArrowIcon from "../public/img/icons/arrowIcon";
import { CopySolidIcon } from "../public/img/icons/copyIcon";
import BDLogoImage from "../public/img/logos/bd_logo";
import EnthusiasticImage from "../public/img/enthusiasticImage";
import DatabaseImage from "../public/img/databaseImage";
import MasterOfDatabaseImage from "../public/img/masterOfDatabaseImage";
import ProductsFiltersImage from "../public/img/productsFiltersImage";
import ProcessedDataImage from "../public/img/processedDataImage";
import BDLogoEduImage from "../public/img/logos/bd_logo_edu";
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({locale}) {
  const themes = await getAllThemes()
  const defaultDataset = await getAllDatasets()

  let dataThemeCatalog = {
    themes: themes,
    defaultDataset: defaultDataset
  }

  return {
    props: {
      dataThemeCatalog,
      ...(await serverSideTranslations(locale, [ 'index', ])),
    },
    revalidate: 30
  }
}

function Hero({ dataThemeCatalog }) {
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([])
  const [mediumQuery] = useMediaQuery("(max-width: 1366px)")
  const { t } = useTranslation('index')

  function openSearchLink() {
    triggerGAEvent("search", search)
    triggerGAEvent("search_home", search)
    return window.open(`/dataset?q=${search}`, "_self");
  }

  return (
    <VStack
      alignItems="center"
      width="100%"
      padding="0px 10%"
      marginTop="50px"
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
              isMobileMod() ? "64px" : 
              mediumQuery ? "16px" : "80px"
            }
          >
            <BDLogoImage 
              widthImage={isMobileMod() ? "160px" : "200px"}
              heightImage={isMobileMod() ? "75px" : "94px"}
              marginBottom="24px"
            />
            <VStack
              maxWidth="650px"
              width={isMobileMod() ? "100vw" : "100%"}
              paddingX={isMobileMod() && "24px"}
              spacing={4}
              alignItems="flex-start"
              flex="3"
            >
              <ControlledInput
                value={search}                placeholder={isMobileMod() ? t("Find the data") : t("Find the data you need")}
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
                  padding: isMobileMod() ? "24px 48px 24px 20px " : "24px 64px 24px 32px",
                  height: isMobileMod() ? "50px" :"80px",
                  borderRadius: isMobileMod() ? "18px" : "25px",
                  backgroundColor: "#ffffff",
                  fontSize: isMobileMod() ? "18px" : "22px",
                  letterSpacing: isMobileMod()? "0.1px" : "0",
                  border: "0px",
                  boxShadow: "0 1px 8px 1px rgba(64, 60, 67, 0.16) !important",
                  _placeholder:isMobileMod() ? {color:"#6F6F6F !important"} : {color: "#A3A3A3"}
                }}
                rightIcon={
                  (search ?
                    <ArrowIcon
                      alt=""
                      width={isMobileMod() ? "18px" : "28px"}
                      height={isMobileMod() ? "18px" : "28px"}
                      fill="#252A32"
                      marginRight={isMobileMod() ? "10px" : "20px"}
                      cursor="pointer"
                      onClick={openSearchLink}
                    />
                    :
                    <SearchIcon
                      alt={t("search")}
                      width={isMobileMod() ? "18px" : "28px"}
                      height={isMobileMod() ? "18px" : "28px"}
                      fill="#252A32"
                      marginRight={isMobileMod() ? "10px" : "25px"}
                    />
                  )
                }
              />
              <HStack display={tags.length === 0 ? "none" : "flex"} paddingLeft={isMobileMod() ? "20px" : "32px"}>
                {!isMobileMod() &&
                  <Text 
                    fontFamily="Ubuntu"
                    fontSize="13px"
                    fontWeight="300"
                    letterSpacing="0.4px"
                    color="#575757"
                  >
                    {t("Popular terms:")}
                  </Text>
                }
                {tags.map((elm, i) => 
                  <ThemeTag name={elm} key={i}/>
                )}
              </HStack>
            </VStack>
          </VStack>

          <VStack
            margin="0 !important"
            paddingTop={isMobileMod() ? "80px" : "120px"}
            width="100%"
            position="relative"
            id="theme"
          >
            <Text
              fontSize={isMobileMod() ? "16px" : "22px"}
              letterSpacing={isMobileMod() ? "0.1px" : "0"}
              fontFamily="Ubuntu"
              fontWeight="300"
              minHeight="30px"
              marginBottom={isMobileMod() ? "8px" : "24px"}
              color="#575757"
              cursor="pointer"
              onClick={() => window.open("#theme", "_self")}
            >
              {t("Search by theme")}
            </Text>
            <ThemeCatalog data={dataThemeCatalog}/>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
}

function Products() {
  const { t } = useTranslation('index')
  return (
    <VStack
      width={{ base: "90%", lg: "85%" }}
      maxWidth="1264px"
      margin="0 auto 36px"
    >
      <VStack position="relative" width="95%">
        <Display
          fontSize={isMobileMod() ? "32px" : "38px"}
          letterSpacing={isMobileMod() ? "0.2px" : "-0.2px"}
          lineHeight={isMobileMod() ? "40px" : "64px"}
          position="relative"
          zIndex="1"
          width="100%"
          textAlign="center"
          margin="80px 0px"
        >
          Facilitamos o trabalho para que a distância {!isMobileMod() && <br/>} {/*TODO: i18n */}
          entre você e sua análise seja <span style={{color:"#2B8C4D"}}>apenas uma boa pergunta</span>.
        </Display>

        <VStack spacing={isMobileMod() ? 8 : 120}>
          <HStack
            flexDirection={isMobileMod() && "column"}
            justifyContent="center"
            gridGap={isMobileMod() ? "0" : "160px"}
          >
            <Stack maxWidth={isMobileMod() ? "300px" : "430px"}>
              <Text
                fontFamily="Ubuntu"
                fontSize="14px"
                fontWeight="300"
                color="#6F6F6F"
                letterSpacing="0.5px"
                lineHeight="24px"
              >
                {t("FILTERS")}
              </Text>

              <SectionTitle marginTop="0 !important">{t("Search data as you wish")}</SectionTitle>
              <SectionText fontSize="16px">
                {t("There are several filters to help you find the data you need.....")}
              </SectionText>

              <SectionLink
                marginTop="24px !important"
                href={"/dataset"}
              >
                {t("Start your search")}
              </SectionLink>
            </Stack>

            <Stack>
              <ProductsFiltersImage
                widthImage={isMobileMod() ? "300px" : "550px"}
                heightImage={isMobileMod() && "250px"}
              />
            </Stack>
          </HStack>

          <HStack
            flexDirection={isMobileMod() && "column"}
            justifyContent="center"
            gridGap={isMobileMod() ? "0" : "160px"}
          >
            <Stack 
              order={isMobileMod() ? 0 : 1}
              maxWidth={isMobileMod() ? "300px" : "430px"}
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
                  {t("PROCESSED TABLES")}
                </Text>
              </HStack>
              
              <SectionTitle marginTop="0 !important">{t("Access quality data")}</SectionTitle>
              <SectionText fontSize="16px">
                {t("With the processed tables from our public datalake.....")}
              </SectionText>

              <SectionLink
                marginTop="24px !important"
                href={"/dataset?contains=tables"}
              >
                {t("See available databases")}
              </SectionLink>
            </Stack>

            <Stack order={isMobileMod() ? 1 : 0}>
              <ProcessedDataImage
                widthImage={isMobileMod() ? "300px" : "550px"}
                heightImage={isMobileMod() && "250px"}
              />
            </Stack>
          </HStack>

          <HStack
            flexDirection={isMobileMod() && "column"}
            justifyContent="center"
            gridGap={isMobileMod() ? "100px" : "160px"}
            spacing={0}
          >
            <Stack maxWidth={isMobileMod() ? "300px" : "430px"}>
              <Text
                fontFamily="Ubuntu"
                fontSize="14px"
                fontWeight="300"
                color="#6F6F6F"
                letterSpacing="0.5px"
                lineHeight="24px"
              >
                {t("PACKAGES")}
              </Text>

              <SectionTitle marginTop="0 !important">{t("Explore in your favorite language")}</SectionTitle>
              <SectionText fontSize="16px">
                {t("We have developed packages for accessing processed data in Python.....")}
              </SectionText>

              <SectionLink
                marginTop="24px !important"
                href={"https://basedosdados.github.io/mais/"}
              >
                {t("Learn how to access")}
              </SectionLink>
            </Stack>

            <Stack
              maxWidth={isMobileMod() ? "320px" : "550px"}
              minWidth={isMobileMod() ? "320px" : "550px"}
              height="100%"
            >
              <Box
                borderRadius="16px"
                backgroundColor="#252A32"
                width="100%"
                height="100%"
              >
                <Box display="flex" flexDirection="row" position="relative" padding="6px 12px" alignItems="center">
                  <Box display="flex" flexDirection="row" gap="8px" position="absolute">
                    <Box width="14px" height="14px" borderRadius="50%" backgroundColor="#d9515c"/>
                    <Box width="14px" height="14px" borderRadius="50%" backgroundColor="#f5c036"/>
                    <Box width="14px" height="14px" borderRadius="50%" backgroundColor="#3dc93f"/>
                  </Box>
                  <Text fontSize="18px" width="100%" textAlign="center" color="#a2a2a2">bash</Text>
                </Box>
                <Box
                  display="flex"
                  height="180px"
                >
                  <Text
                    display="flex"
                    flexDirection="row"
                    gap="10px"
                    fontSize="18px"
                    color="#eeeeee"
                    paddingX="36px"
                    marginTop="50px"
                  >
                    <Text as="span" color="#a1a1a1">$</Text> pip install basedosdados
                  </Text>
                </Box>
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
          as="span"
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

function Support() {
  const { hasCopied, onCopy } = useClipboard("42494318000116")
  const { t } = useTranslation('index')

  // TODO: i18n
  return (
    <VStack
      spacing={20}
      width={{ base: "90%", lg: "85%" }}
      margin="auto"
    >
      <VStack id="support" position="relative" width="95%">
        <Display
          letterSpacing={isMobileMod() ? "0.2px" : "-0.4px"}
          position="relative"
          zIndex="1"
          width="100%"
          textAlign="center"
          margin={isMobileMod() ? "80px 0px 24px" : "104px 0px 24px"}
        >
          {t('We exist through the effort of people who')} {!isMobileMod() && <br/>}
          {t('believe in access to quality open data.')}
        </Display>
        <Text
          position="relative"
          zIndex="1"
          color="#6F6F6F"
          fontFamily="Ubuntu"
          fontSize={isMobileMod() ? "16px" : "18px"}
          alignSelf="center"
          letterSpacing={isMobileMod() ? "0.2px" : "0.1px"}
          fontWeight="300"
          margin="0 0 48px !important"
        > {t('Please support Base dos Dados')}
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
            title={t("Enthusiast")}
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
            width={isMobileMod() ? "266px" : "320px"}
            height={isMobileMod() ? "400" : "428px"}
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
              <span>para fazer databasers felizes.</span>
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
            paddingBottom={!isMobileMod() && "32px"}
          >
            Doe qualquer valor via PIX
          </Text>

          <Grid
            templateColumns={isMobileMod() ? "repeat(1, 3fr)" : "repeat(3, 1fr)"}
            gridGap={isMobileMod() && "40px"}
            justifyItems="center"
            width="100%"
          >
            <GridItem
              marginTop={isMobileMod() && "32px !important"}
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

            <GridItem marginBottom={isMobileMod() && "24px"}>
              <ChakraImage
                alt="QR code para apoiador"
                position="relative"
                top="-5px"
                width="250px"
                height="250px"
                objectFit="contain"
                boxShadow="0 1.6px 16px rgba(100, 96, 103, 0.16)"
                src="https://storage.googleapis.com/basedosdados-website/images/bd_qrcode.png"
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

            <GridItem display={isMobileMod() && "none"}>
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

function BDEdu () {
  const closeDate = new Date(2024, 2, 26)
  const currentDate = new Date()

  if(currentDate > closeDate) return null
  return (
    <Stack
      id="edu" 
      width={{ base: "90%", lg: "85%" }}
      maxWidth="1264px"
      margin="104px auto"
      alignItems="center"
    >
      <BDLogoEduImage
        widthImage="225px"
        heightImage="54px"
        marginBottom="24px"
      />
      <Display
        textAlign="center"
        margin="0 0 24px !important"
      > Venha aprender com quem é referência {!isMobileMod() &&<br/>} em disponibilizar dados públicos no Brasil
      </Display>
      <BodyText
        textAlign="center"
        margin="0 0 24px !important"
      >
        {t('With our course, you can go further in your research, profession, or organization.')}
      </BodyText>
      <RoundedButton
        margin="0 !important"
        backgroundColor="#8262D1"
      >
        <a href="https://info.basedosdados.org/bd-edu-sql" target="_blank">
          {t('Take advantage of the promotional price')}
        </a>
      </RoundedButton>
    </Stack>
  )
}

export default function Home({ dataThemeCatalog }) {
  return (
    <MainPageTemplate id="home" backgroundColor="#FFFFFF">
      <Hero dataThemeCatalog={dataThemeCatalog}/>
      {/* <BDEdu /> */}
      <BePartner />
      <Products />
      <Support />
      <link href="/vendor/terminal.css" rel="stylesheet" />
    </MainPageTemplate>
  );
}

/**
 * Next-Logger Setup,
 * a.k.a force dependency injection. 
 * Beware, as it works only with Next.js 12.
 * - https://stackoverflow.com/questions/71422446
 * - https://github.com/sainsburys-tech/next-logger/issues/13
 */
export const config = {
  unstable_includeFiles: [
    // package
    "next-logger",
    // dependencies
    "pino",
    "cosmiconfig",
    "path-type",
    "parse-json",
    "error-ex",
    "is-arrayish",
    "json-parse-even-better-errors",
    "lines-and-columns",
    "@babel/code-frame",
    "@babel/highlight",
    "js-tokens",
    "@babel/helper-validator-identifier",
    "chalk",
    "ansi-styles",
    "color-convert",
    "color-name",
    "supports-color",
    "has-flag",
    "pino-std-serializers",
    "fast-redact",
    "quick-format-unescaped",
    "sonic-boom",
    "atomic-sleep",
    "on-exit-leak-free",
    "thread-stream",
    "safe-stable-stringify",
  ].map(
      (dep) => `node_modules/${dep}/**/*.+(js|json)`
  ),
};