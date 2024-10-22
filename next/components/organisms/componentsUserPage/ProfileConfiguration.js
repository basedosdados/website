import {
  Stack,
  Box,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Image,
  Tooltip,
  HStack,
  useDisclosure,
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
import cookies from "js-cookie";
import { useTranslation } from "react-i18next";

import SectionTitle from "../../atoms/SectionTitle";
import RoundedButton from "../../atoms/RoundedButton";
import InputForm from "../../atoms/SimpleInput";
import ImageCrop from "../../molecules/ImgCrop";
import Checkbox from "../../atoms/Checkbox";
import { cleanString } from "../../../utils";
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";

import {
  LabelTextForm,
  SkStack,
} from "../../molecules/uiUserPage";

import Exclamation from "../../../public/img/icons/exclamationIcon";
import PenIcon from "../../../public/img/icons/penIcon";
import GithubIcon from "../../../public/img/icons/githubIcon";
import TwitterIcon from "../../../public/img/icons/twitterIcon";
import LinkedinIcon from "../../../public/img/icons/linkedinIcon";

export default function ProfileConfiguration({ userInfo }) {
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