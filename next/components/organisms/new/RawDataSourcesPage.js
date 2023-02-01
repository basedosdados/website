import {
  VStack,
  HStack,
  Stack,
  Center,
  Box,
  Text,
  Grid,
  GridItem
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
  formatJson,
  getTemporalCoverage
} from "../../../utils";
import { useCheckMobile } from "../../../hooks/useCheckMobile.hook";
import { SimpleTable } from "../../atoms/SimpleTable";
import SectionText from "../../atoms/SectionText";
import Subtitle from "../../atoms/Subtitle";
import RoundedButton from "../../atoms/RoundedButton";
import { BaseResourcePage } from "../../molecules/BaseResourcePage";
import { DisclaimerBox } from "../../molecules/DisclaimerBox";
import { SchemaForm } from "../../molecules/SchemaForm";

import { deleteResource, updateResource } from "../../../pages/api/datasets";
import { getExternalLinkSchema } from "../../../pages/api/schemas";

import {
  getRawDataSources
} from "../../../pages/api/new/datasets";

import RedirectIcon from "../../../public/img/icons/redirectIcon"
import LanguageIcon from "../../../public/img/icons/languageIcon";
import DisplayIcon from "../../../public/img/icons/displayIcon";
import DataStructureIcon from "../../../public/img/icons/dataStructureIcon";
import ApiIcon from "../../../public/img/icons/apiIcon";
import FrequencyIcon from "../../../public/img/icons/frequencyIcon";
import ObservationLevelIcon from "../../../public/img/icons/observationLevelIcon";
import RegisterIcon from "../../../public/img/icons/registerIcon";
import IpIcon from "../../../public/img/icons/ipIcon";
import CoinIcon from "../../../public/img/icons/coinIcon";
import ExclamationIcon from "../../../public/img/icons/exclamationIcon";

