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
      <Table role="table">
        <Thead role="rowgroup">
          {headers.map((h, index) => (
            <Th
              key={`header-${index}`}
              role="row"
              padding="14px 22px"
              textTransform="none"
              letterSpacing="inherit"
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              lineHeight="20px"
              color="#252A32"
              backgroundColor="#F7F7F7"
              borderBottom="1px solid #DEDFE0 !important"
              boxSizing="content-box"
            >
              <div role="columnheader">
                {h}
              </div>
            </Th>
          ))}
        </Thead>
        <Tbody role="rowgroup">
          {values.map((h, rowIndex) => (
            <Tr key={`row-${rowIndex}`} role="row">
              {h.map((r, cellIndex) => (
                <Td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  role="cell"
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
                  whiteSpace="break-spaces"
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
