import {
  Stack,
  Box,
  Text,
  FormControl,
  FormErrorMessage,
  useDisclosure,
  ModalCloseButton,
  UnorderedList,
  ListItem,
  Spinner
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";
import SectionTitle from "../../atoms/SectionTitle";
import RoundedButton from "../../atoms/RoundedButton";
import ButtonSimple from "../../atoms/SimpleButton";
import InputForm from "../../atoms/SimpleInput";

import {
  LabelTextForm,
  ExtraInfoTextForm,
  ModalGeneral
} from "../../molecules/uiUserPage";

import Exclamation from "../../../public/img/icons/exclamationIcon";
import { EmailRecoveryImage } from "../../../public/img/emailImage";
import { EyeIcon, EyeOffIcon } from "../../../public/img/icons/eyeIcon";

export default function NewPassword({ userInfo }) {
  const { t } = useTranslation('user');
  const newPasswordModal = useDisclosure()
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(true)
  const [showNewPassword, setShowNewPassword] = useState(true)
  const [showConfirmPassword, setShowConfirmPassword] = useState(true)

  const handleInputChange = (e, field) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    let regexPassword = {}
    let validationErrors = {}

    if(formData.password !== "" && formData.password === formData.newPassword) {
      validationErrors.newPassword = t('username.newPasswordDifferent')
    }
    if(!/^.{8,}$/.test(formData.newPassword)) {
      regexPassword = {...regexPassword, amount: true}
    }
    if(!/[A-Z]/.test(formData.newPassword)) {
      regexPassword = {...regexPassword, upperCase: true}
    }
    if(!/[a-z]/.test(formData.newPassword)) {
      regexPassword = {...regexPassword, lowerCase: true}
    }
    if(!/(?=.*?[0-9])/.test(formData.newPassword)) {
      regexPassword = {...regexPassword, number: true}
    }
    if(!/[!@#?!%&*]/.test(formData.newPassword)) {
      regexPassword = {...regexPassword, special: true}
    }
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = t('username.confirmPasswordRequired')
    }
    if(/\s/.test(formData.confirmPassword)) {
      validationErrors.newPassword = t('username.noSpacesInPassword')
      validationErrors.confirmPassword = t('username.noSpacesInPassword')
    }
    if(formData.confirmPassword !== formData.newPassword) {
      validationErrors.confirmPassword = t('username.passwordMismatch')
    }

    if(Object.keys(regexPassword).length > 0) validationErrors.regexPassword = regexPassword

    if(formData.password === "") {
      validationErrors.password = t('username.errEnterPassword')
    }

    if(formData.password !== "") {
      const result = await fetch(`/api/user/getToken?a=${btoa(userInfo.email)}&q=${btoa(formData.password)}&s=${"true"}`, {method: "GET"})
        .then(res => res.json())
      if(result.error) {
        validationErrors.password = t('username.incorrectPassword')
      }
    }
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false)
    } else {
      const reg = new RegExp("(?<=:).*")
      const [ id ] = reg.exec(userInfo?.id)
  
      const result = await fetch(`/api/user/updatePassword?b=${btoa(id)}&p=${btoa(formData.newPassword)}`, {method: "GET"})
        .then(res => res.json())

      if(result?.success === true) {
        setFormData({
          password: "",
          newPassword: "",
          confirmPassword: ""
        })
        newPasswordModal.onOpen()
      }
    }
    setIsLoading(false)
  }

  return (
    <Stack spacing="24px" maxWidth="480px">
      <Box display={isLoading ? "flex" : "none"} position="fixed" top="0" left="0" width="100%" height="100%" zIndex="99999"/>

      <ModalGeneral
        isOpen={newPasswordModal.isOpen}
        onClose={newPasswordModal.onClose}
      >
        <Stack spacing={0} marginBottom="16px">
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <Stack spacing="24px" alignItems="center" textAlign="center" marginBottom="24px">
          <EmailRecoveryImage/>
          <SectionTitle
            lineHeight="40px"
          >{t('username.passwordChangedSuccessfully')}</SectionTitle>
          <ExtraInfoTextForm
            fontSize="16px"
            letterSpacing="0.2px"
            lineHeight="24px"
          >{t('username.useNewPassword')}</ExtraInfoTextForm>
        </Stack>

        <Stack
          flexDirection={isMobileMod() ? "column-reverse" : "row"}
          spacing={0}
          justifyContent="center"
          gap="24px"
          width="100%"
        >
          <RoundedButton
            borderRadius="30px"
            backgroundColor="#FFF"
            border="1px solid #42B0FF"
            color="#42B0FF"
            width={isMobileMod() ? "100%" : "fit-content"}
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => window.open(`/user/${userInfo.username}`, "_self")}
          >
            {t('username.continueSettings')}
          </RoundedButton>

          <RoundedButton
            borderRadius="30px"
            width={isMobileMod() ? "100%" : "fit-content"}
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => window.open("/", "_self")}
          >
            {t('username.goToHomepage')}
          </RoundedButton>
        </Stack>
      </ModalGeneral>

      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={!!errors.password}>
          <Box
            display="flex"
            flexDirection="row"
            width="100%"
            marginBottom="8px"
          >
            <LabelTextForm width="100%" text={t('username.currentPassword')} margin="0 !important"/>
            <ButtonSimple
              display={isMobileMod() ? "none" : "flex"}
              position="relative"
              top="-2px"
              width="inherit"
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
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            placeholder={t('username.enterCurrentPassword')}
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
            <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.password}
          </FormErrorMessage>
          <ButtonSimple
            display={isMobileMod() ? "flex" : "none"}
            fontWeight="400"
            color="#42B0FF"
            letterSpacing="0.3px"
            fontSize="12px"
            _hover={{opacity: "0.6"}}
            marginTop="8px"
            onClick={() => window.open("./password-recovery", "_self")}
          >{t('username.forgotPassword')}
          </ButtonSimple>
        </FormControl>

        <FormControl marginTop="24px" isInvalid={!!errors.newPassword || !!errors.regexPassword}>
          <LabelTextForm text={t('username.newPassword')}/>
          <InputForm
            type={showNewPassword ? "password" : "text"}
            id="newPassword"
            name="newPassword"
            autoComplete="new-password"
            value={formData.newPassword}
            onChange={(e) => handleInputChange(e, "newPassword")}
            placeholder={t('username.createNewPassword')}
            fontFamily="ubuntu"
            height="40px"
            fontSize="14px"
            borderRadius="16px"
            _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
            styleElmRight={{
              width: "50px",
              height: "40px",
              cursor: "pointer",
              onClick: () => setShowNewPassword(!showNewPassword)
            }}
            elmRight={showNewPassword ?
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
          <Text 
            margin="8px 0"
            color= { errors?.regexPassword ? Object.keys(errors?.regexPassword).length > 0 ? "#D93B3B" : "#7D7D7D" : "#7D7D7D" }
            fontFamily= "Ubuntu"
            fontSize= "12px"
            fontWeight= "400"
            lineHeight= "16px"
            letterSpacing= "0.3px"
            display="flex"
            flexDirection="row"
            gap="4px"
            alignItems="flex-start"
          ><Exclamation width="14px" height="14px" fill="#D93B3B" display={ errors?.regexPassword ? Object.keys(errors?.regexPassword).length > 0 ? "flex" : "none" : "none"}/> {t('username.passwordRequirements')}</Text>
          <UnorderedList fontSize="12px" fontFamily="Ubuntu" position="relative" left="2px">
            <ListItem fontSize="12px" color={errors?.regexPassword?.amount ? "#D93B3B" :"#7D7D7D"}>{t('username.minCharacters')}</ListItem>
            <ListItem fontSize="12px" color={errors?.regexPassword?.upperCase ? "#D93B3B" :"#7D7D7D"}>{t('username.uppercaseLetter')}</ListItem>
            <ListItem fontSize="12px" color={errors?.regexPassword?.lowerCase ? "#D93B3B" :"#7D7D7D"}>{t('username.lowercaseLetter')}</ListItem>
            <ListItem fontSize="12px" color={errors?.regexPassword?.number ? "#D93B3B" :"#7D7D7D"}>{t('username.digit')}</ListItem>
            <ListItem fontSize="12px" color={errors?.regexPassword?.special ? "#D93B3B" :"#7D7D7D"}>{t('username.specialCharacter')}</ListItem>
          </UnorderedList>
          {errors.newPassword &&
            <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
              <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.newPassword}
            </FormErrorMessage>
          }
        </FormControl>

        <FormControl marginTop="24px" isInvalid={!!errors.confirmPassword}>
          <LabelTextForm text={t('username.confirmNewPassword')} />
          <InputForm
            type={showConfirmPassword ? "password" : "text"}
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange(e, "confirmPassword")}
            placeholder={t('username.enterPasswordAgain')}
            fontFamily="ubuntu"
            height="40px"
            fontSize="14px"
            borderRadius="16px"
            _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
            styleElmRight={{
              width: "50px",
              height: "40px",
              cursor: "pointer",
              onClick: () => setShowConfirmPassword(!showConfirmPassword)
            }}
            elmRight={showConfirmPassword ?
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
            <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.confirmPassword}
          </FormErrorMessage>
        </FormControl>

        <RoundedButton
          type="submit"
          marginTop="24px"
          borderRadius="30px"
          _hover={{transform: "none", opacity: 0.8}}
          width="fit-content"
          isDisabled={isLoading}
        >
          {isLoading ?
            <Spinner />
            :
            t('username.updatePassword')
          }
        </RoundedButton>
      </form>
    </Stack>
  )
}