import {
  Stack,
  Box,
  Text,
  Divider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Image,
  Tooltip,
  HStack,
  Checkbox,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  UnorderedList,
  ListItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  Grid,
  GridItem
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MainPageTemplate } from "../../components/templates/main";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import BigTitle from "../../components/atoms/BigTitle";
import SectionTitle from "../../components/atoms/SectionTitle";
import RoundedButton from "../../components/atoms/RoundedButton";
import ButtonSimple from "../../components/atoms/SimpleButton";
import InputForm from "../../components/atoms/SimpleInput"
import Link from "../../components/atoms/Link";
import BodyText from "../../components/atoms/BodyText";
import { CardPrice } from "../precos";
import PaymentSystem from "../../components/organisms/paymentSystem";

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

const LabelTextForm = ({ text, ...props }) => {
  return (
    <FormLabel
      color="#252A32"
      fontFamily="ubuntu"
      letterSpacing="0.2px"
      fontSize="16px"
      fontWeight="400"
      lineHeight="16px"
      {...props}
    >{text}</FormLabel>
  )
}

const TitleTextForm = ({ children, ...props }) => {
  return (
    <Text
      color="#252A32"
      fontFamily="ubuntu"
      letterSpacing="0.2px"
      fontSize="16px"
      fontWeight="400"
      lineHeight="16px"
      marginBottom="8px"
      {...props}
    >{children}</Text>
  )
}

const ExtraInfoTextForm = ({children, ...props}) => {
  return (
    <Text
      color="#7D7D7D"
      fontFamily="ubuntu"
      letterSpacing="0.3px"
      fontSize="12px"
      fontWeight="400"
      lineHeight="16px"
      {...props}
    >{children}</Text>
  )
}

const ModalGeneral = ({
  children,
  isOpen,
  onClose,
  isCentered = true,
  propsModalContent
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={isCentered} margin="24px !important">
      <ModalOverlay/>
      <ModalContent
        margin="24px"
        minWidth={isMobileMod() ? "" : "536px"}
        boxSizing="content-box"
        padding="32px"
        borderRadius="20px"
        {...propsModalContent}
      >
        <ModalHeader padding="0">
          {children[0]}
        </ModalHeader>

        <ModalBody padding="0">
          {children[1]}
        </ModalBody>

        <ModalFooter padding="0" width={isMobileMod() ? "100%" : "auto"}>
          {children[2]}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

const ProfileConfiguration = () => {
  const [formData, setFormData] = useState({ firstName: "" , lastName: "", picture: "" })
  const [errors, setErrors] = useState({ firstName: "" , lastName: "" })

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Stack
      flexDirection={isMobileMod() ? "column-reverse" : "row"}
      justifyContent="space-between"
      spacing={0}
      gap={isMobileMod() ? "40px" : "80px"}
    >
      <Stack spacing="24px" flex={1}>
        <FormControl isInvalid={!!errors.firstName}>
          <LabelTextForm text="Nome"/>
          <Input
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
          <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
            <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.firstName}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <LabelTextForm text="Sobrenome"/>
          <Input
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
          <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
            <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.lastName}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
          <LabelTextForm text="E-mail"/>
          <Checkbox
            color="#7D7D7D"
            fontFamily="Ubuntu"
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            letterSpacing="0.3px"
          >
            Tornar o e-mail de acesso à sua conta visível para o público.
          </Checkbox>
        </FormControl>

        <FormControl isInvalid={!!errors.website}>
          <LabelTextForm text="URL"/>
          <Input
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
          <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
            <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.website}
          </FormErrorMessage>
        </FormControl>
        
        <Stack>
          <LabelTextForm text="Redes sociais"/>

          <HStack spacing="8px" margin="0 0 8px 0 !important">
            <GithubIcon width="24px" height="24px" fill="#D0D0D0"/>
            <Input
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
          </HStack>

          <HStack spacing="8px" margin="0 0 8px 0 !important">
            <TwitterIcon width="24px" height="24px" fill="#D0D0D0"/>
            <Input
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
          </HStack>

          <HStack spacing="8px"  margin="0 !important">
            <LinkedinIcon width="24px" height="24px" fill="#D0D0D0"/>
            <Input
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
          </HStack>
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
          // _hover={{transform: "none", opacity: 0.8}}
          _hover={{transform: "none"}}
          backgroundColor="#C4C4C4"
          cursor="default"
        >
          Atualizar perfil
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

        <Box
          position="relative"
          width="200px"
          height="200px"
        > 
          <Box
            borderRadius="50%"
            overflow="hidden"
          >
            <Image width="100%" height="100%" src={formData?.picture ? formData.picture : "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"}/>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="absolute"
            // cursor="pointer"
            cursor="default"
            bottom="10px"
            left="10px"
            width="32px"
            height="32px"
            borderRadius="50%"
            backgroundColor="#C4C4C4"
            // backgroundColor="#2B8C4D"
          >
            <Tooltip
              hasArrow
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
        </Box>
      </Stack>
    </Stack>
  )
}

