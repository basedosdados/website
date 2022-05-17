import { 
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Tooltip,
  Button,
  VStack,
  Box,
  Center
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { formatJson, getTemporalCoverage } from '../../utils';
import InfoIcon from '../../public/img/icons/infoIcon'

function TableDatasets({
  headers,
  values,
  translations,
  availableOptionsTranslations,
  parentTemporalCoverage,
  tooltip,
  containerStyle,
}) {
  const [columnsHeaders, setColumnsHeaders] = useState([])
  const [columnsValues, setColumnsValues] = useState([])
  const [translatedHeaders, setTranslatedHeaders] = useState({})
  const [translatedValues, setTranslatedValues] = useState({})

  useEffect(() => {
    const schemaHeaders = headers.reduce((obj, cur) => (
      {...obj, [cur]: "Não listado"}), {})
    const newValues = values.map((elm) => {
      const values = elm
      const directoryColumn = () => {
        if(!values.directory_column) {
          return {directory_column : "Não listado"}
        }
        if(typeof values.directory_column === "object") {
          const directory = Object.values(values.directory_column)
            .map((elm) => {
              if(!elm) {
                return "Não listado"
              } else {
                return elm
              }
            })

          return {
            directory_column : `${directory[0]}.${directory[1]}:${directory[2]}`
          }
        } else {
          return {directory_column : "Não listado"}
        }
      }

      const temporalCoverage = () => {
        if(!values.temporal_coverage) {
          return {temporal_coverage : "Não listado"}
        }
        if(typeof values.temporal_coverage === "object") {
          return {temporal_coverage: getTemporalCoverage(values.temporal_coverage, parentTemporalCoverage)}
        } else {
          return {temporal_coverage : "Não listado"}
        }
      }
      
      const formatting = {
        ...values,
        ...directoryColumn(),
        ...temporalCoverage(),
      }
      const row = {...schemaHeaders, ...formatting}

      delete row.is_in_staging
      delete row.is_partition
      
      const translations = () => {
        return {
          bigquery_type : translate(row.bigquery_type, translatedValues),
          measurement_unit : translate(row.measurement_unit, translatedValues),
          covered_by_dictionary: translate(row.covered_by_dictionary, translatedValues),
          has_sensitive_data: translate(row.has_sensitive_data, translatedValues),
        }
      }

      const translatedRow = {...row,...translations()}

      return Object.values(translatedRow)
    })

    delete schemaHeaders.is_in_staging
    delete schemaHeaders.is_partition

    setColumnsHeaders(Object.keys(schemaHeaders))
    setColumnsValues(newValues)
    
  },[values, headers])

  useEffect(() => {
    setTranslatedHeaders(translations)
    setTranslatedValues(availableOptionsTranslations)
  },[translations, availableOptionsTranslations])

  
  function translate(field, translation) {
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

    if(translation[field] === "Data") {
      return "DATE"
    }

    return translation[field] || field
  }

  const empty = () => {
    return (
      <p style={{margin:"0", fontWeight:"700", color:"#C4C4C4"}}>
        Não listado
      </p>
    )
  }

  function isEmpty(value) {
    if(value) {
      if(value === "Não listado" || value === "Não listado.Não listado:Não listado"){
        return empty()
      } else {
        return value
      }
    } else {
      return empty()
    }
  }

  return (
    <HStack
      width="100%"
      overflowX="auto"
      {...containerStyle}
    >
      <Table>
        <Thead>
          {columnsHeaders.map((elm) => (
            <Th
              minWidth="220px"
              flex={1}
              padding="8px 24px"
              fontSize="14px"
              color="#6F6F6F"
              background="#F6F6F6"
              fontWeight="500"
              fontFamily="Ubuntu"
              letterSpacing="0.4px"
              textTransform="capitalize"
              boxSizing="content-box"
              borderY="1px solid #DEDFE0 !important"
            >
              {tooltip ?
                <Box display="flex" gridGap="8px" cursor="pointer">
                  {translations ? translate(elm, translatedHeaders) : elm}
                  <Tooltip
                    hasArrow
                    bg="#2A2F38"
                    label={tooltip[elm]}
                    fontSize="16px"
                    fontWeight="500"
                    padding="5px 15px"
                    marginTop="8px"
                    color="#FFF"
                    borderRadius="6px"
                  >
                    <Center>
                      <InfoIcon fill="#A3A3A3" tip/>
                    </Center>
                  </Tooltip>
                </Box>
                :
                <>
                  {translations ? translate(elm, translatedHeaders) : elm}
                </>
              }
            </Th>
          ))}
        </Thead>
        <Tbody>
          {columnsValues.map((elm) => (
            <Tr>
              {elm.map((r) => (
                <Td
                  padding="10px 24px"
                  fontSize="14px"
                  fontFamily="Lato"
                  letterSpacing="0.5px"
                  color="#000000a8"
                  _first={{
                    color:"#252A32"
                  }}
                >
                  {isEmpty(r)}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </HStack>
  )
}

export default function ColumnsDatasets({
  headers,
  values,
  translations,
  availableOptionsTranslations,
  parentTemporalCoverage,
  tooltip,
  containerStyle,
}) {
  const [expanded, setExpanded] = useState(false)

  if (values.length <= 5)
    return (
      <TableDatasets
        headers={headers}
        values={values}
        translations={translations}
        availableOptionsTranslations={availableOptionsTranslations}
        parentTemporalCoverage={parentTemporalCoverage}
        tooltip={tooltip}
        containerStyle={containerStyle}
      />
    )

  return (
    <VStack width="100%" spacing={5}>
      <TableDatasets
        headers={headers}
        values={expanded ? values : values.slice(0, Math.min(3, values.length))}
        translations={translations}
        availableOptionsTranslations={availableOptionsTranslations}
        parentTemporalCoverage={parentTemporalCoverage}
        tooltip={tooltip}
        containerStyle={containerStyle}
      />
        
      <Button
        width="100%"
        backgroundColor="#E3E3E3"
        color="#525252"
        fontSize="14px"
        marginTop="5px !important"
        minHeight="30px !important"
        maxHeight="30px !important"
        _hover={{backgroundColor:"", opacity:"0.6"}}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Ver menos" : "Ver mais"}
      </Button>
    </VStack>
  );
}
