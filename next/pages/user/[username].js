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
import { CardPrice } from "../precos";
import PaymentSystem from "../../components/organisms/PaymentSystem";
import ImageCrop from "../../components/molecules/ImgCrop";
import { cleanString } from "../../utils";

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
  const { req, res } = context
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
      getUser,
    }
  }
}

// Sections Of User Page
const ProfileConfiguration = ({ userInfo }) => {
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
      validationErrors.firstName = "Seu nome é um campo obrigatorio."
    }
    if(/\s/.test(formData.website)) {
      validationErrors.website = "Não pode haver espaçamento nesse campo."
    }
    if(/\s/.test(formData.github)) {
      validationErrors.github = "Não pode haver espaçamento nesse campo."
    }
    if(/\s/.test(formData.twitter)) {
      validationErrors.twitter = "Não pode haver espaçamento nesse campo."
    }
    if(/\s/.test(formData.linkedin)) {
      validationErrors.linkedin = "Não pode haver espaçamento nesse campo."
    }
    if (formData.website) {
      if(!formData.website.startsWith("http")) validationErrors.website = "Informe uma URL válida."
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
          <LabelTextForm text="Nome"/>
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Insira seu nome"
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
          <LabelTextForm text="Sobrenome"/>
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Insira seu sobrenome"
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
          <LabelTextForm text="E-mail"/>
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
              Tornar o e-mail de acesso à sua conta visível para o público.
            </label>
          </SkeletonText>
        </FormControl>

        <FormControl isInvalid={!!errors.website}>
          <LabelTextForm text="URL"/>
          <SkStack isLoaded={!isLoading}>
            <InputForm
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="Insira seu endereço URL"
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
          <LabelTextForm text="Redes sociais"/>
          <FormControl isInvalid={!!errors.github}>
            <HStack spacing="8px" margin="0 0 8px 0 !important">
              <GithubIcon width="24px" height="24px" fill="#D0D0D0"/>
              <SkStack isLoaded={!isLoading}>
                <InputForm
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="Link para o perfil no GitHub"
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
                  placeholder="Link para o perfil no Twitter"
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
                  placeholder="Link para o perfil no LinkedIn"
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
          Ao preencher os campos desta página, você nos dá consentimento para compartilhar essas informações onde quer que o seu perfil de usuário apareça.
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
            "Atualizar perfil"
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
        >Foto de perfil</SectionTitle>

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
                      label="Editar"
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
                      >Atualizar a foto</FormLabel>
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
                    >Remover foto</Text>
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
    if(formData.username === "") return setErrors({username: "Nome de usuário inválido."})
    if(formData.username.includes(" ")) return setErrors({username: "Nome de usuário não pode conter espaços."})
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
      setErrors({username: "Nome de usuário inválido ou já existe uma conta com este nome de usuário."})
      setIsLoading(false)
    }
  }

  async function eraseAccount(string) {
    if(string = "deletar minha conta") {
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

  const stringConfirm = confirmationWord === "deletar minha conta"

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
              >Voltar</Text>
            </Stack>
              
            <ModalCloseButton
              fontSize="14px"
              top="24px"
              right="26px"
              _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
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
            >Alterar e-mail</SectionTitle>
            <ModalCloseButton
              fontSize="14px"
              top="34px"
              right="26px"
              _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
            />
          </Stack>
        }

        {emailSent ?
          <Stack spacing="24px" textAlign="center">
            <EmailConfirmImage justifyContent="center"/>

            <SectionTitle
              lineHeight="40px"
            >Confirme seu endereço de e-mail</SectionTitle>
            <ExtraInfoTextForm
              fontSize="16px"
              letterSpacing="0.2px"
            >Enviamos uma confirmação de e-mail para</ExtraInfoTextForm>
            <TitleTextForm>dadinho@basedosdados.org</TitleTextForm>
            <ExtraInfoTextForm
              fontSize="16px"
              letterSpacing="0.2px"
              lineHeight="24px"
            >Confira sua caixa de entrada e siga as <br/>
instruções enviadas no e-mail para completar a alteração.</ExtraInfoTextForm>
          </Stack>
          :
          <Stack spacing="24px">
            <ExtraInfoTextForm fontSize="16px" lineHeight="24px" letterSpacing="0.2px">
              Insira o seu novo endereço de e-mail. Enviaremos as instruções para você completar a alteração.
            </ExtraInfoTextForm>

            <FormControl isInvalid={!!errors.email}>
              <LabelTextForm text="Novo e-mail"/>
              <InputForm
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Insira seu e-mail"
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
                <LabelTextForm text="Senha" margin="0 !important"/>
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
                >Esqueceu a senha?
                </ButtonSimple>
              </Box>

              <InputForm
                type={showPassword ? "password" : "text"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Insira sua senha"
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
                    alt="esconder senha"
                    width="20px"
                    height="20px"
                    fill="#D0D0D0"
                  />
                :
                  <EyeIcon
                    alt="exibir senhar"
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
            Enviar e-mail
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
          >Alterar nome de usuário</SectionTitle>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
          />
        </Stack>

        <FormControl isInvalid={!!errors.username}>
          <LabelTextForm text="Novo nome de usuário"/>
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
            "Atualizar nome de usuário"
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
          >Tem certeza que deseja deletar sua conta?</SectionTitle>
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
          Após deletar sua conta, todos os dados serão permanentemente removidos e não poderão ser recuperados. 
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
            >Por favor, confirme escrevendo: "deletar minha conta" abaixo.</FormLabel>
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
            Cancelar
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
              "Deletar"
            }
          </RoundedButton>
        </Stack>
      </ModalGeneral>

      {/* <Box>
        <TitleTextForm>E-mail</TitleTextForm>
        <Text
          color="#6F6F6F"
          fontFamily="Ubuntu"
          fontSize="14px"
          fontWeight="400"
          lineHeight="27px"
          letterSpacing="0.3px"
        >{userInfo.email}</Text>
        <Link
          color="#42B0FF"
          fontFamily="ubuntu"
          fontWeight="500"
          fontSize="16px"
          lineHeight="30px"
          letterSpacing="0.2px"
          onClick={() => emailModal.onOpen()}
        >Alterar e-mail</Link>
      </Box> */}

      <Box>
        <TitleTextForm>Nome de usuário</TitleTextForm>
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
        >Alterar nome de usuário</Link>
      </Box>

      <Box>
        <TitleTextForm>Exportar dados da conta</TitleTextForm>
        <ExtraInfoTextForm>Saiba como seus dados são armazenados em nossos Termos de Uso e Políticas de Privacidade.{!isMobileMod() && <br/>} Para exportar os dados da sua conta, entre em contato conosco.</ExtraInfoTextForm>
        <Link
          color="#42B0FF"
          fontFamily="ubuntu"
          fontWeight="500"
          fontSize="16px"
          lineHeight="30px"
          letterSpacing="0.2px"
          href="/contato"
          target="_self"
        >Entre em contato</Link>
      </Box>

      <Box>
        <TitleTextForm color="#D93B3B">Deletar conta</TitleTextForm>
        <ExtraInfoTextForm marginBottom="8px">Após a exclusão, não será possível recuperar o acesso à sua conta.</ExtraInfoTextForm>
        <RoundedButton
          width={isMobileMod() ? "100%" :"fit-content"}
          backgroundColor="#FF8484"
          onClick={() => eraseModalAccount.onOpen()}
        >Deletar minha conta</RoundedButton>
      </Box>
    </Stack>
  )
}

