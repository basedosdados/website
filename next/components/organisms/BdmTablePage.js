import {
  VStack,
  Stack,
  Box,
  Text,
  Grid,
  GridItem,
  Tooltip,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Subtitle from "../atoms/Subtitle";
import SectionText from "../atoms/SectionText";
import ColumnDatasets from "../molecules/ColumnDatasets";
import {
  formatJson,
  getTemporalCoverage,
} from "../../utils";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import BaseResourcePage from "../molecules/BaseResourcePage";
import { SchemaForm } from "../molecules/SchemaForm";
// import { getBdmColumnsSchema } from '../../../pages/api/schemas';
// import { getBdmTableSchema } from "../../../pages/api/schemas";
// import { deleteResource, updateResource } from "../../pages/api/datasets";
import { SimpleTable } from "../atoms/SimpleTable";
import DataInformationQuery from "../molecules/DataInformationQuery";
import FourOhFour from "../templates/404";

import {
  getBdmTable
} from "../../pages/api/datasets"

import StarIcon from "../../public/img/icons/starIcon";
import FrequencyIcon from "../../public/img/icons/frequencyIcon";
import PartitionIcon from "../../public/img/icons/partitionIcon";
import UserIcon from "../../public/img/icons/userIcon";
import VersionIcon from "../../public/img/icons/versionIcon";
import EmailIcon from "../../public/img/icons/emailIcon";
import GithubIcon from "../../public/img/icons/githubIcon";
import CkanIcon from "../../public/img/icons/ckanIcon";
import WebIcon from "../../public/img/icons/webIcon";
import TwitterIcon from "../../public/img/icons/twitterIcon";
import FileIcon from "../../public/img/icons/fileIcon";
import InfoIcon from "../../public/img/icons/infoIcon";

export default function BdmTablePage({ id }) {
  const [resource, setResource] = useState({})
  const [isError, setIsError] = useState({})

  const [showColumns, setShowColumns] = useState(false)
  const [schema, setSchema] = useState({})
  const [columnsHeaders, setColumnsHeaders] = useState([])
  const [columnsValues, setColumnsValues] = useState([])
  const [observationLevel, setObservationLevel] = useState([])

  const feathBdmTable = async () => {
    try {
      const result = await getBdmTable(id)
      return setResource(result)
    } catch (error) {
      setIsError(error)
      console.error(error)
    }
  }

  useEffect(() => {
    feathBdmTable()
  },[id])

  const tooltip = {
    name: "Nome da coluna.",
    bigquery_type: "Tipo de dado no BigQuery — categorias: INTEGER (Inteiro), STRING (Texto), DATE (Data), FLOAT64 (Decimal), GEOGRAPHY (Geográfico).",
    description: "Descrição dos dados da coluna.",
    temporal_coverage: "Data inicial e final de cobertura dos dados. Pode variar entre colunas, de acordo com a disponibilidade nos dados originais.",
    covered_by_dictionary: "Indica se a coluna possui categorias descritas na tabela 'dicionario', explicando o significado das suas chaves e valores — ex: 'sexo' possui os valores 0 e 1 na coluna, e, no dicionario, você irá encontrar 'sexo' com as categorias (chave: 1 - valor: Feminino), (chave: 0 - valor: Masculino).",
    directory_column: "Caso preenchida, indica que a coluna é chave primária de uma entidade — ex: id_municipio = chave primária de municípios. Isso significa que a coluna é igual em todos os conjuntos do datalake. Informações centralizadas da entidade se encontram no diretório conforme: [diretorio].[tabela]:[coluna].",
    measurement_unit: "Unidade de medida da coluna — ex: km, m2, kg.",
    has_sensitive_data: "Indica se a coluna possui dados sensíveis — ex: CPF identificado, dados de conta bancária, etc.",
    observations: "Descreve processos de tratamentos realizados na coluna que precisam ser evidenciados."
  }

  // useEffect(() => {
  //   fetchSchema()
  // },[])
  
  // async function fetchSchema()  {
  //   const columnsSchema = await getBdmColumnsSchema()
  //   setSchema(columnsSchema)
  // }

  // function translateField(field, translation) {
  //   if(!field) return "Não listado"

  //   if(typeof field === "boolean") return field === true ? "Sim" : "Não" 

  //   if(typeof field === "object") {
  //     if(!field) return "Não listado"

  //     if(field.length === 0) {
  //       return "Não listado"
  //     } else {
  //       const newJson = JSON.stringify(field)
  //       return formatJson(newJson, true)
  //     }
  //   }

  //   return translation[field] || field
  // }

  // useEffect(() => {
  //   if(resource.observation_level === null) return setObservationLevel()

  //   if(typeof resource.observation_level === "object") {
  //     if(resource.observation_level.length === 0) return setObservationLevel()
  //     const schemaHeaders = { entity: "-", columns : "-" }
  //     const valueObservationLevel = resource.observation_level.map((elm) => {
  //       const values = elm

  //       const valueColumn = () => {
  //         if(typeof values.columns === "object") {
  //           const newColumn = Object.values(values.columns)
  //             .map((elm) => {
  //               if(!elm) {
  //                 return "-"
  //               } else {
  //                 return elm
  //               }
  //             })
  //           return {columns : newColumn.toString()}
  //         }
  //       }

  //       const translationsEntity = () => {
  //         if(values.entity) {
  //           return {entity : translateField(values.entity, availableOptionsTranslations)}
  //         } else {
  //           return {entity : "-"}
  //         }
  //       }

  //       const row = {...schemaHeaders, ...values, ...valueColumn(), ...translationsEntity()}
        
  //       delete row.country
  //       delete row.column
        
  //       if(row.entity === "-" && row.columns === "-") {
  //         delete row.entity
  //         delete row.columns
  //         return [""]
  //       }

  //       return Object.values(row)
  //     })

  //     function filterArray(value) {
  //       return value.length > 1
  //     }
  //     const newValues = valueObservationLevel.filter(filterArray)

  //     setObservationLevel(newValues)
  //   } else {
  //     setObservationLevel()
  //   }
  // },[resource.observation_level])

  // if (
  //   resource.spatial_coverage &&
  //   typeof resource.spatial_coverage === "array"
  // ) {
  //   resource.spatial_coverage = resource.spatial_coverage.sort();
  // }

  const AddInfoTextBase = ({title, text, info, children, ...style}) => {
    return (
      <Box display="block" alignItems="center" gridGap="8px" {...style}>
        <Text
          display="flex"
          alignItems="center"
          fontFamily="ubuntu"
          fontSize="14px"
          fontWeight="400" 
          letterSpacing="0.3px"
          marginBottom="8px"
          color="#252A32"
        >{title}
          {info &&
            <Tooltip
              label={info}
              hasArrow
              bg="#2A2F38"
              fontSize="16px"
              fontWeight="500"
              padding="10px 16px"
              marginTop="8px"
              color="#FFF"
              borderRadius="6px"
            >
              <InfoIcon
                alt="tip"
                marginLeft="8px"
                cursor="pointer"
                fill="#A3A3A3"
                width="16px"
                height="16px"
              />
            </Tooltip>
          }
        </Text>
        <SectionText>
          {text}
        </SectionText>
        {children}
      </Box>
    )
  }

  const keyIcons = (ref) => {
    let href = ""
    let alt = ""

    if(ref.github_user) {
      const github = ref.github_user.replace(/(https:)\/\/(github.com)\//gim, "")
      href = `https://github.com/${github}` 
      alt = "github basedosdados"
    }
    if(ref.twitter_user) {
      const twitter = ref.twitter_user.replace(/(https:)\/\/(twitter.com)\//gim, "")
      href = `https://twitter.com/${twitter}`
      alt = "twitter basedosdados"
    }
    if(ref.email) {
      href = `mailto:${ref.email}`
      alt= "email do contribuidor"
    }
    if(ref.ckan_user) {
      href = `/user/${ref.ckan_user}`
      alt = "usuário ckan"
    }
    if(ref.website) {
      href = `https://${ref.website}`
      alt = "website pessoal"
    }

    return {
      alt: alt,
      cursor: "pointer",
      width:"18px",
      height:"18px",
      fill: "#42B0FF",
      onClick: () => {window.open(href)}
    }
  }

  const PublishedOrDataCleanedBy = ({ resource }) => {
    if(resource.name === "Ricardo Dahis") return <SectionText marginRight="4px !important">Equipe Dados</SectionText>

    return (
      <>
        {resource?.name ? <SectionText marginRight="4px !important">{resource.name}</SectionText> : <SectionText marginRight="4px !important">Não listado</SectionText>}
        {resource?.email && <EmailIcon {...keyIcons({email : resource.email})}/>}
        {resource?.github_user && <GithubIcon {...keyIcons({github_user : resource.github_user})}/>}
        {resource?.ckan_user && <CkanIcon {...keyIcons({ckan_user : resource.ckan_user})}/>}
        {resource?.website && <WebIcon {...keyIcons({website : resource.website})}/>}
        {resource?.twitter_user && <TwitterIcon {...keyIcons({twitter_user : resource.twitter_user})}/>}
      </>
    )
  }

  const TemporalCoverage = () => {
    // const temporal = resource?.temporal_coverage
    // if(temporal && temporal.length > 0) return getTemporalCoverage(temporal)
    return "Nenhuma cobertura temporal fornecida"
  }

  if(isError?.message?.length > 0) return <FourOhFour/>

  return (
    <BaseResourcePage
      padding={useCheckMobile() ? "16px 0 0" : "16px 8px 0 0"}
      // editLink={`/resource/edit/${resource?.id}`}
      title={resource?.name}
      // removeFunction={() => deleteResource(resource)}
      // formComponent={
      //   <SchemaForm
      //     data={resource}
      //     schemaName="Tabela BD+"
      //     loadSchemaFunction={getBdmTableSchema}
      //     updateFunction={updateResource}
      //     prepareData={(data) => {
      //       data.observation_level = data.observation_level || [];
      //       data.published_by.github_user = data.published_by.github_user || "";
      //       data.published_by.ckan_user = data.published_by.ckan_user || "";
      //       data.data_cleaned_by.github_user =
      //         data.data_cleaned_by.github_user || "";
      //       data.data_cleaned_by.ckan_user =
      //         data.data_cleaned_by.ckan_user || "";
      //       data.data_cleaned_by.website = data.data_cleaned_by.website || "";
      //       data.resource_type = "bdm_table";

      //       return data;
      //     }}
      //   />
      // }
    >
      <DataInformationQuery resource={resource}/>

      <VStack width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>Descrição</Subtitle>
        <SectionText>
          {resource.description || "Nenhuma descrição fornecida."}
        </SectionText>
      </VStack>
      
      <VStack width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>Cobertura temporal</Subtitle>
        <SectionText>
          <TemporalCoverage/>
        </SectionText>
      </VStack>

      {/* <VStack width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>
          Colunas
        </Subtitle>
        {showColumns ?
          <ColumnDatasets
            translations={translations.bdm_columns}
            availableOptionsTranslations={availableOptionsTranslations}
            translationsOptions={translationsOptions}
            parentTemporalCoverage={resource?.temporal_coverage || ""}
            tooltip={tooltip} 
            headers={columnsHeaders}
            values={columnsValues}
          />
        :
          <SectionText>
            Nenhuma informação de coluna fornecida.
          </SectionText>
        }
      </VStack> */}

      {/* <VStack width="100%" spacing={5} alignItems="flex-start">
        <Subtitle>
          Nível da observação
        </Subtitle>
        {observationLevel ?
          <SimpleTable
            headers={["Entidade","Colunas Correspondentes"]}
            values={Object.values(observationLevel)}
            valuesTable={{_first:{textTransform: "capitalize"}}}
          />
        :
          <SectionText>Nenhum nível da observação fornecido.</SectionText>
        }
      </VStack> */}

      <VStack width="100%" spacing={5} alignItems="flex-start">
        <Stack flex="1" >
          <Subtitle>Informações adicionais</Subtitle>
        </Stack>

        <Grid width="100%" flex={1} templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <StarIcon alt="" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="ID do conjunto"
              text={resource?._id || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <StarIcon alt="" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="ID da tabela"
              text={resource?.table_id || "Não listado"}
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
            <PartitionIcon alt="Partições no BigQuery" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Partições no BigQuery"
              info="As partições são divisões feitas em uma tabela para facilitar o gerenciamento e a consulta aos dados.
              Ao segmentar uma tabela grande em partições menores, a quantidade de bytes lidos é reduzida,
              o que ajuda a controlar os custos e melhora o desempenho da consulta."
              text={resource?.partitions || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <UserIcon alt="publicação por" width="22px" height="22px" fill="#D0D0D0"/>
            <Box display="block" gridGap="8px">
              <Text
                fontFamily="ubuntu"
                fontSize="14px"
                fontWeight="400" 
                letterSpacing="0.3px"
                marginBottom="8px"
                color="#252A32"
              >Publicação por</Text>
              <Box display="flex" alignItems="center" gridGap="4px">
                <PublishedOrDataCleanedBy
                  resource={resource?.published_by || "Não listado"}
                />
              </Box>
            </Box>
          </GridItem>

          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <UserIcon alt="publicação por" width="22px" height="22px" fill="#D0D0D0"/>
            <Box display="block" gridGap="8px">
              <Text
                fontFamily="ubuntu"
                fontSize="14px"
                fontWeight="400" 
                letterSpacing="0.3px"
                marginBottom="8px"
                color="#252A32"
              >Tratamento por</Text>
              <Box display="flex" alignItems="center" gridGap="4px">
                <PublishedOrDataCleanedBy
                  resource={resource?.data_cleaned_by || "Não listado"}
                />
              </Box>
            </Box>
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <VersionIcon alt="versão" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Versão"
              text={resource?.version || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <FileIcon alt="Arquivos auxiliares" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Arquivos auxiliares"
              info="Os arquivos dão mais contexto e ajudam a entender melhor os dados disponíveis.
              Podem incluir notas técnicas, descrições de coleta e amostragem, etc."
            />
          </GridItem>
        </Grid>
      </VStack>
    </BaseResourcePage>
  );
}
