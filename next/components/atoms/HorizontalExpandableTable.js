import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
  Button,
  HStack,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'

export default function HorizontalExpandableTable({
  headers,
  values,
  translations,
  containerStyle,
}) {

  const [translated, setTranslated] = useState({})

  useEffect(() => {
    translations && setTranslated(translations)
  },[translated])

  function translate (field) {
    return translated[field]
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
              minWidth="200px"
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
              {translated ? translate(elm) : elm}
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
                  {r ? r : "Não listado"}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </HStack>
  )
}