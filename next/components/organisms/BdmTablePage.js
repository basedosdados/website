import {
  VStack,
  Stack,
  Box,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Subtitle from "../atoms/Subtitle";
import SectionText from "../atoms/SectionText";
import { ExpandableTable } from "../molecules/ExpandableTable";
import ColumnDatasets from "../molecules/ColumnDatasets";
import {
  breakNestedObjects,
  filterOnlyValidValues,
  formatObjectsInArray,
  translate,
  formatJson,
  getTemporalCoverage,
} from "../../utils";
import { BaseResourcePage } from "../molecules/BaseResourcePage";
import { SchemaForm } from "../molecules/SchemaForm";
import { getBdmColumnsSchema } from '../../pages/api/schemas';
import { getBdmTableSchema } from "../../pages/api/schemas";
import { deleteResource, updateResource } from "../../pages/api/datasets";
import { SimpleTable } from "../atoms/SimpleTable";
import DataInformationQuery from "../molecules/DataInformationQuery";
import StarIcon from "../../public/img/icons/starIcon";
import FrequencyIcon from "../../public/img/icons/frequencyIcon";
import ObservationLevelIcon from "../../public/img/icons/observationLevelIcon";
import PartitionIcon from "../../public/img/icons/partitionIcon";
import UserIcon from "../../public/img/icons/userIcon"
import VersionIcon from "../../public/img/icons/versionIcon"
import EmailIcon from "../../public/img/icons/emailIcon"
import GitIcon from "../../public/img/icons/gitIcon"
import CkanIcon from "../../public/img/icons/ckanIcon"
import WebIcon from "../../public/img/icons/webIcon"
import TwitterIcon from "../../public/img/icons/twitterIcon"

export function BdmTablePage({
  availableOptionsTranslations,
  translationsOptions,
  translations,
  datasetName,
  resource,
}) {

  const [showColumns, setShowColumns] = useState(false)
  const [showTemporalCoverage, setShowTemporalCoverage] = useState(false)
  const [schema, setSchema] = useState({})
  const [columnsHeaders, setColumnsHeaders] = useState([])
  const [columnsValues, setColumnsValues] = useState([])
  const [temporalCoverage, setTemporalCoverage] = useState([])
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

  useEffect(() => {
    fetchSchema()
  },[])
  
  async function fetchSchema()  {
    const columnsSchema = await getBdmColumnsSchema()
    setSchema(columnsSchema)
  }

  function translateField(field, translation) {
    if(typeof field === "boolean") {
      return field === true ? "Sim" : "Não"
    }

    if(typeof field === "object") {
      if(!field){
        return "Não listado"
      }
      if(field.length === 0) {
        return "Não listado"
      } else {
        const newJson = JSON.stringify(field)
        return formatJson(newJson, true)
      }
    }

    return translation[field] || field
  }

  useEffect(() => {
    setColumnsHeaders(Object.keys(schema))
    if(resource.columns) {
      if(resource.columns.length === 0) {
        setColumnsValues(resource.columns)
        setShowColumns(false)
      } else {
        setColumnsValues(resource.columns)
        setShowColumns(true)
      }
    }
    if(resource.temporal_coverage) {
      if(resource.temporal_coverage.length === 0) {
        setTemporalCoverage(getTemporalCoverage(resource.temporal_coverage))
        setShowTemporalCoverage(false)
      } else {
        setTemporalCoverage(getTemporalCoverage(resource.temporal_coverage))
        setShowTemporalCoverage(true)
      }
    }

  },[schema, resource])

  if (
    resource.spatial_coverage &&
    typeof resource.spatial_coverage === "array"
  ) {
    resource.spatial_coverage = resource.spatial_coverage.sort();
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
          {translateField(text, availableOptionsTranslations)}
        </SectionText>
        {children}
      </Box>
    )
  }

  const keyIcons = (ref) => {
    let href = ""

    if(ref.github_user) {
      const github = ref.github_user.replace(/(https:)\/\/(github.com)\//gim, "")
      href = `https://github.com/${github}` 
    }
    if(ref.twitter_user) {
      const twitter = ref.twitter_user.replace(/(https:)\/\/(twitter.com)\//gim, "")
      href = `https://twitter.com/${twitter}`
    }
    if(ref.email) { href = `mailto:${ref.email}` }
    if(ref.ckan_user) { href = `/user/${ref.ckan_user}` }
    if(ref.website) { href = `https://${ref.website}` }

    return {
      cursor: "pointer",
      widthIcon:"18px",
      heightIcon:"18px",
      fill: "#42B0FF",
      onClick: () => {window.open(href)}
    }
  }

  return (
    <BaseResourcePage
      padding="16px 8px 0 0"
      editLink={`/resource/edit/${resource.id}`}
      title={`${resource.name}`}
      removeFunction={() => deleteResource(resource)}
      formComponent={
        <SchemaForm
          data={resource}
          schemaName="Tabela BD+"
          loadSchemaFunction={getBdmTableSchema}
          updateFunction={updateResource}
          prepareData={(data) => {
            data.observation_level = data.observation_level || [];
            data.published_by.github_user = data.published_by.github_user || "";
            data.published_by.ckan_user = data.published_by.ckan_user || "";
            data.data_cleaned_by.github_user =
              data.data_cleaned_by.github_user || "";
            data.data_cleaned_by.ckan_user =
              data.data_cleaned_by.ckan_user || "";
            data.data_cleaned_by.website = data.data_cleaned_by.website || "";
            data.resource_type = "bdm_table";

            return data;
          }}
        />
      }
    >
      <DataInformationQuery resource={resource} />

      <VStack width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>Descrição</Subtitle>
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

      <VStack id="acesso" width="100%" spacing={5} alignItems="flex-start">
        <Subtitle>
          Colunas
        </Subtitle>
        {showColumns ?
          <ColumnDatasets
            translations={translations.bdm_columns}
            availableOptionsTranslations={availableOptionsTranslations}
            translationsOptions={translationsOptions}
            parentTemporalCoverage={temporalCoverage}
            tooltip={tooltip}
            headers={columnsHeaders}
            values={columnsValues}
          />
        :
          <SectionText>
            Nenhuma informação de coluna fornecida
          </SectionText>
        }
      </VStack>

      <VStack width="100%" spacing={3} alignItems="flex-start">
        <Stack flex="1" >
          <Subtitle>Informações adicionais</Subtitle>
        </Stack>

        <Grid width="100%" templateColumns="repeat(2, 1fr)" gap={8}>
          {/* dataset_id */}
          <GridItem display="flex" alignItems="flex-start" gridGap="8px">
            <StarIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="ID do conjunto"
              text={resource.dataset_id}
            />
          </GridItem>

          <GridItem display="flex" alignItems="flex-start" gridGap="8px">
            <StarIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="ID da tabela"
              text={resource.table_id}
            />
          </GridItem>

          {/* update_frequency */}
          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <FrequencyIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Frequência de atualização"
              text={resource.update_frequency}
            />
          </GridItem>

          {/* observation_level */}
          {/* <GridItem colSpan={2} display="flex" flexDirection="column" alignItems="flex-start" gridGap="8px">
            <Box display="flex" flexDirection="row" gridGap="8px">
              <ObservationLevelIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
              <Text
                fontFamily="ubuntu"
                fontSize="14px"
                fontWeight="400" 
                letterSpacing="0.3px"
                lineHeight="16px"
                color="#252A32"
              >Nível da observação:</Text>
            </Box>
            
            <Box display="flex" width="100%" flexWrap="wrap" flexDirection="row" gridGap={4}>
              {resource.observation_level.map((elm) => (
                <SimpleTable
                  headers={["campo","valor"]}
                  values={Object.entries(elm)}
                  containerStyle={{
                    minWidth:"200px",
                    height:"auto",
                    flex:1 
                  }}
                />
              ))}
            </Box>
          </GridItem> */}

          {/* partitions */}
          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <PartitionIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <Box>
              <AddInfoTextBase
                title="Partições no BigQuery"
                text={resource.partitions}
              />
            </Box>
          </GridItem>

          {/* published_by */}
          <GridItem display="flex" alignItems="flex-start" gridGap="8px">
            <UserIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase title="Publicação por">
              <Box display="flex" gridGap="10px">
                {resource.published_by.name ? <SectionText>{resource.published_by.name}</SectionText> : <SectionText>Não listado</SectionText>}
                {resource.published_by.email && <EmailIcon {...keyIcons({email : resource.published_by.email})}/>}
                {resource.published_by.github_user && <GitIcon {...keyIcons({github_user : resource.published_by.github_user})}/>}
                {resource.published_by.ckan_user && <CkanIcon {...keyIcons({ckan_user : resource.published_by.ckan_user})}/>}
                {resource.published_by.website && <WebIcon {...keyIcons({website : resource.published_by.website})}/>}
                {resource.published_by.twitter_user && <TwitterIcon {...keyIcons({twitter_user : resource.published_by.twitter_user})}/>}
              </Box>
            </AddInfoTextBase>
          </GridItem>

          {/* data_cleaned_by */}
          <GridItem display="flex" alignItems="flex-start" gridGap="8px">
            <UserIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase title="Tratamento por">
              <Box display="flex" gridGap="10px">
                {resource.data_cleaned_by.name ? <SectionText>{resource.data_cleaned_by.name}</SectionText> : <SectionText>Não listado</SectionText>}
                {resource.data_cleaned_by.email && <EmailIcon {...keyIcons({email : resource.data_cleaned_by.email})}/>}
                {resource.data_cleaned_by.github_user && <GitIcon {...keyIcons({github_user : resource.data_cleaned_by.github_user})}/>}
                {resource.data_cleaned_by.ckan_user && <CkanIcon {...keyIcons({ckan_user : resource.data_cleaned_by.ckan_user})}/>}
                {resource.data_cleaned_by.website && <WebIcon {...keyIcons({website : resource.data_cleaned_by.website})}/>}
                {resource.data_cleaned_by.twitter_user && <TwitterIcon {...keyIcons({twitter_user : resource.data_cleaned_by.twitter_user})}/>}
              </Box>
            </AddInfoTextBase>
          </GridItem>

          {/* version */}
          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <VersionIcon widthIcon="22px" heightIcon="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Versão"
              text={resource.version}
            />
          </GridItem>
        </Grid>

        <ExpandableTable
          containerStyle={{ width: "100%", alignItems: "flex-start" }}
          headers={["nome", "valor"]}
          values={formatObjectsInArray(
            translate(
              translations.bdm_table,
              availableOptionsTranslations,
              filterOnlyValidValues({ dataset_id: datasetName, ...resource }, [
                "dataset_id",
                "table_id",
                "spatial_coverage",
                "update_frequency",
                "observation_level",
                "last_updated",
                "version",
                "published_by",
                "data_cleaned_by",
                "data_cleaning_description",
                "raw_files_url",
                "auxiliary_files_url",
                "architecture_url",
                "covered_by_dictionary",
                "partitions",
                "columns",
              ])
            )
          )}
        />

      </VStack>
    </BaseResourcePage>
  );
}
