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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { isMobileMod } from "../hooks/useCheckMobile.hook";
import Link from "../components/atoms/Link";
import Display from "../components/atoms/Text/Display";
import TitleText from "../components/atoms/Text/TitleText";
import LabelText from "../components/atoms/Text/LabelText";
import BodyText from "../components/atoms/Text/BodyText";
import { ShadowBox } from "../components/atoms/ShadowBox";
import Button from "../components/atoms/Button";
import { BePartner } from "../components/organisms/BePartner";
import { MainPageTemplate } from "../components/templates/main";

import { CopySolidIcon } from "../public/img/icons/copyIcon";
import BDLogoEduImage from "../public/img/logos/bd_logo_edu";
import EnthusiasticImage from "../public/img/enthusiasticImage";
import DatabaseImage from "../public/img/databaseImage";
import MasterOfDatabaseImage from "../public/img/masterOfDatabaseImage";
import ProductsFiltersImage from "../public/img/productsFiltersImage";
import ProcessedDataImage from "../public/img/processedDataImage";
import PayPalButton from '../components/atoms/PayPalButton';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['home', 'common', 'menu', 'dataset'])),
    },
    revalidate: 30
  };
}

function Hero({ locale }) {
  const { t } = useTranslation('home');

  return (
    <VStack
      alignItems="center"
      width="100%"
      marginTop={isMobileMod() ? "" : "50px"}
      zIndex="10"
      position="relative"
    >
      <VStack
        position="relative"
        width="100%"
        maxWidth="1440px"
        height="100%"
        spacing={0}
        padding="40px 24px 80px"
        alignItems="flex-start"
      >
        <Stack spacing={0}>
          <Text
            as="h1"
            display="flex"
            flexDirection="column"
            width="100%"
          >
            <Display as="span" typography={isMobileMod() ? "small" : "large"}>{t("organized_data")}</Display>
            <Display as="span" typography={isMobileMod() ? "small" : "large"}>{t("reliable_analysis")}</Display>
          </Text>
          <TitleText
            maxWidth="1120px"
            color="#71757A"
            paddingTop="16px"
            typography={isMobileMod() ? "small" : "medium"}
          >
            {t("description_organized_data")}
          </TitleText>
          <Stack
            flexDirection={isMobileMod() ? "column" : "row"}
            gap="16px"
            padding="32px 0"
            spacing={0}
          >
            <Link
              href="/search"
              target="_self"
            >
              <Button
                height="54px"
                width={isMobileMod() ? "100%" : "fit-content"}
                justifyContent={{base: "center", md: "flex-start"}}
              >
                <LabelText typography="x-large" color="currentColor">
                  {t("organized_data_first_button")}
                </LabelText>
              </Button>
            </Link>
            <Link
              href="/services"
              target="_self"
            >
              <Button
                height="54px"
                width={isMobileMod() ? "100%" : "fit-content"}
                justifyContent={{base: "center", md: "flex-start"}}
                isVariant
              >
                <LabelText typography="x-large" color="currentColor">
                  {t("organized_data_second_button")}
                </LabelText>
              </Button>
            </Link>
          </Stack>
        </Stack>

        <Stack
          width="100%"
          padding="40px 0"
          spacing={0}
        >
          <Box
            width="100%"
            height={{base: "100%", md: "780px"}}
            display="flex"
            alignItems="center"
            backgroundColor="#FFFFFF"
            boxShadow="0px 1.6px 16px rgba(100, 96, 103, 0.16)"
            borderRadius="16px"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{ width: '100%', height: 'auto', borderRadius: '16px' }}
              onError={(e) => {
                console.error('Erro ao carregar o vídeo', e);
              }}
            >
              <source src={`https://storage.googleapis.com/basedosdados-website/video/platform-presentation-${locale}.mp4`} type="video/mp4" />
            </video>
          </Box>
        </Stack>
      </VStack>
    </VStack>
  );
}

