import {
  Stack,
  VStack
} from "@chakra-ui/react";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import { SimpleButton } from "../atoms/SimpleButton";
import { FilterAccordion } from "../atoms/FilterAccordion";

import CrossIcon from "../../public/img/icons/crossIcon";

function AdminButtons() {

  return (
    <Stack paddingTop="16px" width="100%">
      <SimpleButton
        // isActive={isActive("create_bdm_table")}
        // onClick={() => setResource({ resource_type: "create_bdm_table" })}
        margin="0 0 16px !important"
        justifyContent="space-between"
        alignItems="center"
        paddingRight="15%"
      >
        Criar tabela tratada
        <CrossIcon
          alt=""
          width="18px"
          height="18px"
          fill="currentColor"
          marginLeft="4px"
          transform="rotate(45deg)"
        />
      </SimpleButton>
      <SimpleButton
        // isActive={isActive("create_external_link")}
        // onClick={() => setResource({ resource_type: "create_external_link" })}
        margin="0 0 16px !important"
        justifyContent="space-between"
        alignItems="center"
        paddingRight="15%"
      >
        Criar fonte original
        <CrossIcon
          alt=""
          width="18px"
          height="18px"
          fill="currentColor"
          marginLeft="4px"
          transform="rotate(45deg)"
        />
      </SimpleButton>
      <SimpleButton
        // isActive={isActive("create_information_request")}
        // onClick={() =>
        //   setResource({ resource_type: "create_information_request" })
        // }
        borderBottom="1px solid #DEDFE0"
        padding="0 15% 24px 0"
        margin="0 !important"
        justifyContent="space-between"
        alignItems="center"
      >
        Criar pedido LAI
        <CrossIcon
          alt=""
          width="18px"
          height="18px"
          fill="currentColor"
          marginLeft="4px"
          transform="rotate(45deg)"
        />
      </SimpleButton>
    </Stack>
  )
}

export default function DatasetResource({
  dataset
}) {
console.log(dataset)
  return (
    <Stack
      paddingTop="24px"
      direction={{ base: "column", lg: "row" }}
      spacing={4}
      width="100%"
    >
      <VStack
        minWidth={{ base: "100%", lg: "250px" }}
        maxWidth={{ base: "100%", lg: "250px" }}
        spacing={2}
        align="flex-start"
        justify="flex-start"
        borderRight={!isMobileMod() && "1px solid #DEDFE0"}
      >
        <AdminButtons/>

        {dataset?.tables.length > 0 &&
          <FilterAccordion
            alwaysOpen={true}
            choices={dataset.tables}
            value={dataset.tables.slug}
            valueField="slug"
            displayField="name_pt"
            fieldName="Tabelas tratadas"
            bdPlus={true}
            isHovering={false}
            // onChange
            // onToggle
            // isOpen
          />
        }

        {dataset?.raw_data_sources.length > 0 &&
          <FilterAccordion
            alwaysOpen={true}
            choices={dataset.raw_data_sources}
            value={dataset.raw_data_sources.slug}
            valueField="slug"
            displayField="name_pt"
            fieldName="Fontes originais"
            isHovering={false}
            // onChange
            // onToggle
            // isOpen
          />
        }

        {dataset?.information_requests.length > 0 &&
          <FilterAccordion
            alwaysOpen={true}
            choices={dataset.information_requests}
            value={dataset.information_requests.slug}
            valueField="slug"
            displayField="name_pt"
            fieldName="Pedidos LAI"
            isHovering={false}
            // onChange
            // onToggle
            // isOpen
          />
        }
      </VStack>
    </Stack>
  )
}