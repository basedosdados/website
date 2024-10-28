import {
  Stack,
  Box,
  Text,
  FormControl,
  useDisclosure,
  ModalCloseButton,
  List,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "../../atoms/Link";

import {
  LabelTextForm,
  ModalGeneral,
  InputForm,
  ErrorMessage,
  Button,
  ListChecked
} from "../../molecules/uiUserPage";

import Exclamation from "../../../public/img/icons/exclamationIcon";
import { SuccessIcon } from "../../../public/img/icons/successIcon";
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
    <Stack spacing="0" maxWidth="480px">
      <Box
        display={isLoading ? "flex" : "none"}
        position="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        zIndex="99999"
      />

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

        <Stack spacing="24px" alignItems="center" textAlign="center" margin="24px 0">
          <SuccessIcon
            width="90px"
            height="90px"
            fill="#34A15A"
          />
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="24px"
            lineHeight="36px"
            color="#252A32"
          >{t('username.passwordChangedSuccessfully')}</Text>
        </Stack>

        <Button
          width="100%"
          onClick={() => window.open("/", "_self")}
        >
          {t('username.goToHomepage')}
        </Button>
      </ModalGeneral>

      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={!!errors.password}>
          <LabelTextForm text={t('username.currentPassword')}/>
          <InputForm
            type={showPassword ? "password" : "text"}
            id="password"
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            placeholder={t('username.enterCurrentPassword')}
            inputElementStyle={{
              cursor: "pointer",
              onClick: () => setShowPassword(!showPassword)
            }}
            icon={showPassword ?
              <EyeOffIcon
                alt={t('username.hidePassword')}
                width="20px"
                height="20px"
                fill="#464A51"
              />
            :
              <EyeIcon
                alt={t('username.showPassword')}
                width="20px"
                height="20px"
                fill="#464A51"
              />
            }
          />
          <ErrorMessage>{errors.password}</ErrorMessage>
          <Link
            marginTop="8px"
            fontWeight="400"
            color="#0068C5"
            _hover={{
              color:"#0057A4",
            }}
            href="/user/password-recovery"
          >{t('username.forgotPassword')}
          </Link>
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
            inputElementStyle={{
              cursor: "pointer",
              onClick: () => setShowNewPassword(!showNewPassword)
            }}
            icon={showNewPassword ?
              <EyeOffIcon
                alt={t('username.hidePassword')}
                width="20px"
                height="20px"
                fill="#464A51"
              />
            :
              <EyeIcon
                alt={t('username.showPassword')}
                width="20px"
                height="20px"
                fill="#464A51"
              />
            }
          />
          <Text 
            margin="8px 0"
            color={errors?.regexPassword ? Object.keys(errors?.regexPassword).length > 0 ? "#BF3434" : "#71757A" : "#71757A" }
            fontFamily="Roboto"
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            display="flex"
            flexDirection="row"
            gap="8px"
            alignItems="flex-start"
          >
            <Exclamation
              display={errors?.regexPassword ? Object.keys(errors?.regexPassword).length > 0 ? "flex" : "none" : "none"}
              width="18px"
              height="18px"
              fill="#BF3434"
            /> {t('username.passwordRequirements')}
          </Text>

          <List
            fontFamily="Roboto"
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            position="relative"
            left="2px"
            display="flex"
            flexDirection="column"
            gap="8px"
          >
            <ListChecked 
              checked={formData.newPassword.length >= 8}
              err={errors?.regexPassword?.amount}
            >
              {t('username.minCharacters')}
            </ListChecked>
            <ListChecked
              checked={/[A-Z]/.test(formData.newPassword)}
              err={errors?.regexPassword?.upperCase}
            >
              {t('username.uppercaseLetter')}
            </ListChecked>
            <ListChecked
              checked={/[a-z]/.test(formData.newPassword)}
              err={errors?.regexPassword?.lowerCase}
            >
              {t('username.lowercaseLetter')}
            </ListChecked>
            <ListChecked
              checked={/\d/.test(formData.newPassword)}
              err={errors?.regexPassword?.number}
            >
              {t('username.digit')}
            </ListChecked>
            <ListChecked
              checked={/[!@#?%&*]/.test(formData.newPassword)}
              err={errors?.regexPassword?.special}
            >
              {t('username.specialCharacter')}
            </ListChecked>
          </List>

          {errors.newPassword &&
            <ErrorMessage>{errors.newPassword}</ErrorMessage>
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
            inputElementStyle={{
              cursor: "pointer",
              onClick: () => setShowConfirmPassword(!showConfirmPassword)
            }}
            icon={showConfirmPassword ?
              <EyeOffIcon
                alt={t('username.hidePassword')}
                width="20px"
                height="20px"
                fill="#464A51"
              />
            :
              <EyeIcon
                alt={t('username.showPassword')}
                width="20px"
                height="20px"
                fill="#464A51"
              />
            }
          />
          <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
        </FormControl>

        <Button
          type="submit"
          marginTop="24px"
          isLoading={isLoading}
          onClick={() => {}}
        >
          {t('username.updatePassword')}
        </Button>
      </form>
    </Stack>
  )
}