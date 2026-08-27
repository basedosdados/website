import {
  Stack,
  Box,
  FormControl,
  useDisclosure,
  ModalCloseButton,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Link from "../../atoms/Link";
import TitleText from "../../atoms/Text/TitleText";
import CheckIcon from "../../../public/img/icons/checkIcon";
import WarningIcon from "../../../public/img/icons/warningIcon";
import { hasBDProSubscription, clearClientSession, getUserPageHref, normalizePhone, isValidE164Phone, formatPhoneInput, formatPhoneDisplay, splitStoredPhone, getDefaultCallingCode } from "../../../utils";

import {
  LabelTextForm,
  TitleTextForm,
  ExtraInfoTextForm,
  ModalGeneral,
  Button,
  ErrorMessage
} from "../../molecules/uiUserPage";
import PhoneInput from "../../molecules/PhoneInput";

export default function Account({ userInfo }) {
  const { t } = useTranslation('user');
  const router = useRouter();
  const { locale } = router;
  const toast = useToast();
  const phoneModal = useDisclosure();
  const eraseModalAccount = useDisclosure();
  const sucessEraseModalAccount = useDisclosure();
  const errorEraseModalAccount = useDisclosure();
  const disableNotificationsModal = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [hasCancelSubscription, setHasCancelSubscription] = useState(false);
  const [hasMembers, setHasMembers] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    phoneCallingCode: getDefaultCallingCode(locale),
  });
  const [errors, setErrors] = useState({});

  async function submitUpdate() {
    setErrors({})
    const phone = normalizePhone(formData.phone, formData.phoneCallingCode)
    if(phone && !isValidE164Phone(phone)) return setErrors({phone: t('username.invalidPhone')})
    setIsLoading(true)

    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(userInfo?.id)

    const result = await fetch(`/api/user/updateUser?p=${btoa(id)}&q=${btoa(phone)}`, {method: "GET"})
      .then(res => res.json())

    if(result?.errors?.length === 0) {
      const userData = await fetch(`/api/user/getUser?p=${btoa(id)}`, {method: "GET"})
        .then(res => res.json())
      cookies.set('userBD', JSON.stringify(userData))
      window.open(getUserPageHref("account"), "_self")
    }

    if(result?.errors?.length > 0) {
      const hasUniqueError = result.errors.some((elm) => elm.field === "phone")
      setErrors({phone: hasUniqueError ? t('username.phoneAlreadyExists') : t('username.invalidPhone')})
      setIsLoading(false)
    }
  }

  async function eraseAccount() {
    try {
      setIsLoading(true)
      setHasCancelSubscription(false)
      setHasMembers(false)

      const reg = new RegExp("(?<=:).*")
      const [ id ] = reg.exec(userInfo.id)

      const canDeleteAccount = await validateAccountDeletion(id)

      if (canDeleteAccount) {
        await deleteUserAccount(id)
      } else {
        eraseModalAccount.onClose()
        errorEraseModalAccount.onOpen()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
      eraseModalAccount.onClose()
    }
  }

  async function validateAccountDeletion(id) {
    if (!hasBDProSubscription(userInfo) || userInfo?.proSubscriptionRole === "member") {
      return true
    }

    let hasMembersInSubscription = false
    const hasActiveSubscription = userInfo?.internalSubscription?.edges?.[0]?.node?.canceledAt === null

    if (hasActiveSubscription) {
      setHasCancelSubscription(true)
    }

    if (userInfo?.proSubscription === "bd_pro_empresas") {
      const res = await fetch(`/api/user/getMembers?p=${btoa(id)}`, {method: "GET"})
      const membersData = await res.json()

      if (membersData?.internalSubscription?.edges?.[0]?.node?.subscribers?.edges?.length > 0) {
        setHasMembers(true)
        hasMembersInSubscription = true
      }
    }

    return !hasActiveSubscription && !hasMembersInSubscription
  }

  async function deleteUserAccount(id) {
    const result = await fetch(`/api/user/deleteAccount?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())

    if(result?.ok === true) {
      sucessEraseModalAccount.onOpen()
    } else {
      errorEraseModalAccount.onOpen()
    }
  }

  async function handleCloseSucessEraseAccount() {
    setIsLoading(true)
    await clearClientSession()
    sucessEraseModalAccount.onClose()
    return window.open("/", "_self")
  }

  async function handleDisableAllNotifications() {
    setIsLoading(true)
    disableNotificationsModal.onClose()
    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(userInfo?.id)

    const result = await fetch(`/api/tables/disableAllTableUpdateNotifications?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())

    if(result?.success === true) {
      toast({
        status: "success",
        duration: 3000,
        position: "bottom",
        render: () => (
          <Box
            display="flex"
            width="fit-content"
            flexDirection="row"
            gap="8px"
            padding="12px 16px"
            backgroundColor="#252A32"
            borderRadius="8px"
            color="#FFF"
            fill="#FFF"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="14px"
            lineHeight="20px"
          >
            <CheckIcon
              width="20px"
              height="20px"
            />
            {t('username.disableNotificationsSuccess')}
          </Box>
        )
      })
    } else if (result === null) {
      toast({
        status: "info",
        duration: 3000,
        position: "bottom",
        render: () => (
          <Box
            display="flex"
            width="fit-content"
            flexDirection="row"
            gap="8px"
            padding="12px 16px"
            backgroundColor="#252A32"
            borderRadius="8px"
            color="#FFF"
            fill="#FFF"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="14px"
            lineHeight="20px"
          >
            <WarningIcon
              width="20px"
              height="20px"
            />
            {t('username.noActiveNotifications')}
          </Box>
        )
      })
    } else {
      toast({
        status: "error",
        duration: 3000,
        position: "bottom",
        render: () => (
          <Box
            display="flex"
            width="fit-content"
            flexDirection="row"
            gap="8px"
            padding="12px 16px"
            backgroundColor="#252A32"
            borderRadius="8px"
            color="#FFF"
            fill="#FFF"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="14px"
            lineHeight="20px"
          >
            <WarningIcon
              width="20px"
              height="20px"
            />
            {t('username.disableNotificationsError')}
          </Box>
        )
      })
    }
    setIsLoading(false)
  }


  return (
    <Stack spacing="24px">
      <Box display={isLoading ? "flex" : "none"} position="fixed" top="0" left="0" width="100%" height="100%" zIndex="99999"/>

      <ModalGeneral
        isOpen={phoneModal.isOpen}
        onClose={phoneModal.onClose}
      >
        <Stack spacing={0} marginBottom="16px">
          <TitleText>{userInfo.phone ? t('username.changePhone') : t('username.addPhone')}</TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <FormControl isInvalid={!!errors.phone}>
          <LabelTextForm text={t('username.phone')}/>
          <PhoneInput
            callingCode={formData.phoneCallingCode}
            onCallingCodeChange={(callingCode) => setFormData((prevState) => ({
              ...prevState,
              phoneCallingCode: callingCode,
              phone: formatPhoneInput(prevState.phone, callingCode),
            }))}
            value={formData.phone}
            onChange={(phone) => setFormData((prevState) => ({
              ...prevState,
              phone,
            }))}
            optional
          />
          <ErrorMessage>
            {errors.phone}
          </ErrorMessage>
        </FormControl>

        <Button
          marginTop="24px"
          onClick={() => submitUpdate(formData)}
          isDisabled={isLoading}
          isLoading={isLoading}
          pointerEvents={isLoading ? "none" : "default"}
        >
          {t('username.updatePhone')}
        </Button>
      </ModalGeneral>

      <ModalGeneral
        isOpen={eraseModalAccount.isOpen}
        onClose={eraseModalAccount.onClose}
        propsModalContent={{minWidth: {base: "", lg: "620px !important"}}}
      >
        <Stack spacing={0} marginBottom="16px">
          <TitleText marginRight="20px">{t('username.confirmAccountDeletion')}</TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
            onClick={() =>  eraseModalAccount.onClose() }
          />
        </Stack>

        <Stack spacing="24px" marginBottom="16px">
          <ExtraInfoTextForm>
            {t('username.accountDeletionWarning')}
          </ExtraInfoTextForm>
        </Stack>

        <Stack
          flexDirection={{base: "column-reverse", lg: "row"}}
          spacing={0}
          gap="16px"
          width={{base:"100%", lg: "fit-content"}}
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
            onClick={() => eraseModalAccount.onClose()}
          >
            {t('username.cancel')}
          </Button>

          <Button
            width="100%"
            backgroundColor="#BF3434"
            _hover={{
              backgroundColor: "#992A2A",
            }}
            onClick={() => eraseAccount()}
            isLoading={isLoading}
          >
            {t('username.delete')}
          </Button>
        </Stack>
      </ModalGeneral>

      <ModalGeneral
        isOpen={sucessEraseModalAccount.isOpen}
        onClose={handleCloseSucessEraseAccount}
        propsModalContent={{minWidth: {base: "", lg: "620px !important"}}}
      >
        <Stack spacing={0} marginBottom="16px">
          <TitleText>{t('username.deleteAccountSuccessTitle')}</TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <Stack spacing="24px" marginBottom="16px">
          <ExtraInfoTextForm>
          {t('username.deleteAccountSuccessText')}
          </ExtraInfoTextForm>
        </Stack>

        <Stack
          width={{base:"100%", lg: "fit-content"}}
        >
          <Button
            width="100%"
            backgroundColor="#BF3434"
            _hover={{
              backgroundColor: "#992A2A",
            }}
            onClick={handleCloseSucessEraseAccount}
            isLoading={isLoading}
          >
            {t('username.close')}
          </Button>
        </Stack>
      </ModalGeneral>

      <ModalGeneral
        isOpen={errorEraseModalAccount.isOpen}
        onClose={errorEraseModalAccount.onClose}
        propsModalContent={{minWidth: {base: "", lg: "620px !important"}}}
      >
        <Stack spacing={0} marginBottom="16px">
          <TitleText>{t('username.errorEraseAccountTitle')}</TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>
        <Stack spacing="4px" marginBottom="24px" flexDirection="column">
          {hasCancelSubscription && (
            <ExtraInfoTextForm>{t('username.errorEraseAccountText')}</ExtraInfoTextForm>
          )}
          {hasMembers && (
            <ExtraInfoTextForm>{t('username.errorEraseAccountMembers')}</ExtraInfoTextForm>
          )}
        </Stack>

        <Stack
          spacing={0}
          width={{base:"100%", lg: "fit-content"}}
        >
          <Button
            whiteSpace="nowrap"
            width="100%"
            backgroundColor="#BF3434"
            _hover={{
              backgroundColor: "#992A2A",
            }}
            isLoading={isLoading}
            onClick={() => errorEraseModalAccount.onClose()}
          >
            {t('username.close')}
          </Button>
        </Stack>
      </ModalGeneral>

      <ModalGeneral
        isOpen={disableNotificationsModal.isOpen}
        onClose={disableNotificationsModal.onClose}
        propsModalContent={{minWidth: {base: "", lg: "800px !important"}}}
      >
        <Stack spacing={0} marginBottom="16px">
          <TitleText marginRight="20px">{t('username.confirmDisableNotificationsTitle')}</TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
            onClick={() => disableNotificationsModal.onClose()}
          />
        </Stack>

        <Stack spacing="24px" marginBottom="16px">
          <ExtraInfoTextForm>
            {t('username.confirmDisableNotificationsDescription')}
          </ExtraInfoTextForm>
        </Stack>

        <Stack
          flexDirection={{base: "column-reverse", lg: "row"}}
          spacing={0}
          gap="16px"
          width={{base:"100%", lg: "fit-content"}}
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
            onClick={() => disableNotificationsModal.onClose()}
          >
            {t('username.cancel')}
          </Button>

          <Button
            width="100%"
            backgroundColor="#BF3434"
            _hover={{
              backgroundColor: "#992A2A",
            }}
            onClick={() => handleDisableAllNotifications()}
            isLoading={isLoading}
          >
            {t('username.confirmDisableNotificationsConfirmButton')}
          </Button>
        </Stack>
      </ModalGeneral>

      <Box marginTop="0 !important">
        <TitleTextForm>{t('username.phone')}</TitleTextForm>
        <ExtraInfoTextForm>{userInfo.phone ? formatPhoneDisplay(userInfo.phone, locale) : t('username.phoneNotSet')}</ExtraInfoTextForm>
        <Button
          isVariant
          onClick={() => {
            const parsed = splitStoredPhone(userInfo.phone || "", locale)
            setFormData({
              phone: formatPhoneInput(parsed.localNumber, parsed.callingCode),
              phoneCallingCode: parsed.callingCode,
            })
            setErrors({})
            phoneModal.onOpen()
          }}
        >{userInfo.phone ? t('username.changePhone') : t('username.addPhone')}</Button>
      </Box>

      <Box>
        <TitleTextForm>{t('username.disableAllNotifications')}</TitleTextForm>
        <ExtraInfoTextForm>{t('username.disableNotificationsInfo')}</ExtraInfoTextForm>
        <Button
          isVariant
          onClick={() => disableNotificationsModal.onOpen()}
        >{t('username.disableNotificationsButton')}</Button>
      </Box>

      <Box>
        <TitleTextForm>{t('username.exportAccountData')}</TitleTextForm>
        <ExtraInfoTextForm>
          {t('username.dataStorageInfo', { returnObjects: true })[0]}
          <Link
            display="inline"
            fontWeight="400"
            color="#0068C5"
            _hover={{
              color:"#0057A4",
            }}
            href="/terms?section=terms"
          >
            {t('username.dataStorageInfo', { returnObjects: true })[1]}
          </Link>
          {t('username.dataStorageInfo', { returnObjects: true })[2]}
          <Link
            display="inline"
            fontWeight="400"
            color="#0068C5"
            _hover={{
              color:"#0057A4",
            }}
            href="/terms?section=privacy"
          >
            {t('username.dataStorageInfo', { returnObjects: true })[3]}
          </Link>
          {t('username.dataStorageInfo', { returnObjects: true })[4]}
        </ExtraInfoTextForm>
        <Button
          isVariant
          onClick={() => router.push('/contact')}
        >{t('username.contactUs')}</Button>
      </Box>

      <Box>
        <TitleTextForm color="#BF3434">{t('username.deleteAccount')}</TitleTextForm>
        <ExtraInfoTextForm color="#71757A">{t('username.accountAccessWarning')}</ExtraInfoTextForm>
        <Button
          backgroundColor="#BF3434"
          _hover={{
            backgroundColor: "#992A2A",
          }}
          onClick={() => eraseModalAccount.onOpen()}
        >{t('username.deleteMyAccount')}</Button>
      </Box>
    </Stack>
  )
}
