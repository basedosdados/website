import {
  Stack,
  Box,
  Text,
  Divider,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Image,
  Tooltip,
  HStack,
  useDisclosure,
  ModalCloseButton,
  UnorderedList,
  ListItem,
  Badge,
  Grid,
  GridItem,
  SkeletonCircle,
  SkeletonText,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Spinner
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cookies from 'js-cookie';
import { serialize } from 'cookie';
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../../components/templates/main";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import { ControlledInputSimple } from "../../components/atoms/ControlledInput";
import Checkbox from "../../components/atoms/Checkbox";
import BigTitle from "../../components/atoms/BigTitle";
import SectionTitle from "../../components/atoms/SectionTitle";
import RoundedButton from "../../components/atoms/RoundedButton";
import ButtonSimple from "../../components/atoms/SimpleButton";
import InputForm from "../../components/atoms/SimpleInput";
import Link from "../../components/atoms/Link";
import Toggle from "../../components/atoms/Toggle";
import { CardPrice } from "../prices";
import PaymentSystem from "../../components/organisms/PaymentSystem";
import ImageCrop from "../../components/molecules/ImgCrop";
import { cleanString, triggerGAEvent } from "../../utils";

import {
  LabelTextForm,
  TitleTextForm,
  SkStack,
  ExtraInfoTextForm,
  ModalGeneral
} from "../../components/molecules/uiUserPage";

import Exclamation from "../../public/img/icons/exclamationIcon";
import PenIcon from "../../public/img/icons/penIcon";
import GithubIcon from "../../public/img/icons/githubIcon";
import TwitterIcon from "../../public/img/icons/twitterIcon";
import LinkedinIcon from "../../public/img/icons/linkedinIcon";
import { EmailConfirmImage, EmailRecoveryImage } from "../../public/img/emailImage";
import ChevronIcon from "../../public/img/icons/chevronIcon";
import { EyeIcon, EyeOffIcon } from "../../public/img/icons/eyeIcon";
import CheckIcon from "../../public/img/icons/checkIcon";
import CrossIcon from "../../public/img/icons/crossIcon";
import InfoIcon from "../../public/img/icons/infoIcon";
import { SuccessIcon } from "../../public/img/icons/successIcon";
import ErrIcon from "../../public/img/icons/errIcon";
import stylesPS from "../../styles/paymentSystem.module.css";

export async function getServerSideProps(context) {
  const { req, res, locale } = context
  let user = null

  if(req.cookies.userBD) user = JSON.parse(req.cookies.userBD)

  if (user === null || Object.keys(user).length < 0) {
    res.setHeader('Set-Cookie', serialize('token', '', {maxAge: -1, path: '/', }))

    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      }
    }
  }

  const validateTokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/api/user/validateToken?p=${btoa(req.cookies.token)}`, {method: "GET"})
  const validateToken = await validateTokenResponse.json()

  if(validateToken.error) {
    const refreshTokenResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/api/user/refreshToken?p=${btoa(req.cookies.token)}`, {method: "GET"})
    const refreshToken = await refreshTokenResponse.json()

    if(refreshToken.error) {
      res.setHeader('Set-Cookie', serialize('token', '', {maxAge: -1, path: '/', }))
      res.setHeader('Set-Cookie', serialize('userBD', '', { maxAge: -1, path: '/', }))

      return {
        redirect: {
          destination: "/user/login",
          permanent: false,
        }
      }
    }
  }

  const reg = new RegExp("(?<=:).*")
  const [ id ] = reg.exec(user.id)

  const getUserResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_FRONTEND}/api/user/getUser?p=${btoa(id)}&q=${btoa(req.cookies.token)}`, {method: "GET"})
  const getUser = await getUserResponse.json()

  if(getUser.errors) {
    res.setHeader('Set-Cookie', serialize('token', '', {maxAge: -1, path: '/', }))
    res.setHeader('Set-Cookie', serialize('userBD', '', { maxAge: -1, path: '/', }))

    return {
      redirect: {
        destination: "/user/login",
        permanent: false,
      }
    }
  }

  const userDataString = JSON.stringify(getUser)
  res.setHeader('Set-Cookie', serialize('userBD', userDataString, { maxAge: 60 * 60 * 24 * 7, path: '/'}))

  return {
    props: {
      ...(await serverSideTranslations(locale, ['menu', 'user', 'prices'])),
      getUser,
    }
  }
}

// Sections Of User Page
const ProfileConfiguration = ({ userInfo }) => {
  const { t } = useTranslation('user');
  const [isLoading, setIsLoading] = useState(true)
  const [isImgLoading, setIsImgLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    isEmailVisible: false,
    website: "",
    github: "",
    twitter: "",
    linkedin: ""
  })
  const [pictureProfile, setPictureProfile] = useState("")
  const [errors, setErrors] = useState({})
  const menuAvatar = useDisclosure()
  const pictureModal = useDisclosure()
  const [picture, setPicture] = useState("")
  const [fileInputKey, setFileInputKey] = useState(Date.now())
  const router = useRouter()

  useEffect(() => {
    if(Object.keys(userInfo).length === 0) return null

    setFormData({
      firstName: userInfo?.firstName,
      lastName: userInfo?.lastName || "",
      isEmailVisible: userInfo?.isEmailVisible,
      website: userInfo?.website || "",
      github: userInfo?.github || "",
      twitter: userInfo?.twitter || "",
      linkedin: userInfo?.linkedin || ""
    })

    setPictureProfile(userInfo?.picture || "")

    setTimeout(() => {
      setIsLoading(false)
    }, [1000])
  }, [userInfo])

  useEffect(() => {
    setIsImgLoading(isLoading)
  }, [isLoading])

  function handleInputChange (e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  function handleCheckboxChange (e) {
    setFormData((prevState) => ({
      ...prevState,
      isEmailVisible: !formData.isEmailVisible
    }))
  }

  async function handleUpdateProfile () {
    setIsLoading(true)
    const validationErrors = {}

    if (!formData.firstName) {
      validationErrors.firstName = t('username.requiredField')
    }
    if(/\s/.test(formData.website)) {
      validationErrors.website = t('username.noSpaces')
    }
    if(/\s/.test(formData.github)) {
      validationErrors.github = t('username.noSpaces')
    }
    if(/\s/.test(formData.twitter)) {
      validationErrors.twitter = t('username.noSpaces')
    }
    if(/\s/.test(formData.linkedin)) {
      validationErrors.linkedin = t('username.noSpaces')
    }
    if (formData.website) {
      if(!formData.website.startsWith("http")) validationErrors.website = t('username.invalidURL')
    }

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return setIsLoading(false)
    } else {
      const reg = new RegExp("(?<=:).*")
      const [ id ] = reg.exec(userInfo?.id)
      const form = {...formData, id: id }

      const result = await fetch(`/api/user/updateProfile?p=${btoa(form.id)}&f=${btoa(cleanString(form.firstName))}&l=${btoa(cleanString(form?.lastName || "") || "null")}&e=${btoa(form?.isEmailVisible || "false")}&w=${btoa(form?.website || "null")}&g=${btoa(form?.github || "null")}&t=${btoa(form?.twitter || "null")}&li=${btoa(form?.linkedin || "null")}`, { method: "GET" })
        .then(res => res.json())

      if(result.errors.length > 0) {
        result.errors.map((elm) => {
          console.error(`Campo ${elm.field}: ${elm.messages}`)
        })
      }

      const userData = await fetch(`/api/user/getUser?p=${btoa(id)}`, { method: "GET" })
        .then(res => res.json())
      cookies.set('userBD', JSON.stringify(userData))
      setIsLoading(false)
    }
  }

  const handleImageChange = (event) => {
    const input = event.target

    if (input.files && input.files[0]) {
      const fileType = input.files[0].type
      if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'image/jpg') {
        const reader = new FileReader()
        reader.onload = function (e) {
          setPicture(e.target.result)
        }
        pictureModal.onOpen()
        reader.readAsDataURL(input.files[0])
      } else {
        setPicture(null)
        input.value = ""
      }
    }
  }

  async function hanlderRemovePicture() {
    setIsImgLoading(true)
    menuAvatar.onClose()
    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(userInfo.id)

    const res = await fetch(`/api/user/deletePictureProfile?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())

    if(res?.ok === true) {
      const userData = await fetch(`/api/user/getUser?p=${btoa(id)}`, {method: "GET"})
        .then(res => res.json())
      cookies.set('userBD', JSON.stringify(userData))
      window.location.reload()
    }
  }

  useEffect(() => {
    setPicture(null)
    setFileInputKey(Date.now())
  }, [pictureModal.isOpen === false])

  return (
    <Stack
      flexDirection={isMobileMod() ? "column-reverse" : "row"}
      justifyContent="space-between"
      spacing={0}
      gap={isMobileMod() ? "40px" : "80px"}
    >
      <Box display={isImgLoading ? "flex" : "none"} position="fixed" top="0" left="0" width="100%" height="100%" zIndex="99999"/>

      <ImageCrop
        isOpen={pictureModal.isOpen}
        onClose={pictureModal.onClose}
        src={picture}
        id={userInfo.id}
        username={userInfo.username}
        email={userInfo.email}
      />

      <Stack spacing="24px" flex={1}>
        <FormControl isInvalid={!!errors.firstName}>
          <LabelTextForm text={t('username.firstName')}/>
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={t('username.enterFirstName')}
              fontFamily="ubuntu"
              height="40px"
              fontSize="14px"
              borderRadius="16px"
              _placeholder={{color: "#A3A3A3"}}
              _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
            />
          </SkStack>
          <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
            <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.firstName}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
          <LabelTextForm text={t('username.lastName')}/>
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder={t('username.enterLastName')}
              fontFamily="ubuntu"
              height="40px"
              fontSize="14px"
              borderRadius="16px"
              _placeholder={{color: "#A3A3A3"}}
              _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
            />
          </SkStack>
        </FormControl>

        <FormControl>
          <LabelTextForm text={t('username.email')}/>
          <SkeletonText
            isLoaded={!isLoading}
            fadeDuration={2}
            height="20px"
            width="100%"
            noOfLines={2}
            startColor="#F0F0F0"
            endColor="#F3F3F3"
          >
            <label
              style={{
                display:"flex",
                flexDirection:"row",
                gap:"8px",
                cursor:"pointer",
                alignItems:"center",
                color:"#7D7D7D",
                fontFamily:"Ubuntu",
                fontSize:"14px",
                fontWeight:"400",
                lineHeight:"20px",
                letterSpacing:"0.3px",
              }}
            >
              <Checkbox
                id="isEmailVisible"
                name="isEmailVisible"
                defaultChecked={formData.isEmailVisible}
                checked={formData.isEmailVisible}
                onChange={handleCheckboxChange}
              />
              {t('username.makeEmailPublic')}
            </label>
          </SkeletonText>
        </FormControl>

        <FormControl isInvalid={!!errors.website}>
          <LabelTextForm text={t('username.url')}/>
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder={t('username.enterURL')}
              fontFamily="ubuntu"
              height="40px"
              fontSize="14px"
              borderRadius="16px"
              _placeholder={{color: "#A3A3A3"}}
              _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
            />
          </SkStack>
          <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
            <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.website}
          </FormErrorMessage>
        </FormControl>
        
        <Stack>
          <LabelTextForm text={t('username.socialMedia')}/>
          <FormControl isInvalid={!!errors.github}>
            <HStack spacing="8px" margin="0 0 8px 0 !important">
              <GithubIcon width="24px" height="24px" fill="#D0D0D0"/>
              <SkStack isLoaded={!isLoading}>
                <InputForm
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder={t('username.githubProfileLink')}
                  fontFamily="ubuntu"
                  height="40px"
                  fontSize="14px"
                  borderRadius="16px"
                  _placeholder={{color: "#A3A3A3"}}
                />
              </SkStack>
              <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
                <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.github}
              </FormErrorMessage>
            </HStack>
          </FormControl>

          <FormControl isInvalid={!!errors.twitter}>
            <HStack spacing="8px" margin="0 0 8px 0 !important">
              <TwitterIcon width="24px" height="24px" fill="#D0D0D0"/>
              <SkStack isLoaded={!isLoading}>
                <InputForm
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  placeholder={t('username.twitterProfileLink')}
                  fontFamily="ubuntu"
                  height="40px"
                  fontSize="14px"
                  borderRadius="16px"
                  _placeholder={{color: "#A3A3A3"}}
                />
              </SkStack>
              <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
                <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.twitter}
              </FormErrorMessage>
            </HStack>
          </FormControl>

          <FormControl isInvalid={!!errors.linkedin}>
            <HStack spacing="8px"  margin="0 !important">
              <LinkedinIcon width="24px" height="24px" fill="#D0D0D0"/>
              <SkStack isLoaded={!isLoading}>
                <InputForm
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder={t('username.linkedinProfileLink')}
                  fontFamily="ubuntu"
                  height="40px"
                  fontSize="14px"
                  borderRadius="16px"
                  _placeholder={{color: "#A3A3A3"}}
                />
              </SkStack>
              <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
                <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.linkedin}
              </FormErrorMessage>
            </HStack>
          </FormControl>
        </Stack>

        <Text
          fontFamily="ubuntu"
          fontSize="12px"
          fontWeight="400"
          lineHeight="16px"
          letterSpacing="0.3px"
          color="#7D7D7D"
        >
          {t('username.shareInfo')}
        </Text>

        <RoundedButton
          borderRadius="30px"
          width={isMobileMod() ? "100%" : "fit-content"}
          _hover={{transform: "none", opacity: 0.8}}
          onClick={() => handleUpdateProfile()}
          isDisabled={isLoading}
        >
          {isLoading ?
            <Spinner />
          :
            t('username.updateProfile')
          }
        </RoundedButton>
      </Stack>

      <Stack
        width={isMobileMod() ? "100%" : "fit-content"}
        alignItems="center"
      >
        <SectionTitle
          textAlign={isMobileMod() ? "start" :"center"}
          width="100%"
          fontSize="18px"
          letterSpacing="0.1px"
        >{t('username.profilePicture')}</SectionTitle>

        <SkeletonCircle
          position="relative"
          height="200px"
          width="200px"
          startColor="#F0F0F0"
          endColor="#F3F3F3"
          isLoaded={!isImgLoading}
          fadeDuration={2}
        >
          <Box
            position="relative"
            width="200px"
            height="200px"
          > 
              <Box
                borderRadius="50%"
                overflow="hidden"
              >
                <Image
                  src={pictureProfile ? pictureProfile : "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"}
                  width="100%"
                  height="100%"
                />
              </Box>

              <Popover
                returnFocusOnClose={false}
                isOpen={menuAvatar.isOpen}
                onClose={menuAvatar.onClose}
              >
                <PopoverTrigger>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="absolute"
                    cursor="pointer"
                    bottom="10px"
                    left="10px"
                    width="32px"
                    height="32px"
                    borderRadius="50%"
                    backgroundColor="#2B8C4D"
                    onClick={() => { menuAvatar.onOpen() }}
                  >
                    <Tooltip
                      hasArrow
                      isDisabled={menuAvatar.isOpen}
                      bg="#2A2F38"
                      label={t('username.edit')}
                      fontSize="14px"
                      fontWeight="400"
                      letterSpacing="0.5px"
                      lineHeight="24px"
                      padding="5px 16px 6px"
                      marginTop="10px"
                      color="#FFF"
                      borderRadius="6px"
                      minWidth="96px"
                      textAlign="center"
                    >
                      <PenIcon
                        width="22px"
                        height="22px"
                        fill="#FFF"
                      />
                    </Tooltip>
                  </Box>
                </PopoverTrigger>
                <PopoverContent
                  maxWidth="160px"
                  boxShadow="0 1.6px 16px 0 rgba(100, 96, 103, 0.16) !important"
                >
                  <PopoverArrow/>
                  <PopoverBody
                    padding="8px 24px"
                    zIndex="1000000 !important"
                  >
                    <FormControl>
                      <FormLabel
                        cursor="pointer"
                        fontFamily="Lato"
                        fontSize="14px"
                        letterSpacing="0.5px"
                        fontWeight="400"
                        color="#252A32"
                        margin="0"
                        _hover={{ color: "#42B0FF" }}
                      >{t('username.updatePicture')}</FormLabel>
                      <Input
                        key={fileInputKey}
                        display="none"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={handleImageChange}
                      />
                    </FormControl>

                    <Text
                      paddingTop="8px"
                      cursor="pointer"
                      fontFamily="Lato"
                      fontSize="14px"
                      letterSpacing="0.5px"
                      fontWeight="400"
                      color="#252A32"
                      _hover={{ color: "#42B0FF" }}
                      onClick={() => hanlderRemovePicture()}
                    >{t('username.removePicture')}</Text>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
          </Box>
        </SkeletonCircle>
      </Stack>
    </Stack>
  )
}

