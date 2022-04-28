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
  VStack
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { formatJson } from '../../utils';
import InfoIcon from '../../public/img/icons/infoIcon'

function TableDatasets({
  headers,
  values,
  translations,
  availableOptionsTranslations,
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
      const row = {...schemaHeaders, ...elm}
      
      delete row.is_in_staging
      delete row.is_partition

      return Object.values(row)
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

  
  function translate (field, translation) {
    if(typeof field === "boolean") {
      return field === true ? "Sim" : "Não"
    }

    if(typeof field === "object") {
      if(field.length === 0) {
        return "Não listado"
      } else {
        return formatJson(JSON.stringify(field))
      }
    }

    if(translation[field] === "Data") {
      return "DATA"
    }

    return translation[field] || field
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
              minWidth="200px"
              flex={1}
              padding="5px 15px"
              fontSize="14px"
              color="#707070"
              background="#F5F5F5"
              fontWeight="500"
              fontFamily="Ubuntu"
              letterSpacing="0.5px"
              textTransform="capitalize"
              boxSizing="content-box"
              borderY="1px solid #E4E4E4 !important"
            >
              {tooltip ?
                <Tooltip
                  label={tooltip[elm]}
                  fontSize="16px"
                  fontWeight="500"
                  padding="5px 15px"
                  backgroundColor="#2A2F38"
                  marginTop="10px"
                  color="#FFF"
                  borderRadius="6px"
                >
                  <div style={{display: "flex", gap: "10px", cursor: "pointer"}}>
                    {translations ? translate(elm, translatedHeaders) : elm}
                    <InfoIcon fill="#707070"tip/>
                  </div>
                </Tooltip>
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
                  padding="10px 15px"
                  fontSize="14px"
                  fontFamily="Lato"
                  letterSpacing="0.5px"
                  color="#000000a8"
                  _first={{
                    color:"#252A32"
                  }}
                >
                  {r ? translate(r, translatedValues) : "Não listado"}
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
  tooltip,
  containerStyle,
}) {
  const [expanded, setExpanded] = useState(false);

  if (values.length <= 5)
    return (
      <TableDatasets
        headers={headers}
        values={values}
        translations={translations}
        availableOptionsTranslations={availableOptionsTranslations}
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