const NewPassword = ({ userInfo }) => {
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
      validationErrors.newPassword = "A nova senha tem quer ser diferente da atual"
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
      validationErrors.confirmPassword = "Confirmar a senha é necessário"
    }
    if(/\s/.test(formData.confirmPassword)) {
      validationErrors.newPassword = "As senhas inseridas não podem conter espaçamentos."
      validationErrors.confirmPassword = "As senhas inseridas não podem conter espaçamentos."
    }
    if(formData.confirmPassword !== formData.newPassword) {
      validationErrors.confirmPassword = "A senha inserida não coincide com a senha criada no campo acima. Por favor, verifique se não há erros de digitação e tente novamente."
    }

    if(Object.keys(regexPassword).length > 0) validationErrors.regexPassword = regexPassword

    if(formData.password === "") {
      validationErrors.password = "Por favor, insira a senha."
    }

    if(formData.password !== "") {
      const result = await fetch(`/api/user/getToken?a=${btoa(userInfo.email)}&q=${btoa(formData.password)}&s=${"true"}`, {method: "GET"})
        .then(res => res.json())
      if(result.error) {
        validationErrors.password = "A senha está incorreta. Por favor, tente novamente."
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
            _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
          />
        </Stack>

        <Stack spacing="24px" alignItems="center" textAlign="center" marginBottom="24px">
          <EmailRecoveryImage/>
          <SectionTitle
            lineHeight="40px"
          >Sua senha foi alterada com sucesso</SectionTitle>
          <ExtraInfoTextForm
            fontSize="16px"
            letterSpacing="0.2px"
            lineHeight="24px"
          >Agora você pode utilizar a nova senha para acessar sua<br/> conta na Base dos Dados.</ExtraInfoTextForm>
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
            Continuar nas configurações
          </RoundedButton>

          <RoundedButton
            borderRadius="30px"
            width={isMobileMod() ? "100%" : "fit-content"}
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => window.open("/", "_self")}
          >
            Ir para a página inicial
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
            <LabelTextForm width="100%" text="Senha atual" margin="0 !important"/>
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
            >Esqueceu a senha?
            </ButtonSimple>
          </Box>
          <InputForm
            type={showPassword ? "password" : "text"}
            id="password"
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            placeholder="Insira a senha atual"
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
                alt="esconder senha"
                width="20px"
                height="20px"
                fill="#D0D0D0"
              />
            :
              <EyeIcon
                alt="exibir senhar"
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
          >Esqueceu a senha?
          </ButtonSimple>
        </FormControl>

        <FormControl marginTop="24px" isInvalid={!!errors.newPassword || !!errors.regexPassword}>
          <LabelTextForm text="Nova senha"/>
          <InputForm
            type={showNewPassword ? "password" : "text"}
            id="newPassword"
            name="newPassword"
            autoComplete="new-password"
            value={formData.newPassword}
            onChange={(e) => handleInputChange(e, "newPassword")}
            placeholder="Crie uma nova senha"
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
                alt="esconder senha"
                width="20px"
                height="20px"
                fill="#D0D0D0"
              />
            :
              <EyeIcon
                alt="exibir senhar"
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
          ><Exclamation width="14px" height="14px" fill="#D93B3B" display={ errors?.regexPassword ? Object.keys(errors?.regexPassword).length > 0 ? "flex" : "none" : "none"}/> Certifique-se que a senha tenha no mínimo:</Text>
          <UnorderedList fontSize="12px" fontFamily="Ubuntu" position="relative" left="2px">
            <ListItem fontSize="12px" color={errors?.regexPassword?.amount ? "#D93B3B" :"#7D7D7D"}>8 caracteres</ListItem>
            <ListItem fontSize="12px" color={errors?.regexPassword?.upperCase ? "#D93B3B" :"#7D7D7D"}>Uma letra maiúscula</ListItem>
            <ListItem fontSize="12px" color={errors?.regexPassword?.lowerCase ? "#D93B3B" :"#7D7D7D"}>Uma letra minúscula</ListItem>
            <ListItem fontSize="12px" color={errors?.regexPassword?.number ? "#D93B3B" :"#7D7D7D"}>Um dígito</ListItem>
            <ListItem fontSize="12px" color={errors?.regexPassword?.special ? "#D93B3B" :"#7D7D7D"}>Um caractere especial, dentre ! @ # ? ! % & *</ListItem>
          </UnorderedList>
          {errors.newPassword &&
            <FormErrorMessage fontFamily="ubuntu" fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="center">
              <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.newPassword}
            </FormErrorMessage>
          }
        </FormControl>

        <FormControl marginTop="24px" isInvalid={!!errors.confirmPassword}>
          <LabelTextForm text="Confirme a nova senha" />
          <InputForm
            type={showConfirmPassword ? "password" : "text"}
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange(e, "confirmPassword")}
            placeholder="Insira a senha novamente"
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
                alt="esconder senha"
                width="20px"
                height="20px"
                fill="#D0D0D0"
              />
            :
              <EyeIcon
                alt="exibir senhar"
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
            "Atualizar senha"
          }
        </RoundedButton>
      </form>
    </Stack>
  )
}

