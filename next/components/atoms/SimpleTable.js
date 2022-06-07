import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

export function SimpleTable({
  headers,
  values,
  containerStyle,
  valuesTable
}) {

  return (
    <TableContainer 
      width="100%"
      height="100%"
      {...containerStyle}
    >
      <Table>
        <Thead>
          {headers.map((h) => (
            <Th
              padding="8px 24px"
              fontSize="14px"
              color="#6F6F6F"
              background="#F6F6F6"
              fontWeight="500"
              fontFamily="Ubuntu"
              letterSpacing="0.4px"
              textTransform="capitalize"
              boxSizing="content-box"
            >
              {h}
            </Th>
          ))}
        </Thead>
        <Tbody>
          {values.map((h) => (
            <Tr>
              {h.map((r) => (
                <Td
                  padding="10px 24px"
                  fontSize="14px"
                  fontFamily="Lato"
                  letterSpacing="0.5px"
                  color="#000000a8"
                  _first={{
                    color:"#252A32",
                  }}
                  {...valuesTable}
                >
                  {r}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
