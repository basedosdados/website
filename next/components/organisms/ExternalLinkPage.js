import {
  VStack,
  HStack,
  Stack,
  Box,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
  formatJson,
  getTemporalCoverage
} from "../../utils";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import { BaseResourcePage } from "../molecules/BaseResourcePage";
import { deleteResource, updateResource } from "../../pages/api/datasets";
import { getExternalLinkSchema } from "../../pages/api/schemas";
import { SchemaForm } from "../molecules/SchemaForm";
import { SimpleTable } from "../atoms/SimpleTable";
import { DisclaimerBox } from "../molecules/DisclaimerBox";
import SectionText from "../atoms/SectionText";
import Subtitle from "../atoms/Subtitle";
import RoundedButton from "../atoms/RoundedButton";
import RedirectIcon from "../../public/img/icons/redirectIcon"
import LanguageIcon from "../../public/img/icons/languageIcon";
import DisplayIcon from "../../public/img/icons/displayIcon";
import DataStructureIcon from "../../public/img/icons/dataStructureIcon";
import ApiIcon from "../../public/img/icons/apiIcon";
import FrequencyIcon from "../../public/img/icons/frequencyIcon";
import ObservationLevelIcon from "../../public/img/icons/observationLevelIcon";
import RegisterIcon from "../../public/img/icons/registerIcon";
import IpIcon from "../../public/img/icons/ipIcon";
import CoinIcon from "../../public/img/icons/coinIcon";
import ExclamationIcon from "../../public/img/icons/exclamationIcon";

export function ExternalLinkPage({
  translations,
  resource,
  availableOptionsTranslations,
}) {
  const isMobile = useCheckMobile();
  const [isMobileMod, setIsMobileMod] = useState(false)
  const [observationLevel, setObservationLevel] = useState([])
  const [temporalCoverage, setTemporalCoverage] = useState([])
  const [showTemporalCoverage, setShowTemporalCoverage] = useState(false)

  useEffect(() => {
    setIsMobileMod(isMobile)
  }, [isMobile])

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

  useEffect(() => {
    if(resource.observation_level === null) return setObservationLevel()

    if(typeof resource.observation_level === "object") {
      if(resource.observation_level.length === 0) return setObservationLevel()
      const schemaHeaders = { entity: "-", columns : "-" }
      const valueObservationLevel = resource.observation_level.map((elm) => {
        const values = elm

        const valueColumn = () => {
          if(typeof values.columns === "object") {
            const newColumn = Object.values(values.columns)
              .map((elm) => {
                if(!elm) {
                  return "-"
                } else {
                  return elm
                }
              })
            return {columns : newColumn.toString()}
          }
        }

        const translationsEntity = () => {
          if(values.entity) {
            return {entity : translateField(values.entity, availableOptionsTranslations)}
          } else {
            return {entity : "-"}
          }
        }

        const row = {...schemaHeaders, ...values, ...valueColumn(), ...translationsEntity()}
        
        delete row.country
        delete row.column
        
        if(row.entity === "-" && row.columns === "-") {
          delete row.entity
          delete row.columns
          return [""]
        }

        return Object.values(row)
      })

      function filterArray(value) {
        return value.length > 1
      }
      const newValues = valueObservationLevel.filter(filterArray)

      setObservationLevel(newValues)
    } else {
      setObservationLevel()
    }
  },[resource.observation_level])

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
      title={resource.name}
      removeFunction={() => deleteResource(resource)}
      formComponent={
        <SchemaForm
          data={resource}
          updateFunction={updateResource}
          loadSchemaFunction={getExternalLinkSchema}
          schemaName="Fonte original"
          prepareData={(data) => {
            data.country_ip_address_required =
              data.country_ip_address_required || [];
            data.maintainer = data.maintainer || "";
            data.maintainer_email = data.maintainer_email || "";
            data.resource_type = "external_link";

            return data;
          }}
        />
      }
    >
      <VStack id="acesso" width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>Consulta aos dados</Subtitle>
        <DisclaimerBox width="100%">
          <HStack spacing={0}>
            <ExclamationIcon widthIcon="20px" heightIcon="20px" fill="#42B0FF"/>
            <SectionText display="flex">
              <p style={{margin:"0 4px 0 12px", fontWeight: "bolder", fontFamily: "lato"}}>
                ATENÇÃO:</p>Estes dados não passaram pela metodologia de tratamento da Base dos Dados.
            </SectionText>
          </HStack>
        </DisclaimerBox>

        <RoundedButton
          height="35px"
          fontSize="14px"
          minWidth="100px"
          color="#FFF"
          backgroundColor={resource.url ? "#42B0FF" : "#C4C4C4"}
          padding="0 20px"
          isDisabled={resource.url ? false : true}
          onClick={() => window.open(resource.url)}
        >
          Acessar fonte original
          <RedirectIcon margin="0 0 4px 8px" widthIcon="14px" heightIcon="14px" fill="#FFF"/>
        </RoundedButton>
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
          <GridItem colSpan={isMobileMod && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <LanguageIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Idioma"
              text={resource.language}
            />
          </GridItem>

          <GridItem colSpan={isMobileMod && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <DisplayIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Disponibilidade"
              text={resource.availability}
            />
          </GridItem>

          <GridItem colSpan={isMobileMod && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <DataStructureIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Tem dados estruturados"
              text={resource.has_structured_data}
            />
          </GridItem>

          <GridItem colSpan={isMobileMod && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <ApiIcon alt="tabela tem api" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Tem API"
              text={resource.has_api}
            />
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <FrequencyIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Frequência de atualização"
              text={resource.update_frequency}
            />
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <ObservationLevelIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <Box width="100%">
              <Text
                fontFamily="ubuntu"
                fontSize="14px"
                fontWeight="400" 
                letterSpacing="0.3px"
                marginBottom="8px"
                color="#252A32"
              >Nível da observação</Text>
              {observationLevel ? 
                <SimpleTable 
                  headers={["Entidade","Colunas Correspondentes"]}
                  values={Object.values(observationLevel)}
                  valuesTable={{_first:{textTransform: "capitalize"}}}
                />
                :
                <SectionText marginRight="4px !important">Não listado</SectionText>
              }
            </Box>
          </GridItem>

          <GridItem colSpan={isMobileMod && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <RegisterIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Requer registro"
              text={resource.requires_registration}
            />
          </GridItem>

          <GridItem colSpan={isMobileMod && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <IpIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Requer IP de algum país"
              text={resource.country_ip_address_required}
            />
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <CoinIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Gratuito"
              text={resource.is_free}
            />
          </GridItem>
        </Grid>
      </VStack>
    </BaseResourcePage>
  )
}
