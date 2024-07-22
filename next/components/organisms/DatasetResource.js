import {
  Stack,
  VStack,
  Box,
  HStack,
  Divider,
  Text
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import BdmTablePage from "./BdmTablePage";
import RawDataSourcesPage from "./RawDataSourcesPage";
import InformationRequestPage from "./InformationRequestPage";

export default function DatasetResource({
  dataset
}) {
  const router = useRouter()
  const { query } = router
  const [tables, setTables] = useState([])
  const [rawDataSources, setRawDataSources] = useState([])
  const [informationRequests, setInformationRequests] = useState([])

  const pushQuery = (key, value) => {
    router.push({
      pathname: `/dataset/${query.dataset}`,
      query: { [key]: value }
    },
      undefined, { shallow: true }
    )
  }

  function sortElements(a, b) {
    if (a.order < b.order) {
      return -1
    }
    if (a.order > b.order) {
      return 1
    }
    return 0
  }

  useEffect(() => {
    // Id do dataset do SAEB
    let dataset_tables = []
    if(dataset?._id === "e083c9a2-1cee-4342-bedc-535cbad6f3cd") {
      dataset_tables = dataset?.tables?.edges.map((elm) => elm.node)
        .filter((elm) => elm?.status?.slug !== "under_review").sort(sortElements) || []
    } else {
      dataset_tables = dataset?.tables?.edges.map((elm) => elm.node)
        .filter((elm) => elm?.status?.slug !== "under_review")
          .filter((elm) => elm?.slug !== "dicionario")
            .filter((elm) => elm?.slug !== "dictionary").sort(sortElements) || []
    }

    const raw_data_sources = dataset?.rawDataSources?.edges.map((elm) => elm.node).filter((elm) => elm?.status?.slug !== "under_review").sort(sortElements) || []
    const information_request = dataset?.informationRequests?.edges.map((elm) => elm.node).filter((elm) => elm?.status?.slug !== "under_review").sort(sortElements) || []

    setTables(dataset_tables)
    setRawDataSources(raw_data_sources)
    setInformationRequests(information_request)

    const queryParams = new URLSearchParams(window.location.search)

    if(queryParams.toString().length === 0) {
      if(dataset_tables.length > 0) return pushQuery("table", dataset_tables[0]?._id)
      if(raw_data_sources.length > 0) return pushQuery("raw_data_source", raw_data_sources[0]?._id)
      if(information_request.length > 0) return pushQuery("information_request", information_request[0]?._id)
    }
  }, [dataset])

  function SwitchResource ({route}) {
    if (route.hasOwnProperty("table")) return <BdmTablePage id={route.table}/>
    if (route.hasOwnProperty("raw_data_source")) return <RawDataSourcesPage id={route.raw_data_source}/>
    if (route.hasOwnProperty("information_request")) return <InformationRequestPage id={route.information_request}/>
    return null
  }

  function ContentFilter({
    fieldName,
    choices,
    onChange,
    value,
    hasDivider = true
  }) {
    if(choices.length < 1) return null

    return (
      <Box>
        <Divider
          display={hasDivider ? "flex" : "none"}
          marginY="24px"
          borderColor="#DEDFE0"
        />

        <Text
          paddingLeft="15px"
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="14px"
          lineHeight="20px"
          color="#252A32"
          marginBottom="8px"
        >
          {fieldName}
        </Text>

        <Box>
          {choices.map((elm, i) => (
            <HStack
              key={i}
              spacing="4px"
              cursor="pointer"
              pointerEvents={elm._id === value ? "none" : "default"}
            >
              <Box 
                width="3px"
                height="24px"
                backgroundColor={elm._id === value && "#2B8C4D"}
                borderRadius="10px"
              />
              <Text
                width="100%"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="14px"
                lineHeight="20px"
                color={elm._id === value ? "#2B8C4D" : "#71757A"}
                backgroundColor={elm._id === value && "#F7F7F7"}
                _hover={{
                  backgroundColor:elm._id === value ? "#F7F7F7" :"#EEEEEE",
                }}
                borderRadius="8px"
                padding="6px 8px"
                onClick={() => onChange(elm._id)}
              >
                {elm.name || elm.number}
              </Text>
            </HStack>
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <Stack
      paddingTop="32px"
      direction={{ base: "column", lg: "row" }}
      gap="24px"
      spacing={0}
      width="100%"
      height="100%"
    >
      <Stack
        minWidth={{base: "100%", lg: "272px"}}
        spacing={0}
      >
        <ContentFilter
          fieldName="Tabelas tratadas"
          choices={tables}
          value={query.table}
          onChange={(id) => {
            pushQuery("table", id)
          }}
          hasDivider={false}
        />

        <ContentFilter
          fieldName="Fontes originais"
          choices={rawDataSources}
          value={query.raw_data_source}
          onChange={(id) => {
            pushQuery("raw_data_source", id)
          }}
          hasDivider={tables.length > 0 ? true : false}
        />

        <ContentFilter
          fieldName="Pedidos LAI"
          choices={informationRequests}
          value={query.information_request}
          onChange={(id) => {
            pushQuery("information_request", id)
          }}
          hasDivider={tables.length > 0 || rawDataSources.length > 0 ? true : false}
        />
      </Stack>

      <SwitchResource route={query}/>
    </Stack>
  )
}