export default function RawDataSourcesPage({
  id
}) {
  const [resource, setResource] = useState({})

  const featchRawDataSources = async () => {
    try {
      const result = await getRawDataSources(id)
      return setResource(result)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    featchRawDataSources()
  },[])

  const TemporalCoverage = () => {
    const temporal = resource?.temporal_coverage
    if(temporal && temporal.length > 0) return getTemporalCoverage(temporal)
    return "Nenhuma cobertura temporal fornecida"
  }

  const ObservationLevel = () => {
    const notFound = <SectionText marginRight="4px !important">Não listado</SectionText>

    if(!resource?.observation_level) return notFound
    if(resource?.observation_level === null) return notFound

    // if(typeof resource.observation_level === "object") {
    //   if(resource.observation_level.length === 0) return setObservationLevel()
    //   const schemaHeaders = { entity: "-", columns : "-" }
    //   const valueObservationLevel = resource.observation_level.map((elm) => {
    //     const values = elm

    //     const valueColumn = () => {
    //       if(typeof values.columns === "object") {
    //         const newColumn = Object.values(values.columns)
    //           .map((elm) => {
    //             if(!elm) {
    //               return "-"
    //             } else {
    //               return elm
    //             }
    //           })
    //         return {columns : newColumn.toString()}
    //       }
    //     }

    //     const translationsEntity = () => {
    //       if(values.entity) {
    //         return {entity : translateField(values.entity, availableOptionsTranslations)}
    //       } else {
    //         return {entity : "-"}
    //       }
    //     }

    //     const row = {...schemaHeaders, ...values, ...valueColumn(), ...translationsEntity()}
        
    //     delete row.country
    //     delete row.column
        
    //     if(row.entity === "-" && row.columns === "-") {
    //       delete row.entity
    //       delete row.columns
    //       return [""]
    //     }

    //     return Object.values(row)
    //   })

    //   function filterArray(value) {
    //     return value.length > 1
    //   }
    //   const newValues = valueObservationLevel.filter(filterArray)

    //   newValues
    // }

    //  return (
    //   <SimpleTable 
    //     headers={["Entidade","Colunas Correspondentes"]}
    //     values={Object.values(observationLevel)}
    //     valuesTable={{_first:{textTransform: "capitalize"}}}
    //   />
    // )
  }

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

  // function translateField(field, translation) {
  //   if(!field) return "Não listado"
      
  //   if(typeof field === "boolean") return field === true ? "Sim" : "Não"

  //   if(typeof field === "object") {
  //     if(!field) return "Não listado"
      
  //     if(field.length === 0) {
  //       return "Não listado"
  //     } else {
  //       if(Array.isArray(field)) {
  //         const newValues = field.map((elm) => {
  //           return translateField(elm, availableOptionsTranslations)
  //         })
  //         return formatJson(JSON.stringify(newValues), true)
  //       } else {
  //         const newJson = JSON.stringify(field)
  //         return formatJson(newJson, true)
  //       }
  //     }
  //   }

  //   return translation[field] || field
  // }

  return (
    <BaseResourcePage
      title={resource?.namePT || resource?.nameEn}
      // removeFunction={() => deleteResource(resource)}
      // formComponent={
      //   <SchemaForm
      //     data={resource}
      //     updateFunction={updateResource}
      //     loadSchemaFunction={getExternalLinkSchema}
      //     schemaName="Fonte original"
      //     prepareData={(data) => {
      //       data.country_ip_address_required =
      //         data.country_ip_address_required || [];
      //       data.maintainer = data.maintainer || "";
      //       data.maintainer_email = data.maintainer_email || "";
      //       data.resource_type = "external_link";

      //       return data;
      //     }}
      //   />
      // }
    >
      <VStack width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>Consulta aos dados</Subtitle>
        <DisclaimerBox width="100%">
          <HStack spacing={0} flexDirection={useCheckMobile() && "column"} alignItems="flex-start">
            <Center>
              <ExclamationIcon alt="atenção" width="20px" height="20px" fill="#42B0FF"/>
              <SectionText margin="0 4px 0 12px" fontWeight="bolder" fontFamily="lato">ATENÇÃO:</SectionText>
            </Center>
            <SectionText display="flex" marginLeft={useCheckMobile() && "32px !important"}>
              Estes dados não passaram pela metodologia de tratamento da Base dos Dados.
            </SectionText>
          </HStack>
        </DisclaimerBox>

        <RoundedButton
          height="35px"
          fontSize="14px"
          minWidth="100px"
          width={useCheckMobile() && "100%"}
          color="#FFF"
          backgroundColor={resource?.rawDataUrl ? "#42B0FF" : "#C4C4C4"}
          padding="0 20px"
          isDisabled={resource?.rawDataUrl ? false : true}
          onClick={() => window.open(resource?.rawDataUrl)}
        >
          Acessar fonte original
          <RedirectIcon alt="hiperlink" marginLeft="8px" width="14px" height="14px" fill="#FFF"/>
        </RoundedButton>
      </VStack>

      <VStack width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>Cobertura temporal</Subtitle>
        <SectionText>
          <TemporalCoverage/>
        </SectionText>
      </VStack>

      <VStack width="100%" spacing={5} alignItems="flex-start">
        <Stack flex="1" >
          <Subtitle>Informações adicionais</Subtitle>
        </Stack>

        <Grid width="100%" flex={1} templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <LanguageIcon alt="idioma" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Idioma"
              text={resource?.language || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <DisplayIcon alt="disponibilidade" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Disponibilidade"
              text={resource?.availability || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <DataStructureIcon alt="Tem dados estruturados" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Tem dados estruturados"
              text={resource?.has_structured_data || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <ApiIcon alt="tabela tem api" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Tem API"
              text={resource?.has_api || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <FrequencyIcon alt="Frequência de atualização" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Frequência de atualização"
              text={resource?.update_frequency || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <ObservationLevelIcon alt="Nível da observação" width="22px" height="22px" fill="#D0D0D0"/>
            <Box width="100%">
              <Text
                fontFamily="ubuntu"
                fontSize="14px"
                fontWeight="400" 
                letterSpacing="0.3px"
                marginBottom="8px"
                color="#252A32"
              >Nível da observação</Text>
              <ObservationLevel/>
            </Box>
          </GridItem>

          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <RegisterIcon alt="Requer registro" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Requer registro"
              text={resource?.requires_registration || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <IpIcon alt="IP" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Requer IP de algum país"
              text={resource?.country_ip_address_required || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <CoinIcon alt="é gratuito?" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Gratuito"
              text={resource?.is_free || "Não listado"}
            />
          </GridItem>
        </Grid>
      </VStack>
    </BaseResourcePage>
  )
}
