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
  Checkbox
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MainPageTemplate } from "../../components/templates/main";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import BigTitle from "../../components/atoms/BigTitle";
import SectionTitle from "../../components/atoms/SectionTitle";
import RoundedButton from "../../components/atoms/RoundedButton";

import Exclamation from "../../public/img/icons/exclamationIcon";
import PenIcon from "../../public/img/icons/penIcon";
import GithubIcon from "../../public/img/icons/githubIcon";
import TwitterIcon from "../../public/img/icons/twitterIcon";
import LinkedinIcon from "../../public/img/icons/linkedinIcon";

export default function UserPage() {
  const [sectionSelected, setSectionSelected] = useState(0)
  const [formData, setFormData] = useState({ username: "", firstName: "" , lastName: "", picture: "" })
  const [errors, setErrors] = useState({ username: "", firstName: "" , lastName: "" })

  const choices = [
    "Perfil público",
    "Conta",
    "Senha",
    "Planos e pagamento",
    "Acessos",
  ]

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
        <BigTitle>Configurações</BigTitle>

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          spacing={0}
          gap="80px"
          marginBottom="80px !important"
        >
          <Stack
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
          >
            <SectionTitle>Perfil público</SectionTitle>
            <Divider marginBottom="32px !important" borderColor="#DEDFE0"/>

            <Stack
              flexDirection="row"
              justifyContent="space-between"
              spacing={0}
              gap="80px"
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
                    lineHeight="27px"
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
        </Stack>
      </Stack>
    </MainPageTemplate>
  )
}
