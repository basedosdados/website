import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

export default function ObservationLevel({ resource }) {
  const headers = ["Entidade","Colunas Correspondentes"]

  let array = []
  const keys = Object.keys(resource?.observationLevels)

  keys.forEach((elm) => {
    const value = resource?.observationLevels[elm]

    const newValue = [value?.entity?.name || "Não informado", value?.columns[0]?.name || "Não informado"]
    array.push(newValue)
  })

  return (
    <TableContainer
      width="100%"
      height="100%"
      border="1px solid #DEDFE0"
      overflow="hidden"
      borderBottom="0px"
      borderRadius="16px"
    >
      <Table position="relative" role="table">
        <Thead role="rowgroup" position="relative">
          <Tr>
            {headers.map((elm, i) => (
              <Th
                key={i}
                role="row"
                position="sticky"
                top="0"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="14px"
                lineHeight="20px"
                color="#252A32"
                backgroundColor="#F7F7F7"
                borderBottom="1px solid #DEDFE0 !important"
                textTransform="none"
                padding="14px 22px"
                letterSpacing="inherit"
                boxSizing="content-box"
                zIndex={1}
              >
                {elm}
              </Th>
            ))}
          </Tr>
        </Thead>

        <Tbody role="rowgroup" position="relative">
          {array.map((elm, i) => (
            <Tr
              key={i}
              role="row"
              borderBottom="1px solid #DEDFE0"
            >
              <Td
                width="50%"
                role="cell"
                position="relative"
                padding="14px 22px"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="14px"
                lineHeight="20px"
                color="#464A51"
                backgroundColor="#FFF"
                borderColor="#DEDFE0"
                textTransform="none"
                letterSpacing="inherit"
              >
                {elm[0]}
              </Td>
              <Td
                width="50%"
                role="cell"
                position="relative"
                padding="14px 22px"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="14px"
                lineHeight="20px"
                color="#464A51"
                backgroundColor="#FFF"
                borderColor="#DEDFE0"
                textTransform="none"
                letterSpacing="inherit"
              >
                {elm[1]}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}