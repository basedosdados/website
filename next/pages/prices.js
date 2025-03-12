import {
  Box,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Head from "next/head";
import cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Toggle from "../components/atoms/Toggle";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
import Display from "../components/atoms/Text/Display";
import TitleText from "../components/atoms/Text/TitleText";
import LabelText from "../components/atoms/Text/LabelText";
import BodyText from "../components/atoms/Text/BodyText";

import CheckIcon from "../public/img/icons/checkIcon";
import InfoIcon from '../public/img/icons/infoIcon';

export async function getStaticProps({ locale }) {
  const pagesProps = await withPages();
  return {
    props: {
      ...pagesProps,
      ...(await serverSideTranslations(locale, ['common', 'prices', 'menu'])),
    },
  };
}

export const CardPrice = ({
  title,
  subTitle,
  price,
  anualPlan = false,
  textResource,
  resources = [],
  button,
  locale,
}) => {
  const { t } = useTranslation('prices');

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="relative"
      width={{base: "100%", lg: "272px"}}
      boxSizing={{base: "inherit", lg: "content-box"}}
      borderRadius="16px"
      boxShadow="0 2px 16px 0 rgba(100, 96, 103, 0.16)"
      padding="40px 24px"
      textAlign="center"
    >
      <Box
        height="fit-content"
      >
        <Box
          display="flex"
          flexDirection="row"
          gap="8px"
          justifyContent="center"
          alignItems="center"
          marginBottom="8px"
        >
          <TitleText
            typography="large"
            textAlign="center"
          >
            {title}
          </TitleText>
        </Box>

        <LabelText
          typography="large"
          fontWeight="400"
          textAlign="center"
          color="#71757A"
          marginBottom="24px"
        >
          {subTitle}
        </LabelText>

        <Box
          justifyContent="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginBottom="40px"
        >
          <Box
            display="flex"
            flexDirection="row"
            height="60px"
            alignItems="center"
          >
            <Display textAlign="center">R$ {anualPlan ? price/12 : price}</Display>
            <TitleText
              typography="small"
              position="relative"
              top="16px"
              right="-4px"
              textAlign="center"
            >{t('perMonth')}</TitleText>
          </Box>

          <BodyText
            height="24px"
            color="#464A51"
            marginTop="24px"
            alignItems="center"
          >{anualPlan && t('annualBillingMessage', {
            price: price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
          })}</BodyText>
        </Box>
      </Box>

      <Box
        flex={1}
        textAlign="start"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box marginBottom="24px">
          <BodyText
            color="#71757A"
            alignItems="center"
            marginBottom="16px"
          >
            {textResource}
          </BodyText>

          {resources.map((elm, i) => {
            return (
              <Box
                key={i}
                display="flex"
                marginBottom="8px"
                flexDirection="row"
                alignItems="center"
                gap="8px"
                _last={{marginBottom:"0px !important"}}
              >
                <CheckIcon 
                  width="24px"
                  height="24px"
                  fill="#2B8C4D"
                />
                <BodyText
                  alignItems="center"
                  color="#464A51"
                >
                  {elm.name}
                </BodyText>
                {elm.tooltip &&
                  <Tooltip
                    label={elm.tooltip}
                    hasArrow
                    placement="top"
                    padding="16px"
                    backgroundColor="#252A32"
                    boxSizing="border-box"
                    borderRadius="8px"
                    fontFamily="Roboto"
                    fontWeight="400"
                    fontSize="14px"
                    lineHeight="20px"
                    textAlign="center"
                    color="#FFFFFF"
                    maxWidth="230px"
                  >
                    <InfoIcon width="14px" height="14px" alt="tip" cursor="pointer" fill="#878A8E"/>
                  </Tooltip>
                }
              </Box>
            )
          })}
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          gap="16px"
        >
          {button.isCurrentPlan ? (
            <LabelText
              typography="x-large"
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="40px"
              textAlign="center"
              color="#7D7D7D"
              cursor="default"
            >
              {t('currentPlan')}
            </LabelText>
          ) : (
            <Link
              href={button.onClick ? '#' : button.href}
              width="100%"
              style={{ textDecoration: 'none' }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                borderRadius="8px"
                backgroundColor="#0D99FC"
                padding="12px 16px"
                cursor="pointer"
                color="#FFF"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="20px"
                lineHeight="36px"
                onClick={button.onClick}
                _hover={{
                  backgroundColor: "#0B89E2"
                }}
              >
                {t(button.text)}
              </Box>
            </Link>
          )}

          <BodyText 
            display="flex"
            flexDirection="row"
            justifyContent="center"
            textAlign="center"
            color="#71757A"
            height="24px"
          >{t('readThe')}
            <Link href="/terms?section=terms" locale={locale} passHref>
              <BodyText
                as="span"
                cursor="pointer"
                marginLeft="4px"
                target="_blank"
                alignItems="center"
                color="#0D99FC"
                _hover={{
                  color: "#0B89E2"
                }}
              >
                {t('termsOfService')}
              </BodyText>
            </Link>
            .
          </BodyText>
        </Box>
      </Box>
    </Box>
  )
}

export function SectionPrice() {
  const { t, ready } = useTranslation('prices');
  const { locale } = useRouter();
  const [toggleAnual, setToggleAnual] = useState(true)
  const [plans, setPlans] = useState(null)
  const [username, setUsername] = useState(null)
  const [isBDPro, setIsBDPro] = useState({isCurrentPlan: false})
  const [isBDEmp, setIsBDEmp] = useState({isCurrentPlan: false})
  const [hasSubscribed, setHasSubscribed] = useState(true)

  if (!ready) return null

  async function alreadySubscribed(id) {
    const result = await fetch(`/api/user/getAlreadySubscribed?p=${btoa(id)}`)
      .then(res => res.json())
    setHasSubscribed(result?.edges.length > 0)
  } 

  useEffect(() => {
    let user = null
    if(cookies.get("userBD")) user = JSON.parse(cookies.get("userBD"))

    if(user) {
      const reg = new RegExp("(?<=:).*")
      const [ id ] = reg.exec(user.id)
      alreadySubscribed(id)
    } else {
      setHasSubscribed(false)
    }

    const stripeSubscription = user?.internalSubscription?.edges?.[0]?.node

    if(user != null) {
      setUsername(user?.username)
      setIsBDPro({isCurrentPlan: stripeSubscription?.stripeSubscription === "bd_pro", planInterval: stripeSubscription?.planInterval})
      setIsBDEmp({isCurrentPlan: stripeSubscription?.stripeSubscription === "bd_pro_empresas", planInterval: stripeSubscription?.planInterval})
    }

    async function fecthPlans() {
      try {
        const result = await fetch(`/api/stripe/getPlans`, { method: "GET" })
          .then(res => res.json())

        if(result.success === true) {
          function filterData(productName, interval, isActive) {
            let array = result.data

            return array.filter(item => 
              (productName ? item.node.productName === productName : true) &&
              (interval ? item.node.interval === interval : true) &&
              (isActive !== undefined ? item.node.isActive === isActive : true)
            )
          }

          const filteredPlans = {
            bd_pro_month : filterData("BD Pro", "month", true)[0].node,
            bd_pro_year : filterData("BD Pro", "year", true)[0].node,
            bd_empresas_month : filterData("BD Empresas", "month", true)[0].node,
            bd_empresas_year : filterData("BD Empresas", "year", true)[0].node
          }

          setPlans(filteredPlans)
        }
      } catch (error) {
        console.error(error)
      }
    }

    setToggleAnual(true)
    fecthPlans()
  }, [])

  function planIntervalPlan() {
    const planInterval = toggleAnual ? "year" : "month"

    if(isBDPro?.planInterval === planInterval) return true
    return false
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gridGap="40px"
    >
      <Box
        display="flex"
        width="100%"
        flexDirection="row"
        justifyContent="center"
        alignitems="center"
        gap="8px"
      >
        <Toggle
          defaultChecked
          className="toggle_variant"
          value={toggleAnual}
          onChange={() => setToggleAnual(!toggleAnual)}
        />
        <LabelText
          typography="large"
          position="relative"
          top="-2px"
          gap="8px"
          display="flex"
          fontWeight="400"
          alignItems="center"
          textAlign="center"
        >
          {t('annualDiscount')}
          <LabelText
            typography="large"
            as="span"
            color="#2B8C4D"
            backgroundColor="#D5E8DB"
            padding="2px 4px"
            borderRadius="4px"
            height="32px"
          >{t('save20')}</LabelText>
        </LabelText>
      </Box>

      <Stack
        display={{base: "flex", lg: "grid"}}
        gridTemplateColumns="repeat(3, 320px)"
        gridTemplateRows="1fr"
        justifyContent="center"
        justifyItems="center"
        gap="20px"
        spacing={0}
      >
        <CardPrice
          title={t('plans.free.title')}
          subTitle={t('plans.free.subtitle')}
          price="0"
          textResource={t('features')}
          resources={t('plans.free.features', { returnObjects: true }).map((feature, index) => ({
            name: feature,
            tooltip: index === 1 ? t('tooltips.integratedData') : (index === 6 ? t('tooltips.downloadLimit') : null)
          }))}
          button={{
            text: t('exploreFeatures'),
            href: "/search",
          }}
          locale={locale}
        />

        <CardPrice
          title={t('plans.pro.title')}
          subTitle={t('plans.pro.subtitle')}
          price={plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`].amount || 444}
          anualPlan={toggleAnual}
          textResource={t('allFeaturesPlus', { plan: t('plans.free.title') })}
          resources={t('plans.pro.features', { returnObjects: true }).map((feature, index) => ({
            name: feature,
            tooltip: index === 2 ? t('tooltips.downloadLimitPro') : null
          }))}
          button={{
            text: isBDPro.isCurrentPlan && planIntervalPlan() ? t('currentPlan') : hasSubscribed ? t('subscribe') : t('startFreeTrial'),
            href: username === null ? `/user/login?i=${plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`]._id}` :`/user/${username}?plans_and_payment&i=${plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`]._id}`,
            isCurrentPlan: isBDPro.isCurrentPlan && planIntervalPlan(),
          }}
          locale={locale}
        />

        <CardPrice
          title={t('plans.enterprise.title')}
          subTitle={t('plans.enterprise.subtitle')}
          price={plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`].amount || 3360}
          anualPlan={toggleAnual}
          textResource={t('allFeaturesPlus', { plan: t('plans.pro.title') })}
          resources={t('plans.enterprise.features', { returnObjects: true }).map(feature => ({ name: feature }))}
          button={{
            text: isBDEmp.isCurrentPlan && planIntervalPlan() ? t('currentPlan') : hasSubscribed ? t('subscribe') : t('startFreeTrial'),
            href: username === null ? `/user/login?i=${plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`]._id}` :`/user/${username}?plans_and_payment&i=${plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`]._id}`,
            isCurrentPlan: isBDEmp.isCurrentPlan && planIntervalPlan(),
          }}
          locale={locale}
        />
      </Stack>
    </Box>
  )
}

export default function Price() {
  const { t } = useTranslation('prices');

  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>{t('pageTitle')}</title>
        <meta
          property="og:title"
          content={t('ogTitle')}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={t('ogDescription')}
          key="ogdesc"
        />
      </Head>

      <Stack
        gridGap="40px"
        paddingTop="90px"
        width="100%"
        maxWidth="1264px"
        flexDirection="column"
        marginBottom="80px !important"
        margin="auto"
        spacing={0}
      >
        <Display
          typography="large"
          width="100%"
          textAlign="center"
        >
          {t('comparePlans')}
        </Display>

        <SectionPrice/>
      </Stack>
    </MainPageTemplate>
)
}
