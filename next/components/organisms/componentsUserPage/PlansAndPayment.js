import {
  Stack,
  Box,
  Text,
  Divider,
  Tooltip,
  useDisclosure,
  ModalCloseButton,
  Badge,
  Grid,
  GridItem
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import cookies from 'js-cookie';
import { useTranslation, Trans } from "react-i18next";
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";
import { ControlledInputSimple } from "../../atoms/ControlledInput";
import Link from "../../atoms/Link";
import TitleText from "../../atoms/Text/TitleText";
import LabelText from "../../atoms/Text/LabelText";
import BodyText from "../../atoms/Text/BodyText";
import Toggle from "../../atoms/Toggle";
import { SectionPrice } from "../../../pages/prices";
import PaymentSystem from "../../organisms/PaymentSystem";
import { triggerGAEvent, triggerGAEventWithData, hasBDProSubscription, hasChatbotSubscription, getSubscriptionStatusKey, isSubscriptionTrialing } from "../../../utils";
import { selectPlans, localeToRegion, formatCurrency } from "../../../constants/stripePlans";

const SubscriptionBadgeStyles = {
  active: { backgroundColor: "#D5E8DB", color: "#2B8C4D" },
  canceled: { backgroundColor: "#F6E3E3", color: "#BF3434" },
  trial: { backgroundColor: "#E8F2FC", color: "#0068C5" },
}

function SubscriptionStatusBadge({ subscription, t, fallbackStatus = "active" }) {
  const statusKey = subscription ? getSubscriptionStatusKey(subscription) : fallbackStatus
  const badgeStyle = SubscriptionBadgeStyles[statusKey] || SubscriptionBadgeStyles.active;

  return (
    <Badge
      width="fit-content"
      padding="2px 4px"
      textTransform="none"
      borderRadius="6px"
      backgroundColor={badgeStyle.backgroundColor}
      color={badgeStyle.color}
      fontSize="12px"
      lineHeight="18px"
      fontFamily="Roboto"
      fontWeight="500"
      letterSpacing="0.1px"
    >
      {t(`username.${statusKey}`)}
    </Badge>
  )
}

import {
  TitleTextForm,
  ExtraInfoTextForm,
  ModalGeneral,
  Button
} from "../../molecules/uiUserPage";

import Exclamation from "../../../public/img/icons/exclamationIcon";
import CheckIcon from "../../../public/img/icons/checkIcon";
import CrossIcon from "../../../public/img/icons/crossIcon";
import InfoIcon from "../../../public/img/icons/infoIcon";
import { SuccessIcon } from "../../../public/img/icons/successIcon";
import ErrIcon from "../../../public/img/icons/errIcon";
import stylesPS from "../../../styles/paymentSystem.module.css";


function purchaseReflectedInUserData(user, expectChatbot) {
  if (!user) return false
  if (expectChatbot) return hasChatbotSubscription(user)
  if (hasBDProSubscription(user)) return true
  const nodes = user?.internalSubscription?.edges?.map((edge) => edge?.node) || []
  return nodes.some((node) => {
    const slug = (node?.stripeSubscription || "").toLowerCase()
    return slug.includes("bd_pro") || slug.includes("empresas")
  })
}

function trackOpenChatbotPaymentSuccess({ checkoutInfos, hasBdPro, pagePath }) {
  if (typeof window === "undefined") return;
  triggerGAEventWithData("open_chatbot", {
    value: "payment_success_modal",
    plan_interval: checkoutInfos?.interval,
    product_slug: checkoutInfos?.productSlug,
    has_chatbot_subscription: true,
    has_bd_pro: Boolean(hasBdPro),
    is_logged_in: true,
    page_path: pagePath || window.location.pathname,
  });
}

function trackOpenChatbotUserPlansSection({
  hasBdPro,
  chatbotPlanInterval,
  chatbotCanceled,
  pagePath,
}) {
  if (typeof window === "undefined") return;
  triggerGAEventWithData("open_chatbot", {
    value: "user_plans_section",
    has_chatbot_subscription: true,
    has_bd_pro: Boolean(hasBdPro),
    is_logged_in: true,
    plan_interval: chatbotPlanInterval,
    chatbot_subscription_canceled: Boolean(chatbotCanceled),
    page_path: pagePath || window.location.pathname,
  });
}

export default function PlansAndPayment ({ userData }) {
  const { t } = useTranslation('user');
  const router = useRouter()
  const { query } = router
  const [plan, setPlan] = useState("")
  const [checkoutInfos, setCheckoutInfos] = useState({})
  const [valueCoupon, setValueCoupon] = useState("")
  const [errCoupon, setErrCoupon] = useState(false)
  const [couponInfos, setCouponInfos] = useState({})
  const [couponInputFocus, setCouponInputFocus] = useState(false)
  const [coupon, setCoupon] = useState("")
  const [emailGCP, setEmailGCP] = useState(userData?.gcpEmail || userData?.email)
  const [emailGCPFocus, setEmailGCPFocus] = useState(false)
  const [errEmailGCP, setErrEmailGCP] = useState(false)
  const [isLoadingEmailChange, setIsLoadingEmailChange] = useState(false)

  const PaymentModal = useDisclosure()
  const EmailModal = useDisclosure()
  const SucessPaymentModal = useDisclosure()
  const ErroPaymentModal = useDisclosure()
  const PlansModal = useDisclosure()
  const CancelModalPlan = useDisclosure()
  const AlertChangePlanModal = useDisclosure()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingH, setIsLoadingH] = useState(false)
  const [isLoadingCanSub, setIsLoadingCanSub] = useState(false)
  const [isLoadingClientSecret, setIsLoadingClientSecret] = useState(true)
  const [hasSubscribedBDPro, setHasSubscribedBDPro] = useState(true)
  const [hasSubscribedChatbot, setHasSubscribedChatbot] = useState(true)
  const [hasSubscribedLoaded, setHasSubscribedLoaded] = useState(false)
  const [plans, setPlans] = useState(null)
  const [toggleAnual, setToggleAnual] = useState(true)
  const [subscriptionToCancel, setSubscriptionToCancel] = useState("bd_pro")
  const [checkoutStep, setCheckoutStep] = useState("plan")
  const [isChatbotTrialSuccess, setIsChatbotTrialSuccess] = useState(false)
  const [isStartingChatbotTrial, setIsStartingChatbotTrial] = useState(false)
  const [isSetupIntentCheckout, setIsSetupIntentCheckout] = useState(false)
  const successCheckoutKindRef = useRef(null)

  const internalSubscriptions = userData?.internalSubscription?.edges?.map((edge) => edge?.node) || []
  const bdProSubscriptionInfo = internalSubscriptions.find((subscription) => {
    const slug = (subscription?.stripeSubscription || "").toLowerCase()
    return slug.includes("bd_pro") || slug.includes("empresas")
  }) || userData?.subscriptionSet?.edges?.[0]?.node
  const chatbotSubscriptionInfo = internalSubscriptions.find((subscription) => {
    const slug = (subscription?.stripeSubscription || "").toLowerCase()
    return slug.includes("chatbot")
  }) || null

  async function alreadySubscribed(id) {
    try {
      const [bdPro, chatbot] = await Promise.all([
        fetch(`/api/user/getAlreadySubscribed?p=${btoa(id)}&type=bd_pro`).then(res => res.json()),
        fetch(`/api/user/getAlreadySubscribed?p=${btoa(id)}&type=chatbot`).then(res => res.json()),
      ])
      setHasSubscribedBDPro(bdPro)
      setHasSubscribedChatbot(chatbot)
    } catch (error) {
      console.error(error)
      setHasSubscribedBDPro(false)
      setHasSubscribedChatbot(false)
    } finally {
      setHasSubscribedLoaded(true)
    }
  }

  useEffect(() => {
    const reg = new RegExp("(?<=:).*")
    const match = reg.exec(userData.id)

    if (!match) {
      setHasSubscribedLoaded(true)
      return
    }

    alreadySubscribed(match[0])
  }, [userData?.id])

  useEffect(() => {
    async function fecthPlans() {
      try {
        const result = await fetch(`/api/stripe/getPlans`, { method: "GET" })
          .then(res => res.json())

        if(result.success === true) {
          setPlans(selectPlans(result.data, localeToRegion(router.locale)))
        }
      } catch (error) {
        console.error(error)
      }
    }

    fecthPlans()
  }, [])

  useEffect(() => {
    if(plans === null) return
    if(plan === "") return
    if(!hasSubscribedLoaded) return

    const value = Object.values(plans).find(elm => elm?._id === plan)
    if (!value) return

    const isChatbotType = value?.productName?.toLowerCase().includes("chatbot") || value?.productSlug?.toLowerCase().includes("chatbot")
    if (
      isChatbotType &&
      hasChatbotSubscription(userData) &&
      chatbotSubscriptionInfo?.planInterval &&
      value?.interval &&
      value.interval !== chatbotSubscriptionInfo.planInterval
    ) {
      setPlan("")
      setToggleAnual(true)
      setCheckoutInfos({})
      return AlertChangePlanModal.onOpen()
    }

    if(value?.interval === "month") setToggleAnual(false)
    setCheckoutInfos(value)

    const checkoutAlreadyVisible = PaymentModal.isOpen || EmailModal.isOpen
    if (!checkoutAlreadyVisible) {
      if (isChatbotType) {
        if (!hasSubscribedChatbot) {
          startChatbotTrialFlow()
        } else {
          openCheckoutPlanStep()
        }
      } else {
        EmailModal.onOpen()
      }
    }
  }, [plan, plans, userData, chatbotSubscriptionInfo, hasSubscribedLoaded, hasSubscribedChatbot])

  useEffect(() => {
    if (!plans || plan !== "") return
    if (query.checkout !== "chatbot") return
    if (hasChatbotSubscription(userData)) return

    const planId = plans.bd_chatbot_year?._id
    if (planId) {
      setPlan(planId)
    }
  }, [query.checkout, plans, userData, plan])

  useEffect(() => {
    const planSelected = cookies.get('plan_selected');
    if (planSelected && plans) {
      const monthId = plans.bd_chatbot_month?._id
      const yearId = plans.bd_chatbot_year?._id
      const chatbotPlanIds = [monthId, yearId].filter(Boolean)
      const isChatbotType = chatbotPlanIds.includes(planSelected)

      if (hasBDProSubscription(userData) && !isChatbotType) {
        cookies.remove('plan_selected');
        return AlertChangePlanModal.onOpen();
      }
      if (
        hasChatbotSubscription(userData) &&
        isChatbotType &&
        chatbotSubscriptionInfo?.planInterval
      ) {
        const selectedInterval =
          planSelected === monthId
            ? "month"
            : planSelected === yearId
              ? "year"
              : null
        if (
          selectedInterval &&
          selectedInterval !== chatbotSubscriptionInfo.planInterval
        ) {
          cookies.remove('plan_selected');
          return AlertChangePlanModal.onOpen();
        }
      }
      setPlan(planSelected);
      cookies.remove('plan_selected');
    }
  }, [query, plans, userData, chatbotSubscriptionInfo])

  const planActive = hasBDProSubscription(userData)
  const hasChatbotActiveSubscription = hasChatbotSubscription(userData)
  const isChatbotTrial = isSubscriptionTrialing(chatbotSubscriptionInfo)
  const isChatbotCheckout = checkoutInfos?.productName?.toLowerCase().includes("chatbot") || checkoutInfos?.productSlug?.toLowerCase().includes("chatbot")
  const hasSubscribed = isChatbotCheckout ? hasSubscribedChatbot : hasSubscribedBDPro

  const localizedProductName = (name) =>
    router.locale === "en" && typeof name === "string"
      ? name.replace(/\bBD\b/g, "DB")
      : name

  function getCheckoutStepLabel() {
    if (checkoutStep === "plan") {
      return isChatbotCheckout ? t("username.step1of2") : t("username.step2of3")
    }
    return isChatbotCheckout ? t("username.step2of2") : t("username.step3of3")
  }

  function resetCheckoutState() {
    setCheckoutStep("plan")
    setToggleAnual(true)
    setValueCoupon("")
    setErrCoupon(false)
    setCoupon("")
    setCouponInfos({})
    setPlan("")
    setIsSetupIntentCheckout(false)
  }

  function openCheckoutPlanStep() {
    setCheckoutStep("plan")
    PaymentModal.onOpen()
  }

  function openCheckoutPaymentStep() {
    setCheckoutStep("payment")
    setIsLoadingClientSecret(true)
    setIsSetupIntentCheckout(false)
    PaymentModal.onOpen()
  }

  async function startChatbotTrialFlow() {
    setIsStartingChatbotTrial(true)

    try {
      const trial = await fetch(`/api/stripe/startChatbotTrial?p=${btoa(plan)}`, {
        method: "GET",
      }).then((res) => res.json())

      if (trial?.started) {
        successCheckoutKindRef.current = "chatbot"
        setIsChatbotTrialSuccess(true)
        SucessPaymentModal.onOpen()
        return
      }

      openCheckoutPaymentStep()
    } catch (error) {
      console.error(error)
      openCheckoutPaymentStep()
    } finally {
      setIsStartingChatbotTrial(false)
    }
  }

  function goBackFromPlanStep() {
    PaymentModal.onClose()
    if (isChatbotCheckout) {
      resetCheckoutState()
      return
    }
    EmailModal.onOpen()
  }

  const resources = {
    "BD Gratis" : {
      title: t('username.DBFree'),
      buttons: [{
        text: t('username.comparePlans'),
        onClick: () => {
          PlansModal.onOpen()
          setToggleAnual(true)
        }}
      ],
      resources : [
        {name: t('username.processedTables')},
        {name: t('username.integratedData'), tooltip: t('username.integratedDataTooltip')},
        {name: t('username.updatedLowFrequencyData')},
        {name: t('username.cloudAccess')},
        {name: t('username.sqlPythonRAccess')},
        {name: t('username.biIntegration')},
        planActive ? "" : {name: t('username.downloadLimit100MB'), tooltip: t('username.downloadLimit100MBTooltip')},
      ]
    },
    "bd_pro" : {
      title: t('username.DBPro'),
      buttons : [{
        text: t('username.cancelPlan'),
        onClick: () => {
          setSubscriptionToCancel("bd_pro")
          CancelModalPlan.onOpen()
        },
        props: {
          borderColor: bdProSubscriptionInfo?.canceledAt ? "#ACAEB1" : "#2B8C4D",
          color: bdProSubscriptionInfo?.canceledAt ? "#ACAEB1" : "#2B8C4D",
          pointerEvents: bdProSubscriptionInfo?.canceledAt ? "none" : "default",
          backgroundColor: "#FFF",
          border: "1px solid",
          _hover: {
            borderColor: "#22703E",
            color: "#22703E",
            backgroundColor: "#FFF",
          }
        }
      }],
      resources : [
        {name: t('username.dozensOfHighFrequencyDatasets')},
        {name: t('username.companyReferenceTable')},
        {name: t('username.downloadLimit1GB'), tooltip: t('username.downloadLimit1GBTooltip')},
        {name: t('username.selectedTableNotifications')}
      ]
    },
    "bd_pro_empresas" : {
      title: t('username.DBEnterprise'),
      buttons : [{
        text: t('username.cancelPlan'),
        onClick: () => {
          setSubscriptionToCancel("bd_pro")
          CancelModalPlan.onOpen()
        },
        props: {
          borderColor: bdProSubscriptionInfo?.canceledAt ? "#ACAEB1" : "#2B8C4D",
          color: bdProSubscriptionInfo?.canceledAt ? "#ACAEB1" : "#2B8C4D",
          pointerEvents: bdProSubscriptionInfo?.canceledAt ? "none" : "default",
          backgroundColor: "#FFF",
          border: "1px solid",
          _hover: {
            borderColor: "#22703E",
            color: "#22703E",
            backgroundColor: "#FFF",
          }
        }
      }],
      resources : [
        {name: t('username.accessFor10Accounts')},
        {name: t('username.prioritySupport')},
        {name: t('username.bdOrgsChatbot'), hideInListFeature: true},
        {name: t('username.bdOrgsSegmentedInfrastructure')},
        {name: t('username.bdOrgsUnifiedBilling')},
        {
          name: t('username.bdOrgsSpecializedServices'),
          linkText: t('username.bdOrgsLearnMore'),
          linkHref: '/services',
        },
      ]}
  }

  const defaultResource = resources["BD Gratis"]
  const planResource = resources[userData?.proSubscription]

  const controlResource  = () => {
    if (!planActive || !planResource) return defaultResource
    return planResource
  }

  const ListFeature = ({ elm, index, notIncludes = false }) => {
    if (!elm || elm === "" || elm.hideInListFeature) return null;

    return (
      <Box key={index} display="flex" alignItems="center">
        {notIncludes ?
          <CrossIcon fill="#BF3434" width="24px" height="24px" marginRight="8px"/>
          :
          <CheckIcon fill="#2B8C4D" width="24px" height="24px" marginRight="8px"/>
        }
        <BodyText
          typography="small"
          color="#464A51"
        >
          {elm.linkHref ? (
            <>
              {elm.name}{" "}
              <Link
                href={elm.linkHref}
                color="#0068C5"
                _hover={{ color: "#0057A4" }}
                fontSize="14px"
                fontWeight="400"
              >
                {elm.linkText}
              </Link>
            </>
          ) : (
            elm.name
          )}
        </BodyText>
        {elm.tooltip &&
          <Tooltip
            label={elm.tooltip}
            hasArrow
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
            placement="top"
            maxWidth="300px"
          >
            <InfoIcon width="14px" height="14px" alt="tip" cursor="pointer" fill="#A3A3A3" marginLeft="16px"/>
          </Tooltip>
        }
      </Box>
    )
  }

  const openModalSucess = (isTrial = false) => {
    const isChatbotPurchase =
      checkoutInfos?.productName?.toLowerCase().includes("chatbot") ||
      checkoutInfos?.productSlug?.toLowerCase().includes("chatbot")
    successCheckoutKindRef.current = isChatbotPurchase ? "chatbot" : "bd_pro"
    setIsChatbotTrialSuccess(isTrial)
    PaymentModal.onClose()
    SucessPaymentModal.onOpen()
  }

  const openModalErro = () => {
    PaymentModal.onClose()
    ErroPaymentModal.onOpen()
  }

  async function cancelSubscripetion() {
    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(userData.id)

    const result = await fetch(`/api/stripe/removeSubscription?p=${btoa(id)}&t=${btoa(subscriptionToCancel)}`, {method: "GET"})
      .then(res => res.json())

    if(result?.success === false) {
      setIsLoadingCanSub(false)
      CancelModalPlan.onClose()
    }

    const user = await fetch(`/api/user/getUser?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())
    cookies.set('userBD', JSON.stringify(user))
    window.open(`/user/${userData.username}?plans_and_payment`, "_self")
  }

  async function closeModalSucess() {
    SucessPaymentModal.onClose()

    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(userData.id)

    const expectChatbot = successCheckoutKindRef.current === "chatbot"

    let user
    let attempts = 0
    const maxAttempts = 10
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    while (!purchaseReflectedInUserData(user, expectChatbot) && attempts < maxAttempts) {
      user = await fetch(`/api/user/getUser?p=${btoa(id)}`, { method: "GET" })
        .then((res) => res.json())

      if (purchaseReflectedInUserData(user, expectChatbot)) {
        cookies.set("userBD", JSON.stringify(user))
        break
      }

      attempts++
      await delay(10000)
    }

    successCheckoutKindRef.current = null
    setIsChatbotTrialSuccess(false)

    if(isLoadingH === true) return window.open("/", "_self")
    window.open(`/user/${userData.username}?plans_and_payment`, "_self")
  }

  function formatTimeStamp (value) {
    if(value === null || value === undefined) return t("username.noDate")
    const date = new Date(value)
    const options = { day: '2-digit', month: 'long', year: 'numeric' }
    const formattedDate = date.toLocaleDateString('pt-BR', options)
    return formattedDate
  }

  function formattedPlanInterval (value, variant = false) {
    if(variant) {
      if(value === "month") return t('username.month')
      if(value === "year") return t('username.year')
    } else {
      if(value === "month") return t('username.monthly')
      if(value === "year") return t('username.annually')
    }
  }

  function changeIntervalPlanCheckout() {
    let togglerValue = !toggleAnual ? "year" : "month"
    const value = Object.values(plans).find(elm => elm?.interval === togglerValue && elm?.productSlug === checkoutInfos?.productSlug)
    if (!value?._id) return
    setCheckoutInfos(value)
    setCoupon("")
    setValueCoupon("")
    setPlan(value._id)
    setErrCoupon(false)
    setToggleAnual(!toggleAnual)
  }

  async function validateStripeCoupon() {
    if(valueCoupon === "") return
    setErrCoupon(false)

    const result = await fetch(`/api/stripe/validateStripeCoupon?p=${btoa(plan)}&c=${btoa(valueCoupon)}`, { method: "GET" })
      .then(res => res.json())

    if(result?.isValid === false || result?.errors || !result) {
      setValueCoupon("")
      setErrCoupon(true)
    }
    if(result?.duration === "repeating" && toggleAnual === true) {
      setValueCoupon("")
      setErrCoupon(true)
    } else {
      setCouponInfos(result)
      setCoupon(valueCoupon)
    }
  }

  const CouponDisplay = () => {
    let limitText

    if(couponInfos?.duration === "once") limitText = toggleAnual ? t('username.validFor1Year') : t('username.validFor1Month')
    if(couponInfos?.duration === "repeating") limitText = `${t('username.validFor')} ${couponInfos?.durationInMonths} ${couponInfos?.durationInMonths.length === 1 ? t('username.month') : t('username.months')})`

    return (
      <>
        <GridItem>
          <Text>{t('username.coupon')} {coupon.toUpperCase()} {limitText}</Text>
        </GridItem>
        <GridItem textAlign="end">
          <Text>- {formatCheckoutAmount(couponInfos?.discountAmount)}/{formattedPlanInterval(checkoutInfos?.interval, true)}</Text>
        </GridItem>
      </>
    )
  }

  function getCheckoutTotalAmount() {
    if (couponInfos?.discountAmount) {
      return checkoutInfos?.amount - couponInfos.discountAmount
    }
    return checkoutInfos?.amount
  }

  function formatCheckoutAmount(amount) {
    return formatCurrency(amount, localeToRegion(router.locale))
  }

  const TotalToPayDisplay = () => {
    const value = formatCheckoutAmount(getCheckoutTotalAmount())

    return (
      <>
        <GridItem>
          <Text color="#252A32" fontWeight="500">{t('username.totalToPay')}</Text>
        </GridItem>
        <GridItem textAlign="end">
          <Text color="#252A32" fontWeight="500">{value}/{formattedPlanInterval(checkoutInfos?.interval, true)}</Text>
        </GridItem>
      </>
    ) 
  }

  const showPaymentSummary =
    checkoutStep === "payment" &&
    !isLoadingClientSecret &&
    (!isSetupIntentCheckout || !isChatbotCheckout)

  async function handlerEmailGcp() {
    setErrEmailGCP(false)
    setIsLoadingEmailChange(true)

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    if(!isValidEmail(emailGCP)) {
      setErrEmailGCP(true)
      setIsLoadingEmailChange(false)
      return
    }

    try {
      const response = await fetch(`/api/user/changeUserGcpEmail?p=${btoa(emailGCP)}`)
        .then(res => res.json())

      if(response.ok) {
        if(emailGCP !== userData?.email) {
          if(emailGCP !== userData?.gcpEmail) {
            triggerGAEvent("exchange_email_gcp",`checkout_de_pagamento`)
          }
        }
        setIsLoadingEmailChange(false)
        openCheckoutPlanStep()
        EmailModal.onClose()
      } else {
        setErrEmailGCP(true)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingEmailChange(false)
    }
  }

  useEffect(() => {
    if(valueCoupon === "") {
      setCoupon("")
      setCouponInfos("")
    }
  }, [valueCoupon])

  useEffect(() => {
    if(isLoading === true || isLoadingH === true) closeModalSucess()
    if(isLoadingCanSub === true) cancelSubscripetion()
  }, [isLoading, isLoadingH, isLoadingCanSub]) 

  useEffect(() => {
    const onPopState = () => {
      successCheckoutKindRef.current = null
      setIsChatbotTrialSuccess(false)
      setIsLoading(false)
      setIsLoadingH(false)
      SucessPaymentModal.onClose()
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  return (
    <Stack spacing={0}>
      <Box
        display={isLoading || isLoadingH || isStartingChatbotTrial ? "flex" : "none"}
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex="99999"
      />

      {/* stripe */}
      <ModalGeneral
        propsModal={{ id: "modal-stripe-checkout" }}
        classNameBody={stylesPS.modal}
        isOpen={PaymentModal.isOpen}
        onClose={() => {
          resetCheckoutState();
          if (query.i)
            return window.open(
              `/user/${userData.username}?plans_and_payment`,
              "_self",
            );
          PaymentModal.onClose();
        }}
        propsModalContent={{
          width: "100%",
          maxWidth: checkoutStep === "plan" ? "656px" : "560px",
          margin: "24px",
        }}
        isCentered={isMobileMod() ? false : true}
      >
        <Stack spacing={0} marginBottom="40px">
          <BodyText typography="small" width="100%" color="#2B8C4D">
            {getCheckoutStepLabel()}
          </BodyText>
          <TitleText width="100%">
            {checkoutStep === "plan"
              ? t("username.confirmPlan")
              : t("username.payment")}
          </TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
          />
        </Stack>

        <Stack>
          {checkoutStep === "plan" && (
            <Stack spacing="32px">
              <Stack flexDirection="column" spacing={0} gap="16px">
                <Box display="flex" flexDirection="row" gap="8px" width="100%">
                  <LabelText textTransform="capitalize">
                    {localizedProductName(checkoutInfos?.productName)}
                  </LabelText>
                  {!isChatbotCheckout && (
                    <BodyText
                      cursor="pointer"
                      color="#0068C5"
                      _hover={{ color: "#0057A4" }}
                      marginLeft="auto"
                      onClick={() => {
                        PaymentModal.onClose();
                        resetCheckoutState();
                        PlansModal.onOpen();
                      }}
                    >
                      {t("username.changePlan")}
                    </BodyText>
                  )}
                </Box>

                <Box
                  display="flex"
                  flexDirection={{ base: "column", lg: "row" }}
                  gap="8px"
                  alignItems={{ base: "start", lg: "center" }}
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="8px"
                    alignItems="center"
                  >
                    {toggleAnual ? (
                      <Toggle
                        id="toggle-prices-modal-checkout"
                        defaultChecked
                        value={toggleAnual}
                        onChange={() => changeIntervalPlanCheckout()}
                      />
                    ) : (
                      <Toggle
                        id="toggle-prices-modal-checkout"
                        value={toggleAnual}
                        onChange={() => changeIntervalPlanCheckout()}
                      />
                    )}
                    <BodyText>{t("username.annualDiscount")}</BodyText>
                  </Box>

                  <TitleText
                    typography="small"
                    as="span"
                    color="#2B8C4D"
                    backgroundColor="#D5E8DB"
                    padding="2px 4px"
                    borderRadius="4px"
                    height="32px"
                  >
                    {t("username.save20")}
                  </TitleText>
                </Box>
              </Stack>

              <Stack flexDirection="column" spacing={0} gap="8px">
                <LabelText>{t("username.discountCoupon")}</LabelText>

                <Box
                  display="flex"
                  flexDirection={{ base: "column", lg: "row" }}
                  alignItems="center"
                  gap="8px"
                >
                  <Stack
                    spacing={0}
                    width="100%"
                    maxWidth="300px"
                    position="relative"
                  >
                    <ControlledInputSimple
                      value={valueCoupon}
                      onChange={setValueCoupon}
                      inputFocus={couponInputFocus}
                      changeInputFocus={setCouponInputFocus}
                      width="100%"
                      placeholder={t("username.enterCoupon")}
                      inputElementStyle={{
                        display: "none",
                      }}
                      inputStyle={{
                        paddingLeft: "16px !important",
                        paddingRight: "40px !important",
                        borderRadius: "8px",
                        height: "44px",
                      }}
                    />
                    {valueCoupon && (
                      <CrossIcon
                        position="absolute"
                        top="10px"
                        right="12px"
                        alt={t("username.clear")}
                        width="24px"
                        height="24px"
                        fill="#878A8E"
                        cursor="pointer"
                        onClick={() => setValueCoupon("")}
                      />
                    )}
                  </Stack>

                  <Button
                    isVariant
                    width={{ base: "100%", lg: "fit-content" }}
                    onClick={() => validateStripeCoupon()}
                  >
                    {t("username.apply")}
                  </Button>
                </Box>

                {errCoupon && (
                  <BodyText
                    typography="small"
                    display="flex"
                    flexDirection="row"
                    color="#BF3434"
                    gap="8px"
                    height="24px"
                    alignItems="center"
                  >
                    <Exclamation width="21px" height="21px" fill="#BF3434" />{" "}
                    {t("username.enterValidCoupon")}
                  </BodyText>
                )}
              </Stack>

              <BodyText
                display={hasSubscribed ? "none" : "flex"}
                fontFamily="Roboto"
                color="#464A51"
              >
                {t("username.trialPeriod")}
              </BodyText>

              <Divider borderColor="#DEDFE0" />

              <Grid
                templateColumns="4fr 2fr"
                width="100%"
                gap="8px"
                alignItems="center"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="16px"
                lineHeight="24px"
                color="#464A51"
              >
                <GridItem>
                  <Text>{t("username.subtotal")}</Text>
                </GridItem>
                <GridItem textAlign="end">
                  <Text>
                    {formatCheckoutAmount(checkoutInfos?.amount)}
                    /{formattedPlanInterval(checkoutInfos?.interval, true)}
                  </Text>
                </GridItem>

                {couponInfos?.isValid && <CouponDisplay />}
                <TotalToPayDisplay />
              </Grid>

              {(couponInfos?.duration === "once" ||
                couponInfos?.duration === "repeating") && (
                <BodyText color="#464A51">
                  {t("username.couponDuration", { returnObjects: true })[0]}
                  {couponInfos?.duration === "once" && 2}{" "}
                  {couponInfos?.duration === "repeating" &&
                    couponInfos?.durationInMonths + 1}
                  º {formattedPlanInterval(checkoutInfos?.interval, true)}{" "}
                  {!hasSubscribed && "e 7º dia"}
                  {t("username.couponDuration", { returnObjects: true })[1]}
                  {formatCheckoutAmount(checkoutInfos?.amount)}
                  /{formattedPlanInterval(checkoutInfos?.interval, true)}.
                </BodyText>
              )}

              <Stack
                width="100%"
                spacing={0}
                gap="16px"
                justifyContent="end"
                flexDirection={{ base: "column-reverse", lg: "row" }}
              >
                <Button
                  isVariant
                  width={{ base: "100%", lg: "fit-content" }}
                  onClick={() => goBackFromPlanStep()}
                >
                  {t("username.back")}
                </Button>
                <Button
                  width={{ base: "100%", lg: "fit-content" }}
                  onClick={() => {
                    setIsSetupIntentCheckout(false)
                    setIsLoadingClientSecret(true)
                    setCheckoutStep("payment")
                  }}
                >
                  {t("username.next")}
                </Button>
              </Stack>
            </Stack>
          )}

          {checkoutStep === "payment" && (
            <Stack
              spacing="24px"
              pointerEvents={isLoadingClientSecret ? "none" : "default"}
            >
              {showPaymentSummary && (
                <Stack
                  spacing="8px"
                  padding="16px"
                  backgroundColor="#F7F7F7"
                  borderRadius="12px"
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap="16px"
                  >
                    <LabelText textTransform="capitalize">
                      {localizedProductName(checkoutInfos?.productName)}
                    </LabelText>
                    <BodyText typography="small" color="#71757A">
                      {formattedPlanInterval(checkoutInfos?.interval)}
                    </BodyText>
                  </Box>
                  <TitleText typography="small">
                    {formatCheckoutAmount(getCheckoutTotalAmount())}/
                    {formattedPlanInterval(checkoutInfos?.interval, true)}
                  </TitleText>
                </Stack>
              )}
              <LabelText>{t("username.paymentDetails")}</LabelText>
              <PaymentSystem
                userData={userData}
                plan={plan}
                coupon={coupon}
                onSucess={(isTrial) => openModalSucess(isTrial)}
                onErro={() => openModalErro()}
                isLoading={(e) => setIsLoadingClientSecret(e)}
                onClientSecretReady={({ isSetupIntent, isLoading: loadingSecret }) => {
                  if (loadingSecret) {
                    setIsSetupIntentCheckout(false)
                    return
                  }
                  setIsSetupIntentCheckout(Boolean(isSetupIntent))
                }}
              />
            </Stack>
          )}
        </Stack>
      </ModalGeneral>

      {/* email gcp */}
      <ModalGeneral
        propsModal={{ id: "modal-email-gcp" }}
        isOpen={EmailModal.isOpen}
        onClose={() => {
          setEmailGCP(userData?.gcpEmail || userData?.email);
          setErrEmailGCP(false);
          setPlan("");
          EmailModal.onClose();
        }}
        propsModalContent={{
          width: "100%",
          maxWidth: "656px",
          margin: "24px",
        }}
        isCentered={isMobileMod() ? false : true}
      >
        <Stack spacing={0}>
          <BodyText typography="small" width="100%" color="#2B8C4D">
            {t("username.step1of3")}
          </BodyText>
          <ModalCloseButton
            fontSize="14px"
            top="28px"
            right="26px"
            _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
          />
        </Stack>

        <Stack marginBottom={{ base: "24px", lg: "285px !important" }}>
          <TitleText>{t("username.BQEmail")}</TitleText>

          <BodyText color="#464A51" marginBottom="32px !important">
            {t("username.BQEmailDescription1")}
            <Text as="span" fontWeight="500">
              {t("username.BQEmailDescription2")}
            </Text>
            {t("username.BQEmailDescription3")}
          </BodyText>

          <LabelText marginBottom="8px !important">
            {t("username.BQEmail")}
          </LabelText>

          <Stack
            spacing={0}
            width={{ base: "100%", lg: "464px" }}
            position="relative"
          >
            <ControlledInputSimple
              value={emailGCP}
              onChange={setEmailGCP}
              inputFocus={emailGCPFocus}
              changeInputFocus={setEmailGCPFocus}
              width="100%"
              placeholder="Insira o e-mail que deseja utilizar para acessar o BigQuery"
              inputElementStyle={{
                display: "none",
              }}
              inputStyle={{
                paddingLeft: "16px !important",
                paddingRight: "40px !important",
                borderRadius: "8px",
                height: "44px",
                backgroundColor: errEmailGCP ? "#F6E3E3" : "#EEEEEE",
              }}
            />
          </Stack>

          {errEmailGCP && (
            <BodyText
              typography="small"
              display="flex"
              flexDirection="row"
              color="#BF3434"
              gap="8px"
              height="24px"
              alignItems="center"
            >
              <Exclamation width="21px" height="21px" fill="#BF3434" />{" "}
              {t("username.pleaseEnterValidEmail")}
            </BodyText>
          )}
        </Stack>

        <Stack
          width="100%"
          spacing={0}
          gap="16px"
          justifyContent="end"
          flexDirection={{ base: "column-reverse", lg: "row" }}
        >
          <Button
            isVariant
            width={{ base: "100%", lg: "fit-content" }}
            onClick={() => {
              setEmailGCP(userData?.gcpEmail || userData?.email);
              setErrEmailGCP(false);
              setPlan("");
              EmailModal.onClose();
            }}
          >
            {t("username.cancel")}
          </Button>

          <Button
            width={{ base: "100%", lg: "fit-content" }}
            onClick={() => handlerEmailGcp()}
            isLoading={isLoadingEmailChange}
          >
            {t("username.next")}
          </Button>
        </Stack>
      </ModalGeneral>

      {/* success */}
      <ModalGeneral
        propsModal={{ id: "modal-stripe-payment_intent-succeeded" }}
        isOpen={SucessPaymentModal.isOpen}
        propsModalContent={{
          width: "100%",
          maxWidth: "656px",
        }}
        onClose={() => setIsLoading(true)}
      >
        <Stack spacing={0} marginBottom="16px">
          <Box height="24px" />
          <ModalCloseButton
            fontSize="14px"
            top="28px"
            right="26px"
            _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
          />
        </Stack>

        <Stack
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyItems="center"
          width="100%"
          minWidth="292px"
          gap="24px"
          marginBottom="24px"
          spacing={0}
        >
          <SuccessIcon width="90px" height="64px" fill="#34A15A" />
          <TitleText>
            {isChatbotCheckout
              ? isChatbotTrialSuccess
                ? t("username.chatbotTrialSuccessTitle")
                : t("username.chatbotSubscriptionSuccessTitle")
              : t("username.congratulations")}
          </TitleText>
          {isChatbotCheckout ? (
            isChatbotTrialSuccess ? (
              <BodyText color="#464A51">
                {t("username.chatbotTrialSuccessDescription")}
              </BodyText>
            ) : (
              <BodyText color="#464A51">
                <Trans
                  t={t}
                  i18nKey="username.chatbotSubscriptionSuccessDescription"
                  components={{
                    1: (
                      <Text
                        as="a"
                        href="/contact"
                        target="_self"
                        color="#0068C5"
                        _hover={{ color: "#0057A4" }}
                      />
                    ),
                  }}
                />
              </BodyText>
            )
          ) : (
            <BodyText color="#464A51">
              {t("username.BQEmailDescription4")}{" "}
              <Text as="span" fontWeight="500">
                {emailGCP}
              </Text>
              .{t("username.BQEmailDescription5")}
              {t("username.BQEmailDescription6")}{" "}
              <Text
                as="a"
                href="/contact"
                target="_self"
                color="#0068C5"
                _hover={{ color: "#0057A4" }}
              >
                {t("username.BQEmailDescription7")}
              </Text>
            </BodyText>
          )}
        </Stack>

        <Stack
          flexDirection={{ base: "column-reverse", lg: "row" }}
          spacing={0}
          gap="24px"
          width="100%"
        >
          {isChatbotCheckout ? (
            <>
              <Button
                isVariant
                width={{ base: "100%", lg: "50%" }}
                onClick={() => {
                  setIsLoadingH(true);
                }}
                isLoading={isLoadingH}
              >
                {t("username.goToHomepage")}
              </Button>
              <Button
                as="a"
                href="/chatbot"
                width={{ base: "100%", lg: "50%" }}
                onClick={() => {
                  successCheckoutKindRef.current = null;
                  setIsChatbotTrialSuccess(false);
                  setIsLoading(false);
                  setIsLoadingH(false);
                  SucessPaymentModal.onClose();
                  trackOpenChatbotPaymentSuccess({
                    checkoutInfos,
                    hasBdPro: planActive,
                    pagePath: router.pathname,
                  });
                }}
                isLoading={isLoading}
              >
                {t("username.openChatbot")}
              </Button>
            </>
          ) : (
            <>
              <Button
                isVariant
                width={{ base: "100%", lg: "50%" }}
                onClick={() => {
                  successCheckoutKindRef.current = null;
                  setIsLoading(false);
                  setIsLoadingH(false);
                  SucessPaymentModal.onClose();
                  window.open(`/user/${userData?.username}?big_query`, "_self");
                }}
                isLoading={isLoading}
              >
                {t("username.continueSettings")}
              </Button>

              <Button
                width={{ base: "100%", lg: "50%" }}
                onClick={() => setIsLoadingH(true)}
                isLoading={isLoadingH}
              >
                {t("username.goToHomepage")}
              </Button>
            </>
          )}
        </Stack>
      </ModalGeneral>

      {/* err */}
      <ModalGeneral
        isOpen={ErroPaymentModal.isOpen}
        onClose={() => {
          setPlan("");
          ErroPaymentModal.onClose();
        }}
      >
        <Stack spacing={0} marginBottom="16px">
          <Box height="24px" />
          <ModalCloseButton
            fontSize="14px"
            top="28px"
            right="26px"
            _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
          />
        </Stack>

        <Stack
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyItems="center"
          width="100%"
          minWidth="292px"
          gap="24px"
          marginBottom="24px"
          spacing={0}
        >
          <ErrIcon width="90px" height="64px" fill="#BF3434" />
          <TitleText>{t("username.paymentFailed")}</TitleText>
          <BodyText typography="small" color="#464A51" marginBottom="8px">
            {t("username.paymentError")}
            <Link
              display="inline"
              color="#0068C5"
              _hover={{
                color: "#0057A4",
              }}
              fontWeight="400"
              href="/contact"
              target="_self"
              marginLeft="2px"
            >
              {t("username.contactUs")}
            </Link>
            .
          </BodyText>
        </Stack>

        <Stack
          width={{ base: "100%", lg: "fit-content" }}
          alignItems="center"
          spacing={0}
        >
          <Button
            width={{ base: "100%", lg: "fit-content" }}
            onClick={() => ErroPaymentModal.onClose()}
          >
            {t("username.understood")}
          </Button>
        </Stack>
      </ModalGeneral>

      {/* modal plans */}
      <ModalGeneral
        isOpen={PlansModal.isOpen}
        onClose={() => {
          setPlan("");
          PlansModal.onClose();
        }}
        propsModal={{
          scrollBehavior: { base: "outside", lg: "inside" },
        }}
        propsModalContent={{
          maxWidth: "fit-content",
          minWidth: "fit-content",
          maxHeight: "fit-content",
          margin: { base: "0", lg: "24px" },
          padding: "32px 22px 26px 22px",
          borderRadius: { base: "0", lg: "20px" },
        }}
        isCentered={false}
      >
        <Stack spacing={0} marginBottom="40px">
          <TitleText width="100%" paddingLeft="10px">
            {t("username.comparePlans")}
          </TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
          />
        </Stack>

        <Stack width={{ base: "100%", lg: "1008px" }}>
          <SectionPrice
            hasChatbot={false}
            action={(planId) => {
              setPlan(planId);
              PlansModal.onClose();
            }}
          />
        </Stack>
      </ModalGeneral>

      {/* err plans */}
      <ModalGeneral
        isOpen={AlertChangePlanModal.isOpen}
        onClose={AlertChangePlanModal.onClose}
        propsModalContent={{ maxWidth: "500px" }}
      >
        <Stack
          spacing={0}
          marginBottom="16px"
          height={{ base: "100%", lg: "fit-content" }}
        >
          <TitleText>{t("username.planChange")}</TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
          />
        </Stack>

        <Stack spacing="24px" marginBottom="16px">
          <ExtraInfoTextForm>
            {t("username.changePlanInstructions")}
          </ExtraInfoTextForm>
        </Stack>

        <Stack
          spacing={0}
          gap="24px"
          width={{ base: "100%", lg: "fit-content" }}
        >
          <Button
            width={{ base: "100%", lg: "fit-content" }}
            onClick={() => {
              AlertChangePlanModal.onClose();
              window.open("/contact", "_self");
            }}
          >
            {t("username.contactUs")}
          </Button>
        </Stack>
      </ModalGeneral>

      {/* cancel */}
      <ModalGeneral
        propsModal={{ id: "modal-cancel-sub" }}
        isOpen={CancelModalPlan.isOpen}
        onClose={CancelModalPlan.onClose}
        propsModalContent={{ maxWidth: "fit-content" }}
      >
        <Stack spacing={0} marginBottom="16px">
          <TitleText marginRight="24px">
            {t("username.confirmPlanCancellation")}
          </TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
          />
        </Stack>

        <Stack
          flexDirection={{ base: "column-reverse", lg: "row" }}
          spacing={0}
          gap="16px"
          marginLeft="auto"
          width={{ base: "100%", lg: "300px" }}
        >
          <Button
            width="100%"
            border="1px solid #BF3434"
            color="#BF3434"
            backgroundColor="#fff"
            _hover={{
              color: "#992A2A",
              borderColor: "#992A2A",
            }}
            onClick={() => CancelModalPlan.onClose()}
          >
            {t("username.back")}
          </Button>

          <Button
            width="100%"
            backgroundColor="#BF3434"
            _hover={{
              backgroundColor: "#992A2A",
            }}
            onClick={() => setIsLoadingCanSub(true)}
            isLoading={isLoadingCanSub}
          >
            {t("username.cancelPlan")}
          </Button>
        </Stack>
      </ModalGeneral>

      <Stack spacing="40px">
        <Stack
          width="100%"
          spacing={0}
          flexDirection={{ base: "column", lg: "row" }}
          justifyContent="space-between"
        >
          <Stack spacing="8px" marginBottom={{ base: "16px", lg: "0" }}>
            {planActive && (
              <SubscriptionStatusBadge
                subscription={bdProSubscriptionInfo}
                t={t}
              />
            )}

            <Box
              display="flex"
              flexDirection="row"
              gap="8px"
              alignItems="center"
            >
              <LabelText typography="large">
                {controlResource().title}
              </LabelText>
              <LabelText typography="x-small" color="#71757A">
                {formattedPlanInterval(bdProSubscriptionInfo?.planInterval)}
              </LabelText>
            </Box>

            <Box display={bdProSubscriptionInfo ? "flex" : "none"}>
              <BodyText typography="small" color="#71757A">
                {bdProSubscriptionInfo?.canceledAt
                  ? t("username.planAccessUntil")
                  : t("username.nextAutoRenewal")}
                <Text as="span" fontWeight="500" color="#464A51">
                  {formatTimeStamp(
                    bdProSubscriptionInfo?.canceledAt
                      ? bdProSubscriptionInfo?.canceledAt
                      : bdProSubscriptionInfo?.nextBillingCycle,
                  )}
                </Text>
              </BodyText>
            </Box>
          </Stack>

          <Stack
            display={
              userData?.proSubscription === "bd_pro_empresas" &&
              userData?.proSubscriptionRole === "member"
                ? "none"
                : "flex"
            }
            spacing={0}
            gap="24px"
            flexDirection={{ base: "column-reverse", lg: "row" }}
          >
            <Button
              width={{ base: "100%", lg: "fit-content" }}
              onClick={() => controlResource().buttons[0].onClick()}
              {...controlResource()?.buttons?.[0]?.props}
            >
              {controlResource().buttons[0].text}
            </Button>
          </Stack>
        </Stack>

        <Stack
          spacing={0}
          gap={
            userData?.proSubscription === "bd_pro_empresas"
              ? { base: "0", lg: "64px" }
              : "64px"
          }
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Stack minWidth="350px" spacing="8px">
            <BodyText typography="small" color="#464A51" marginBottom="8px">
              {t("username.includes")}
            </BodyText>
            {defaultResource.resources.map((elm, index) => {
              if (elm === "") return;
              return <ListFeature elm={elm} index={index} key={index} />;
            })}
            {userData?.proSubscription === "bd_pro" &&
              planResource.resources.map((elm, index) => {
                return <ListFeature elm={elm} index={index} key={index} />;
              })}
          </Stack>

          <Stack spacing="8px">
            {userData?.proSubscription === "bd_pro_empresas" && (
              <Stack
                spacing={0}
                gap="8px"
                marginTop={{ base: "8px", lg: "36px" }}
              >
                {resources["bd_pro"].resources.map((elm, index) => {
                  return <ListFeature elm={elm} index={index} key={index} />;
                })}
                {planResource.resources.map((elm, index) => {
                  return <ListFeature elm={elm} index={index} key={index} />;
                })}
              </Stack>
            )}
            {userData?.proSubscription !== "bd_pro_empresas" && (
              <BodyText typography="small" color="#464A51" marginBottom="8px">
                {t("username.doesNotInclude")}
              </BodyText>
            )}

            {!planActive && (
              <>
                {resources["bd_pro"].resources.map((elm, index) => {
                  return (
                    <ListFeature
                      notIncludes
                      elm={elm}
                      index={index}
                      key={index}
                    />
                  );
                })}
                {resources["bd_pro_empresas"].resources.map((elm, index) => {
                  return (
                    <ListFeature
                      notIncludes
                      elm={elm}
                      index={index}
                      key={index}
                    />
                  );
                })}
              </>
            )}

            {userData?.proSubscription === "bd_pro" &&
              resources["bd_pro_empresas"].resources.map((elm, index) => {
                return (
                  <ListFeature
                    notIncludes
                    elm={elm}
                    index={index}
                    key={index}
                  />
                );
              })}

            {!planActive && (
              <BodyText
                typography="small"
                as="button"
                display="flex"
                justifyContent="start"
                color="#0068C5"
                _hover={{ color: "#0057A4" }}
                marginTop="16px !important"
                onClick={() => {
                  PlansModal.onOpen();
                  setToggleAnual(true);
                }}
              >
                {t("username.viewAllAndComparePlans")}
              </BodyText>
            )}
          </Stack>
        </Stack>

        <Stack>
          <Box>
            <Stack
              display="flex"
              flexDirection="column"
              spacing={0}
              gap="8px"
              marginTop="8px"
            >
              {hasChatbotActiveSubscription && (
                <SubscriptionStatusBadge
                  subscription={chatbotSubscriptionInfo}
                  t={t}
                />
              )}
              <Box
                display="flex"
                flexDirection="row"
                gap="8px"
                alignItems="center"
                flexWrap="wrap"
              >
                <LabelText typography="large">
                  {t("username.chatbotSectionTitle")}
                </LabelText>
                <Badge
                  width="fit-content"
                  padding="2px 8px"
                  textTransform="none"
                  borderRadius="6px"
                  backgroundColor="#E8F2FC"
                  color="#0068C5"
                  fontSize="12px"
                  lineHeight="18px"
                  fontFamily="Roboto"
                  fontWeight="500"
                  letterSpacing="0.1px"
                >
                  {t("username.chatbotNewBadge")}
                </Badge>
                {chatbotSubscriptionInfo?.planInterval && !isChatbotTrial && (
                  <LabelText typography="x-small" color="#71757A">
                    {formattedPlanInterval(
                      chatbotSubscriptionInfo?.planInterval,
                    )}
                  </LabelText>
                )}
              </Box>
            </Stack>
            <ExtraInfoTextForm margin="8px 0">
              <Trans
                t={t}
                i18nKey="username.chatbotSectionTagline"
                components={{
                  1: (
                    <Link
                      display="inline"
                      fontWeight="400"
                      color="#0068C5"
                      _hover={{
                        color: "#0057A4",
                      }}
                      href="/blog/chatbot"
                    />
                  ),
                }}
              />
            </ExtraInfoTextForm>
            {hasChatbotActiveSubscription && (
              <Stack spacing="8px" marginTop="8px" marginBottom="16px">
                <BodyText typography="small" color="#71757A">
                  {chatbotSubscriptionInfo?.canceledAt
                    ? t("username.planAccessUntil")
                    : t("username.nextAutoRenewal")}
                  <Text as="span" fontWeight="500" color="#464A51">
                    {formatTimeStamp(
                      chatbotSubscriptionInfo?.canceledAt
                        ? chatbotSubscriptionInfo?.canceledAt
                        : chatbotSubscriptionInfo?.nextBillingCycle,
                    )}
                  </Text>
                </BodyText>
              </Stack>
            )}
            {!hasChatbotActiveSubscription && (
              <Button
                isVariant
                marginTop="8px"
                onClick={() => {
                  setToggleAnual(true);
                  if (plans?.bd_chatbot_year?._id)
                    setPlan(plans.bd_chatbot_year._id);
                }}
              >
                {t("username.subscribeChatbot")}
              </Button>
            )}
            {hasChatbotActiveSubscription && (
              <Stack
                display="flex"
                flexDirection="row"
                spacing="0"
                gap="8px"
                marginTop="8px"
                alignItems="flex-start"
              >
                <Button
                  as="a"
                  href="/chatbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackOpenChatbotUserPlansSection({
                      hasBdPro: planActive,
                      chatbotPlanInterval:
                        chatbotSubscriptionInfo?.planInterval,
                      chatbotCanceled: chatbotSubscriptionInfo?.canceledAt,
                      pagePath: router.pathname,
                    })
                  }
                >
                  {t("username.openChatbot")}
                </Button>
                <Button
                  isVariant
                  onClick={() => {
                    setSubscriptionToCancel("chatbot");
                    CancelModalPlan.onOpen();
                  }}
                  borderColor={
                    chatbotSubscriptionInfo?.canceledAt ? "#ACAEB1" : "#BF3434"
                  }
                  color={
                    chatbotSubscriptionInfo?.canceledAt ? "#ACAEB1" : "#BF3434"
                  }
                  pointerEvents={
                    chatbotSubscriptionInfo?.canceledAt ? "none" : "default"
                  }
                  backgroundColor="#FFF"
                  border="1px solid"
                  _hover={{
                    borderColor: "#992A2A",
                    color: "#992A2A",
                    backgroundColor: "#FFF",
                  }}
                >
                  {t("username.cancelChatbotSubscription")}
                </Button>
              </Stack>
            )}
          </Box>
        </Stack>

        <Stack>
          <Box>
            <TitleTextForm>
              {t("username.changeBillingInformation")}
            </TitleTextForm>
            <ExtraInfoTextForm>
              <Trans
                i18nKey={t("username.changeBillingInformationInfo")}
                components={{
                  1: (
                    <Link
                      display="inline"
                      fontWeight="400"
                      color="#0068C5"
                      _hover={{
                        color: "#0057A4",
                      }}
                      href="https://coda.io/@base-dos-dados/faq-bd-pro/assinatura-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              />
            </ExtraInfoTextForm>
            <Button
              as="a"
              href="https://billing.stripe.com/p/login/bIY4jedfK4kRgda144"
              isVariant
              onClick={() => {}}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("username.changeBillingInformationButton")}
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}