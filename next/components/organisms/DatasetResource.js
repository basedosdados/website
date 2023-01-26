import {
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";

import { SimpleButton } from "../atoms/SimpleButton";
import { FilterAccordion } from "../atoms/FilterAccordion";

import InformationRequestPage from "../organisms/new/InformationRequestPage";

import {
  getInformationRequest
} from "../../pages/api/new/datasets";

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

export async function getStaticProps() {

}

export default function DatasetResource({
  dataset
}) {
  const router = useRouter()
  const { query } = router
  const [tables, setTables] = useState([])
  const [rawDataSources, setRawDataSources] = useState([])
  const [informationRequests, setInformationRequests] = useState([])
  const [currentData, setCurrentData] = useState({})

  const pushQuery = (key, value) => {
    router.push({
      pathname: `/dataset/v2/${query.dataset}`,
      query: { [key]: value }
    },
      undefined, { shallow: true }
    )
  }

  // console.log(query)

  useEffect(() => {
    if(query.bdm_tables) return console.log(0)
    if(query.raw_data_sources) return console.log(1)
    if(query.information_request) return console.log(2)
  },[query])

  useEffect(() => {
    const dataset_tables = dataset.tables.edges.map((elm) => elm.node)
    const raw_data_sources = dataset.rawDataSources.edges.map((elm) => elm.node)
    const information_request = dataset.informationRequests.edges.map((elm) => elm.node)

    setTables(dataset_tables)
    setRawDataSources(raw_data_sources)
    setInformationRequests(information_request)
  },[dataset])

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

        {tables?.length > 0 &&
          <FilterAccordion
            alwaysOpen={true}
            choices={tables}
            value={query.bdm_tables}
            valueField="_id"
            displayField="namePt"
            fieldName="Tabelas tratadas"
            bdPlus={true}
            isHovering={false}
            onChange={(id) => {
              pushQuery("bdm_tables", id)
            }}
            // onToggle
          />
        }

        {rawDataSources?.length > 0 &&
          <FilterAccordion
            alwaysOpen={true}
            choices={rawDataSources}
            value={query.raw_data_sources}
            valueField="_id"
            displayField="namePt"
            fieldName="Fontes originais"
            isHovering={false}
            onChange={(id) => {
              pushQuery("raw_data_sources", id)
            }}
            // onToggle
          />
        }

        {informationRequests?.length > 0 &&
          <FilterAccordion
            alwaysOpen={true}
            choices={informationRequests}
            value={query.information_request}
            valueField="_id"
            displayField="namePt"
            fieldName="Pedidos LAI"
            isHovering={false}
            onChange={(id) => {
              pushQuery("information_request", id)
            }}
            // onToggle
          />
        }
      </VStack>
      <VStack
        width="100%"
        overflow="hidden"
        marginLeft={{base:"0", lg: "32px !important", xl: "40px !important"}}
        alignItems="flex-start"
        flex="1"
      >
        {query.bdm_tables &&
          <InformationRequestPage
            resource={currentData}
          />
        }
        {query.raw_data_sources &&
          <InformationRequestPage
            resource={currentData}
          />
        }
        {query.information_request &&
          <InformationRequestPage
            resource={currentData}
          />
        }
      </VStack>
    </Stack>
  )
}