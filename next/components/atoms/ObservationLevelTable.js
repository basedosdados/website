import {
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { capitalize } from "lodash";

export default function ObservationLevel({ resource }) {
  const { t } = useTranslation("dataset");
  const router = useRouter();
  const { locale } = router;

  const headers = [
    t("observationLevelTable.entityHeader"),
    t("observationLevelTable.columnsHeader"),
  ];

  function sortElements(a, b) {
    if (a.order < b.order) {
      return -1;
    }
    if (a.order > b.order) {
      return 1;
    }
    return 0;
  }

  let array = [];
  const keys = Object.keys(resource?.observationLevels);
  const sortedLevels = Object.values(resource?.observationLevels).sort(
    sortElements,
  );

  sortedLevels.forEach((value) => {
    const valueEntity = () => {
      if (value.entity[`name${capitalize(locale)}`])
        return value.entity[`name${capitalize(locale)}`];
      if (value.entity.name) return value.entity.name;
      return t("observationLevelTable.notProvided");
    };

    const valueColumns = () => {
      let columns = [];

      if (value?.columns[0]) {
        Object.values(value.columns).map((column) => {
          columns.push(column?.name);
        });
      } else {
        columns = [t("observationLevelTable.notProvided")];
      }
      return columns.join(", ");
    };

    const newValue = [valueEntity(), valueColumns()];
    array.push(newValue);
  });

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
            <Tr key={i} role="row" borderBottom="1px solid #DEDFE0">
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
                whiteSpace="break-spaces"
              >
                {elm[1]}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
