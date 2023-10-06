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
  Tooltip
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { MainPageTemplate } from "../../components/templates/main";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import BigTitle from "../../components/atoms/BigTitle";
import SectionTitle from "../../components/atoms/SectionTitle";

import Exclamation from "../../public/img/icons/exclamationIcon";
import PenIcon from "../../public/img/icons/penIcon";

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
              <Stack spacing={0} flex={1}>
                <FormControl isInvalid={!!errors.username} marginBottom="24px !important">
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

                <FormControl isInvalid={!!errors.firstName} marginBottom="24px !important">
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

                <FormControl isInvalid={!!errors.email} marginBottom="24px !important">
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
                    fontSize="16px"
                    fontWeight="500"
                    padding="5px 16px 6px"
                    marginTop="10px"
                    color="#FFF"
                    borderRadius="6px"
                    minWidth="96px"
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