const Account = () => {
  const emailModal = useDisclosure()
  const eraseModalAccount = useDisclosure()
  const [emailSent, setEmailSent] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({ email: "", password: ""})

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Stack spacing="24px">
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
              <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
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
              <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
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
        isOpen={eraseModalAccount.isOpen}
        onClose={eraseModalAccount.onClose}
      >
        <Stack spacing={0} marginBottom="16px">
          <SectionTitle
            lineHeight="40px"
          >Tem certeza que deseja deletar sua conta?</SectionTitle>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", color:"#FF8484"}}
          />
        </Stack>

        <Stack spacing="24px" marginBottom="16px">
          <ExtraInfoTextForm fontSize="16px" lineHeight="24px" letterSpacing="0.2px">
          Após deletar sua conta, todos os dados serão permanentemente removidos e não poderão ser recuperados. 
          </ExtraInfoTextForm>
        </Stack>

        <Stack
          flexDirection={isMobileMod() ? "column" : "row"}
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
            onClick={() => eraseModalAccount.onClose()}
          >
            Cancelar
          </RoundedButton>

          <RoundedButton
            borderRadius="30px"
            // backgroundColor="#FF8484"
            cursor="default"
            backgroundColor="#C4C4C4"
            width={isMobileMod() ? "100%" : "fit-content"}
            // _hover={{transform: "none", opacity: 0.8}}
            _hover={{transform: "none"}}
          >
            Deletar
          </RoundedButton>
        </Stack>
      </ModalGeneral>

      <Box>
        <TitleTextForm>E-mail</TitleTextForm>
        <Text
          color="#6F6F6F"
          fontFamily="Ubuntu"
          fontSize="14px"
          fontWeight="400"
          lineHeight="27px"
          letterSpacing="0.3px"
        >meuemail@gmail.com</Text>
        <Link
          color="#42B0FF"
          fontFamily="ubuntu"
          fontWeight="500"
          fontSize="16px"
          lineHeight="30px"
          letterSpacing="0.2px"
          onClick={() => emailModal.onOpen()}
        >Alterar e-mail</Link>
      </Box>

      {/* <Box>
        <TitleTextForm>Nome de usuário</TitleTextForm>
        <Text
          color="#6F6F6F"
          fontFamily="Ubuntu"
          fontSize="14px"
          fontWeight="400"
          lineHeight="27px"
          letterSpacing="0.3px"
        >dadinho</Text>
        <Link
          color="#42B0FF"
          fontFamily="ubuntu"
          fontWeight="500"
          fontSize="16px"
          lineHeight="30px"
          letterSpacing="0.2px"
          onClick={() => emailModal.onOpen()}
        >Alterar nome de usuário</Link>
      </Box> */}

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

const NewPassword = () => {
  const newPasswordModal = useDisclosure()
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = useState({
    password: "",
    newPassword: "",
    regexPassword: {},
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(true)
  const [showNewPassword, setShowNewPassword] = useState(true)
  const [showConfirmPassword, setShowConfirmPassword] = useState(true)

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Stack spacing="24px" maxWidth="480px">
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
          flexDirection={isMobileMod() ? "column" : "row"}
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
            onClick={() => newPasswordModal.onClose()}
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
        <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
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

      <FormControl isInvalid={!!errors.newPassword}>
        <LabelTextForm text="Nova Senha" />
        <InputForm
          type={showNewPassword ? "password" : "text"}
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
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
          color= {Object.keys(errors.regexPassword).length > 0 ? "#D93B3B" : "#7D7D7D"}
          fontFamily= "Ubuntu"
          fontSize= "12px"
          fontWeight= "400"
          lineHeight= "16px"
          letterSpacing= "0.3px"
          display="flex"
          flexDirection="row"
          gap="4px"
          alignItems="flex-start"
        ><Exclamation width="14px" height="14px" fill="#D93B3B" display={Object.keys(errors.regexPassword).length > 0 ? "flex" : "none"}/> Certifique-se que a senha tenha no mínimo:</Text>
        <UnorderedList fontSize="12px" fontFamily="Ubuntu" position="relative" left="2px">
          <ListItem fontSize="12px" color={errors?.regexPassword?.amount ? "#D93B3B" :"#7D7D7D"}>8 caracteres</ListItem>
          <ListItem fontSize="12px" color={errors?.regexPassword?.upperCase ? "#D93B3B" :"#7D7D7D"}>Uma letra maiúscula</ListItem>
          <ListItem fontSize="12px" color={errors?.regexPassword?.lowerCase ? "#D93B3B" :"#7D7D7D"}>Uma letra minúscula</ListItem>
          <ListItem fontSize="12px" color={errors?.regexPassword?.number ? "#D93B3B" :"#7D7D7D"}>Um dígito</ListItem>
          <ListItem fontSize="12px" color={errors?.regexPassword?.special ? "#D93B3B" :"#7D7D7D"}>Um caractere especial</ListItem>
        </UnorderedList>
      </FormControl>

      <FormControl isInvalid={!!errors.confirmPassword}>
        <LabelTextForm text="Confirme a nova senha" />
        <InputForm
          type={showConfirmPassword ? "password" : "text"}
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
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
        <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
          <Exclamation marginTop="4px" fill="#D93B3B"/>{errors.confirmPassword}
        </FormErrorMessage>
      </FormControl>

      <RoundedButton
        borderRadius="30px"
        _hover={{transform: "none", opacity: 0.8}}
        width="fit-content"
        onClick={() => newPasswordModal.onOpen()}
      >
        Atualizar senha
      </RoundedButton>
    </Stack>
  )
}

const PlansAndPayment = () => {
  const PlansModal = useDisclosure()

  const resources={
    "bdGratis" : [
    {name: "Tabelas tratadas"},
    {name: "Dados integrados", tooltip: "Nossa metodologia de padronização e compatibilização de dados permite que você cruze tabelas de diferentes instituições e temas de maneira simplificada."},
    {name: "Acesso em nuvem"},
    {name: "Acesso via SQL, Python, R e Stata"},
    {name: "Integração com ferramentas BI"},
    {name: "Download até 200.000 linhas"},
    {name: "Até 1TB de processamento", tooltip: "Limite mensal gratuito oferecido pelo Google Cloud."}],
    "bdPro" : [
      {name: "Dezenas de bases de alta frequência atualizadas"}
    ],
    "bdEmpresas" : [
      {name: "Acesso para 10 contas"},
      {name: "Suporte prioritário via email e Discord"}
    ]
  }

  const TabContent = ({children, ...props}) => {
    return (
      <Tab
        fontFamily="ubuntu"
        fontSize="16px"
        fontWeight="400"
        letterSpacing="0.2px"
        lineHeight="24px"
        color="#252A32"
        padding="0 8px 11px"
        _hover={{
          borderBottom: "3px solid #D0D0D0"
        }}
        _selected={{
          color: "#2B8C4D",
          fontWeight: "700",
          borderBottom: "3px solid #2B8C4D",
          pointerEvents: "none"
        }}
        {...props}
      >
        {children}
      </Tab>
    )
  }

  return (
    <Stack>
      <ModalGeneral
        isOpen={PlansModal.isOpen}
        onClose={PlansModal.onClose}
        propsModalContent={{maxWidth: "fit-content"}}
        isCentered={isMobileMod() ? false : true}
      >
        <Stack spacing={0} marginBottom="16px">
          <SectionTitle lineHeight="40px">
            Compare os planos
          </SectionTitle>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", color:"#42B0FF"}}
          />
        </Stack>
        <Stack
          display={isMobileMod() ? "flex" : "grid"}
          gridTemplateColumns="repeat(3, 320px)"
          gridTemplateRows="1fr"
          justifyContent="center"
          justifyItems="center"
          gap="20px"
          spacing={0}
        >
          <CardPrice
            colorBanner="#2B8C4D"
            title="BD Grátis"
            subTitle={<BodyText>Para você descobrir o potencial da plataforma de dados</BodyText>}
            personConfig={{
              price: "0"
            }}
            textResource="Recursos:"
            resources={[
              {name: "Tabelas tratadas"},
              {name: "Dados integrados", tooltip: "Nossa metodologia de padronização e compatibilização de dados permite que você cruze tabelas de diferentes instituições e temas de maneira simplificada."},
              {name: "Acesso em nuvem"},
              {name: "Acesso via SQL, Python, R e Stata"},
              {name: "Integração com ferramentas BI"},
              {name: "Download até 200.000 linhas"},
              {name: "Até 1TB de processamento", tooltip: "Limite mensal gratuito oferecido pelo Google Cloud."}
            ]}
            button={{
              text: "Explorar recursos",
              href: "/dataset",
              target: "_self",
              noHasModal: true,
              color: "#FFF",
              colorText: "#42B0FF"
            }}
          />

          <CardPrice
            colorBanner="#9C8400"
            title="BD Pro"
            badge="Beta"
            subTitle={<BodyText>Para você ter acesso aos<br/> dados mais atualizados</BodyText>}
            personConfig={{
              price: "47"
            }}
            textResource="Todos os recursos da BD Grátis, mais:"
            resources={[
              {name: "Dezenas de bases de alta frequência atualizadas"},
            ]}
            button={{
              text: "Iniciar teste grátis",
              href: "https://buy.stripe.com/8wM01TeVQ3kg0mIeV4?locale=pt"
            }}
            hasServiceTerms
          />

          <CardPrice
            colorBanner="#252A32"
            title="BD Empresas"
            badge="Beta"
            subTitle={<BodyText>Para sua empresa ganhar tempo<br/> e qualidade em decisões</BodyText>}
            personConfig={{
              price: "350"
            }}
            textResource="Todos os recursos da BD Pro, mais:"
            resources={[
              {name: "Acesso para 10 contas"},{name: "Suporte prioritário via email e Discord"}
            ]}
            button={{
              text: "Iniciar teste grátis",
              href: "https://buy.stripe.com/00g4i93d8f2Y5H24gr?locale=pt"
            }}
            hasServiceTerms
          />
        </Stack>
      </ModalGeneral>

      <Tabs isLazy defaultIndex={1}>
        <TabList
          borderBottom= "2px solid #DEDFE0 !important"
        >
          <TabContent>Planos</TabContent>
          <TabContent>Pagamento</TabContent>
        </TabList>
        <TabPanels>
          <TabPanel padding="32px 0 0">
            <Stack spacing="40px">
              <Stack
                spacing={0}
                flexDirection={isMobileMod() ? "column" : "row"}
                width="100%"
                justifyContent="space-between"
              >
                <Stack spacing="8px" marginBottom={isMobileMod() ? "16px" : "0"}>
                  <Badge
                    width="fit-content"
                    padding="4px 5px"
                    textTransform="none"
                    borderRadius="6px"
                    backgroundColor="#DEDFE0"
                    color="#252A32"
                    fontSize="10px"
                    fontFamily="ubuntu"
                    fontWeight="300"
                    letterSpacing="0.2px"
                  >Plano atual</Badge>
                  <Text
                    color="#252A32"
                    fontFamily="Ubuntu"
                    fontSize="28px"
                    fontWeight="500"
                    lineHeight="36px"
                  >BD Grátis</Text>
                </Stack>
                <Stack
                  spacing={0}
                  gap="24px"
                  flexDirection={isMobileMod() ? "column" : "row"}
                >
                  <RoundedButton
                    borderRadius="30px"
                    backgroundColor="#FFF"
                    border="1px solid #42B0FF"
                    color="#42B0FF"
                    width={isMobileMod() ? "100%" : "fit-content"}
                    _hover={{transform: "none", opacity: 0.8}}
                    onClick={() => PlansModal.onOpen()}
                  >Compare os planos</RoundedButton>
                  <RoundedButton
                    borderRadius="30px"
                    width={isMobileMod() ? "100%" : "fit-content"}
                    // _hover={{transform: "none", opacity: 0.8}}
                    cursor="default"
                    backgroundColor="#C4C4C4"
                    _hover={{transform: "none"}}
                  >Faça o upgrade</RoundedButton>
                </Stack>
              </Stack>

              <Stack
                spacing={0}
                gap="64px"
                flexDirection={isMobileMod() ? "column" : "row"}
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
                  {resources.bdGratis.map((elm, index) => {
                    return (
                      <Box key={index} display="flex" alignItems="center">
                        <CheckIcon fill="#2B8C4D" width="24px" height="24px" marginRight="8px"/>
                        <Text
                          color="#252A32"
                          fontFamily="Ubuntu"
                          fontSize="16px"
                          fontWeight="400"
                          lineHeight="16px"
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
                  })}
                </Stack>

                <Stack spacing="8px">
                  <Text
                    color="#7D7D7D"
                    fontFamily="Ubuntu"
                    fontSize="16px"
                    fontWeight="400"
                    lineHeight="16px"
                    letterSpacing="0.2px"
                    marginBottom="8px"
                  >Não inclui</Text>
                  {resources.bdPro.map((elm, index) => {
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
                            <InfoIcon width="14px" height="14px" alt="tip" cursor="pointer" fill="#A3A3A3"/>
                          </Tooltip>
                        }
                      </Box>
                    )
                  })}
                  {resources.bdEmpresas.map((elm, index) => {
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
                            <InfoIcon width="14px" height="14px" alt="tip" cursor="pointer" fill="#A3A3A3"/>
                          </Tooltip>
                        }
                      </Box>
                    )
                  })}

                  <ButtonSimple
                    color="#42B0FF"
                    fontSize="14px"
                    fontWeight="700"
                    letterSpacing="0.3px"
                    _hover={{opacity: 0.7}}
                    marginTop="16px !important"
                    onClick={() => PlansModal.onOpen()}
                  >
                    Veja tudo e compare os planos
                  </ButtonSimple>
                </Stack>
              </Stack>
            </Stack>
          </TabPanel>

          <TabPanel>
            <PaymentSystem />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  )
}

