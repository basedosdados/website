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
import { ControlledInput } from "../components/atoms/ControlledInput";
import Link from "../components/atoms/Link";
import { ShadowBox } from "../components/atoms/ShadowBox";
import Button from "../components/atoms/Button";
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
import PayPalButton from '../components/atoms/PayPalButton';

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
  const [mediumQuery] = useMediaQuery("(max-width: 1366px)")

  function openSearchLink() {
    triggerGAEvent("search", search)
    triggerGAEvent("search_home", search)
    router.push(`/search?q=${search}`);
  }

  return (
    <VStack
      alignItems="center"
      width="100%"
      marginTop="50px"
      zIndex="10"
      position="relative"
    >
      <VStack
        position="relative"
        width="100%"
        maxWidth="1440px"
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
            marginTop={{
              base: "64px",
              lg: mediumQuery ? "16px" : "80px"
            }}
          >
            {locale === 'en' ? (
              <DBLogoImage 
                widthImage={{base: "160px", lg: "200px"}}
                heightImage={{base: "75px", lg: "94px"}}
                marginBottom="24px"
              />
            ) : (
              <BDLogoImage 
                widthImage={{base: "160px", lg: "200px"}}
                heightImage={{base: "75px", lg: "94px"}}
                marginBottom="24px"
              />
            )}
            <VStack
              maxWidth="650px"
              width={{base: "100vw", lg: "100%"}}
              paddingX={{base: "24px", lg: "0"}}
              spacing={4}
              alignItems="flex-start"
              flex="3"
            >
              <ControlledInput
                value={search}
                placeholder={isMobileMod() ? t('search_placeholder_mobile') : t('search_placeholder')}
                onChange={setSearch}
                onEnterPress={openSearchLink}
                inputStyle={{
                  "aria-label": "Search",
                  id: "searchDatabases",
                }}
                rightIcon={
                  (search ?
                    <Link
                      href={`/search?q=${search}`}
                      onClick={(e) => {
                        e.preventDefault();
                        openSearchLink();
                      }}
                    >
                      <ArrowIcon
                        alt=""
                        width={{base: "18px", lg: "28px"}}
                        height={{base: "18px", lg: "28px"}}
                        fill="#252A32"
                        marginRight={{base: "10px", lg: "20px"}}
                        cursor="pointer"
                      />
                    </Link>
                    :
                    <SearchIcon
                      alt="pesquisar"
                      width={{base: "18px", lg: "28px"}}
                      height={{base: "18px", lg: "28px"}}
                      fill="#252A32"
                      marginRight={{base: "10px", lg: "20px"}}
                    />
                  )
                }
              />
            </VStack>
          </VStack>

          <VStack
            margin="0 !important"
            paddingTop={{base: "80px", lg: "120px"}}
            width="100%"
            spacing="32px"
            position="relative"
            id="theme"
          >
            <Text
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="20px"
              lineHeight="30px"
              color="#71757A"
              minHeight="30px"
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
  const { locale } = useRouter();
  
  return (
    <VStack
      width="100%"
      maxWidth="1440px"
      padding="0 24px"
      margin="0 auto"
    >
      <VStack spacing={0} width="100%">
        <Text
          display={{base: "block", md:"flex"}}
          flexDirection="column"
          position="relative"
          zIndex="1"
          width="100%"
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="50px"
          lineHeight="60px"
          color="#252A32"
          textAlign="center"
          margin="104px 0 112px"
        >
          {t('products.facilitation_text')}
          <Text as="span">
            {t('products.analysis_distance')}
            <Text as="span" color="#2B8C4D">{t('products.good_question')}</Text>.
          </Text>
        </Text>

        <VStack spacing={{base: "80px", lg: "112px"}} width="100%">
          <HStack
            width="100%"
            flexDirection={{base: "column", lg: "row"}}
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={0}
            gap={{base: "40px", lg: "160px"}}
          >
            <Stack
              maxWidth={{base: "100%", lg: "490px"}}
              spacing={0}
            >
              <Text
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="14px"
                lineHeight="20px"
                color="#71757A"
                paddingBottom="10px"
              >
                {t('products.filters')}
              </Text>

              <Text
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="24px"
                lineHeight="36px"
                color="#252A32"
                paddingBottom="18px"
              >
                {t('products.search_as_you_want')}
              </Text>

              <Text
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="18px"
                lineHeight="26px"
                color="#464A51"
                paddingBottom="24px"
              >
                {t('products.search_description')}
              </Text>

              <Link
                width="fit-content"
                href={"/search"}
                fontSize="18px"
                lineHeight="26px"
                fontWeight="400"
                paddingBottom="2px"
                borderBottom="1px solid #0068C5"
                color="#0068C5"
                _hover={{
                  color: "#0057A4",
                  borderColor: "#0057A4"
                }}
              >
                {t('products.start_search')}
              </Link>
            </Stack>

            <Stack>
              <ProductsFiltersImage
                widthImage={{base: "100%", lg: "625px"}}
                heightImage={{base: "100%", lg: "300px"}}
              />
            </Stack>
          </HStack>

          <HStack
            width="100%"
            flexDirection={{base: "column", lg: "row"}}
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={0}
            gap={{base: "40px", lg: "160px"}}
          >
            <Stack 
              order={{base: 0, lg: 1}}
              maxWidth={{base: "100%", lg: "490px"}}
              spacing={0}
            >
              <Text
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="14px"
                lineHeight="20px"
                color="#71757A"
                paddingBottom="10px"
              >
                {t('products.processed_tables')}
              </Text>

              <Text
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="24px"
                lineHeight="36px"
                color="#252A32"
                paddingBottom="18px"
              >
                {t('products.access_quality_data')}
              </Text>

              <Text
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="18px"
                lineHeight="26px"
                color="#464A51"
                paddingBottom="24px"
              >
                {t('products.processed_tables_description')}
              </Text>

              <Link
                width="fit-content"
                href={"/search?contains=tables"}
                fontSize="18px"
                lineHeight="26px"
                fontWeight="400"
                paddingBottom="2px"
                borderBottom="1px solid #0068C5"
                color="#0068C5"
                _hover={{
                  color: "#0057A4",
                  borderColor: "#0057A4"
                }}
              >
                {t('products.view_available_data')}
              </Link>
            </Stack>

            <Stack order={{base: 1, lg: 0}}>
              <ProcessedDataImage
                widthImage={{base: "100%", lg: "625px"}}
                heightImage={{base: "100%", lg: "300px"}}
              />
            </Stack>
          </HStack>

          <HStack
            width="100%"
            flexDirection={{base: "column", lg: "row"}}
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={0}
            gap={{base: "40px", lg: "160px"}}
          >
            <Stack
              maxWidth={{base: "100%", lg: "490px"}}
              spacing={0}
            >
              <Text
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="14px"
                lineHeight="20px"
                color="#71757A"
                paddingBottom="10px"
              >
                {t('products.packages')}
              </Text>

              <Text
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="24px"
                lineHeight="36px"
                color="#252A32"
                paddingBottom="18px"
              >
                {t('products.explore_in_your_favorite_language')}
              </Text>

              <Text
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="18px"
                lineHeight="26px"
                color="#464A51"
                paddingBottom="24px"
              >
                {t('products.packages_description')}
              </Text>

              <Link
                width="fit-content"
                href={
                  locale === "en" ? "https://basedosdados.github.io/sdk/en" :
                  locale === "es" ? "https://basedosdados.github.io/sdk/es" :
                  "https://basedosdados.github.io/sdk"
                }
                fontSize="18px"
                lineHeight="26px"
                fontWeight="400"
                paddingBottom="2px"
                borderBottom="1px solid #0068C5"
                color="#0068C5"
                _hover={{
                  color: "#0057A4",
                  borderColor: "#0057A4"
                }}
              >
                {t('products.learn_how_to_access')}
              </Link>
            </Stack>

            <Stack
              maxWidth={{base: "100%", lg: "550px"}}
              minWidth={{base: "100%", lg: "550px"}}
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
      <Text
        fontFamily="Roboto"
        fontWeight="500"
        fontSize="18px"
        lineHeight="28px"
        color="#252A32"
        textAlign="justify"
      >
        {title}
      </Text>
      <Text
        fontFamily="Roboto"
        fontWeight="400"
        fontSize="18px"
        lineHeight="28px"
        color="#464A51"
        textAlign="justify"
        marginBottom="10px"
      >
        {text}
      </Text>
    </Box>
  )
}

