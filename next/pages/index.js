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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { isMobileMod } from "../hooks/useCheckMobile.hook";
import BodyText from "../components/atoms/BodyText";
import { ControlledInput } from "../components/atoms/ControlledInput";
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

import { getAllThemes } from "./api/themes/getAllThemes";
import { getAllDatasets } from "./api/themes/getAllDatasets";

import SearchIcon from "../public/img/icons/searchIcon";
import ArrowIcon from "../public/img/icons/arrowIcon";
import { CopySolidIcon } from "../public/img/icons/copyIcon";
import BDLogoImage from "../public/img/logos/bd_logo";
import DBLogoImage from "../public/img/logos/db_logo";
import BDLogoEduImage from "../public/img/logos/bd_logo_edu";
import DBLogoEduImage from "../public/img/logos/db_logo_edu";
import EnthusiasticImage from "../public/img/enthusiasticImage";
import DatabaseImage from "../public/img/databaseImage";
import MasterOfDatabaseImage from "../public/img/masterOfDatabaseImage";
import ProductsFiltersImage from "../public/img/productsFiltersImage";
import ProcessedDataImage from "../public/img/processedDataImage";

export async function getStaticProps({ locale }) {
  const themes = await getAllThemes(locale);
  const defaultDataset = await getAllDatasets(locale);

  let dataThemeCatalog = {
    themes: themes,
    defaultDataset: defaultDataset
  };

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu', 'dataset'])),
      dataThemeCatalog
    },
    revalidate: 30
  };
}