const Accesses = () => {

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
              <Image width="100%" height="100%" src="https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"/>
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
            >Dadinho</Text>
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
            >dadinho@basedosdados.org</Text>
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

export default function UserPage() {
  const router = useRouter()
  const { query } = router
  const [sectionSelected, setSectionSelected] = useState(3)

  const choices = [
    {bar: "Perfil público", title: "Perfil público", value: "profile", index: 0},
    {bar: "Conta", title: "Conta", value: "account", index: 1},
    {bar: "Senha", title: "Alterar senha", value: "new_password", index: 2},
    {bar: "Planos e pagamento", title: "Planos e pagamento", value: "plans_and_payment", index: 3},
    {bar: "Acessos", title: "Gerenciar acessos", value: "accesses", index: 4},
  ]

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
                borderLeft={
                  sectionSelected === index ? "3px solid #2B8C4D" : "transparent"
                }
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
                  _hover={sectionSelected === index ? "none" : {  opacity: "0.6" , fontWeight: "500" }}
                  padding="0 24px"
                  width="100%"
                  onClick={() => router.push({pathname: "/user/dev", query: section.value})}
                >
                  {section.bar}
                </Text>
              </Box>
            ))}
          </Stack>

          <Stack
            flex={1}
            maxWidth="800px"
            spacing={0}
          >
            <SectionTitle marginBottom="8px">{choices[sectionSelected].title}</SectionTitle>
            <Divider marginBottom={isMobileMod() ? "40px !important" : "32px !important"} borderColor="#DEDFE0"/>

            {sectionSelected === 0 && <ProfileConfiguration/>}
            {sectionSelected === 1 && <Account/>}
            {sectionSelected === 2 && <NewPassword/>}
            {sectionSelected === 3 && <PlansAndPayment/>}
            {sectionSelected === 4 && <Accesses/>}
          </Stack>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
