import {
  Stack,
  Box,
  Text,
  FormControl,
  useDisclosure,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useState } from "react";
import cookies from 'js-cookie';
import { useTranslation } from "react-i18next";
import Link from "../../atoms/Link";

import {
  LabelTextForm,
  TitleTextForm,
  ExtraInfoTextForm,
  ModalGeneral,
  Button,
  InputForm,
  ErrorMessage
} from "../../molecules/uiUserPage";

export default function Account({ userInfo }) {
  const { t } = useTranslation('user');
  const usernameModal = useDisclosure()
  const eraseModalAccount = useDisclosure()
  const sucessEraseModalAccount = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({username: ""})
  const [errors, setErrors] = useState({})

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

  async function eraseAccount() {
    setIsLoading(true)
    const reg = new RegExp("(?<=:).*")
    const [ id ] = reg.exec(userInfo.id)

    const result = await fetch(`/api/user/deleteAccount?p=${btoa(id)}`, {method: "GET"})
      .then(res => res.json())

    if(result?.ok === true) {
      setIsLoading(false)
      eraseModalAccount.onClose()
      sucessEraseModalAccount.onOpen()
    }
  }

  return (
    <Stack spacing="24px">
      <Box display={isLoading ? "flex" : "none"} position="fixed" top="0" left="0" width="100%" height="100%" zIndex="99999"/>

      <ModalGeneral
        isOpen={usernameModal.isOpen}
        onClose={usernameModal.onClose}
      >
        <Stack spacing={0} marginBottom="16px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="24px"
            lineHeight="36px"
            color="#252A32"
          >{t('username.changeUsername')}</Text>
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
            placeholder={t('username.changeUsernameInput')}
          />
          <ErrorMessage>
            {errors.username}
          </ErrorMessage>
        </FormControl>

        <Button
          marginTop="24px"
          onClick={() => submitUpdate(formData)}
          isDisabled={isLoading}
          isLoading={isLoading}
          pointerEvents={isLoading ? "none" : "default"}
        >
          {t('username.updateUsername')}
        </Button>
      </ModalGeneral>

      <ModalGeneral
        isOpen={eraseModalAccount.isOpen}
        onClose={eraseModalAccount.onClose}
        propsModalContent={{minWidth: {base: "", lg: "620px !important"}}}
      >
        <Stack spacing={0} marginBottom="16px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="24px"
            lineHeight="36px"
            color="#252A32"
          >{t('username.confirmAccountDeletion')}</Text>
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
        onClose={() => {
          setIsLoading(true)
          cookies.remove('userBD', { path: '/' })
          cookies.remove('token', { path: '/' })
          sucessEraseModalAccount.onClose()
          return window.open("/", "_self")
        }}
        propsModalContent={{minWidth: {base: "", lg: "620px !important"}}}
      >
        <Stack spacing={0} marginBottom="16px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="24px"
            lineHeight="36px"
            color="#252A32"
          >{t('username.deleteAccountSuccessTitle')}</Text>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", opacity: 0.7}}
            onClick={() => sucessEraseModalAccount.onClose() }
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
            onClick={() => eraseModalAccount.onClose()}
            isLoading={isLoading}
          >
            {t('username.close')}
          </Button>
        </Stack>
      </ModalGeneral>

      <Box marginTop="0 !important">
        <TitleTextForm>{t('username.username')}</TitleTextForm>
        <ExtraInfoTextForm>{userInfo.username}</ExtraInfoTextForm>
        <Button
          color="#2B8C4D"
          backgroundColor="#FFF"
          border="1px solid #2B8C4D"
          _hover={{
            backgroundColor: "#FFF",
            color: "#22703E",
            borderColor: "#22703E"
          }}
          onClick={() => usernameModal.onOpen()}
        >{t('username.changeUsername')}</Button>
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
          color="#2B8C4D"
          backgroundColor="#FFF"
          border="1px solid #2B8C4D"
          _hover={{
            backgroundColor: "#FFF",
            color: "#22703E",
            borderColor: "#22703E"
          }}
          onClick={() => window.open("/contact")}
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