function Hero({ dataThemeCatalog, locale }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([])
  const [mediumQuery] = useMediaQuery("(max-width: 1366px)")

  function openSearchLink() {
    triggerGAEvent("search", search)
    triggerGAEvent("search_home", search)
    router.push(`/dataset?q=${search}`);
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
            {locale === 'en' ? (
              <DBLogoImage 
                widthImage={isMobileMod() ? "160px" : "200px"}
                heightImage={isMobileMod() ? "75px" : "94px"}
                marginBottom="24px"
              />
            ) : (
              <BDLogoImage 
                widthImage={isMobileMod() ? "160px" : "200px"}
                heightImage={isMobileMod() ? "75px" : "94px"}
                marginBottom="24px"
              />
            )}
            <VStack
              maxWidth="650px"
              width={isMobileMod() ? "100vw" : "100%"}
              paddingX={isMobileMod() && "24px"}
              spacing={4}
              alignItems="flex-start"
              flex="3"
            >
              <ControlledInput
                value={search}
                placeholder={isMobileMod() ? t('search_placeholder_mobile') : t('search_placeholder')}
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
                    <Link
                      href={`/dataset?q=${search}`}
                      onClick={(e) => {
                        e.preventDefault();
                        openSearchLink();
                      }}
                    >
                      <ArrowIcon
                        alt=""
                        width={isMobileMod() ? "18px" : "28px"}
                        height={isMobileMod() ? "18px" : "28px"}
                        fill="#252A32"
                        marginRight={isMobileMod() ? "10px" : "20px"}
                        cursor="pointer"
                      />
                    </Link>
                    :
                    <SearchIcon
                      alt="pesquisar"
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
                    {t('popular_terms')}
                  </Text>
                }
                {tags.map((elm, i) => 
                  <ThemeTag slug={elm} key={i} locale={locale}/>
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
              {t('search_by_theme')}
            </Text>
            <ThemeCatalog data={dataThemeCatalog} locale={locale}/>
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
}

function Products() {
  const { t } = useTranslation('common');

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
          {t('products.facilitation_text')}
          {!isMobileMod() && <br/>}
          {t('products.analysis_distance')}
          <span style={{color:"#2B8C4D"}}>{t('products.good_question')}</span>.
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
                {t('products.filters')}
              </Text>

              <SectionTitle marginTop="0 !important">{t('products.search_as_you_want')}</SectionTitle>
              <SectionText fontSize="16px">
                {t('products.search_description')}
              </SectionText>

              <SectionLink
                marginTop="24px !important"
                href={"/dataset"}
              >
                {t('products.start_search')}
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
                  {t('products.processed_tables')}
                </Text>
              </HStack>
              
              <SectionTitle marginTop="0 !important">{t('products.access_quality_data')}</SectionTitle>
              <SectionText fontSize="16px">
                {t('products.processed_tables_description')}
              </SectionText>

              <SectionLink
                marginTop="24px !important"
                href={"/dataset?contains=tables"}
              >
                {t('products.view_available_data')}
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
                {t('products.packages')}
              </Text>

              <SectionTitle marginTop="0 !important">{t('products.explore_in_your_favorite_language')}</SectionTitle>
              <SectionText fontSize="16px">
                {t('products.packages_description')}
              </SectionText>

              <SectionLink
                marginTop="24px !important"
                href={"https://basedosdados.github.io/mais/"}
              >
                {t('products.learn_how_to_access')}
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
  const { t } = useTranslation('common');
  const { hasCopied, onCopy } = useClipboard("42494318000116")

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
          {t('support.existence_through_effort')} {!isMobileMod() && <br/>} {t('support.those_who_believe_in_quality_open_data')}
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
        >
          {t('support.support_us_too')}
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
            title={t('support.enthusiast')}
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
              {t('support.tight_pocket')} <br/> {t('support.enthusiast_description')}
            </BodyText>
            <Link
              _hover={{ opacity:"none" }}
              margin="0 !important"
              target="_blank"
              href="https://apoia.se/support/basedosdados/new/15"
            >
              <RoundedButton backgroundColor="#FF8484" width="200px">
                R$ <p style={{fontSize:"24px", margin:"0 5px"}}>15</p>/ {t('support.month')}
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
            title={t('support.databaser')}
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
              <b style={{fontWeight:"500"}}>{t('support.donate_1_real_per_day')}</b>
              <span>{t('support.to_make_databasers_happy')}</span>
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
                R$ <p style={{fontSize:"24px", margin:"0 5px"}}>30</p>/ {t('support.month')}
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
            title={t('support.master_of_data')}
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
              {t('support.master_of_data_description')}
            </BodyText>
            <Link
              _hover={{ opacity:"none" }}
              marginTop="0 !important"
              target="_blank"
              href="https://apoia.se/support/basedosdados/new/50"
            >
              <RoundedButton backgroundColor="#FF8484" width="200px">
                R$ <p style={{fontSize:"24px", margin:"0 5px"}}>50</p>/ {t('support.month')}
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
            {t('support.donate_any_amount_via_pix')}
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
              <TextPix title={t('support.company_name')} text="Instituto Base dos Dados"/>
              <TextPix title={t('support.cnpj')} text="42494318/0001-16"/>
              <TextPix title={t('support.bank')} text="PagSeguro"/>
              <Box display="flex" gridGap="48px">
                <TextPix title={t('support.agency')} text="0001"/>
                <TextPix title={t('support.account')} text="31401653-6"/>
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
                  {hasCopied ? t('support.pix_key_copied') : t('support.copy_pix_key')}
              </RoundedButton>
            </GridItem>

            <GridItem display={isMobileMod() && "none"}>
              <BodyText letterSpacing="0.2px" fontSize="16px" color="#FF8484" fontWeight="500" marginBottom="24px">{t('support.follow_the_steps')}</BodyText>
              <StepText index="1" text={t('support.step_1')}/>
              <StepText index="2" text={t('support.step_2')}/>
              <StepText index="3" text={t('support.step_3')}/>
              <StepText index="❤" text={t('support.step_4')}/>
            </GridItem>
          </Grid>

          <BodyText
            fontSize="16px"
            letterSpacing="0.2px"
            textAlign="center"
            margin="32px 0 !important"
          >
            💰 {t('support.want_to_institutionally_support_db')}
            <Link
              display="inline"
              fontFamily="ubuntu"
              textDecoration="none"
              fontWeight="500"
              fontSize="16px"
              letterSpacing="0.2px"
              color="#42B0FF"
              href="/contact"
            >
              {t('support.contact_us')}
            </Link>
          </BodyText>
        </Box>
      </VStack>
    </VStack>
  );
}

function BDEdu () {
  const { t } = useTranslation('common');
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
      >
        {t('edu.learn_from_the_reference')}
        {!isMobileMod() &&<br/>}
        {t('edu.in_making_public_data_available')}
      </Display>
      <BodyText
        textAlign="center"
        margin="0 0 24px !important"
      >
        {t('edu.with_our_course_you_can_go_further')}
      </BodyText>
      <RoundedButton
        margin="0 !important"
        backgroundColor="#8262D1"
      >
        <a href={`https://info.basedosdados.org/bd-edu-sql`} target="_blank">
          {t('edu.take_advantage_of_the_promotional_price')}
        </a>
      </RoundedButton>
    </Stack>
  )
}

export default function Home({ dataThemeCatalog }) {
  const router = useRouter();
  const { locale } = router;

  return (
    <MainPageTemplate id="home" backgroundColor="#FFFFFF">
      <Hero dataThemeCatalog={dataThemeCatalog} locale={locale}/>
      {/* <BDEdu /> */}
      <BePartner />
      <Products />
      <Support />
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
