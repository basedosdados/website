import {
  Box,
  Stack,
  Tooltip,
  Skeleton,
  SkeletonText,
  Badge,
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
import { triggerGAEvent, triggerGAEventWithData } from "../utils";

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
  isBeta = false,
}) => {
  const { t } = useTranslation('prices');
  const router = useRouter();

  const handleNavigation = () => {
    if (button.onClick) {
      button.onClick();
    }
    if (button.href) {
      router.push(button.href);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      position="relative"
      width={{ base: "100%", lg: "260px" }}
      boxSizing={{ base: "inherit", lg: "content-box" }}
      borderRadius="16px"
      boxShadow="0 2px 16px 0 rgba(100, 96, 103, 0.16)"
      padding="40px 24px"
      textAlign="center"
    >
      <Box height="fit-content">
        <Box
          display="flex"
          flexDirection="row"
          gap="8px"
          justifyContent="center"
          alignItems="center"
          marginBottom="8px"
        >
          <TitleText typography="large" textAlign="center">
            {title}
          </TitleText>
          <Badge
            display={isBeta ? "block" : "none"}
            width="fit-content"
            padding="4px 12px"
            textTransform="none"
            borderRadius="6px"
            backgroundColor="#E8F2FC"
            color="#0068C5"
            fontSize="16px"
            lineHeight="24px"
            fontFamily="Roboto"
            fontWeight="500"
            letterSpacing="0.1px"
          >
            {t("beta")}
          </Badge>
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
            <Display textAlign="center">
              R$ {anualPlan ? Math.ceil(price / 12) : price}
            </Display>
            <TitleText
              typography="small"
              position="relative"
              top="16px"
              right="-4px"
              textAlign="center"
            >
              {t("perMonth")}
            </TitleText>
          </Box>

          <BodyText
            height="24px"
            color="#464A51"
            marginTop="24px"
            alignItems="center"
          >
            {anualPlan &&
              t("annualBillingMessage", {
                price: price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 0,
                }),
              })}
          </BodyText>
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
          <BodyText color="#71757A" alignItems="center" marginBottom="16px">
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
                _last={{ marginBottom: "0px !important" }}
              >
                <CheckIcon width="24px" height="24px" fill="#2B8C4D" />
                <BodyText alignItems="center" color="#464A51">
                  {elm.name}
                </BodyText>
                {elm.tooltip && (
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
                    <InfoIcon
                      width="14px"
                      height="14px"
                      alt="tip"
                      cursor="pointer"
                      fill="#878A8E"
                    />
                  </Tooltip>
                )}
              </Box>
            );
          })}
        </Box>

        <Box display="flex" flexDirection="column" gap="16px">
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
              {t("currentPlan")}
            </LabelText>
          ) : (
            <Box
              id={button?.id}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              borderRadius="8px"
              backgroundColor="#2B8C4D"
              padding="12px 16px"
              cursor="pointer"
              color="#FFF"
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="20px"
              lineHeight="36px"
              onClick={handleNavigation}
              _hover={{
                backgroundColor: "#22703E",
              }}
            >
              {t(button.text)}
            </Box>
          )}

          <BodyText
            display="flex"
            flexDirection="row"
            justifyContent="center"
            textAlign="center"
            color="#71757A"
            height="24px"
          >
            {t("readThe")}
            <Link href="/terms?section=terms" locale={locale} passHref>
              <BodyText
                as="span"
                cursor="pointer"
                marginLeft="4px"
                target="_blank"
                alignItems="center"
                color="#0068C5"
                _hover={{
                  color: "#0057A4",
                }}
              >
                {t("termsOfService")}
              </BodyText>
            </Link>
            .
          </BodyText>
        </Box>
      </Box>
    </Box>
  );
}

