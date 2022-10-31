import {
  VStack,
  HStack,
  Stack,
  Image,
  Box,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Subtitle from "../atoms/Subtitle";
import SectionText from "../atoms/SectionText";
import {
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
  getTemporalCoverage,
} from "../../utils";
import { BaseResourcePage } from "../molecules/BaseResourcePage";
import { deleteResource, updateResource } from "../../pages/api/datasets";
import { getInformationRequestSchema } from "../../pages/api/schemas";
import { SchemaForm } from "../molecules/SchemaForm";
import { DisclaimerBox } from "../molecules/DisclaimerBox";
import RoundedButton from "../atoms/RoundedButton";
import StatusIcon from "../../public/img/icons/statusIcon";
import UserIcon from "../../public/img/icons/userIcon";
import ExclamationIcon from "../../public/img/icons/exclamationIcon";
import RedirectIcon from "../../public/img/icons/redirectIcon";

export function InformationRequestPage({
  translations,
  resource,
  availableOptionsTranslations,
}) {
  const [temporalCoverage, setTemporalCoverage] = useState([])
  const [showTemporalCoverage, setShowTemporalCoverage] = useState(false)

  useEffect(() => {
    if(resource.temporal_coverage) {
      if(resource.temporal_coverage.length === 0) {
        setTemporalCoverage(getTemporalCoverage(resource.temporal_coverage))
        setShowTemporalCoverage(false)
      } else {
        setTemporalCoverage(getTemporalCoverage(resource.temporal_coverage))
        setShowTemporalCoverage(true)
      }
    }
  },[resource.temporalCoverage])

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
          {translateField(text, availableOptionsTranslations)}
        </SectionText>
        {children}
      </Box>
    )
  }

  function translateField(field, translation) {
    if(!field) return "Não listado"
      
    if(typeof field === "boolean") return field === true ? "Sim" : "Não"

    if(typeof field === "object") {
      if(!field) return "Não listado"
      
      if(field.length === 0) {
        return "Não listado"
      } else {
        if(Array.isArray(field)) {
          const newValues = field.map((elm) => {
            return translateField(elm, availableOptionsTranslations)
          })
          return formatJson(JSON.stringify(newValues), true)
        } else {
          const newJson = JSON.stringify(field)
          return formatJson(newJson, true)
        }
      }
    }

    return translation[field] || field
  }

  return (
    <BaseResourcePage
      title={`Número do pedido: ${resource.name}`}
      removeFunction={() => deleteResource(resource)}
      formComponent={
        <SchemaForm
          data={resource}
          updateFunction={updateResource}
          loadSchemaFunction={getInformationRequestSchema}
          schemaName="Pedidos LAI"
          prepareData={(data) => {
            data.country_ip_address_required =
              data.country_ip_address_required || [];
            data.maintainer = data.maintainer || "";
            data.maintainer_email = data.maintainer_email || "";
            data.resource_type = "information_request";

            return data;
          }}
        />
      }
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
          <HStack margin="10px 0" gridGap={2}>
            <Image
              border="1px solid #DEDFE0"
              borderRadius="10px"
              src={"/img/icons/fiquem_sabendo.png"}
              width="80px"
              height="80px"
              onClick={() => window.open("https://fiquemsabendo.com.br/")}
              cursor="pointer"
            />
            <Box>
              <Text
                width="130px"
                onClick={() => window.open("https://fiquemsabendo.com.br/")}
                cursor="pointer"
                marginBottom="5px"
                fontWeight="bold"
              >
                Fiquem Sabendo
              </Text>
              <SectionText>
                Agência de dados públicos independente e especializada na Lei de Acesso à Informação.
              </SectionText>
            </Box>
          </HStack>
        </VStack>

        <VStack id="acesso" width="100%" spacing={4} alignItems="flex-start">
          <Subtitle>Consulta aos dados</Subtitle>
          <DisclaimerBox width="100%">
            <HStack spacing={0}>
              <ExclamationIcon alt="atenção" width="20px" height="20px" fill="#42B0FF"/>
              <SectionText display="flex">
                <p style={{margin:"0 4px 0 12px", fontWeight: "bolder", fontFamily: "lato"}}>
                  ATENÇÃO:</p>Estes dados não passaram pela metodologia de tratamento da Base dos Dados.
              </SectionText>
            </HStack>
          </DisclaimerBox>

          <HStack>
            <RoundedButton
              height="35px"
              fontSize="14px"
              minWidth="100px"
              color="#FFF"
              backgroundColor={resource?.url ? "#42B0FF" : "#C4C4C4"}
              padding="0 20px"
              isDisabled={resource?.url ? false : true}
              onClick={() => window.open(resource?.url)}
            >
              <RedirectIcon marginRight="8px" widthIcon="14px" heightIcon="14px" fill="#FFF"/>
              Acessar dados
            </RoundedButton>

            <RoundedButton
              height="35px"
              fontSize="14px"
              minWidth="100px"
              color={resource?.data_url ? "#42B0FF" : "#FFF"}
              border={resource?.data_url && "2px solid #42B0FF"}
              backgroundColor={resource?.data_url ? "#FFF" : "#C4C4C4"}
              padding="0 20px"
              isDisabled={resource?.data_url ? false : true}
              onClick={() => window.open(resource?.data_url)}
            >
              <RedirectIcon marginRight="8px" widthIcon="14px" heightIcon="14px" fill={resource?.data_url ? "#42B0FF" : "#FFF"}/>
              Acessar pedido
            </RoundedButton>
          </HStack>
        </VStack>

        <VStack
          alignItems="flex-start"
          marginTop="32px !important"
          fontFamily="Lato"
          fontSize="16px"
        >
          <Subtitle marginBottom="8px !important">Descrição</Subtitle>
          <SectionText>
            {resource.description || "Nenhuma descrição fornecida."}
          </SectionText>
        </VStack>

        <VStack id="acesso" width="100%" spacing={4} alignItems="flex-start">
          <Subtitle>Cobertura temporal</Subtitle>
          <SectionText>
            {showTemporalCoverage ? temporalCoverage : "Nenhuma cobertura temporal fornecida"}
          </SectionText>
        </VStack>

        <VStack width="100%" spacing={5} alignItems="flex-start">
          <Stack flex="1" >
            <Subtitle>Informações adicionais</Subtitle>
          </Stack>
  
          <Grid width="100%" flex={1} templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
              <StatusIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
              <AddInfoTextBase
                title="Estado"
                text={resource.state}
              />
            </GridItem>

            <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
              <UserIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
              <AddInfoTextBase
                title="Pedido feito por"
                text={resource.requested_by.name}
              />
            </GridItem>
          </Grid>
        </VStack>
      </VStack>
    </BaseResourcePage>
  )
}
