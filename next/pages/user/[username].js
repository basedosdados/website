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
  ModalFooter
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MainPageTemplate } from "../../components/templates/main";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import BigTitle from "../../components/atoms/BigTitle";
import SectionTitle from "../../components/atoms/SectionTitle";
import RoundedButton from "../../components/atoms/RoundedButton";
import ButtonSimple from "../../components/atoms/SimpleButton";
import InputForm from "../../components/atoms/SimpleInput"
import Link from "../../components/atoms/Link";

import Exclamation from "../../public/img/icons/exclamationIcon";
import PenIcon from "../../public/img/icons/penIcon";
import GithubIcon from "../../public/img/icons/githubIcon";
import TwitterIcon from "../../public/img/icons/twitterIcon";
import LinkedinIcon from "../../public/img/icons/linkedinIcon";
import { EmailConfirmImage } from "../../public/img/emailImage";
import ChevronIcon from "../../public/img/icons/chevronIcon";
import { EyeIcon, EyeOffIcon } from "../../public/img/icons/eyeIcon";

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
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered margin="24px !important">
      <ModalOverlay/>
      <ModalContent
        margin="24px"
        minWidth={isMobileMod() ? "" : "536px"}
        boxSizing="content-box"
        padding="32px"
        borderRadius="20px"
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
  const [formData, setFormData] = useState({ username: "", firstName: "" , lastName: "", picture: "" })
  const [errors, setErrors] = useState({ username: "", firstName: "" , lastName: "" })

  return (
    <Stack
      flexDirection={isMobileMod() ? "column-reverse" : "row"}
      justifyContent="space-between"
      spacing={0}
      gap={isMobileMod() ? "40px" : "80px"}
    >
      <Stack spacing="24px" flex={1}>
        <FormControl isInvalid={!!errors.username}>
          <LabelTextForm text="Username"/>
          <Input
            id="username"
            name="username"
            value={formData.username}
            placeholder="Insira seu username"
            fontFamily="ubuntu"
            height="40px"
            fontSize="14px"
            borderRadius="16px"
            _invalid={{boxShadow:"0 0 0 2px #D93B3B"}}
          />
          <FormErrorMessage fontSize="12px" color="#D93B3B" display="flex" flexDirection="row" gap="4px" alignItems="flex-start">
            <Exclamation marginTop="3px" fill="#D93B3B"/>{errors.username}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.firstName}>
          <LabelTextForm text="Nome"/>
          <Input
            id="firstName"
            name="firstName"
            value={formData.name}
            placeholder="Insira seu nome"
            fontFamily="ubuntu"
            height="40px"
            fontSize="14px"
            borderRadius="16px"
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
            placeholder="Insira seu sobrenome"
            fontFamily="ubuntu"
            height="40px"
            fontSize="14px"
            borderRadius="16px"
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
          <LabelTextForm text="Url"/>
          <Input
            id="website"
            name="website"
            value={formData.website}
            placeholder="Insira seu endereço URL"
            fontFamily="ubuntu"
            height="40px"
            fontSize="14px"
            borderRadius="16px"
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
              placeholder="Link para o perfil no GitHub"
              fontFamily="ubuntu"
              height="40px"
              fontSize="14px"
              borderRadius="16px"
            />
          </HStack>

          <HStack spacing="8px" margin="0 0 8px 0 !important">
            <TwitterIcon width="24px" height="24px" fill="#D0D0D0"/>
            <Input
              id="twitter"
              name="twitter"
              value={formData.twitter}
              placeholder="Link para o perfil no Twitter"
              fontFamily="ubuntu"
              height="40px"
              fontSize="14px"
              borderRadius="16px"
            />
          </HStack>

          <HStack spacing="8px"  margin="0 !important">
            <LinkedinIcon width="24px" height="24px" fill="#D0D0D0"/>
            <Input
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              placeholder="Link para o perfil no Linkedin"
              fontFamily="ubuntu"
              height="40px"
              fontSize="14px"
              borderRadius="16px"
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
          width="fit-content"
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
            <Image width="100%" height="100%" src={formData?.picture ? formData.picture : "https://basedosdados-static.s3.us-east-2.amazonaws.com/equipe/sem_foto.png"}/>
          </Box>
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
                // onChange={handleInputChange}
                // onKeyDown={handleKeyDown}
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
                  // onChange={handleInputChange}
                  // onKeyDown={handleKeyDown}
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
            backgroundColor="#FF8484"
            width={isMobileMod() ? "100%" : "fit-content"}
            _hover={{transform: "none", opacity: 0.8}}
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

export default function UserPage() {
  const [sectionSelected, setSectionSelected] = useState(1)

  const choices = [
    "Perfil público",
    "Conta",
    "Senha",
    "Planos e pagamento",
    "Acessos",
  ]

  return (
    <MainPageTemplate paddingX="24px">
      <Stack
        paddingTop={isMobileMod() ? "120px" : "50px"}
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
          marginBottom={isMobileMod() ? "" : "80px !important"}
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
                  onClick={() => setSectionSelected(index)}
                >
                  {section}
                </Text>
              </Box>
            ))}
          </Stack>

          <Stack
            flex={1}
            maxWidth="800px"
            spacing={0}
          >
            <SectionTitle marginBottom="8px">{choices[sectionSelected]}</SectionTitle>
            <Divider marginBottom={isMobileMod() ? "40px !important" : "32px !important"} borderColor="#DEDFE0"/>

            {sectionSelected === 0 && <ProfileConfiguration/>}
            {sectionSelected === 1 && <Account/>}
          </Stack>
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