export function StepText ({index, text}) {
  return (
    <Box marginBottom="20px !important">
      <Text
        display="flex"
        gap="8px"
        fontFamily="Roboto"
        fontWeight="400"
        fontSize="18px"
        lineHeight="28px"
        color="#464A51"
      >
        <Text
          as="span"
          color="#252A32"
          fontWeight="500"
          width="12px"
        >
          {index}
        </Text>
        {text}
      </Text>
    </Box>
  )
}

function Support() {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const { hasCopied, onCopy } = useClipboard("42494318000116");

  return (
    <VStack
      spacing={0}
      width="100%"
      paddingX="24px"
      margin="auto"
    >
      <VStack id="support" position="relative" width="100%" spacing={0}>
        <Text
          display={{base: "block", md:"flex"}}
          flexDirection="column"
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="50px"
          lineHeight="60px"
          color="#252A32"
          position="relative"
          zIndex="1"
          width="100%"
          textAlign="center"
          margin="104px 0px 40px"
        >
          <Text as="span">{t('support.existence_through_effort')}</Text>
          <Text as="span">{t('support.those_who_believe_in_quality_open_data')}</Text>
        </Text>

        {locale === 'pt' && (
          <>
            <Text
              position="relative"
              zIndex="1"
              textAlign="center"
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="24px"
              lineHeight="36px"
              color="#464A51"
              paddingBottom="40px"
            >
              {t('support.support_us_too')}
            </Text>

            <Stack
              width="100%"
              paddingBottom="40px"
              justifyContent="center"
              alignItems="center"
              direction={{ base: "column", lg: "row" }}
              gap="40px"
              spacing={0}
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
              >
                <Text
                  textAlign="center"
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#464A51"
                  padding="10px 0 24px"
                >
                  {t('support.tight_pocket')} <br/> {t('support.enthusiast_description')}
                </Text>
                <Link
                  target="_blank"
                  href="https://apoia.se/support/basedosdados/new/15"
                >
                  <Button
                    backgroundColor="#0D99FC"
                    _hover={{
                      backgroundColor: "#0B86DE"
                    }}
                    width="200px"
                    justifyContent="center"
                    height="54px"
                  >
                    <Text
                      fontFamily="Roboto"
                      fontWeight="700"
                      fontSize="16px"
                      lineHeight="18px"
                      color="#FFFFFF"
                    >
                      R$ <Text as="span" fontSize="24px" lineHeight="28px">15</Text>/ {t('support.month')}
                    </Text>
                  </Button>
                </Link>
              </ShadowBox>

              <ShadowBox
                width={{base: "266px", lg: "320px"}}
                height={{base: "400", lg: "428px"}}
                image={
                  <DatabaseImage 
                    widthImage="100%"
                    heightImage="100%"
                    backgroundColor="#454955"
                  />
                }
                title={t('support.databaser')}
              >
                <Text
                  display="flex"
                  flexDirection="column"
                  textAlign="center"
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#464A51"
                  padding="10px 0 24px"
                >
                  <Text as="span" fontWeight="500">{t('support.donate_1_real_per_day')}</Text>
                  <Text as="span">{t('support.to_make_databasers_happy')}</Text>
                </Text>
                <Link
                  target="_blank"
                  href="https://apoia.se/support/basedosdados/new/30"
                >
                  <Button
                    backgroundColor="#0D99FC"
                    _hover={{
                      backgroundColor: "#0B86DE"
                    }}
                    width="200px"
                    justifyContent="center"
                    height="54px"
                  >
                    <Text
                      fontFamily="Roboto"
                      fontWeight="700"
                      fontSize="16px"
                      lineHeight="18px"
                      color="#FFFFFF"
                    >
                      R$ <Text as="span" fontSize="24px" lineHeight="28px">30</Text>/ {t('support.month')}
                    </Text>
                  </Button>
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
              >
                <Text
                  textAlign="center"
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#464A51"
                  padding="10px 0 24px"
                >
                  {t('support.master_of_data_description')}
                </Text>
                <Link
                  target="_blank"
                  href="https://apoia.se/support/basedosdados/new/50"
                >
                  <Button
                    backgroundColor="#0D99FC"
                    _hover={{
                      backgroundColor: "#0B86DE"
                    }}
                    width="200px"
                    justifyContent="center"
                    height="54px"
                  >
                    R$ <Text as="span" fontSize="24px" lineHeight="28px">50</Text>/ {t('support.month')}
                  </Button>
                </Link>
              </ShadowBox>
            </Stack>

            <Box padding="0px">
              <Text
                width="100%"
                textAlign="center"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="18px"
                lineHeight="28px"
                color="#71757A"
                paddingBottom="32px"
              >
                {t('support.donate_any_amount_via_pix')}
              </Text>

              <Grid
                templateColumns={{base: "repeat(1, 3fr)", lg: "repeat(3, 1fr)"}}
                gap={{base: "40px", lg: "0"}}
                justifyItems="center"
                width="100%"
              >
                <GridItem
                  paddingTop={{base: "32px", lg: "0"}}
                  justifyContent="center"
                  alignItems="flex-start"
                >
                  <TextPix title={t('support.company_name')} text="Instituto Base dos Dados"/>
                  <TextPix title={t('support.cnpj')} text="42494318/0001-16"/>
                  <TextPix title={t('support.bank')} text="PagSeguro"/>
                  <Box display="flex" gap="48px">
                    <TextPix title={t('support.agency')} text="0001"/>
                    <TextPix title={t('support.account')} text="31401653-6"/>
                  </Box>
                </GridItem>

                <GridItem>
                  <ChakraImage
                    alt="QR code para apoiador"
                    position="relative"
                    top="-5px"
                    width="286px"
                    height="286px"
                    objectFit="contain"
                    boxShadow="0 1.6px 16px rgba(100, 96, 103, 0.16)"
                    src="https://storage.googleapis.com/basedosdados-website/images/bd_qrcode.png"
                  />
                  <Button 
                    fontSize="20px"
                    lineHeight="30px"
                    backgroundColor="#0D99FC"
                    _hover={{
                      backgroundColor: "#0B89E2"
                    }}
                    paddingX="30px"
                    width="100%"
                    height="54px"
                    gap="6px"
                    onClick={onCopy}
                    marginTop="32px"
                    textAlign="center"
                    justifyContent="center"
                  >
                    <CopySolidIcon alt="copiar chave PIX" width="22px" height="22px" fill="#FFF"/>
                      {hasCopied ? t('support.pix_key_copied') : t('support.copy_pix_key')}
                  </Button>
                </GridItem>

                <GridItem display={{base: "none", lg: "flex"}} flexDirection="column">
                  <Text
                    fontFamily="Roboto"
                    fontWeight="500"
                    fontSize="18px"
                    lineHeight="28px"
                    color="#252A32"
                    marginBottom="24px"
                  >{t('support.follow_the_steps')}</Text>
                  <StepText index="1" text={t('support.step_1')}/>
                  <StepText index="2" text={t('support.step_2')}/>
                  <StepText index="3" text={t('support.step_3')}/>
                  <StepText index="." text={t('support.step_4')}/>
                </GridItem>
              </Grid>

              <Text
                display="block"
                flexDirection="column"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="16px"
                lineHeight="24px"
                color="#252A32"
                textAlign="center"
                justifyContent="center"
                gap="4px"
                padding="32px 0"
              >
                <Text as="span">💰 {t('support.want_to_institutionally_support_db')}</Text>
                <Link
                  display="default"
                  fontWeight="400"
                  fontSize="16px"
                  lineHeight="24px"
                  color="#0068C5"
                  _hover={{
                    color: "#0057A4"
                  }}
                  href="/contact"
                >
                  {t('support.contact_us')}
                </Link>
              </Text>
            </Box>
          </>
        )}

        {locale !== 'pt' && (
          <>
            <Text
              width="100%"
              textAlign="center"
              fontFamily="Roboto"
              fontSize="20px"
              fontWeight="400"
              lineHeight="32px"
              color="#71757A"
              paddingBottom={{base: "0", lg: "32px"}}
            >
              {t('support.donate_any_amount_via_paypal')}
            </Text>
            <Box marginTop="32px">
              <PayPalButton />
            </Box>
          </>
        )}
      </VStack>
    </VStack>
  );
}