const Account = ({ userInfo }) => {
  const { t } = useTranslation('user');
  const router = useRouter()
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
      router.push({
        pathname: '/user/[username]',
        query: { 
          username: formData.username,
          account: '' 
        }
      }, undefined, { locale: router.locale })
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
        return router.push('/', undefined, { locale: router.locale })
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
                  onClick={() => router.push('/user/password-recovery', undefined, { locale: router.locale })}
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
          href="/contact"
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

const NewPassword = ({ userInfo }) => {
  const { t } = useTranslation('user');
  const router = useRouter()
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
    const regexPassword = {}
    const validationErrors = {}

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
            onClick={() => router.push(`/user/${userInfo.username}`, undefined, { locale: router.locale })}
          >
            {t('username.continueSettings')}
          </RoundedButton>

          <RoundedButton
            borderRadius="30px"
            width={isMobileMod() ? "100%" : "fit-content"}
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => router.push('/', undefined, { locale: router.locale })}
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
              onClick={() => router.push('/user/password-recovery', undefined, { locale: router.locale })}
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
            onClick={() => router.push('/user/password-recovery', undefined, { locale: router.locale })}
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

const PlansAndPayment = ({ userData }) => {
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
  const [hasSubscribed, setHasSubscribed] = useState(true)

  const [plans, setPlans] = useState(null)
  const [toggleAnual, setToggleAnual] = useState(true)

  const subscriptionInfo = userData?.internalSubscription?.edges?.[0]?.node

  async function alreadySubscribed(id) {
    const result = await fetch(`/api/user/getAlreadySubscribed?p=${btoa(id)}`)
      .then(res => res.json())
    setHasSubscribed(result?.edges.length > 0)
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
      if(subscriptionInfo?.isActive === true) return AlertChangePlanModal.onOpen()
      setPlan(query.i)
    }
  }, [query])

  const planActive = subscriptionInfo?.isActive === true

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
          borderColor: subscriptionInfo?.canceledAt ? "#ACAEB1" : "#42B0FF",
          color: subscriptionInfo?.canceledAt ? "#ACAEB1" : "#42B0FF",
          pointerEvents: subscriptionInfo?.canceledAt ? "none" : "default"
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
          borderColor: subscriptionInfo?.canceledAt ? "#ACAEB1" : "#42B0FF",
          color: subscriptionInfo?.canceledAt ? "#ACAEB1" : "#42B0FF",
          pointerEvents: subscriptionInfo?.canceledAt ? "none" : "default"
        }
      }],
      resources : [
        {name: t('username.accessFor10Accounts')},
        {name: t('username.prioritySupport')}
      ]}
  }

  const defaultResource = resources["BD Gratis"]
  const planResource = resources[subscriptionInfo?.stripeSubscription]
  const planCanceled = subscriptionInfo?.canceledAt

  const controlResource  = () => {
    return planActive ? planResource : defaultResource
  }

  const IncludesFeature = ({ elm, index }) => {
    return (
      <Box key={index} display="flex" alignItems="center">
        <CheckIcon fill="#2B8C4D" width="24px" height="24px" marginRight="8px"/>
        <Text
          color="#252A32"
          fontFamily="Ubuntu"
          fontSize="16px"
          fontWeight="400"
          lineHeight="24px"
          letterSpacing="0.2px"
        >{elm.name}</Text>
        {elm.tooltip &&
          <Tooltip
            hasArrow
            placement="top"
            bg="#2A2F38"
            label={elm.tooltip}
            fontSize="14px"
            fontWeight="400"
            padding="5px 16px 6px"
            letterSpacing="0.5px"
            lineHeight="24px"
            color="#FFF"
            borderRadius="6px"
          >
            <InfoIcon width="14px" height="14px" alt="tip" cursor="pointer" fill="#A3A3A3" marginLeft="16px"/>
          </Tooltip>
        }
      </Box>
    )
  }

  const NotIncludesFeature = ({ elm, index }) => {
    return (
      <Box key={index} display="flex" alignItems="center">
        <CrossIcon fill="#FF8484" width="24px" height="24px" marginRight="8px"/>
        <Text
          color="#252A32"
          fontFamily="Ubuntu"
          fontSize="16px"
          fontWeight="400"
          lineHeight="24px"
          letterSpacing="0.2px"
        >{elm.name}</Text>
        {elm.tooltip &&
          <Tooltip
            hasArrow
            placement="top"
            bg="#2A2F38"
            label={elm.tooltip}
            fontSize="14px"
            fontWeight="400"
            padding="5px 16px 6px"
            letterSpacing="0.5px"
            lineHeight="24px"
            color="#FFF"
            borderRadius="6px"
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

    const subs = await fetch(`/api/stripe/getSubscriptionActive?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())

    const result = await fetch(`/api/stripe/removeSubscription?p=${btoa(subs[0]?.node._id)}`, {method: "GET"})
      .then(res => res.json())

    if(result?.success === false) {
      setIsLoadingCanSub(false)
    }

    const user = await fetch(`/api/user/getUser?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())
    cookies.set('userBD', JSON.stringify(user))
    router.push({
      pathname: '/user/[username]',
      query: { 
        username: userData.username,
        plans_and_payment: '' 
      }
    }, undefined, { locale: router.locale })
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

    if(isLoadingH === true) return router.push('/', undefined, { locale: router.locale })
    router.push({
      pathname: '/user/[username]',
      query: { 
        username: userData.username,
        plans_and_payment: '' 
      }
    }, undefined, { locale: router.locale })
  }

  function formatTimeStamp (value) {
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
    <Stack>
      <Box display={isLoading || isLoadingH ? "flex" : "none"} position="fixed" top="0" left="0" width="100%" height="100%" zIndex="99999"/>

      {/* stripe */}
      <ModalGeneral
        classNameBody={stylesPS.modal}
        isOpen={PaymentModal.isOpen}
        onClose={() => {
          setToggleAnual(true)
          setValueCoupon("")
          if(query.i) return router.push({
            pathname: '/user/[username]',
            query: { 
              username: userData.username,
              plans_and_payment: '' 
            }
          }, undefined, { locale: router.locale })
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
          <Text
            width="100%"
            fontFamily="Roboto"
            fontWeight="400"
            color="#2B8C4D"
            fontSize="14px"
            lineHeight="20px"
          >
            {t('username.step2of2')}
          </Text>
          <Text
            width="100%"
            fontFamily="Roboto"
            fontWeight="500"
            color="#252A32"
            fontSize="24px"
            lineHeight="36px"
          >
            {t('username.payment')}
          </Text>
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
                <Text
                  fontFamily="Roboto"
                  fontWeight="500"
                  fontSize="16px"
                  lineHeight="24px"
                  color="#252A32"
                >
                  {checkoutInfos?.productName}
                </Text>
                <Text
                  cursor="pointer"
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="16px"
                  lineHeight="24px"
                  color="#0068C5"
                  _hover={{color: "#0057A4"}}
                  marginLeft="auto"
                  onClick={() => {
                    PaymentModal.onClose()
                    setToggleAnual(true)
                    setCoupon("")
                    setValueCoupon("")
                    PlansModal.onOpen()
                  }}
                >{t('username.changePlan')}</Text>
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
                        defaultChecked
                        value={toggleAnual}
                        onChange={() => changeIntervalPlanCheckout()}
                      />
                    : 
                      <Toggle
                        value={toggleAnual}
                        onChange={() => changeIntervalPlanCheckout()}
                      />
                  }
                  <Text
                    fontFamily="Roboto"
                    fontWeight="400"
                    fontSize="16px"
                    lineHeight="24px"
                    color="#252A32"
                  >
                    {t('username.annualDiscount')}
                  </Text>
                </Box>

                <Text
                  as="span"
                  color="#2B8C4D"
                  backgroundColor="#D5E8DB"
                  fontFamily="Roboto"
                  fontWeight="500"
                  lineHeight="28px"
                  padding="2px 4px"
                  borderRadius="4px"
                  height="32px"
                >
                  {t('username.save20')}
                </Text>
              </Box>
            </Stack>

            <Stack
              flexDirection="column"
              spacing={0}
              gap="8px"
            >
              <Text
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="16px"
                lineHeight="24px"
                color="#252A32"
              >
                {t('username.discountCoupon')}
              </Text>

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

                <Box
                  as="button"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width={{base: "100%", lg: "fit-content"}}
                  height="44px"
                  borderRadius="8px"
                  padding="10px 34px"
                  border="1px solid"
                  cursor="pointer"
                  backgroundColor="#FFF"
                  color="#2B8C4D"
                  borderColor="#2B8C4D"
                  _hover={{
                    borderColor: "#22703E",
                    color: "#22703E"
                  }}
                  fontFamily="Roboto"
                  fontWeight="500"
                  fontSize="14px"
                  lineHeight="20px"
                  onClick={() => validateStripeCoupon()}
                >
                  {t('username.apply')}
                </Box>
              </Box>

              {errCoupon && 
                <Text
                  display="flex"
                  flexDirection="row"
                  fontFamily="Roboto"
                  fontSize="14px"
                  lineHeight="20px"
                  fontWeight="400"
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
                </Text>
              }
            </Stack>

            <Text
              display={hasSubscribed ? "none" : "flex"}
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="16px"
              lineHeight="24px"
              color="#464A51"
            >
              {t('username.trialPeriod')}
            </Text>

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
              <Text
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="16px"
                lineHeight="24px"
                color="#464A51"
              >
                A partir do {couponInfos?.duration === "once" && 2} {couponInfos?.duration === "repeating" && couponInfos?.durationInMonths + 1}º {formattedPlanInterval(checkoutInfos?.interval, true)} {!hasSubscribed && "e 7º dia"}, o total a pagar será de {checkoutInfos?.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}/{formattedPlanInterval(checkoutInfos?.interval, true)}.
              </Text>
            }

            <Box display={{base:"none", lg: "flex"}} marginTop="auto !important">
              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width={{base: "100%", lg: "fit-content"}}
                height="40px"
                borderRadius="8px"
                padding="10px 34px"
                border="1px solid"
                cursor="pointer"
                marginTop="24px !important"
                backgroundColor="#FFF"
                color="#2B8C4D"
                borderColor="#2B8C4D"
                _hover={{
                  borderColor: "#22703E",
                  color: "#22703E"
                }}
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="14px"
                lineHeight="20px"
                onClick={() => {
                  PaymentModal.onClose()
                  EmailModal.onOpen()
                }}
              >
                {t('username.back')}
              </Box>
            </Box>
          </Stack>

          <Box display="flex" flexDirection="column" gap="24px" flex={1}>
            <Text
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="16px"
              lineHeight="24px"
              color="#252A32"
            >
              {t('username.paymentDetails')}
            </Text>
            <PaymentSystem
              userData={userData}
              plan={plan}
              coupon={coupon}
              onSucess={() => openModalSucess()}
              onErro={() => openModalErro()}
            />

            <Box display={{base:"flex", lg: "none"}} marginTop="auto !important">
              <Box
                as="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width={{base: "100%", lg: "fit-content"}}
                height="40px"
                borderRadius="8px"
                padding="10px 34px"
                border="1px solid"
                cursor="pointer"
                backgroundColor="#FFF"
                color="#2B8C4D"
                borderColor="#2B8C4D"
                _hover={{
                  borderColor: "#22703E",
                  color: "#22703E"
                }}
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="14px"
                lineHeight="20px"
                onClick={() => {
                  PaymentModal.onClose()
                  EmailModal.onOpen()
                }}
              >
                {t('username.back')}
              </Box>
            </Box>
          </Box>
        </Stack>
      </ModalGeneral>

      {/* email gcp */}
      <ModalGeneral
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
          <Text
            width="100%"
            fontFamily="Roboto"
            fontWeight="400"
            color="#2B8C4D"
            fontSize="14px"
            lineHeight="20px"
          >
            {t('username.step1of2')}
          </Text>
          <ModalCloseButton
            fontSize="14px"
            top="28px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <Stack marginBottom={{base: "24px", lg: "285px !important"}}>
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            color="#252A32"
            fontSize="24px"
            lineHeight="36px"
          >
            {t('username.BQEmail')}
          </Text>

          <Text
            fontFamily="Roboto"
            fontWeight="400"
            color="#464A51"
            fontSize="16px"
            lineHeight="24px"
            marginBottom="32px !important"
          >
            {t('username.BQEmailDescription1')}
            <Text as="span" fontWeight="500">{t('username.BQEmailDescription2')}</Text> 
            {t('username.BQEmailDescription3')}
          </Text>

          <Text
            fontFamily="Roboto"
            fontWeight="500"
            color="#252A32"
            fontSize="16px"
            lineHeight="24px"
            marginBottom="8px !important"
          >
            {t('username.BQEmail')}
          </Text>

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
            <Text
              display="flex"
              flexDirection="row"
              fontFamily="Roboto"
              fontSize="14px"
              lineHeight="20px"
              fontWeight="400"
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
            </Text>
          }
        </Stack>

        <Stack
          width="100%"
          spacing={0}
          gap="16px"
          justifyContent="end"
          flexDirection={{base: "column-reverse", lg:"row"}}
        >
          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={{base: "100%", lg:"fit-content"}}
            height="40px"
            borderRadius="8px"
            padding="10px 34px"
            border="1px solid"
            cursor="pointer"
            backgroundColor="#FFF"
            color="#2B8C4D"
            borderColor="#2B8C4D"
            _hover={{
              borderColor: "#22703E",
              color: "#22703E"
            }}
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="14px"
            lineHeight="20px"
            onClick={() => {
              setEmailGCP(userData?.gcpEmail || userData?.email)
              setErrEmailGCP(false)
              EmailModal.onClose()
            
            }}
          >
            {t('username.cancel')}
          </Box>

          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={{base: "100%", lg:"fit-content"}}
            height="40px"
            borderRadius="8px"
            padding="10px 34px"
            border="1px solid"
            cursor="pointer"
            backgroundColor="#2B8C4D"
            color="#FFF"
            borderColor="#2B8C4D"
            _hover={{
              borderColor: "#22703E",
              backgroundColor: "#22703E"
            }}
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="14px"
            lineHeight="20px"
            onClick={() => handlerEmailGcp()}
          >
            {isLoadingEmailChange ?
              <Spinner/>
              :
              t('username.next')
            }
          </Box>
        </Stack>
      </ModalGeneral>

      {/* success */}
      <ModalGeneral
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
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="24px"
            lineHeight="36px"
            color="#252A32"
          >
            {t('username.congratulations')}
          </Text>
          <Text
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="16px"
            lineHeight="24px"
            color="#464A51"
          >
            {t('username.BQEmailDescription4')} <Text as="span" fontWeight="500">{emailGCP}</Text>.
            {t('username.BQEmailDescription5')}
            
            {t('username.BQEmailDescription6')}
            <Text as="a" href="/contact" target="_self" color="#0068C5" _hover={{color: "#0057A4"}}>{t('username.BQEmailDescription7')}</Text>
          </Text>
        </Stack>

        <Stack
          flexDirection={isMobileMod() ? "column-reverse" : "row"}
          spacing={0}
          gap="24px"
          width="100%"
        >
          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={{base:"100%", lg: "50%"}}
            height="40px"
            borderRadius="8px"
            padding="10px 34px"
            border="1px solid"
            cursor="pointer"
            marginTop="auto !important"
            backgroundColor="#FFF"
            color="#2B8C4D"
            borderColor="#2B8C4D"
            _hover={{
              borderColor: "#22703E",
              color: "#22703E"
            }}
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="14px"
            lineHeight="20px"
            onClick={() => router.push({
              pathname: '/user/[username]',
              query: { 
                username: userData?.username,
                big_query: '' 
              }
            }, undefined, { locale: router.locale })}
          >
            {isLoading ?
              <Spinner/>
              :
              t('username.continueSettings')
            }
          </Box>

          <Box
            as="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={{base:"100%", lg: "50%"}}
            height="40px"
            borderRadius="8px"
            padding="10px 34px"
            border="1px solid"
            cursor="pointer"
            marginTop="auto !important"
            backgroundColor="#2B8C4D"
            color="#FFF"
            borderColor="#2B8C4D"
            _hover={{
              borderColor: "#22703E",
              backgroundColor: "#22703E"
            }}
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="14px"
            lineHeight="20px"
            onClick={() => setIsLoadingH(true)}
          >
            {isLoadingH ?
              <Spinner/>
              :
              t('username.goToHomepage')
            }
          </Box>
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
            fill="#FF8484"
          />
          <Text
            fontFamily="Ubuntu"
            fontWeight="400"
            fontSize="24px"
            lineHeight="40px"
            color="#252A32"
          >
            {t('username.paymentFailed')}
          </Text>
          <Text
            fontFamily="Ubuntu"
            fontWeight="400"
            fontSize="16px"
            lineHeight="22px"
            textAlign="center"
            letterSpacing="0.2px"
            color="#7D7D7D"
          >
            {t('username.paymentError')}
            <Link
              display="inline"
              color="#42B0FF"
              fontFamily="ubuntu"
              fontWeight="600"
              fontSize="16px"
              lineHeight="30px"
              letterSpacing="0.2px"
              href="/contact"
              target="_self"
              marginLeft="2px"
              >{t('username.contactUs')}</Link>
            .
          </Text>
        </Stack>

        <Stack
          width="100%"
          alignItems="center"
          spacing={0}
        >
          <RoundedButton
            borderRadius="30px"
            width="fit-content"
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => ErroPaymentModal.onClose()}
          >
            {t('username.understood')}
          </RoundedButton>
        </Stack>
      </ModalGeneral>

      {/* modal plans */}
      <ModalGeneral
        isOpen={PlansModal.isOpen}
        onClose={PlansModal.onClose}
        propsModal={{
          scrollBehavior: isMobileMod() ? "outside" : "inside",
        }}
        propsModalContent={{
          maxWidth: "fit-content",
          minWidth: "fit-content",
          maxHeight: "fit-content",
          margin: isMobileMod() ? "0" : "24px",
          padding: "32px 22px 26px 22px",
          borderRadius: isMobileMod() ? "0" : "20px",
        }}
        isCentered={isMobileMod() ? false : true}
      >
        <Stack spacing={0} marginBottom="40px">
          <Text
            width="100%"
            fontFamily="Roboto"
            fontWeight="500"
            color="#252A32"
            fontSize="24px"
            lineHeight="36px"
            paddingLeft="10px"
          >
            {t('username.comparePlans')}
          </Text>
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
              defaultChecked
              className="toggle_variant"
              value={toggleAnual}
              onChange={() => setToggleAnual(!toggleAnual)}
            />
            <Text
              position="relative"
              top="-2px"
              gap="8px"
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="18px"
              lineHeight="20px"
              display="flex"
              alignItems="center"
              textAlign="center"
              color="#252A32"
            >
              {t('username.annualDiscount')}
              <Text
                as="span"
                color="#2B8C4D"
                backgroundColor="#D5E8DB"
                fontWeight="500"
                lineHeight="28px"
                padding="2px 4px"
                borderRadius="4px"
                height="32px"
              >
                {t('username.save20')}
              </Text>
            </Text>
          </Box>

          <Stack
            display={isMobileMod() ? "flex" : {base: "flex", lg: "grid"}}
            gridTemplateColumns="repeat(3, 320px)"
            gridTemplateRows="1fr"
            alignItems={isMobileMod() ? "center" : {base: "center", lg: "inherit"}}
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
                href: "/dataset",
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
                text: `${subscriptionInfo?.stripeSubscription === "bd_pro" ? t('username.currentPlan') : hasSubscribed ? t('username.subscribe') : t('username.startFreeTrial')}`,
                onClick: subscriptionInfo?.stripeSubscription === "bd_pro" ? () => {} : () => {
                  setPlan(plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`]._id)
                  PlansModal.onClose()
                  EmailModal.onOpen()
                },
                isCurrentPlan: subscriptionInfo?.stripeSubscription === "bd_pro" ? true : false,
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
                text: `${subscriptionInfo?.stripeSubscription === "bd_pro_empresas" ? t('username.currentPlan') : hasSubscribed ? t('username.subscribe') : t('username.startFreeTrial')}`,
                onClick: subscriptionInfo?.stripeSubscription === "bd_pro_empresas" ? () => {} : () => {
                  setPlan(plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`]._id)
                  PlansModal.onClose()
                  EmailModal.onOpen()
                },
                isCurrentPlan: subscriptionInfo?.stripeSubscription === "bd_pro_empresas" ? true : false,
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
          height={isMobileMod() ? "100%" : "fit-content"}
        >
          <SectionTitle lineHeight={isMobileMod() ? "32px" : "40px"}>
            {t('username.planChange')}
          </SectionTitle>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <Stack spacing="24px" marginBottom="16px">
          <ExtraInfoTextForm fontSize="16px" lineHeight="24px" letterSpacing="0.2px" color="#464A51">
            {t('username.changePlanInstructions')}
          </ExtraInfoTextForm>
        </Stack>

        <Stack
          flexDirection={isMobileMod() ? "column-reverse" : "row"}
          spacing={0}
          gap="24px"
          width={isMobileMod() ? "100%" : "fit-content"}
        >
          <RoundedButton
            borderRadius="30px"
            width={isMobileMod() ? "100%" : "fit-content"}
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => {
              AlertChangePlanModal.onClose()
              router.push('/contact', undefined, { locale: router.locale })
            }}
          >
            {t('username.contactUs')}
          </RoundedButton>
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
          height={isMobileMod() ? "100%" : "fit-content"}
        >
          <SectionTitle lineHeight={isMobileMod() ? "32px" : "40px"}>
            {t('username.confirmPlanCancellation')}
          </SectionTitle>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
          />
        </Stack>

        <Stack/>

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
            onClick={() => CancelModalPlan.onClose()}
          >
            {t('username.back')}
          </RoundedButton>

          <RoundedButton
            borderRadius="30px"
            backgroundColor="#FF8484"
            width={isMobileMod() ? "100%" : ""}
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => setIsLoadingCanSub(true)}
          >
            {isLoadingCanSub ?
              <Spinner />
            :
              t('username.cancelPlan')
            }
          </RoundedButton>
        </Stack>
      </ModalGeneral>

      <Stack spacing="40px">
        <Stack
          width="100%"
          spacing={0}
          flexDirection={isMobileMod() ? "column" : "row"}
          justifyContent="space-between"
        >
          <Stack
            spacing="8px"
            marginBottom={isMobileMod() ? "16px" : "0"}
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
              <Text
                color="#252A32"
                fontFamily="Ubuntu"
                fontSize="28px"
                fontWeight="500"
                lineHeight="36px"
              >{controlResource().title}</Text>
              <Text
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="12px"
                lineHeight="18px"
                letterSpacing="0.1px"
                color="#71757A"
              >
                {formattedPlanInterval(subscriptionInfo?.planInterval)}
              </Text>
            </Box>

            <Box display={subscriptionInfo ? "flex" : "none"}>
              <Text
                fontFamily="Ubuntu"
                fontWeight="400"
                fontSize="16px"
                lineHeight="22px"
                color="#252A32"
              >
                {subscriptionInfo?.canceledAt ? t('username.planAccessUntil') : t('username.nextAutoRenewal')}: <Text
                  as="span"
                  fontWeight="500"
                >
                  {formatTimeStamp(subscriptionInfo?.canceledAt ? subscriptionInfo?.canceledAt : subscriptionInfo?.nextBillingCycle)}
                </Text>
              </Text>
            </Box>
          </Stack>

          <Stack
            spacing={0}
            gap="24px"
            flexDirection={isMobileMod() ? "column-reverse" : "row"}
          >
            <RoundedButton
              borderRadius="30px"
              backgroundColor="#FFF"
              border="1px solid #42B0FF"
              color="#42B0FF"
              width={isMobileMod() ? "100%" : "fit-content"}
              _hover={{transform: "none", opacity: 0.8}}
              onClick={() => controlResource().buttons[0].onClick()}
              {...controlResource()?.buttons?.[0]?.props}
            >{controlResource().buttons[0].text}
            </RoundedButton>
          </Stack>
        </Stack>

        <Stack
          spacing={0}
          gap="64px"
          flexDirection={isMobileMod() ? "column" : {base: "column", lg: "row"}}
        >
          <Stack minWidth="350px" spacing="8px">
            <Text
              color="#7D7D7D"
              fontFamily="Ubuntu"
              fontSize="16px"
              fontWeight="400"
              lineHeight="16px"
              letterSpacing="0.2px"
              marginBottom="8px"
            >{t('username.includes')}</Text>
            {defaultResource.resources.map((elm, index) => {
              if(elm === "") return
              return <IncludesFeature elm={elm} index={index} key={index}/>
            })}
            {subscriptionInfo?.stripeSubscription === "bd_pro" && 
              planResource.resources.map((elm, index) => {
                return <IncludesFeature elm={elm} index={index} key={index}/>
              })
            }
            {subscriptionInfo?.stripeSubscription === "bd_pro_empresas" &&
              <>
                {resources["bd_pro"].resources.map((elm, index) => {
                  return <IncludesFeature elm={elm} index={index} key={index}/>
                })}
                {planResource.resources.map((elm, index) => {
                  return <IncludesFeature elm={elm} index={index} key={index}/>
                })}
              </>
            }
          </Stack>

          <Stack spacing="8px">
            {subscriptionInfo?.stripeSubscription !== "bd_pro_empresas" &&
              <Text
                color="#7D7D7D"
                fontFamily="Ubuntu"
                fontSize="16px"
                fontWeight="400"
                lineHeight="16px"
                letterSpacing="0.2px"
                marginBottom="8px"
              >{t('username.doesNotInclude')}</Text>}

              {!planActive && 
                <>
                  {resources["bd_pro"].resources.map((elm, index) => {
                    return <NotIncludesFeature  elm={elm} index={index} key={index}/>
                  })}
                  {resources["bd_pro_empresas"].resources.map((elm, index) => {
                    return <NotIncludesFeature  elm={elm} index={index} key={index}/>
                  })}
                </>
              }

              {subscriptionInfo?.stripeSubscription === "bd_pro" &&
                resources["bd_pro_empresas"].resources.map((elm, index) => {
                  return <NotIncludesFeature  elm={elm} index={index} key={index}/>
                })
              }

            {!subscriptionInfo?.isActive &&
              <ButtonSimple
                color="#42B0FF"
                fontSize="14px"
                fontWeight="700"
                letterSpacing="0.3px"
                _hover={{opacity: 0.7}}
                marginTop="16px !important"
                onClick={() => {
                  PlansModal.onOpen()
                  setToggleAnual(true)
                }}
              >
                {t('username.viewAllAndComparePlans')}
              </ButtonSimple>
            }
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

