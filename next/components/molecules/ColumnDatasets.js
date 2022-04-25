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
  const [columnHeaders, setColumnHeaders] = useState([])
  const [columnValues, setColumnValues] = useState([])
  const [translatedHeaders, setTranslatedHeaders] = useState({})
  const [translatedValues, setTranslatedValues] = useState({})

  useEffect(() => {
    setColumnHeaders(headers)
    
    const ArrayHeaders = headers.reduce((obj, cur) => (
      {...obj, [cur]: "Não listado"}), {})
    const ArrayValues = values.map((elm) => {
      // console.log(elm)
      const newValue = Object.assign(ArrayHeaders, elm)
      return Object.values(newValue)
    })

    setColumnValues(ArrayValues)
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
          {columnHeaders.map((elm) => (
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
          {columnValues.map((elm) => (
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