function BDEdu () {
  const { t } = useTranslation('common');
  const closeDate = new Date(2025, 2, 26)
  const currentDate = new Date()

  if(currentDate > closeDate) return null
  return (
    <Stack
      id="edu" 
      width="100%"
      paddingX="24px"
      maxWidth="1440px"
      margin="104px auto"
      alignItems="center"
    >
      <BDLogoEduImage
        widthImage="225px"
        heightImage="54px"
        marginBottom="24px"
      />
      <Text
        display={{base: "block", md:"flex"}}
        flexDirection="column"
        fontFamily="Roboto"
        fontWeight="500"
        fontSize="50px"
        lineHeight="60px"
        color="#252A32"
        textAlign="center"
        paddingBottom="24px"
      >
        <Text as="span">{t('edu.learn_from_the_reference')}</Text>
        <Text as="span">{t('edu.in_making_public_data_available')}</Text>
      </Text>
      <Text
        fontFamily="Roboto"
        fontWeight="500"
        fontSize="24px"
        lineHeight="36px"
        color="#71757A"
        textAlign="center"
        paddingBottom="24px"
      >
        {t('edu.with_our_course_you_can_go_further')}
      </Text>
      <Button
        fontFamily="Roboto"
        fontWeight="500"
        fontSize="20px"
        lineHeight="30px"
        height="56px"
        padding="10px 16px"
        backgroundColor="#0D99FC"
        _hover={{
          backgroundColor: "#0B89E2"
        }}
      >
        <a href={`https://info.basedosdados.org/bd-edu-sql`} target="_blank">
          {t('edu.take_advantage_of_the_promotional_price')}
        </a>
      </Button>
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