const PlansAndPayment = ({ userData }) => {
  const router = useRouter()
  const { query } = router

  const [plan, setPlan] = useState("")
  const [checkoutInfos, setCheckoutInfos] = useState({})
  const [valueCoupon, setValueCoupon] = useState("")
  const [couponInputFocus, setCouponInputFocus] = useState(false)
  const [coupon, setCoupon] = useState("")
  const PaymentModal = useDisclosure()
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
    setCheckoutInfos(value)
  }, [plan, plans])

  useEffect(() => {
    if(query.i) {
      if(subscriptionInfo?.isActive === true) return AlertChangePlanModal.onOpen()
      setPlan(query.i)
      PaymentModal.onOpen()
    }
  }, [query])

  const planActive = subscriptionInfo?.isActive === true

  const resources = {
    "BD Gratis" : {
      title: "BD Grátis",
      buttons: [{
        text:"Comparar planos",
        onClick: () => {
          PlansModal.onOpen()
          setToggleAnual(true)
        }}
      ],
      resources : [
        {name: "Tabelas tratadas"},
        {name: "Dados integrados", tooltip: "Nossa metodologia de padronização e compatibilização de dados permite que você cruze tabelas de diferentes instituições e temas de maneira simplificada."},
        {name: "Acesso em nuvem"},
        {name: "Acesso via SQL, Python e R"},
        {name: "Integração com ferramentas BI"},
        planActive ? "" : {name: "Download direto até 100 MB", tooltip: "Esse limite não se aplica ao acesso via SQL, Python e R."},
      ]
    },
    "bd_pro" : {
      title: "BD Pro",
      buttons : [{
        text:"Cancelar plano",
        onClick: () => CancelModalPlan.onOpen(),
        props: {
          borderColor: subscriptionInfo?.canceledAt ? "#ACAEB1" : "#42B0FF",
          color: subscriptionInfo?.canceledAt ? "#ACAEB1" : "#42B0FF",
          pointerEvents: subscriptionInfo?.canceledAt ? "none" : "default"
        }
      }],
      resources : [
        {name: "Dezenas de bases de alta frequência atualizadas"},
        {name: "Tabela de referência de empresas com informações atualizadas"},
        {name: "Download direto até 1 GB", tooltip: "Tabelas maiores que 1 GB não estão disponíveis para download parcial ou completo. Esse limite não se aplica ao acesso via SQL, Python e R."},
      ]
    },
    "bd_pro_empresas" : {
      title: "BD Empresas",
      buttons : [{
        text:"Cancelar plano",
        onClick: () => CancelModalPlan.onOpen(),
        props: {
          borderColor: subscriptionInfo?.canceledAt ? "#ACAEB1" : "#42B0FF",
          color: subscriptionInfo?.canceledAt ? "#ACAEB1" : "#42B0FF",
          pointerEvents: subscriptionInfo?.canceledAt ? "none" : "default"
        }
      }],
      resources : [
        {name: "Acesso para 10 contas"},
        {name: "Suporte prioritário via email e Discord"}
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
    window.open(`/user/${userData.username}?plans_and_payment`, "_self")
  }

  async function closeModalSucess() {
    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(userData.id)

    const user = await fetch(`/api/user/getUser?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())
    cookies.set('userBD', JSON.stringify(user))

    if(isLoadingH === true) return window.open("/", "_self")
    window.open(`/user/${userData.username}?plans_and_payment`, "_self")
  }

  function formatTimeStamp (value) {
    const date = new Date(value)
    const options = { day: '2-digit', month: 'long', year: 'numeric' }
    const formattedDate = date.toLocaleDateString('pt-BR', options)
    return formattedDate
  }

  function formattedPlanInterval (value, variant = false) {
    if(variant) {
      if(value === "month") return "mês"
      if(value === "year") return "ano"
    } else {
      if(value === "month") return "(Mensal)"
      if(value === "year") return "(Anual)"
    }
  }

  function changeIntervalPlanCheckout() {
    let togglerValue = !toggleAnual ? "year" : "month"
    const value = Object.values(plans).find(elm => elm.interval === togglerValue && elm.productSlug === checkoutInfos?.productSlug)
    setCheckoutInfos(value)
    setPlan(value._id)
    setToggleAnual(!toggleAnual)
  }

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
          <Text
            width="100%"
            fontFamily="Roboto"
            fontWeight="500"
            color="#252A32"
            fontSize="24px"
            lineHeight="36px"
          >
            Pagamento
          </Text>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
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
                    PlansModal.onOpen()
                  }}
                >Alterar plano</Text>
              </Box>

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
                >Desconto anual</Text>
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
                >Economize 20%</Text>
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
                Cupom de desconto
              </Text>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap="8px"
              >
                <ControlledInputSimple
                  value={valueCoupon}
                  onChange={setValueCoupon}
                  inputFocus={couponInputFocus}
                  changeInputFocus={setCouponInputFocus}
                  width="100%"
                  placeholder="Insira o cupom"
                  inputElementStyle={{
                    display: "none"
                  }}
                  inputStyle={{
                    paddingLeft: "16px !important",
                    height: "48px"
                  }}
                />

                <Box
                  as="button"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="fit-content"
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
                    if(valueCoupon === "") return
                    setCoupon(valueCoupon)
                  }}
                >
                  Aplicar
                </Box>
              </Box>
            </Stack>

            <Text
              display={hasSubscribed ? "none" : "flex"}
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="16px"
              lineHeight="24px"
              color="#464A51"
            >Período de teste - 7 dias grátis</Text>

            <Divider borderColor="#DEDFE0" />

            <Stack
              spacing="8px"
            >
              <Stack
                flexDirection="row"
                alignItems="center"
                spacing={0}
                justifyContent="space-between"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="16px"
                lineHeight="24px"
                color="#464A51"
              >
                <Text>Subtotal</Text>
                <Text>{checkoutInfos?.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}/{formattedPlanInterval(checkoutInfos?.interval, true)}</Text>
              </Stack>

              {/* <Stack></Stack> */}

              <Stack
                flexDirection="row"
                alignItems="center"
                spacing={0}
                justifyContent="space-between"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="16px"
                lineHeight="24px"
                color="#252A32"
              >
                <Text>Total a pagar</Text>
                <Text>{checkoutInfos?.amount?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })}/{formattedPlanInterval(checkoutInfos?.interval, true)}</Text>
              </Stack>
            </Stack>
          </Stack>

          <Box display="flex" flexDirection="column" gap="24px" flex={1}>
            <Text
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="16px"
              lineHeight="24px"
              color="#252A32"
            >
              Detalhes do pagamento
            </Text>
            <PaymentSystem
              userData={userData}
              plan={plan}
              coupon={coupon}
              onSucess={() => openModalSucess()}
              onErro={() => openModalErro()}
            />
          </Box>
        </Stack>
      </ModalGeneral>

      {/* success */}
      <ModalGeneral
        isOpen={SucessPaymentModal.isOpen}
        onClose={() => setIsLoading(true)}
      >
        <Stack spacing={0} marginBottom="16px">
          <Box height="24px"/>
          <ModalCloseButton
            fontSize="14px"
            top="28px"
            right="26px"
            _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
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
            fontFamily="Ubuntu"
            fontWeight="400"
            fontSize="24px"
            lineHeight="40px"
            color="#252A32"
          >
            Parabéns!
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
            Seu pagamento foi efetuado com sucesso e seu plano foi atualizado.
          </Text>
        </Stack>

        <Stack
          flexDirection={isMobileMod() ? "column-reverse" : "row"}
          spacing={0}
          gap="24px"
          width="100%"
        >
          <RoundedButton
            borderRadius="30px"
            backgroundColor="#FFF"
            border="1px solid #42B0FF"
            color="#42B0FF"
            width="inherit"
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => setIsLoading(true)}
          >
            {isLoading ?
              <Spinner/>
              :
              "Continuar nas configurações"
            }
          </RoundedButton>

          <RoundedButton
            borderRadius="30px"
            width="inherit"
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => setIsLoadingH(true)}
          >
            {isLoadingH ?
              <Spinner/>
              :
              "Ir para a página inicial"
            }
          </RoundedButton>
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
            _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
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
            O pagamento falhou
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
            Houve um problema ao processar seu pagamento.
            Por favor, verifique se as informações estão corretas ou tente novamente mais tarde.
            Se esta mensagem continuar a ser exibida,
            <Link color="#42B0FF"
              fontFamily="ubuntu"
              fontWeight="600"
              fontSize="16px"
              lineHeight="30px"
              letterSpacing="0.2px"
              href="/contato"
              target="_self"
              marginLeft="2px"
              >entre em contato</Link>
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
            Entendi
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
            Compare os planos
          </Text>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
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
              Desconto anual
              <Text
                as="span"
                color="#2B8C4D"
                backgroundColor="#D5E8DB"
                fontWeight="500"
                lineHeight="28px"
                padding="2px 4px"
                borderRadius="4px"
                height="32px"
              >Economize 20%</Text>
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
              title="BD Grátis"
              subTitle={<>Para você descobrir o potencial da plataforma de dados</>}
              price={"0"}
              textResource="Recursos:"
              resources={[
                {name: "Tabelas tratadas"},
                {name: "Dados integrados", tooltip: "Nossa metodologia de padronização e compatibilização de dados permite que você cruze tabelas de diferentes instituições e temas de maneira simplificada."},
                {name: "Acesso em nuvem"},
                {name: "Acesso via SQL, Python e R"},
                {name: "Integração com ferramentas BI"},
                {name: "Download direto até 100 MB", tooltip: "Esse limite não se aplica ao acesso via SQL, Python e R."},
              ]}
              button={{
                text: "Explorar recursos",
                href: "/dataset",
                noHasModal: true,
              }}
            />

            <CardPrice
              title="BD Pro"
              subTitle={<>Para você ter acesso aos<br/> dados mais atualizados</>}
              price={plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`].amount || 444}
              anualPlan={toggleAnual}
              textResource="Todos os recursos da BD Grátis, mais:"
              resources={[
                {name: "Dezenas de bases de alta frequência atualizadas"},
                {name: "Tabela de referência de empresas com informações atualizadas"},
                {name: "Download direto até 1GB (80% das tabelas da plataforma)", tooltip: "Tabelas maiores que 1 GB não estão disponíveis para download parcial ou completo. Esse limite não se aplica ao acesso via SQL, Python e R."}
              ]}
              button={{
                text: `${subscriptionInfo?.stripeSubscription === "bd_pro" ? "Plano atual" : hasSubscribed ? "Assinar" : "Iniciar teste grátis"}`,
                onClick: subscriptionInfo?.stripeSubscription === "bd_pro" ? () => {} : () => {
                  setPlan(plans?.[`bd_pro_${toggleAnual ? "year" : "month"}`]._id)
                  PlansModal.onClose()
                  PaymentModal.onOpen()
                },
                isCurrentPlan: subscriptionInfo?.stripeSubscription === "bd_pro" ? true : false,
              }}
            />

            <CardPrice
              title="BD Empresas"
              subTitle={<>Para sua empresa ganhar tempo<br/> e qualidade em decisões</>}
              price={plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`].amount || 3360}
              anualPlan={toggleAnual}
              textResource="Todos os recursos da BD Pro, mais:"
              resources={[
                {name: "Acesso para 10 contas"},
                {name: "Suporte prioritário via email e Discord"}
              ]}
              button={{
                text: `${subscriptionInfo?.stripeSubscription === "bd_pro_empresas" ? "Plano atual" : hasSubscribed ? "Assinar" : "Iniciar teste grátis"}`,
                onClick: subscriptionInfo?.stripeSubscription === "bd_pro_empresas" ? () => {} : () => {
                  setPlan(plans?.[`bd_empresas_${toggleAnual ? "year" : "month"}`]._id)
                  PlansModal.onClose()
                  PaymentModal.onOpen()
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
            Alteração de planos
          </SectionTitle>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
          />
        </Stack>

        <Stack spacing="24px" marginBottom="16px">
          <ExtraInfoTextForm fontSize="16px" lineHeight="24px" letterSpacing="0.2px" color="#464A51">
            Para realizar o upgrade ou downgrade, por favor,
            entre em contato com a nossa equipe.
            Estamos prontos para ajudar você a fazer a transição para o novo plano o mais rápido possível!
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
            width={isMobileMod() ? "100%" : ""}
            _hover={{transform: "none", opacity: 0.8}}
            onClick={() => {
              AlertChangePlanModal.onClose()
              window.open("/contato", "_self")
            }}
          >
            Entrar em contato
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
            Tem certeza que deseja cancelar seu plano?
          </SectionTitle>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
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
            Voltar
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
              "Cancelar plano"
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
              {planActive ? planCanceled ? "Cancelado" : "Ativo" : "Ativo"}
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
                {subscriptionInfo?.canceledAt ? "Acesso ao plano disponível até:" : "Próxima data de renovação automática: "} <Text
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
            >Inclui</Text>
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
              >Não inclui</Text>}

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
                Veja tudo e compare os planos
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
          label="Disponível apenas no plano BD Empresas"
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
            >Adicionar usuário</RoundedButton>
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
          >Usuário</Text>
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
          >Acesso</Text>
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
            Administrador
          </Text>
        </GridItem>
      </Grid>
    </Stack>
  )
}
// Sections Of User Page

export default function UserPage({ getUser }) {
  const router = useRouter()
  const { query } = router
  const [userInfo, setUserInfo] = useState({})
  const [sectionSelected, setSectionSelected] = useState(0)

  useEffect(() => {
    setUserInfo(getUser)
  }, [getUser])

  const choices = [
    {bar: "Perfil público", title: "Perfil público", value: "profile", index: 0},
    {bar: "Conta", title: "Conta", value: "account", index: 1},
    {bar: "Senha", title: "Alterar senha", value: "new_password", index: 2},
    {bar: "Planos e pagamento", title: "Planos e pagamento", value: "plans_and_payment", index: 3},
  ]
  // {bar: "Acessos", title: "Gerenciar acessos", value: "accesses", index: 4},

  useEffect(() => {
    const key = Object.keys(query)
    const removeElem = key.indexOf("username")
    if (removeElem !== -1) key.splice(removeElem, 1)

    if (key.length === 0) return

    for (const elements of choices) {
      if (elements.value === key[0]) {
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
        <BigTitle display={isMobileMod() ? "none" : "flex"}>Configurações</BigTitle>

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
            {/* {sectionSelected === 4 && <Accesses userInfo={userInfo}/>} */}
          </Stack>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
