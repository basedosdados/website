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
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";
import { ControlledInputSimple } from "../../atoms/ControlledInput";
import Link from "../../atoms/Link";
import TitleText from "../../atoms/Text/TitleText";
import LabelText from "../../atoms/Text/LabelText";
import BodyText from "../../atoms/Text/BodyText";
import Toggle from "../../atoms/Toggle";
import { CardPrice } from "../../../pages/prices";
import PaymentSystem from "../../organisms/PaymentSystem";
import { triggerGAEvent } from "../../../utils";

import {
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
  const [hasOpenEmailModal, setHasOpenEmailModal] = useState(false)
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
  const AlertChangePlanModal  = useDisclosure()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingH, setIsLoadingH] = useState(false)
  const [isLoadingCanSub, setIsLoadingCanSub] = useState(false)
  const [isLoadingClientSecret, setIsLoadingClientSecret] = useState(true)
  const [hasSubscribed, setHasSubscribed] = useState(true)
  const [plans, setPlans] = useState(null)
  const [toggleAnual, setToggleAnual] = useState(true)

  const subscriptionInfo = () => {
    if(userData?.internalSubscription?.edges?.[0]?.node) return userData?.internalSubscription?.edges?.[0]?.node
    if(userData?.subscriptionSet?.edges?.[0]?.node) return userData?.subscriptionSet?.edges?.[0]?.node
  }

  async function alreadySubscribed(id) {
    const result = await fetch(`/api/user/getAlreadySubscribed?p=${btoa(id)}`)
      .then(res => res.json())
    setHasSubscribed(result)
  }

  useEffect(() => {
    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(userData.id)

    alreadySubscribed(id)
  }, [userData?.id])

  useEffect(() => {
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

    fecthPlans()
  }, [])

  useEffect(() => {
    if(plans === null) return
    if(plan === "") return

    const value = Object.values(plans).find(elm => elm._id === plan)
    if(value?.interval === "month") setToggleAnual(false)
    setCheckoutInfos(value)
    if(!hasOpenEmailModal) {
      EmailModal.onOpen()
      setHasOpenEmailModal(true)
    }
  }, [plan, plans])

  useEffect(() => {
    if(query.i) {
      if(userData?.isSubscriber) return AlertChangePlanModal.onOpen()
      setPlan(query.i)
    }
  }, [query])

  const planActive = userData?.isSubscriber

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
        onClick: () => CancelModalPlan.onOpen(),
        props: {
          borderColor: subscriptionInfo()?.canceledAt ? "#ACAEB1" : "#2B8C4D",
          color: subscriptionInfo()?.canceledAt ? "#ACAEB1" : "#2B8C4D",
          pointerEvents: subscriptionInfo()?.canceledAt ? "none" : "default",
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
      ]
    },
    "bd_pro_empresas" : {
      title: t('username.DBEnterprise'),
      buttons : [{
        text: t('username.cancelPlan'),
        onClick: () => CancelModalPlan.onOpen(),
        props: {
          borderColor: subscriptionInfo()?.canceledAt ? "#ACAEB1" : "#2B8C4D",
          color: subscriptionInfo()?.canceledAt ? "#ACAEB1" : "#2B8C4D",
          pointerEvents: subscriptionInfo()?.canceledAt ? "none" : "default",
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
        {name: t('username.prioritySupport')}
      ]}
  }

  const defaultResource = resources["BD Gratis"]
  const planResource = resources[userData?.proSubscription]
  const planCanceled = subscriptionInfo()?.canceledAt

  const controlResource  = () => {
    return planActive ? planResource : defaultResource
  }

  const ListFeature = ({ elm, index, notIncludes = false }) => {
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
        >{elm.name}</BodyText>
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

  const openModalSucess = () => {
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

    const subscriptionActive = await fetch(`/api/stripe/getSubscriptionActive?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())

    const result = await fetch(`/api/stripe/removeSubscription?p=${btoa(subscriptionActive)}`, {method: "GET"})
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
    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(userData.id)

    let user
    let attempts = 0
    const maxAttempts = 10
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    while (!user?.internalSubscription?.edges?.[0]?.node && attempts < maxAttempts) {
      user = await fetch(`/api/user/getUser?p=${btoa(id)}`, { method: "GET" })
        .then((res) => res.json())

      if (user?.internalSubscription?.edges?.[0]?.node) {
        cookies.set("userBD", JSON.stringify(user))
        break
      }

      attempts++
      await delay(10000)
    }

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
    const value = Object.values(plans).find(elm => elm.interval === togglerValue && elm.productSlug === checkoutInfos?.productSlug)
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
          <Text>- {couponInfos?.discountAmount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}/{formattedPlanInterval(checkoutInfos?.interval, true)}</Text>
        </GridItem>
      </>
    )
  }

  const TotalToPayDisplay = () => {
    let value

    if(couponInfos?.discountAmount) {
      value = (checkoutInfos?.amount-couponInfos?.discountAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
    } else {
      value = checkoutInfos?.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
    }

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

  async function handlerEmailGcp() {
    setErrEmailGCP(false)
    setIsLoadingEmailChange(true)

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
    if(!isValidEmail(emailGCP)) return setErrEmailGCP(true)

    const response = await fetch(`/api/user/changeUserGcpEmail?p=${btoa(emailGCP)}`)
      .then(res => res.json())

    if(response.ok) {
      if(emailGCP !== userData?.email) {
        if(emailGCP !== userData?.gcpEmail) {
          triggerGAEvent("troca_do_email_gcp",`checkout_de_pagamento`)
        }
      }
      setIsLoadingEmailChange(false)
      EmailModal.onClose()
      PaymentModal.onOpen()
    } else {
      setErrEmailGCP(true)
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

  return (
    <Stack spacing={0}>
      <Box display={isLoading || isLoadingH ? "flex" : "none"} position="fixed" top="0" left="0" width="100%" height="100%" zIndex="99999"/>

      {/* stripe */}
      <ModalGeneral
        propsModal={{id:"modal-stripe-checkout"}}
        classNameBody={stylesPS.modal}
        isOpen={PaymentModal.isOpen}
        onClose={() => {
          setToggleAnual(true)
          setValueCoupon("")
          if(query.i) return window.open(`/user/${userData.username}?plans_and_payment`, "_self")
          PaymentModal.onClose()
        }}
        propsModalContent={{
          width: "100%",
          maxWidth:"1008px",
          margin: "24px"
        }}
        isCentered={isMobileMod() ? false : true}
      >
        <Stack spacing={0} marginBottom="40px">
          <BodyText
            typography="small"
            width="100%"
            color="#2B8C4D"
          >
            {t('username.step2of2')}
          </BodyText>
          <TitleText width="100%">
            {t('username.payment')}
          </TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <Stack
          display="flex"
          flexDirection={{base: "column", lg: "row"}}
          gap="80px"
          spacing={0}
          pointerEvents={isLoadingClientSecret ? "none" : "default"}
        >
          <Stack
            flex={1}
            spacing="32px"
          >
            <Stack
              flexDirection="column"
              spacing={0}
              gap="16px"
            >
              <Box
                display="flex"
                flexDirection="row"
                gap="8px"
                width="100%"
              >
                <LabelText>
                  {checkoutInfos?.productName}
                </LabelText>
                <BodyText
                  cursor="pointer"
                  color="#0068C5"
                  _hover={{color: "#0057A4"}}
                  marginLeft="auto"
                  onClick={() => {
                    PaymentModal.onClose()
                    setToggleAnual(true)
                    setErrCoupon(false)
                    setCoupon("")
                    setValueCoupon("")
                    PlansModal.onOpen()
                  }}
                >{t('username.changePlan')}</BodyText>
              </Box>

              <Box
                display="flex"
                flexDirection={{base: "column", lg: "row"}}
                gap="8px"
                alignItems={{base: "start", lg: "center"}}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  gap="8px"
                  alignItems="center"
                >
                  {toggleAnual ?  
                      <Toggle
                        id="toggle-prices-modal-checkout"
                        defaultChecked
                        value={toggleAnual}
                        onChange={() => changeIntervalPlanCheckout()}
                      />
                    : 
                      <Toggle
                        id="toggle-prices-modal-checkout"
                        value={toggleAnual}
                        onChange={() => changeIntervalPlanCheckout()}
                      />
                  }
                  <BodyText>
                    {t('username.annualDiscount')}
                  </BodyText>
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
                  {t('username.save20')}
                </TitleText>
              </Box>
            </Stack>

            <Stack
              flexDirection="column"
              spacing={0}
              gap="8px"
            >
              <LabelText>
                {t('username.discountCoupon')}
              </LabelText>

              <Box
                display="flex"
                flexDirection={{base: "column", lg: "row"}}
                alignItems="center"
                gap="8px"
              >
                <Stack spacing={0} width="100%" position="relative">
                  <ControlledInputSimple
                    value={valueCoupon}
                    onChange={setValueCoupon}
                    inputFocus={couponInputFocus}
                    changeInputFocus={setCouponInputFocus}
                    width="100%"
                    placeholder={t('username.enterCoupon')}
                    inputElementStyle={{
                      display: "none",
                    }}
                    inputStyle={{
                      paddingLeft: "16px !important",
                      paddingRight: "40px !important",
                      borderRadius: "8px",
                      height: "44px"
                    }}
                  />
                  {valueCoupon &&
                    <CrossIcon
                      position="absolute"
                      top="10px"
                      right="12px"
                      alt={t('username.clear')}
                      width="24px"
                      height="24px"
                      fill="#878A8E"
                      cursor="pointer"
                      onClick={() => setValueCoupon("")}
                    />
                  }
                </Stack>

                <Button
                  color="#2B8C4D"
                  backgroundColor="#FFF"
                  border="1px solid #2B8C4D"
                  _hover={{
                    backgroundColor: "#FFF",
                    color: "#22703E",
                    borderColor: "#22703E"
                  }}
                  width={{base: "100%", lg: "fit-content"}}
                  onClick={() => validateStripeCoupon()}
                >
                  {t('username.apply')}
                </Button>
              </Box>

              {errCoupon && 
                <BodyText
                  typography="small"
                  display="flex"
                  flexDirection="row"
                  color="#BF3434"
                  gap="8px"
                  height="24px"
                  alignItems="center"
                >
                  <Exclamation
                    width="21px"
                    height="21px"
                    fill="#BF3434"
                  /> {t('username.enterValidCoupon')}
                </BodyText>
              }
            </Stack>

            <BodyText
              display={hasSubscribed ? "none" : "flex"}
              fontFamily="Roboto"
              color="#464A51"
            >
              {t('username.trialPeriod')}
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
                <Text>{t('username.subtotal')}</Text>
              </GridItem>
              <GridItem textAlign="end">
                <Text>{checkoutInfos?.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}/{formattedPlanInterval(checkoutInfos?.interval, true)}</Text>
              </GridItem>

              {couponInfos?.isValid &&
                <CouponDisplay />
              }
              <TotalToPayDisplay />
            </Grid>

            {(couponInfos?.duration === "once" || couponInfos?.duration === "repeating") &&
              <BodyText color="#464A51">
                {t('username.couponDuration', { returnObjects: true })[0]}{couponInfos?.duration === "once" && 2} {couponInfos?.duration === "repeating" && couponInfos?.durationInMonths + 1}º {formattedPlanInterval(checkoutInfos?.interval, true)} {!hasSubscribed && "e 7º dia"}{t('username.couponDuration', { returnObjects: true })[1]}{checkoutInfos?.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}/{formattedPlanInterval(checkoutInfos?.interval, true)}.
              </BodyText>
            }

            <Box display={{base:"none", lg: "flex"}} marginTop="auto !important">
              <Button
                marginTop="24px"
                color="#2B8C4D"
                backgroundColor="#FFF"
                border="1px solid #2B8C4D"
                _hover={{
                  backgroundColor: "#FFF",
                  color: "#22703E",
                  borderColor: "#22703E"
                }}
                width={{base: "100%", lg: "fit-content"}}
                onClick={() => {
                  PaymentModal.onClose()
                  EmailModal.onOpen()
                }}
              >
                {t('username.back')}
              </Button>
            </Box>
          </Stack>

          <Box display="flex" flexDirection="column" gap="24px" flex={1}>
            <LabelText>
              {t('username.paymentDetails')}
            </LabelText>
            <PaymentSystem
              userData={userData}
              plan={plan}
              coupon={coupon}
              onSucess={() => openModalSucess()}
              onErro={() => openModalErro()}
              isLoading={(e) => setIsLoadingClientSecret(e)}
            />

            <Box display={{base:"flex", lg: "none"}} marginTop="auto !important">
              <Button                
                width={{base: "100%", lg: "fit-content"}}
                onClick={() => {
                  PaymentModal.onClose()
                  EmailModal.onOpen()
                }}
              >
                {t('username.back')}
              </Button>
            </Box>
          </Box>
        </Stack>
      </ModalGeneral>

      {/* email gcp */}
      <ModalGeneral
        propsModal={{id:"modal-email-gcp"}}
        isOpen={EmailModal.isOpen}
        onClose={() => {
          setEmailGCP(userData?.gcpEmail || userData?.email)
          setErrEmailGCP(false)
          EmailModal.onClose()
        }}
        propsModalContent={{
          width: "100%",
          maxWidth:"1008px",
          margin: "24px",
        }}
        isCentered={isMobileMod() ? false : true}
      >
        <Stack spacing={0}>
          <BodyText
            typography="small"
            width="100%"
            color="#2B8C4D"
          >
            {t('username.step1of2')}
          </BodyText>
          <ModalCloseButton
            fontSize="14px"
            top="28px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <Stack marginBottom={{base: "24px", lg: "285px !important"}}>
          <TitleText>
            {t('username.BQEmail')}
          </TitleText>

          <BodyText
            color="#464A51"
            marginBottom="32px !important"
          >
            {t('username.BQEmailDescription1')}
            <Text as="span" fontWeight="500">{t('username.BQEmailDescription2')}</Text> 
            {t('username.BQEmailDescription3')}
          </BodyText>

          <LabelText marginBottom="8px !important">
            {t('username.BQEmail')}
          </LabelText>

          <Stack
            spacing={0}
            width={{base: "100%", lg: "464px"}}
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
                backgroundColor: errEmailGCP ? "#F6E3E3" : "#EEEEEE"
              }}
            />
          </Stack>

          {errEmailGCP && 
            <BodyText
              typography="small"
              display="flex"
              flexDirection="row"
              color="#BF3434"
              gap="8px"
              height="24px"
              alignItems="center"
            >
              <Exclamation
                width="21px"
                height="21px"
                fill="#BF3434"
              /> {t('username.pleaseEnterValidEmail')}
            </BodyText>
          }
        </Stack>

        <Stack
          width="100%"
          spacing={0}
          gap="16px"
          justifyContent="end"
          flexDirection={{base: "column-reverse", lg:"row"}}
        >
          <Button
            color="#2B8C4D"
            backgroundColor="#FFF"
            border="1px solid #2B8C4D"
            _hover={{
              backgroundColor: "#FFF",
              color: "#22703E",
              borderColor: "#22703E"
            }}
            width={{base: "100%", lg:"fit-content"}}
            onClick={() => {
              setEmailGCP(userData?.gcpEmail || userData?.email)
              setErrEmailGCP(false)
              EmailModal.onClose()
            }}
          >
            {t('username.cancel')}
          </Button>

          <Button
            width={{base: "100%", lg:"fit-content"}}
            onClick={() => handlerEmailGcp()}
            isLoading={isLoadingEmailChange}
          >
            {t('username.next')}
          </Button>
        </Stack>
      </ModalGeneral>

      {/* success */}
      <ModalGeneral
        propsModal={{id:"modal-stripe-payment_intent-succeeded"}}
        isOpen={SucessPaymentModal.isOpen}
        propsModalContent={{
          width: "100%",
          maxWidth: "656px"
        }}
        onClose={() => setIsLoading(true)}
      >
        <Stack spacing={0} marginBottom="16px">
          <Box height="24px"/>
          <ModalCloseButton
            fontSize="14px"
            top="28px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
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
          <SuccessIcon
            width="90px"
            height="64px"
            fill="#34A15A"
          />
          <TitleText>
            {t('username.congratulations')}
          </TitleText>
          <BodyText color="#464A51">
            {t('username.BQEmailDescription4')} <Text as="span" fontWeight="500">{emailGCP}</Text>.
            {t('username.BQEmailDescription5')}

            {t('username.BQEmailDescription6')} <Text as="a" href="/contact" target="_self" color="#0068C5" _hover={{color: "#0057A4"}}>{t('username.BQEmailDescription7')}</Text>
          </BodyText>
        </Stack>

        <Stack
          flexDirection={{base: "column-reverse", lg: "row"}}
          spacing={0}
          gap="24px"
          width="100%"
        >
          <Button
            color="#2B8C4D"
            backgroundColor="#FFF"
            border="1px solid #2B8C4D"
            _hover={{
              backgroundColor: "#FFF",
              color: "#22703E",
              borderColor: "#22703E"
            }}
            width={{base:"100%", lg: "50%"}}
            onClick={() => window.open(`/user/${userData?.username}?big_query`, "_self")}
            isLoading={isLoading}
          >
            {t('username.continueSettings')}
          </Button>

          <Button
            width={{base:"100%", lg: "50%"}}
            onClick={() => setIsLoadingH(true)}
            isLoading={isLoadingH}
          >
            {t('username.goToHomepage')}
          </Button>
        </Stack>
      </ModalGeneral>

      {/* err */}
      <ModalGeneral
        isOpen={ErroPaymentModal.isOpen}
        onClose={ErroPaymentModal.onClose}
      >
        <Stack spacing={0} marginBottom="16px">
          <Box height="24px"/>
          <ModalCloseButton
            fontSize="14px"
            top="28px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
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
          <ErrIcon
            width="90px"
            height="64px"
            fill="#BF3434"
          />
          <TitleText>{t('username.paymentFailed')}</TitleText>
          <BodyText
            typography="small"
            color="#464A51"
            marginBottom="8px"
          >
            {t('username.paymentError')}
            <Link
              display="inline"
              color="#0068C5"
              _hover={{
                color: "#0057A4"
              }}
              fontWeight="400"
              href="/contact"
              target="_self"
              marginLeft="2px"
            >{t('username.contactUs')}</Link>
            .
          </BodyText>
        </Stack>

        <Stack
          width={{base: "100%", lg: "fit-content"}}
          alignItems="center"
          spacing={0}
        >
          <Button
            width={{base: "100%", lg: "fit-content"}}
            onClick={() => ErroPaymentModal.onClose()}
          >
            {t('username.understood')}
          </Button>
        </Stack>
      </ModalGeneral>

      {/* modal plans */}
      <ModalGeneral
        isOpen={PlansModal.isOpen}
        onClose={PlansModal.onClose}
        propsModal={{
          scrollBehavior: {base: "outside", lg: "inside"}
        }}
        propsModalContent={{
          maxWidth: "fit-content",
          minWidth: "fit-content",
          maxHeight: "fit-content",
          margin: {base: "0", lg: "24px"},
          padding: "32px 22px 26px 22px",
          borderRadius: {base: "0", lg: "20px"},
        }}
        isCentered={false}
      >
        <Stack spacing={0} marginBottom="40px">
          <TitleText
            width="100%"
            paddingLeft="10px"
          >
            {t('username.comparePlans')}
          </TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

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
              id="toggle-prices"
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
              {t('username.annualDiscount')}
              <LabelText
                typography="large"
                as="span"
                color="#2B8C4D"
                backgroundColor="#D5E8DB"
                padding="2px 4px"
                borderRadius="4px"
                height="32px"
              >
                {t('username.save20')}
              </LabelText>
            </LabelText>
          </Box>

          <Stack
            display={{base: "flex", lg: "grid"}}
            gridTemplateColumns="repeat(3, 320px)"
            gridTemplateRows="1fr"
            alignItems={{base: "center", lg: "inherit"}}
            padding="0 10px 6px"
            justifyContent="center"
            justifyItems="center"
            gap="24px"
            spacing={0}
          >
            <CardPrice
              title={t('username.DBFree')}
              subTitle={<>{t('username.DBFreeSubtitle')}</>}
              price={"0"}
              textResource={t('username.resources')}
              resources={[
                {name: t('username.processedTables')},
                {name: t('username.integratedData'), tooltip: t('username.integratedDataTooltip')},
                {name: t('username.cloudAccess')},
                {name: t('username.sqlPythonRAccess')},
                {name: t('username.biIntegration')},
                {name: t('username.downloadLimit100MB'), tooltip: t('username.downloadLimit100MBTooltip')},
              ]}
              button={{
                text: t('username.exploreFeatures'),
                href: "/search",
                noHasModal: true,
              }}
            />

            <CardPrice
              title={t('username.DBPro')}
              subTitle={<>{t('username.DBProSubtitle')}</>}
              price={plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`].amount || 444}
              anualPlan={toggleAnual}
              textResource={t('username.allDBFreeResources')}
              resources={[
                {name: t('username.dozensOfHighFrequencyDatasets')},
                {name: t('username.companyReferenceTable')},
                {name: t('username.downloadLimit1GB'), tooltip: t('username.downloadLimit1GBTooltip')}
              ]}
              button={{
                id: "bd_pro_button_sub_btn",
                text: `${userData?.proSubscription === "bd_pro" ? t('username.currentPlan') : hasSubscribed ? t('username.subscribe') : t('username.startFreeTrial')}`,
                onClick: userData?.proSubscription === "bd_pro" ? () => {} : () => {
                  setPlan(plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`]._id)
                  PlansModal.onClose()
                  EmailModal.onOpen()
                },
                isCurrentPlan: userData?.proSubscription === "bd_pro" ? true : false,
              }}
            />

            <CardPrice
              title={t('username.DBEnterprise')}
              subTitle={<>{t('username.DBEnterpriseSubtitle')}</>}
              price={plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`].amount || 3360}
              anualPlan={toggleAnual}
              textResource={t('username.allDBProResources')}
              resources={[
                {name: t('username.accessFor10Accounts')},
                {name: t('username.prioritySupport')}
              ]}
              button={{
                id: "bd_pro_empresas_button_sub_btn",
                text: `${userData?.proSubscription === "bd_pro_empresas" ? t('username.currentPlan') : hasSubscribed ? t('username.subscribe') : t('username.startFreeTrial')}`,
                onClick: userData?.proSubscription === "bd_pro_empresas" ? () => {} : () => {
                  setPlan(plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`]._id)
                  PlansModal.onClose()
                  EmailModal.onOpen()
                },
                isCurrentPlan: userData?.proSubscription === "bd_pro_empresas" ? true : false,
              }}
            />
          </Stack>
        </Box>
      </ModalGeneral>

      {/* err plans */}
      <ModalGeneral
        isOpen={AlertChangePlanModal.isOpen}
        onClose={AlertChangePlanModal.onClose}
        propsModalContent={{maxWidth: "500px"}}
      >
        <Stack
          spacing={0}
          marginBottom="16px"
          height={{base: "100%", lg: "fit-content"}}
        >
          <TitleText>{t('username.planChange')}</TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <Stack spacing="24px" marginBottom="16px">
          <ExtraInfoTextForm>
            {t('username.changePlanInstructions')}
          </ExtraInfoTextForm>
        </Stack>

        <Stack
          spacing={0}
          gap="24px"
          width={{base: "100%", lg: "fit-content"}}
        >
          <Button
            width={{base: "100%", lg: "fit-content"}}
            onClick={() => {
              AlertChangePlanModal.onClose()
              window.open("/contact", "_self")
            }}
          >
            {t('username.contactUs')}
          </Button>
        </Stack>
      </ModalGeneral>

      {/* cancel */}
      <ModalGeneral
        isOpen={CancelModalPlan.isOpen}
        onClose={CancelModalPlan.onClose}
        propsModalContent={{maxWidth: "fit-content"}}
      >
        <Stack
          spacing={0}
          marginBottom="16px"
        >
          <TitleText marginRight="24px">{t('username.confirmPlanCancellation')}</TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <Stack
          flexDirection={{base: "column-reverse", lg: "row"}}
          spacing={0}
          gap="16px"
          marginLeft="auto"
          width={{base:"100%", lg: "300px"}}
        >
          <Button
            width="100%"
            border="1px solid #BF3434"
            color="#BF3434"
            backgroundColor="#fff"
            _hover={{
              color: "#992A2A",
              borderColor: "#992A2A"
            }}
            onClick={() => CancelModalPlan.onClose()}
          >
            {t('username.back')}
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
            {t('username.cancelPlan')}
          </Button>
        </Stack>
      </ModalGeneral>

      <Stack spacing="40px">
        <Stack
          width="100%"
          spacing={0}
          flexDirection={{base: "column", lg: "row"}}
          justifyContent="space-between"
        >
          <Stack
            spacing="8px"
            marginBottom={{base: "16px", lg: "0"}}
          >
            <Badge
              width="fit-content"
              padding="2px 4px"
              textTransform="none"
              borderRadius="6px"
              backgroundColor={planActive ? planCanceled ? "#F6E3E3" : "#D5E8DB" : "#D5E8DB"}
              color={planActive ? planCanceled ? "#BF3434" : "#2B8C4D": "#2B8C4D"}
              fontSize="12px"
              lineHeight="18px"
              fontFamily="Roboto"
              fontWeight="500"
              letterSpacing="0.1px"
            >
              {planActive ? planCanceled ? t('username.canceled') : t('username.active') : t('username.active')}
            </Badge>

            <Box
              display="flex"
              flexDirection="row"
              gap="8px"
              alignItems="center"
            >
              <LabelText typography="large">{controlResource().title}</LabelText>
              <LabelText
                typography="x-small"
                color="#71757A"
              >
                {formattedPlanInterval(subscriptionInfo()?.planInterval)}
              </LabelText>
            </Box>

            <Box display={subscriptionInfo() ? "flex" : "none"}>
              <BodyText
                typography="small"
                color="#71757A"
              >
                {subscriptionInfo()?.canceledAt ? t('username.planAccessUntil') : t('username.nextAutoRenewal')}<Text
                  as="span"
                  fontWeight="500"
                  color="#464A51"
                >
                  {formatTimeStamp(subscriptionInfo()?.canceledAt ? subscriptionInfo()?.canceledAt : subscriptionInfo()?.nextBillingCycle)}
                </Text>
              </BodyText>
            </Box>
          </Stack>

          <Stack
            display={userData?.proSubscription === "bd_pro_empresas" && userData?.proSubscriptionRole === "member" ? "none" : "flex"}
            spacing={0}
            gap="24px"
            flexDirection={{base: "column-reverse", lg: "row"}}
          >
            <Button
              width={{base: "100%", lg: "fit-content"}}
              onClick={() => controlResource().buttons[0].onClick()}
              {...controlResource()?.buttons?.[0]?.props}
            >
              {controlResource().buttons[0].text}
            </Button>
          </Stack>
        </Stack>

        <Stack
          spacing={0}
          gap="64px"
          flexDirection={{base: "column", lg: "row"}}
        >
          <Stack minWidth="350px" spacing="8px">
            <BodyText
              typography="small"
              color="#464A51"
              marginBottom="8px"
            >{t('username.includes')}</BodyText>
            {defaultResource.resources.map((elm, index) => {
              if(elm === "") return
              return <ListFeature elm={elm} index={index} key={index}/>
            })}
            {userData?.proSubscription === "bd_pro" && 
              planResource.resources.map((elm, index) => {
                return <ListFeature elm={elm} index={index} key={index}/>
              })
            }
            {userData?.proSubscription === "bd_pro_empresas" &&
              <>
                {resources["bd_pro"].resources.map((elm, index) => {
                  return <ListFeature elm={elm} index={index} key={index}/>
                })}
                {planResource.resources.map((elm, index) => {
                  return <ListFeature elm={elm} index={index} key={index}/>
                })}
              </>
            }
          </Stack>

          <Stack spacing="8px">
            {userData?.proSubscription !== "bd_pro_empresas" &&
              <BodyText
                typography="small"
                color="#464A51"
                marginBottom="8px"
              >{t('username.doesNotInclude')}</BodyText>}

              {!planActive && 
                <>
                  {resources["bd_pro"].resources.map((elm, index) => {
                    return <ListFeature notIncludes elm={elm} index={index} key={index}/>
                  })}
                  {resources["bd_pro_empresas"].resources.map((elm, index) => {
                    return <ListFeature notIncludes elm={elm} index={index} key={index}/>
                  })}
                </>
              }

              {userData?.proSubscription === "bd_pro" &&
                resources["bd_pro_empresas"].resources.map((elm, index) => {
                  return <ListFeature notIncludes elm={elm} index={index} key={index}/>
                })
              }

            {!userData?.isSubscriber &&
              <BodyText
                typography="small"
                as="button"
                display="flex"
                justifyContent="start"
                color="#0068C5"
                _hover={{color: "#0057A4"}}
                marginTop="16px !important"
                onClick={() => {
                  PlansModal.onOpen()
                  setToggleAnual(true)
                }}
              >
                {t('username.viewAllAndComparePlans')}
              </BodyText>
            }
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}