import {
  Stack,
  Box,
  HStack,
  Divider,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuOptionGroup,
  MenuList,
  MenuItem,
  MenuDivider,
  useBreakpointValue
} from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';
import { capitalize } from 'lodash';

import TablePage from "./TablePage";
import RawDataSourcesPage from "./RawDataSourcesPage";
import InformationRequestPage from "./InformationRequestPage";

import ChevronIcon from "../../public/img/icons/chevronIcon";

export default function DatasetResource({
  dataset
}) {
  const router = useRouter()
  const { query, locale } = router
  const [tables, setTables] = useState([])
  const [rawDataSources, setRawDataSources] = useState([])
  const [informationRequests, setInformationRequests] = useState([])
  const { t } = useTranslation('dataset');
  const displayScreen = useBreakpointValue({ base: "mobile", lg: "desktop" })

  const pushQuery = (key, value) => {
    router.replace({
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

    let dataset_tables = dataset?.tables?.edges.map((elm) => elm.node)
      .filter((elm) => elm?.status?.slug !== "under_review")
      .filter((elm) => elm?.slug !== "dicionario")
      .filter((elm) => elm?.slug !== "dictionary")
      .sort(sortElements) || []

    let raw_data_sources = dataset?.rawDataSources?.edges.map((elm) => elm.node)
      .filter((elm) => elm?.status?.slug !== "under_review")
      .sort(sortElements) || []
    
    let information_request = dataset?.informationRequests?.edges.map((elm) => elm.node)
      .filter((elm) => elm?.status?.slug !== "under_review")
      .sort(sortElements) || []

    setTables(dataset_tables);
    setRawDataSources(raw_data_sources);
    setInformationRequests(information_request);

    const queryParams = new URLSearchParams(window.location.search)

    if(queryParams.toString().length === 0) {
      if(dataset_tables.length > 0) return pushQuery("table", dataset_tables[0]?._id)
      if(raw_data_sources.length > 0) return pushQuery("raw_data_source", raw_data_sources[0]?._id)
      if(information_request.length > 0) return pushQuery("information_request", information_request[0]?._id)
    }
  }, [dataset])

  function SwitchResource ({route}) {
    if (route.hasOwnProperty("table")) return <TablePage id={route.table}/>
    if (route.hasOwnProperty("raw_data_source")) return <RawDataSourcesPage id={route.raw_data_source} locale={locale}/>
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
    const [isOverflow, setIsOverflow] = useState({})
    const textRefs = useRef({})

    if(choices.length === 0) return null

    useEffect(() => {
      choices.forEach((elm, i) => {
        const textElement = textRefs.current[i]
        if (textElement) {
          setIsOverflow((prev) => ({
            ...prev,
            [i]: textElement.scrollWidth > textElement.clientWidth,
          }))
        }
      })
    }, [choices])

    return (
      <Box width="272px">
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
              <Tooltip
                label={elm[`name${capitalize(locale)}`] || elm.name || elm.number}
                isDisabled={!isOverflow[i]}
                hasArrow
                padding="16px"
                backgroundColor="#252A32"
                boxSizing="border-box"
                borderRadius="8px"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="14px"
                lineHeight="20px"
                textAlign="center"
                color="#FFFFFF"
                placement="top"
                maxWidth="100%"
              >
                <Text
                  ref={(el) => (textRefs.current[i] = el)}
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
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
                  {elm[`name${capitalize(locale)}`] || elm.name || elm.number}
                </Text>
              </Tooltip>
            </HStack>
          ))}
        </Box>
      </Box>
    )
  }

  function SelectResource() {
    const [widthScreen, setWidthScreen] = useState(0)

    useEffect(() => {
      const updateWidthScreen = () => {
        setWidthScreen(window.innerWidth - 48)
      }

      updateWidthScreen()

      window.addEventListener('resize', updateWidthScreen)

      return () => {
        window.removeEventListener('resize', updateWidthScreen)
      }
    }, [])

    return (
      <Menu>
        <MenuButton
          width="100%"
          maxWidth="360px"
          borderRadius="8px"
          padding="14px 20px"
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          backgroundColor="#EEEEEE"
          color="#464A51"
          textAlign="start"
        >
          <Text
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Selecione uma tabela ou fonte original
            <ChevronIcon
              marginLeft="auto"
              transform="rotate(90deg)"
            />
          </Text>
        </MenuButton>

        <MenuList
          minWidth={widthScreen}
          maxWidth={widthScreen}
          maxHeight="420px"
          overflowY="auto"
          borderWidth={0}
          padding={0}
          zIndex={100}
          boxShadow="0 1.6px 16px 0 rgba(100, 96, 103, 0.16)"
        >
          {tables.length > 0 &&
            <MenuOptionGroup
              title="Tabelas tratadas"
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="16px"
              lineHeight="24px"
              color="#71757A"
              margin="0"
              padding="24px 20px 8px"
            >
              {tables.map((elm, i) => {return (
                <MenuItem
                  key={i}
                  width="100%"
                  whiteSpace="normal"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  wordBreak="break-all"
                  fontFamily="Roboto"
                  fontWeight="500"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#252A32"
                  padding="16px 20px"
                  _hover={{ backgroundColor: "transparent"}}
                  _focus={{ backgroundColor: "transparent"}}
                  _active={{ backgroundColor: "transparent" }}
                  _focusVisible={{ backgroundColor: "transparent" }}
                  onClick={() => pushQuery("table", elm._id)}
                  >
                  {elm.name || elm.number}
                </MenuItem>
              )})}
            </MenuOptionGroup>
          }

          {rawDataSources.length > 0 &&
            <>
              <MenuDivider margin="0" borderWidth="2px" borderColor="#DEDFE0"/>
              <MenuOptionGroup
                title="Fontes originais"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="16px"
                lineHeight="24px"
                color="#71757A"
                margin="0"
                padding="24px 20px 8px"
              >
                {rawDataSources.map((elm, i) => {return (
                  <MenuItem
                    key={i}
                    width="100%"
                    whiteSpace="normal"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    wordBreak="break-all"
                    fontFamily="Roboto"
                    fontWeight="500"
                    fontSize="14px"
                    lineHeight="20px"
                    color="#252A32"
                    padding="16px 20px"
                    _hover={{ backgroundColor: "transparent"}}
                    _focus={{ backgroundColor: "transparent"}}
                    _active={{ backgroundColor: "transparent" }}
                    _focusVisible={{ backgroundColor: "transparent" }}
                    onClick={() => pushQuery("raw_data_source", elm._id)}
                  >
                    {elm.name || elm.number}
                  </MenuItem>
                )})}
              </MenuOptionGroup>
            </>
          }

          {informationRequests.length > 0 &&
            <>
              <MenuDivider margin="0" borderWidth="2px" borderColor="#DEDFE0"/>
              <MenuOptionGroup
                title="Pedidos LAI"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="16px"
                lineHeight="24px"
                color="#71757A"
                margin="0"
                padding="24px 20px 8px"
              >
                {informationRequests.map((elm, i) => {return (
                  <MenuItem
                    key={i}
                    width="100%"
                    whiteSpace="normal"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    wordBreak="break-all"
                    fontFamily="Roboto"
                    fontWeight="500"
                    fontSize="14px"
                    lineHeight="20px"
                    color="#252A32"
                    padding="16px 20px"
                    _hover={{ backgroundColor: "transparent"}}
                    _focus={{ backgroundColor: "transparent"}}
                    _active={{ backgroundColor: "transparent" }}
                    _focusVisible={{ backgroundColor: "transparent" }}
                    onClick={() => pushQuery("information_request", elm._id)}
                  >
                    {elm.name || elm.number}
                  </MenuItem>
                )})}
              </MenuOptionGroup>
            </>
          }
        </MenuList>
      </Menu>
    )
  }

  return (
    <Stack
      paddingTop="32px"
      direction={{ base: "column", lg: "row" }}
      gap="24px"
      spacing={0}
      height="100%"
    >
      {displayScreen === "desktop" ? 
        <Stack
          minWidth={{base: "100%", lg: "296px"}}
          maxWidth={{base: "100%", lg: "296px"}}
          spacing={0}
        >
          <ContentFilter
            fieldName={t('tables')}
            choices={tables}
            value={query.table}
            onChange={(id) => {
              pushQuery("table", id)
            }}
            hasDivider={false}
          />

          <ContentFilter
            fieldName={t('rawDataSources')}
            choices={rawDataSources}
            value={query.raw_data_source}
            onChange={(id) => {
              pushQuery("raw_data_source", id)
            }}
            hasDivider={tables.length > 0 ? true : false}
          />

          <ContentFilter
            fieldName={t('informationRequests')}
            choices={informationRequests}
            value={query.information_request}
            onChange={(id) => {
              pushQuery("information_request", id)
            }}
            hasDivider={tables.length > 0 || rawDataSources.length > 0 ? true : false}
          />
        </Stack>
        :
        <SelectResource />
      }

      <SwitchResource route={query}/>
    </Stack>
  )
}