const Accesses = ({ userInfo }) => {
  return (
    <Stack spacing="24px">
      <Stack alignItems="end">
        <Tooltip
          hasArrow
          top="-10px"
          placement="top"
          bg="#2A2F38"
          label={t('username.onlyAvailableInBDEnterprises')}
          fontSize="14px"
          fontWeight="400"
          fontFamily="Lato"
          padding="5px 16px 6px"
          letterSpacing="0.5px"
          lineHeight="24px"
          color="#FFF"
          borderRadius="6px"
        >
          <Box width={isMobileMod() ? "100%" : "fit-content"}>
            <RoundedButton
              borderRadius="30px"
              width={isMobileMod() ? "100%" : "fit-content"}
              _hover={{transform: "none"}}
              cursor="default"
              backgroundColor="#C4C4C4"
            >{t('username.addUser')}</RoundedButton>
          </Box>
        </Tooltip>
      </Stack>

      <Grid templateColumns={isMobileMod() ? "1fr 1fr" : "3fr 1fr"}>
        <GridItem>
          <Text
            backgroundColor="#F6F6F6"
            padding={isMobileMod() ? "8px 0 8px 16px" : "8px 24px"}
            color="#6F6F6F"
            fontFamily="Ubuntu"
            fontSize="16px"
            fontWeight="400"
            lineHeight="16px"
            letterSpacing="0.2px"
          >{t('username.user')}</Text>
        </GridItem>
        <GridItem>
          <Text
            backgroundColor="#F6F6F6"
            padding={isMobileMod() ? "8px 16px" : "8px 24px"}
            color="#6F6F6F"
            fontFamily="Ubuntu"
            fontSize="16px"
            fontWeight="400"
            lineHeight="16px"
            letterSpacing="0.2px"
            width="100%"
          >{t('username.access')}</Text>
        </GridItem>

        <GridItem
          overflow="hidden"
          padding={isMobileMod() ? "24px 0" : "24px"}
          borderBottom="1px solid #DEDFE0"
        >
          <Stack
            width="100%"
            position="relative"
            overflow="hidden"
            flexDir="column"
            spacing={0}
            paddingLeft={isMobileMod() ? "16px" : "0"}
            flexDirection="row"
            alignItems={isMobileMod() ? "stretch" : "stretch"}
            height="54px"
          >
            <Box
              position="absolute"
              width="36px"
              minWidth="36px"
              height="36px"
              minHeight="36px"
              borderRadius="50%"
              overflow="hidden"
              top="9px"
            >
              <Image width="100%" height="100%" src={userInfo?.picture ? userInfo?.picture :"https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"}/>
            </Box>
            <Text
              marginLeft={isMobileMod() ? "44px !important" : "60px !important"}
              color="#252A32"
              fontFamily="Ubuntu"
              fontSize="14px"
              fontWeight="400"
              lineHeight="27px"
              letterSpacing="0.3px"
              height="27px"
              isTruncated
            >{userInfo?.username}</Text>
            <Text
              marginLeft={isMobileMod() ? "44px !important" : "60px !important"}
              color="#6F6F6F"
              fontFamily="Ubuntu"
              fontSize="14px"
              fontWeight="400"
              lineHeight="27px"
              letterSpacing="0.3px"
              height="27px"
              isTruncated
            >{userInfo?.email}</Text>
          </Stack>
        </GridItem>

        <GridItem
          display="flex"
          alignItems="center"
          width="100%"
          padding={isMobileMod() ? "24px 16px" : "24px"}
          borderBottom="1px solid #DEDFE0"
        >
          <Text
            color="#6F6F6F"
            fontFamily="Ubuntu"
            fontSize="14px"
            fontWeight="400"
            lineHeight="27px"
            letterSpacing="0.3px"
          >
            {t('username.administrator')}
          </Text>
        </GridItem>
      </Grid>
    </Stack>
  )
}

