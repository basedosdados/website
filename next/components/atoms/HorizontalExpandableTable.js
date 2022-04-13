import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Tooltip,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { formatJson } from '../../utils'
import InfoIcon from '../../public/img/icons/infoIcon'

export default function HorizontalExpandableTable({
  headers,
  values,
  translations,
  availableOptionsTranslations,
  tooltip,
  containerStyle,
}) {

  const [translatedHeaders, setTranslatedHeaders] = useState({})
  const [translatedValues, setTranslatedValues] = useState({})

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
          {headers.slice(0, headers.length).map((elm) => (
            <Th
              minWidth="275px"
              padding="5px 15px"
              fontSize="14px"
              color="#707070"
              background="#F5F5F5"
              fontWeight="500"
              fontFamily="Ubuntu"
              letterSpacing="0.5px"
              textTransform="capitalize"
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
                    <InfoIcon tip/>
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
          {values.slice(0, values.length).map((elm) => (
            <Tr>
              {elm.slice(0, elm.length).map((r) => (
                <Td
                  padding="6px 15px 3px"
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