export function SectionPrice({
  action = () => {},
  hasChatbot = true,
}) {
  const { t, ready } = useTranslation('prices');
  const { locale } = useRouter();
  const [toggleAnual, setToggleAnual] = useState(true)
  const [plans, setPlans] = useState(null)
  const [username, setUsername] = useState(null)
  const [isBDPro, setIsBDPro] = useState({isCurrentPlan: false})
  const [isBDEmp, setIsBDEmp] = useState({isCurrentPlan: false})
  const [isBDChatbot, setIsBDChatbot] = useState({isCurrentPlan: false})
  const [hasSubscribed, setHasSubscribed] = useState(true)
  const [isLoading, setLoading] = useState(true)

  if (!ready) return null

  async function fetchAlreadySubscribed(id) {
    try {
      const res = await fetch(`/api/user/getAlreadySubscribed?p=${btoa(id)}`)
      const result = await res.json()
      setHasSubscribed(result)
    } catch (e) {
      console.error(e)
      setHasSubscribed(false)
    }
  }

  async function fetchPlans() {
    try {
      const result = await fetch(`/api/stripe/getPlans`, { method: "GET" })
        .then(res => res.json())

      if(result.success === true) {
        function filterData(productName, interval, isActive, amount) {
          let array = result.data

          return array.filter(item => 
            (productName ? item.node.productName === productName : true) &&
            (interval ? item.node.interval === interval : true) &&
            (amount ? item.node.amount === amount : true) &&
            (isActive !== undefined ? item.node.isActive === isActive : true)
          )
        }

        function filterChatbot(interval, amount) {
          return result.data.filter((item) => {
            const name = item.node.productName?.toLowerCase() || ""
            const slug = item.node.productSlug?.toLowerCase() || ""
            const isConsumerChatbot =
              (name.includes("chatbot") || slug.includes("chatbot")) &&
              !name.includes("empresas")
            return isConsumerChatbot &&
              item.node.interval === interval &&
              item.node.amount === amount &&
              item.node.isActive === true
          })
        }

        const filteredPlans = {
          bd_pro_month : filterData("BD Pro", "month", true, 47)[0].node,
          bd_pro_year : filterData("BD Pro", "year", true, 444)[0].node,
          bd_empresas_month : filterData("BD Empresas", "month", true, 385)[0].node,
          bd_empresas_year : filterData("BD Empresas", "year", true, 3700)[0].node,
          bd_chatbot_month : filterChatbot("month", 30)[0]?.node,
          bd_chatbot_year : filterChatbot("year", 326)[0]?.node,
        }

        setPlans(filteredPlans)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      let user = null
      if(cookies.get("userBD")) user = JSON.parse(cookies.get("userBD"))

      const promises = []

      if(user) {
        const reg = new RegExp("(?<=:).*")
        const match = reg.exec(user.id)
        if (match) {
          const [id] = match
          promises.push(fetchAlreadySubscribed(id))
        } else {
          setHasSubscribed(false)
        }
      } else {
        setHasSubscribed(false)
      }

      promises.push(fetchPlans())

      if(user != null) {
        const internalNodes = user?.internalSubscription?.edges?.map((e) => e?.node) || []
        const nodeBDPro = internalNodes.find((n) => n?.stripeSubscription === "bd_pro")
        const nodeBDEmp = internalNodes.find((n) => n?.stripeSubscription === "bd_pro_empresas")
        const chatbotNode = internalNodes.find((n) =>
          (n?.stripeSubscription || "").toLowerCase().includes("chatbot")
        )
        const planIntervalLegacy = user?.subscriptionSet?.edges?.[0]?.node?.planInterval

        setUsername(user?.username)
        setIsBDPro({
          isCurrentPlan: user?.proSubscription === "bd_pro",
          planInterval: (nodeBDPro?.planInterval ?? planIntervalLegacy),
        })
        setIsBDEmp({
          isCurrentPlan: user?.proSubscription === "bd_pro_empresas",
          planInterval: (nodeBDEmp?.planInterval ?? planIntervalLegacy),
        })
        setIsBDChatbot({
          isCurrentPlan: !!chatbotNode,
          planInterval: chatbotNode?.planInterval,
        })
      }

      await Promise.all(promises)
      setLoading(false)
    }

    setToggleAnual(true)
    loadData()
  }, [])

  function planIntervalMatches(planState, toggleAnual) {
    const planInterval = toggleAnual ? "year" : "month"
    return planState?.planInterval === planInterval
  }

  const arrayCards = () => {
    return hasChatbot ? [1, 2, 3, 4] : [1, 2, 3]
  }

  return (
    <Box display="flex" flexDirection="column" gridGap="40px" width="100%">
      <Box
        display="flex"
        width="100%"
        flexDirection="row"
        justifyContent="center"
        alignitems="center"
        gap="8px"
      >
        <Toggle
          id="toggle-prices"
          defaultChecked
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
          {t("annualDiscount")}
          <LabelText
            typography="large"
            as="span"
            color="#2B8C4D"
            backgroundColor="#D5E8DB"
            padding="2px 4px"
            borderRadius="4px"
            height="32px"
          >
            {t("save20")}
          </LabelText>
        </LabelText>
      </Box>

      {isLoading ? (
        <Stack
          display={{ base: "flex", lg: "grid" }}
          gridTemplateColumns={{ lg: "repeat(auto-fit, minmax(260px, 1fr))" }}
          gridTemplateRows="1fr"
          justifyContent="center"
          justifyItems="center"
          gap="20px"
          maxWidth="100%"
          spacing={0}
        >
          {arrayCards().map((i) => (
            <Box
              key={i}
              display="flex"
              flexDirection="column"
              width={{ base: "100%", lg: "260px" }}
              boxSizing={{ base: "inherit", lg: "content-box" }}
              borderRadius="16px"
              boxShadow="0 2px 16px 0 rgba(100, 96, 103, 0.16)"
              padding="40px 24px"
              textAlign="center"
            >
              <Skeleton
                height="32px"
                width="150px"
                margin="0 auto 8px"
                startColor="#F0F0F0"
                endColor="#F3F3F3"
                borderRadius="6px"
              />
              <Skeleton
                height="20px"
                width="200px"
                margin="0 auto 24px"
                startColor="#F0F0F0"
                endColor="#F3F3F3"
                borderRadius="6px"
              />
              <Box marginBottom="40px">
                <Skeleton
                  height="60px"
                  width="120px"
                  margin="0 auto"
                  startColor="#F0F0F0"
                  endColor="#F3F3F3"
                  borderRadius="6px"
                />
              </Box>
              <Box flex={1} textAlign="start">
                <SkeletonText
                  mt="4"
                  noOfLines={6}
                  spacing="4"
                  startColor="#F0F0F0"
                  endColor="#F3F3F3"
                  borderRadius="6px"
                />
                <Skeleton
                  height="48px"
                  width="100%"
                  borderRadius="8px"
                  marginTop="40px"
                  startColor="#F0F0F0"
                  endColor="#F3F3F3"
                />
                <Skeleton
                  height="20px"
                  width="80%"
                  margin="16px auto 0"
                  startColor="#F0F0F0"
                  endColor="#F3F3F3"
                  borderRadius="6px"
                />
              </Box>
            </Box>
          ))}
        </Stack>
      ) : (
        <Stack
          display={{ base: "flex", lg: "grid" }}
          gridTemplateColumns={{ lg: "repeat(auto-fit, minmax(260px, 1fr))" }}
          gridTemplateRows="1fr"
          justifyContent="center"
          justifyItems="center"
          width="100%"
          gap="20px"
          spacing={0}
        >
          <CardPrice
            title={t("plans.free.title")}
            subTitle={t("plans.free.subtitle")}
            price="0"
            textResource={t("features")}
            resources={t("plans.free.features", { returnObjects: true }).map(
              (feature, index) => ({
                name: feature,
                tooltip:
                  index === 1
                    ? t("tooltips.integratedData")
                    : index === 6
                      ? t("tooltips.downloadLimit")
                      : null,
              }),
            )}
            button={{
              text: t("exploreFeatures"),
              href: "/search",
              onClick: () =>
                triggerGAEvent("explore_features_card_price", "click"),
            }}
            locale={locale}
          />
          <CardPrice
            title={t("plans.pro.title")}
            subTitle={t("plans.pro.subtitle")}
            price={
              plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`]?.amount || 444
            }
            anualPlan={toggleAnual}
            textResource={t("allFeaturesPlus", { plan: t("plans.free.title") })}
            resources={t("plans.pro.features", { returnObjects: true }).map(
              (feature, index) => ({
                name: feature,
                tooltip: index === 2 ? t("tooltips.downloadLimitPro") : null,
              }),
            )}
            button={{
              text:
                isBDPro.isCurrentPlan &&
                planIntervalMatches(isBDPro, toggleAnual)
                  ? t("currentPlan")
                  : hasSubscribed
                    ? t("subscribe")
                    : t("startFreeTrial"),
              href:
                username === null
                  ? `/user/login`
                  : `/user/${username}?plans_and_payment`,
              onClick: () => {
                triggerGAEventWithData("bd_pro_card_price", {
                  plan_interval: toggleAnual ? "year" : "month",
                  is_free_trial: !hasSubscribed,
                });
                cookies.set(
                  "plan_selected",
                  plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`]?._id,
                  { expires: 1, path: "/" },
                );
                action(plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`]?._id);
              },
              isCurrentPlan:
                isBDPro.isCurrentPlan &&
                planIntervalMatches(isBDPro, toggleAnual),
            }}
            locale={locale}
          />
          <CardPrice
            title={t("plans.enterprise.title")}
            subTitle={t("plans.enterprise.subtitle")}
            price={
              plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`]
                ?.amount || 3700
            }
            anualPlan={toggleAnual}
            textResource={t("allFeaturesPlus", { plan: t("plans.pro.title") })}
            resources={t("plans.enterprise.features", {
              returnObjects: true,
            }).map((feature) => ({ name: feature }))}
            button={{
              text:
                isBDEmp.isCurrentPlan &&
                planIntervalMatches(isBDEmp, toggleAnual)
                  ? t("currentPlan")
                  : hasSubscribed
                    ? t("subscribe")
                    : t("startFreeTrial"),
              href:
                username === null
                  ? `/user/login`
                  : `/user/${username}?plans_and_payment`,
              onClick: () => {
                triggerGAEventWithData("bd_empresas_card_price", {
                  plan_interval: toggleAnual ? "year" : "month",
                  is_free_trial: !hasSubscribed,
                });
                cookies.set(
                  "plan_selected",
                  plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`]?._id,
                  { expires: 1, path: "/" },
                );
                action(
                  plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`]?._id,
                );
              },
              isCurrentPlan:
                isBDEmp.isCurrentPlan &&
                planIntervalMatches(isBDEmp, toggleAnual),
            }}
            locale={locale}
          />
          {hasChatbot && (
            <CardPrice
              isBeta={true}
              title={t("plans.chatbot.title")}
              subTitle={t("plans.chatbot.subtitle")}
              price={
                plans?.[`bd_chatbot_${toggleAnual ? "year" : "month"}`]?.amount ??
                (toggleAnual ? 326 : 30)
              }
              anualPlan={toggleAnual}
              textResource={t("plans.chatbot.exclusiveFeaturesHeading")}
              resources={t("plans.chatbot.features", { returnObjects: true }).map(
                (feature) => ({ name: feature }),
              )}
              button={{
                text:
                  isBDChatbot.isCurrentPlan &&
                  planIntervalMatches(isBDChatbot, toggleAnual)
                    ? t("currentPlan")
                    : hasSubscribed
                      ? t("subscribe")
                      : t("startFreeTrial"),
                href:
                  username === null
                    ? `/user/login`
                    : `/user/${username}?plans_and_payment`,
                onClick: () => {
                  triggerGAEventWithData("bd_chatbot_card_price", {
                    plan_interval: toggleAnual ? "year" : "month",
                    is_free_trial: !hasSubscribed,
                  });
                  const chatKey = `bd_chatbot_${toggleAnual ? "year" : "month"}`;
                  cookies.set("plan_selected", plans?.[chatKey]?._id, {
                    expires: 1,
                    path: "/",
                  });
                  action(plans?.[chatKey]?._id);
                },
                isCurrentPlan:
                  isBDChatbot.isCurrentPlan &&
                  planIntervalMatches(isBDChatbot, toggleAnual),
              }}
              locale={locale}
            />
          )}
        </Stack>
      )}
    </Box>
  );
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