const BigQuery = ({ userInfo }) => {
  const [emailGcp, setEmailGcp] = useState(userInfo?.gcpEmail || userInfo?.email)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  async function handleUpdateEmailGcp() {
    setErrors({})
    setIsLoading(true)

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    if(!isValidEmail(emailGcp)) { 
      setErrors({emailGcp: "Por favor, insira um e-mail válido."})
    } else {
      const reg = new RegExp("(?<=:).*")
      const [ id ] = reg.exec(userInfo.id)

      let user
      let attempts = 0
      const maxAttempts = 10
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

      const response = await fetch(`/api/user/changeUserGcpEmail?p=${btoa(emailGcp)}`)
        .then(res => res.json())
      
      if(response.ok) {
        if(emailGcp !== userInfo?.email) {
          if(emailGcp !== userInfo?.gcpEmail) {
            triggerGAEvent("troca_do_email_gcp",`section_bigquery`)
          }
        }

        while (!user?.gcpEmail && attempts < maxAttempts) {
          user = await fetch(`/api/user/getUser?p=${btoa(id)}`, { method: "GET" })
            .then((res) => res.json())
  
          if (user?.gcpEmail) {
            cookies.set("userBD", JSON.stringify(user))
            break
          }
  
          attempts++
          await delay(10000)
        }
      } else {
        setErrors({emailGcp: t('username.pleaseEnterValidEmail')})
      }
    }
    setIsLoading(false)
  }

  return (
    <Stack>
      <Box display={isLoading ? "flex" : "none"} position="fixed" top="0" left="0" width="100%" height="100%" zIndex="99999"/>

      <Text
        fontFamily="Ubuntu"
        fontWeight="400"
        fontSize="16px"
        lineHeight="22px"
        letterSpacing="0.2px"
        color="#252A32"
      >
        {t('username.BQEmail')}
      </Text>

      <Text
        fontFamily="Ubuntu"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
        letterSpacing="0.3px"
        color="#7D7D7D"
      >
        {t('username.BQEmailDescription1')} <Text as="span" fontWeight="500">{t('username.BQEmailDescription2')}</Text> {t('username.BQEmailDescription3')}
      </Text>

      <FormControl isInvalid={!!errors.emailGcp} margin="16px 0 24px !important">
        <InputForm
          id="emailgcp"
          name="emailgcp"
          value={emailGcp}
          onChange={(e) => setEmailGcp(e.target.value)}
          placeholder="Insira o e-mail que deseja utilizar para acessar o BigQuery"
          fontFamily="ubuntu"
          
          maxWidth="480px"
          height="40px"
          fontSize="14px"
          borderRadius="16px"
          _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
        />
        <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
          <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.emailGcp}
        </FormErrorMessage>
      </FormControl>

      <RoundedButton
        borderRadius="30px"
        width={isMobileMod() ? "100%" : "fit-content"}
        _hover={{transform: "none", opacity: 0.8}}
        marginTop="0 !important"
        onClick={() => handleUpdateEmailGcp()}
        isDisabled={isLoading}
      >
        {isLoading ?
          <Spinner />
        :
          t('username.updateEmail')
        }
      </RoundedButton>
    </Stack>
  )
}

