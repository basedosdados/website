import {
  VStack,
  HStack,
  Stack,
  Center,
  Image,
  Box,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../../hooks/useCheckMobile.hook";
import Subtitle from "../../atoms/Subtitle";
import SectionText from "../../atoms/SectionText";
import RoundedButton from "../../atoms/RoundedButton";
import BaseResourcePage from "../../molecules/new/BaseResourcePage";
import { DisclaimerBox } from "../../molecules/DisclaimerBox";

import { SchemaForm } from "../../molecules/SchemaForm";
import { deleteResource, updateResource } from "../../../pages/api/datasets";

import {
  getInformationRequest
} from "../../../pages/api/new/datasets";

import StatusIcon from "../../../public/img/icons/statusIcon";
import UserIcon from "../../../public/img/icons/userIcon";
import ExclamationIcon from "../../../public/img/icons/exclamationIcon";
import RedirectIcon from "../../../public/img/icons/redirectIcon";

export default function InformationRequestPage({ id }) {
  const [resource, setResource] = useState({})

  const featchInformationRequest = async () => {
    try {
      const result = await getInformationRequest(id)
      return setResource(result)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    featchInformationRequest()
  },[id])

  const AddInfoTextBase = ({title, text, children, ...style}) => {
    return (
      <Box display="block" alignItems="center" gridGap="8px" {...style}>
        <Text
          fontFamily="ubuntu"
          fontSize="14px"
          fontWeight="400" 
          letterSpacing="0.3px"
          marginBottom="8px"
          color="#252A32"
        >{title}</Text>
        <SectionText>
          {text}
        </SectionText>
        {children}
      </Box>
    )
  }

  const partnerships = {
    "Fiquem Sabendo": {
      title: "Fiquem Sabendo",
      description: "Agência de dados públicos independente e especializada na Lei de Acesso à Informação.",
      url: "https://fiquemsabendo.com.br/",
      src: "/img/icons/fiquem_sabendo.png"
    },
    "Fundação Lemann": {
      title: "Fundação Lemann",
      description: "Organização que trabalha para garantir educação de qualidade para todas as crianças brasileiras e apoia líderes focados no desenvolvimento social do Brasil.",
      url: "https://fundacaolemann.org.br/",
      src: "https://basedosdados-static.s3.us-east-2.amazonaws.com/estudos_de_caso/logos/flemann.png"
    }
  }

  const PartnershipContainer = ({
    title,
    description,
    url,
    src
  }) => {

    return (
      <HStack margin="10px 0" alignItems="flex-start" gridGap={2}>
        <Box
          display="flex"
          alignItems="center"
          backgroundColor="#FFF"
          boxShadow="0 2px 6px 1px #0000001a"
          borderRadius="10px"
          padding="10px"
          minWidth="100px"
          minHeight="100px"
          maxWidth="100px"
          maxHeight="100px"
        >
          <Image
            alt={title}
            src={src}
            width="fit-content"
            height="fit-content"
            onClick={() => window.open(url)}
            cursor="pointer"
          />
        </Box>

        <Box>
          <Text
            width="100%"
            onClick={() => window.open(url)}
            cursor="pointer"
            marginBottom="4px"
            fontWeight="bold"
          >
            {title}
          </Text>
          <SectionText>
            {description}
          </SectionText>
        </Box>
      </HStack>
    )
  }

  if(resource === undefined || Object.keys(resource).length === 0) return null

  return (
    <BaseResourcePage
      title={`Número do pedido: ${resource?.namePt || resource?.nameEn}`}
      // removeFunction={() => deleteResource(resource)}
      // formComponent={
      //   <SchemaForm
      //     data={resource}
      //     updateFunction={updateResource}
      //     loadSchemaFunction={getInformationRequestSchema}
      //     schemaName="Pedidos LAI"
      //     prepareData={(data) => {
      //       data.country_ip_address_required = data.country_ip_address_required || [];
      //       data.maintainer = data.maintainer || "";
      //       data.maintainer_email = data.maintainer_email || "";
      //       data.resource_type = "information_request";
      //       return data;
      //     }}
      //   />
      // }
    >
      <VStack 
        marginTop="0 !important" 
        width="100%" 
        letterSpacing="0.5px" 
        spacing={4} 
        alignItems="flex-start"
      >
        <VStack
          alignItems="flex-start"
          borderRadius="10px"
          marginTop="20px"
          color="#252A32"
          fontFamily="Lato"
          fontSize="16px"
          spacing={5}
        >
          <SectionText>
            A disponibilização destes dados é resultado de uma parceria com:
          </SectionText>

          <PartnershipContainer
            {...resource?.namePt === "03005.341407/2022-56" ?
              partnerships["Fundação Lemann"] :
              partnerships["Fiquem Sabendo"]
            }
          />
        </VStack>

        <VStack width="100%" marginTop="32px !important" spacing={4} alignItems="flex-start">
          <Subtitle>Consulta aos dados</Subtitle>
          <DisclaimerBox width="100%">
            <HStack
              spacing={0}
              flexDirection={useCheckMobile() && "column"}
              alignItems="flex-start"
            >
              <Center>
                <ExclamationIcon alt="atenção" width="20px" height="20px" fill="#42B0FF"/>
                <SectionText margin="0 4px 0 12px" fontWeight="bolder" fontFamily="lato">ATENÇÃO:</SectionText>
              </Center>
              <SectionText
                display="flex"
                marginLeft={useCheckMobile() && "32px !important"}
              >
                Estes dados não passaram pela metodologia de tratamento da Base dos Dados.
              </SectionText>
            </HStack>
          </DisclaimerBox>

          <HStack
            width="100%"
            alignItems="flex-start"
            flexDirection={useCheckMobile() && "column"}
            gridGap={useCheckMobile() ? "16px" : "8px"}
            marginTop={useCheckMobile() && "24px !important"}
            spacing={0}
          >
            <a href={resource?.rawDataUrl} target="_blank">
              <RoundedButton
                height="35px"
                fontSize="14px"
                minWidth="180px"
                width={useCheckMobile() && "100%"}
                color="#FFF"
                backgroundColor={resource?.rawDataUrl ? "#42B0FF" : "#C4C4C4"}
                padding="0 20px"
                isDisabled={resource?.rawDataUrl ? false : true}
              >
                <RedirectIcon alt="hiperlink" marginRight="8px" width="14px" height="14px" fill="#FFF"/>
                Acessar dados
                </RoundedButton>
            </a>

            <a href={resource?.auxiliaryFilesUrl} target="_blank">
              <RoundedButton
                height="35px"
                fontSize="14px"
                minWidth="180px"
                width={useCheckMobile() && "100%"}
                color={resource?.auxiliaryFilesUrl ? "#42B0FF" : "#FFF"}
                border={resource?.auxiliaryFilesUrl && "2px solid #42B0FF"}
                backgroundColor={resource?.auxiliaryFilesUrl ? "#FFF" : "#C4C4C4"}
                padding="0 20px"
                isDisabled={resource?.auxiliaryFilesUrl ? false : true}
              >
                <RedirectIcon alt="hiperlink" marginRight="8px" width="14px" height="14px" fill={resource?.auxiliaryFilesUrl ? "#42B0FF" : "#FFF"}/>
                Acessar pedido
              </RoundedButton>
            </a>
          </HStack>
        </VStack>

        <VStack
          alignItems="flex-start"
          marginTop="32px !important"
          fontFamily="Lato"
          fontSize="16px"
        >
          <Subtitle >Descrição</Subtitle>
          <SectionText marginTop="16px !important">
            {resource?.description || "Nenhuma descrição fornecida."}
          </SectionText>
        </VStack>

        <VStack width="100%" marginTop="32px !important" spacing={4} alignItems="flex-start">
          <Subtitle>Cobertura temporal</Subtitle>
          <SectionText>
            {resource?.coverages.edges[0].node.temporalCoverage || "Nenhuma cobertura temporal fornecida"}
          </SectionText>
        </VStack>

        <VStack width="100%" marginTop="32px !important" spacing={5} alignItems="flex-start">
          <Stack flex="1" >
            <Subtitle>Informações adicionais</Subtitle>
          </Stack>
  
          <Grid width="100%" flex={1} templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
              <StatusIcon alt="estado" width="22px" height="22px" fill="#D0D0D0"/>
              <AddInfoTextBase
                title="Estado"
                text={resource?.status.namePt || resource?.status.nameEn || "Não listado"}
              />
            </GridItem>

            <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
              <UserIcon alt="Pedido feito por" width="22px" height="22px" fill="#D0D0D0"/>
              <AddInfoTextBase
                title="Pedido feito por"
                text={resource.requested_by?.name || "Não listado"}
              />
            </GridItem>
          </Grid>
        </VStack>
      </VStack>
    </BaseResourcePage>
  )
}
