import {
  Stack,
  Box,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useDisclosure,
  ModalCloseButton,
  Spinner
} from "@chakra-ui/react";
import { useState } from "react";
import cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";
import SectionTitle from "../../atoms/SectionTitle";
import RoundedButton from "../../atoms/RoundedButton";
import ButtonSimple from "../../atoms/SimpleButton";
import InputForm from "../../atoms/SimpleInput";
import Link from "../../atoms/Link";

import {
  LabelTextForm,
  TitleTextForm,
  ExtraInfoTextForm,
  ModalGeneral
} from "../../molecules/uiUserPage";

import Exclamation from "../../../public/img/icons/exclamationIcon";
import { EmailConfirmImage } from "../../../public/img/emailImage";
import ChevronIcon from "../../../public/img/icons/chevronIcon";
import { EyeIcon, EyeOffIcon } from "../../../public/img/icons/eyeIcon";

export default function Account({ userInfo }) {
  const { t } = useTranslation('user');
  const emailModal = useDisclosure()
  const usernameModal = useDisclosure()
  const eraseModalAccount = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [confirmationWord, setConfirmationWord] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [showPassword, setShowPassword] = useState(true)

  const [formData, setFormData] = useState({username: ""})
  const [errors, setErrors] = useState({})

  const handleSpaceKey = (e) => {
    if(e.key === " ") { e.preventDefault() }
  }

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  async function submitUpdate() {
    setErrors({})
    if(formData.username === "") return setErrors({username: t('username.invalidUsername')})
    if(formData.username.includes(" ")) return setErrors({username: t('username.noSpacesInUsername')})
    setIsLoading(true)
    
    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(userInfo?.id)
    const form = {id: id, username: formData.username}

    const result = await fetch(`/api/user/updateUser?p=${btoa(id)}&q=${btoa(form.username)}`, {method: "GET"})
      .then(res => res.json())

    if(result?.errors?.length === 0) {
      const userData = await fetch(`/api/user/getUser?p=${btoa(id)}`, {method: "GET"})
        .then(res => res.json())
      cookies.set('userBD', JSON.stringify(userData))
      window.open(`/user/${formData.username}?account`, "_self")
    }

    if(result?.errors?.length > 0) {
      setErrors({username: t('username.usernameAlreadyExists')})
      setIsLoading(false)
    }
  }

  async function eraseAccount(string) {
    if(string = t('username.deleteAccount')) {
      setIsLoading(true)
      const reg = new RegExp("(?<=:).*")
      const [ id ] = reg.exec(userInfo.id)

      const result = await fetch(`/api/user/deleteAccount?p=${btoa(id)}`, {method: "GET"})
        .then(res => res.json())

      if(result?.ok === true) {
        cookies.remove('userBD', { path: '/' })
        cookies.remove('token', { path: '/' })
        return window.open("/", "_self")
      }
      setIsLoading(false)
    }
  }

  const stringConfirm = confirmationWord === t('username.deleteAccount')

  return (
    <Stack spacing="24px">
      <Box display={isLoading ? "flex" : "none"} position="fixed" top="0" left="0" width="100%" height="100%" zIndex="99999"/>

      <ModalGeneral
        isOpen={emailModal.isOpen}
        onClose={emailModal.onClose}
      >
        {emailSent ?
          <Stack spacing={0} marginBottom="16px">
            <Stack spacing={0} flexDirection="row" onClick={() => setEmailSent(false)}>
              <ChevronIcon
                position="relative"
                fill="#42B0FF"
                width="14px"
                height="14px"
                transform="rotate(180deg)"
                top="2px"
              />
              <Text
                cursor="pointer"
                color="#42B0FF"
                fontFamily="Ubuntu"
                fontSize="16px"
                fontWeight="400"
                lineHeight="16px"
                letterSpacing="0.2px"
                marginLeft="8px !important"
              >{t('username.back')}</Text>
            </Stack>
              
            <ModalCloseButton
              fontSize="14px"
              top="24px"
              right="26px"
              _hover={{backgroundColor: "transparent", opacity: 0.7}}
              onClick={() => {
                setEmailSent(false)
                emailModal.onClose()
              }}
            />
          </Stack>
          :
          <Stack spacing={0} marginBottom="16px">
            <SectionTitle
              lineHeight="40px"
            >{t('username.changeEmail')}</SectionTitle>
            <ModalCloseButton
              fontSize="14px"
              top="34px"
              right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
            />
          </Stack>
        }

        {emailSent ?
          <Stack spacing="24px" textAlign="center">
            <EmailConfirmImage justifyContent="center"/>

            <SectionTitle
              lineHeight="40px"
            >{t('username.confirmEmailAddress')}</SectionTitle>
            <ExtraInfoTextForm
              fontSize="16px"
              letterSpacing="0.2px"
            >{t('username.emailSentTo')}</ExtraInfoTextForm>
            <TitleTextForm>dadinho@basedosdados.org</TitleTextForm>
            <ExtraInfoTextForm
              fontSize="16px"
              letterSpacing="0.2px"
              lineHeight="24px"
            >{t('username.checkInboxAndFollowInstructions')}</ExtraInfoTextForm>
          </Stack>
          :
          <Stack spacing="24px">
            <ExtraInfoTextForm fontSize="16px" lineHeight="24px" letterSpacing="0.2px">
              {t('username.enterNewEmail')}
            </ExtraInfoTextForm>

            <FormControl isInvalid={!!errors.email}>
              <LabelTextForm text={t('username.newEmail')}/>
              <InputForm
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('username.enterEmail')}
                fontFamily="ubuntu"
                height="40px"
                fontSize="14px"
                borderRadius="16px"
                _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
              />
              <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
                <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.email}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password} marginBottom="24px !important">
              <Box
                display="flex"
                flexDirection="row"
                width="100%"
                marginBottom="8px"
              >
                <LabelTextForm text={t('username.password')} margin="0 !important"/>
                <ButtonSimple
                  position="relative"
                  top="-2px"
                  width="fit-content"
                  marginLeft="auto !important"
                  fontWeight="700"
                  color="#42B0FF"
                  letterSpacing="0.3px"
                  fontSize="14px"
                  justifyContent="end"
                  _hover={{opacity: "0.6"}}
                  onClick={() => window.open("./password-recovery", "_self")}
                >{t('username.forgotPassword')}
                </ButtonSimple>
              </Box>

              <InputForm
                type={showPassword ? "password" : "text"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('username.enterPassword')}
                fontFamily="ubuntu"
                height="40px"
                fontSize="14px"
                borderRadius="16px"
                _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
                styleElmRight={{
                  width: "50px",
                  height: "40px",
                  cursor: "pointer",
                  onClick: () => setShowPassword(!showPassword)
                }}
                elmRight={showPassword ?
                  <EyeOffIcon
                    alt={t('username.hidePassword')}
                    width="20px"
                    height="20px"
                    fill="#D0D0D0"
                  />
                :
                  <EyeIcon
                    alt={t('username.showPassword')}
                    width="20px"
                    height="20px"
                    fill="#D0D0D0"
                  />
                }
              />
              <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
                <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.password}
              </FormErrorMessage>
            </FormControl>
          </Stack>
        }

        {emailSent ?
          <></>
          :
          <RoundedButton
            borderRadius="30px"
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => setEmailSent(true)}
          >
            {t('username.sendEmail')}
          </RoundedButton>
        }
      </ModalGeneral>

      <ModalGeneral
        isOpen={usernameModal.isOpen}
        onClose={usernameModal.onClose}
      >
        <Stack spacing={0} marginBottom="16px">
          <SectionTitle
            lineHeight="40px"
          >{t('username.changeUsername')}</SectionTitle>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <FormControl isInvalid={!!errors.username}>
          <LabelTextForm text={t('username.newUsername')}/>
          <InputForm
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            onKeyDown={handleSpaceKey}
            fontFamily="ubuntu"
            height="40px"
            fontSize="14px"
            borderRadius="16px"
            _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
          />
          <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
            <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.username}
          </FormErrorMessage>
        </FormControl>

        <RoundedButton
          marginTop="16px"
          borderRadius="30px"
          _hover={{transform: "none", opacity: 0.8}}
          onClick={() => submitUpdate(formData)}
          isDisabled={isLoading}
        >
          {isLoading ?
            <Spinner />
          :
            t('username.updateUsername')
          }
        </RoundedButton>
      </ModalGeneral>

      <ModalGeneral
        isOpen={eraseModalAccount.isOpen}
        onClose={eraseModalAccount.onClose}
        propsModalContent={{minWidth:isMobileMod() ? "" : "620px !important"}}
      >
        <Stack spacing={0} marginBottom="16px">
          <SectionTitle
            lineHeight={isMobileMod() ? "32px" : "40px"}
          >{t('username.confirmAccountDeletion')}</SectionTitle>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", color:"#FF8484"}}
            onClick={() => {
              eraseModalAccount.onClose()
              setConfirmationWord("")
            }}
          />
        </Stack>

        <Stack spacing="24px" marginBottom="16px">
          <ExtraInfoTextForm fontSize="16px" lineHeight="24px" letterSpacing="0.2px">
          {t('username.accountDeletionWarning')}
          </ExtraInfoTextForm>

          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel
              color="#252A32"
              fontFamily="ubuntu"
              letterSpacing="0.2px"
              fontSize="16px"
              fontWeight="400"
              lineHeight="16px"
              userSelect="none"
            >{t('username.confirmDeletion')}</FormLabel>
            <InputForm
              value={confirmationWord}
              onChange={(e) => setConfirmationWord(e.target.value)}
              fontFamily="ubuntu"
              height="40px"
              fontSize="14px"
              borderRadius="16px"
              _placeholder={{color: "#A3A3A3"}}
              _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
            />
          </FormControl>
        </Stack>

        <Stack
          flexDirection={isMobileMod() ? "column-reverse" : "row"}
          spacing={0}
          gap="24px"
          width={isMobileMod() ? "100%" : "fit-content"}
        >
          <RoundedButton
            borderRadius="30px"
            backgroundColor="#FFF"
            border="1px solid #FF8484"
            color="#FF8484"
            width={isMobileMod() ? "100%" : "fit-content"}
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => {
              eraseModalAccount.onClose()
              setConfirmationWord("")
            }}
          >
            {t('username.cancel')}
          </RoundedButton>

          <RoundedButton
            borderRadius="30px"
            backgroundColor={stringConfirm ? "#FF8484" : "#C4C4C4"}
            cursor={stringConfirm ? "pointer" : "default"}
            width={isMobileMod() ? "100%" : "fit-content"}
            _hover={stringConfirm ? {transform: "none", opacity: 0.8} : {transform: "none"}}
            pointerEvents={stringConfirm ? "default" : "none"}
            onClick={() => eraseAccount(confirmationWord)}
            isDisabled={isLoading}
          >
            {isLoading ?
              <Spinner />
            :
              t('username.delete')
            }
          </RoundedButton>
        </Stack>
      </ModalGeneral>

      <Box>
        <TitleTextForm>{t('username.username')}</TitleTextForm>
        <Text
          color="#6F6F6F"
          fontFamily="Ubuntu"
          fontSize="14px"
          fontWeight="400"
          lineHeight="27px"
          letterSpacing="0.3px"
        >{userInfo.username}</Text>
        <Link
          color="#42B0FF"
          fontFamily="ubuntu"
          fontWeight="500"
          fontSize="16px"
          lineHeight="30px"
          letterSpacing="0.2px"
          onClick={() => usernameModal.onOpen()}
        >{t('username.changeUsername')}</Link>
      </Box>

      <Box>
        <TitleTextForm>{t('username.exportAccountData')}</TitleTextForm>
        <ExtraInfoTextForm>{t('username.dataStorageInfo')}{!isMobileMod() && <br/>} {t('username.exportDataInstructions')}</ExtraInfoTextForm>
        <Link
          color="#42B0FF"
          fontFamily="ubuntu"
          fontWeight="500"
          fontSize="16px"
          lineHeight="30px"
          letterSpacing="0.2px"
          href="/contato"
          target="_self"
        >{t('username.contactUs')}</Link>
      </Box>

      <Box>
        <TitleTextForm color="#D93B3B">{t('username.deleteAccount')}</TitleTextForm>
        <ExtraInfoTextForm marginBottom="8px">{t('username.accountAccessWarning')}</ExtraInfoTextForm>
        <RoundedButton
          width={isMobileMod() ? "100%" :"fit-content"}
          backgroundColor="#FF8484"
          onClick={() => eraseModalAccount.onOpen()}
        >{t('username.deleteMyAccount')}</RoundedButton>
      </Box>
    </Stack>
  )
}