export default function UserPage({ getUser }) {
  const { t, ready } = useTranslation('user')
  const router = useRouter()
  const { query } = router
  const [userInfo, setUserInfo] = useState({})
  const [sectionSelected, setSectionSelected] = useState(0)

  if (!ready) return null

  useEffect(() => {
    if (getUser) {
      setUserInfo(getUser)
    }
  }, [getUser])

  const isUserPro = () => {
    if(getUser?.internalSubscription?.edges?.[0]?.node?.isActive === true) return true
    return false
  }

  const choices = [
    {bar: t('username.publicProfile'), title: t('username.publicProfile'), value: "profile", index: 0},
    {bar: t('username.account'), title: t('username.account'), value: "account", index: 1},
    {bar: t('username.changePassword'), title: t('username.changePassword'), value: "new_password", index: 2},
    {bar: t('username.plansAndPayment'), title: t('username.plansAndPayment'), value: "plans_and_payment", index: 3},
    isUserPro() && {bar: "BigQuery", title: "BigQuery", value: "big_query", index: 4},
  ].filter(Boolean)

  useEffect(() => {
    const key = Object.keys(query)
    const removeElem = key.indexOf("username")
    if (removeElem !== -1) key.splice(removeElem, 1)

    if (key.length === 0) return

    for (const elements of choices) {
      if (elements && elements.value === key[0]) {
        setSectionSelected(elements.index)
      }
    }
  }, [query])

  return (
    <MainPageTemplate padding="70px 24px 50px !important" userTemplate>
      <Stack
        paddingTop="50px"
        width="100%"
        maxWidth="1264px"
        flexDirection="column"
        margin="auto"
        spacing={0}
        gap="40px"
      >
        <BigTitle display={isMobileMod() ? "none" : "flex"}>{t('username.settings')}</BigTitle>

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          spacing={0}
          gap="80px"
          width="100%"
          marginBottom={isMobileMod() ? "0px" : "80px !important"}
        >
          <Stack
            display={isMobileMod() ? "none" : "flex"}
            width="fit-content"
          >
            {choices.map((section, index) => (
              <Box
                key={index}
                borderLeft={ sectionSelected === index ? "3px solid #2B8C4D" : "transparent" }
                width="100%"
              >
                <Text
                  fontFamily="Ubuntu"
                  fontSize="16px"
                  lineHeight="27px"
                  letterSpacing="0.2px"
                  cursor="pointer"
                  fontWeight={sectionSelected === index ? "500" : "300"}
                  color={sectionSelected === index ? "#2B8C4D" : "#7D7D7D"}
                  _hover={sectionSelected !== index && {  opacity: "0.6" , fontWeight: "500" }}
                  padding="0 24px"
                  width="100%"
                  onClick={() => router.push({pathname: `/user/${userInfo.username}`, query: section.value})}
                >
                  {section.bar}
                </Text>
              </Box>
            ))}
          </Stack>

          <Stack
            flex={1}
            maxWidth="800px"
            width="100%"
            spacing={0}
          >
            <SectionTitle marginBottom="8px">{choices[sectionSelected].title}</SectionTitle>
            <Divider marginBottom={isMobileMod() ? "40px !important" : "32px !important"} borderColor="#DEDFE0"/>

            {sectionSelected === 0 && <ProfileConfiguration userInfo={userInfo}/>}
            {sectionSelected === 1 && <Account userInfo={userInfo}/>}
            {sectionSelected === 2 && <NewPassword userInfo={userInfo}/>}
            {sectionSelected === 3 && <PlansAndPayment userData={userInfo}/>}
            {sectionSelected === 4 && <BigQuery userInfo={userInfo}/>}
          </Stack>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