function Products({ locale }) {
  const { t } = useTranslation('common');
  
  return (
    <VStack
      width="100%"
      maxWidth="1440px"
      padding="0 24px"
      margin="0 auto"
    >
      <VStack spacing={0} width="100%">
        <Display
          display={{base: "block", md:"flex"}}
          typography={isMobileMod() ? "small" : "large"}
          flexDirection="column"
          position="relative"
          zIndex="1"
          width="100%"
          textAlign="center"
          margin="104px 0 112px"
        >
          {t('products.facilitation_text')} {" "}
          <Text as="span">
            {t('products.analysis_distance')} {" "}
            <Text as="span" color="#2B8C4D">
              {t('products.good_question')}
            </Text>.
          </Text>
        </Display>

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
              <BodyText
                typography="small"
                color="#71757A"
                paddingBottom="10px"
              >
                {t('products.filters')}
              </BodyText>

              <TitleText paddingBottom="18px">
                {t('products.search_as_you_want')}
              </TitleText>

              <BodyText
                typography="large"
                color="#464A51"
                paddingBottom="24px"
              >
                {t('products.search_description')}
              </BodyText>

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
              <BodyText
                typography="small"
                color="#71757A"
                paddingBottom="10px"
              >
                {t('products.processed_tables')}
              </BodyText>

              <TitleText paddingBottom="18px">
                {t('products.access_quality_data')}
              </TitleText>

              <BodyText
                typography="large"
                color="#464A51"
                paddingBottom="24px"
              >
                {t('products.processed_tables_description')}
              </BodyText>

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
              <BodyText
                typography="small"
                color="#71757A"
                paddingBottom="10px"
              >
                {t('products.packages')}
              </BodyText>

              <TitleText paddingBottom="18px">
                {t('products.explore_in_your_favorite_language')}
              </TitleText>

              <BodyText
                typography="large"
                color="#464A51"
                paddingBottom="24px"
              >
                {t('products.packages_description')}
              </BodyText>

              <Link
                width="fit-content"
                href={
                  locale === "en" ? "/en/docs/home" :
                  locale === "es" ? "/es/docs/home" :
                  "/docs/home"
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
      <TitleText
        typography="small"
        textAlign="justify"
      >
        {title}
      </TitleText>
      <BodyText
        typography="large"
        color="#464A51"
        textAlign="justify"
        marginBottom="10px"
      >
        {text}
      </BodyText>
    </Box>
  )
}

export function StepText ({index, text}) {
  return (
    <Box marginBottom="20px !important">
      <BodyText
        typography="large"
        display="flex"
        gap="8px"
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
      </BodyText>
    </Box>
  )
}

function Support({ locale }) {
  const { t } = useTranslation('common');
  const { hasCopied, onCopy } = useClipboard("42494318000116");

  return (
    <VStack
      spacing={0}
      width="100%"
      paddingX="24px"
      margin="auto"
    >
      <VStack id="support" position="relative" width="100%" spacing={0}>
        <Display
          typography={isMobileMod() ? "small" : "large"}
          display={{base: "block", md:"flex"}}
          flexDirection="column"
          fontFamily="Roboto"
          position="relative"
          zIndex="1"
          width="100%"
          textAlign="center"
          margin="104px 0px 40px"
        >
          <Text as="span">
            {t('support.existence_through_effort')}
          </Text>
          {" "}
          <Text as="span">
            {t('support.those_who_believe_in_quality_open_data')}
          </Text>
        </Display>

        {locale === 'pt' && (
          <>
            <TitleText
              position="relative"
              zIndex="1"
              textAlign="center"
              color="#464A51"
              paddingBottom="40px"
            >
              {t('support.support_us_too')}
            </TitleText>

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
                <BodyText
                  typography="small"
                  textAlign="center"
                  color="#464A51"
                  padding="10px 0 24px"
                >
                  {t('support.tight_pocket')} <br/> {t('support.enthusiast_description')}
                </BodyText>
                <Link
                  target="_blank"
                  href="https://apoia.se/support/basedosdados/new/15"
                >
                  <Button
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
                <BodyText
                  typography="small"
                  display="flex"
                  flexDirection="column"
                  textAlign="center"
                  color="#464A51"
                  padding="10px 0 24px"
                >
                  <Text as="span" fontWeight="500">{t('support.donate_1_real_per_day')}</Text>
                  <Text as="span">{t('support.to_make_databasers_happy')}</Text>
                </BodyText>
                <Link
                  target="_blank"
                  href="https://apoia.se/support/basedosdados/new/30"
                >
                  <Button
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
                <BodyText
                  typography="small"
                  textAlign="center"
                  color="#464A51"
                  padding="10px 0 24px"
                >
                  {t('support.master_of_data_description')}
                </BodyText>
                <Link
                  target="_blank"
                  href="https://apoia.se/support/basedosdados/new/50"
                >
                  <Button
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
              <LabelText
                typography="large"
                width="100%"
                textAlign="center"
                color="#71757A"
                paddingBottom="32px"
              >
                {t('support.donate_any_amount_via_pix')}
              </LabelText>

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
                  <LabelText
                    typography="large"
                    marginBottom="24px"
                  >{t('support.follow_the_steps')}</LabelText>
                  <StepText index="1" text={t('support.step_1')}/>
                  <StepText index="2" text={t('support.step_2')}/>
                  <StepText index="3" text={t('support.step_3')}/>
                  <StepText index="." text={t('support.step_4')}/>
                </GridItem>
              </Grid>

              <BodyText
                display="block"
                flexDirection="column"
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
              </BodyText>
            </Box>
          </>
        )}

        {locale !== 'pt' && (
          <>
            <LabelText
              typography="x-large"
              width="100%"
              textAlign="center"
              color="#71757A"
              paddingBottom={{base: "0", lg: "32px"}}
            >
              {t('support.donate_any_amount_via_paypal')}
            </LabelText>
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
      <Display
        typography={isMobileMod() ? "small" : "large"}
        display={{base: "block", md:"flex"}}
        flexDirection="column"
        textAlign="center"
        paddingBottom="24px"
      >
        <Text as="span">{t('edu.learn_from_the_reference')}</Text>
        <Text as="span">{t('edu.in_making_public_data_available')}</Text>
      </Display>
      <TitleText
        color="#71757A"
        textAlign="center"
        paddingBottom="24px"
      >
        {t('edu.with_our_course_you_can_go_further')}
      </TitleText>
      <Button
        fontFamily="Roboto"
        fontWeight="500"
        fontSize="20px"
        lineHeight="30px"
        height="56px"
        padding="10px 16px"
      >
        <a href={`https://info.basedosdados.org/bd-edu-cursos`} target="_blank">
          {t('edu.take_advantage_of_the_promotional_price')}
        </a>
      </Button>
    </Stack>
  )
}

export default function Home({ locale }) {
  return (
    <MainPageTemplate id="home" backgroundColor="#FFFFFF">
      <Hero locale={locale}/>
      {/* <BDEdu /> */}
      <BePartner />
      <Products locale={locale}/>
      <Support locale={locale}/>
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
