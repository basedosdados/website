import {
  VStack,
  HStack,
  Text,
  Divider,
  Stack,
  Skeleton,
  Flex,
  Box,
  Spinner,
} from "@chakra-ui/react";
import Head from "next/head";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isMobileMod, useCheckMobile } from "../../hooks/useCheckMobile.hook";
import { triggerGAEvent } from "../../utils";
import { withPages } from "../../hooks/pages.hook";
import { useTranslation } from 'next-i18next';

import {
  getSearchDatasets
} from "../api/datasets/index";

import { CheckboxFilterAccordion } from "../../components/atoms/FilterAccordion";
import Checkbox from "../../components/atoms/Checkbox";
import { TagFilter } from "../../components/atoms/Tag";
import Database from "../../components/organisms/Database";
import { MainPageTemplate } from "../../components/templates/main";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import FilterIcon from "../../public/img/icons/filterIcon";
import NotFoundImage from "../../public/img/notFoundImage";

export async function getStaticProps({locale}) {
      let out = await withPages()
      out.props = {
          ...out.props, 
          ...(await serverSideTranslations(locale, ['common', 'dataset'])),
      }
      return out
}

export default function SearchDatasetPage() {
  const router =  useRouter()
  const query = router.query

  const [fetchApi, setFetchApi] = useState(null)
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [resource, setResource] = useState([])
  const [selectedFilters, setSelectedFilters] = useState([])
  const [aggregations, setAggregations] = useState({})
  const [count, setCount] = useState(0)
  const [pageInfo, setPageInfo] = useState({page: 0, count: 0})
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation('dataset')

  async function getDatasets({q, filters, page}) {
    const res = await getSearchDatasets({q:q, filter: filters, page:page})
    if(res === undefined) return router.push({pathname:"500"})
    if(res?.count === 0) setShowEmptyState(true)
    setPageInfo({page: page, count: res?.count})
    setResource(res?.results || null)
    setAggregations(res?.aggregations)
    setCount(res?.count)
    setIsLoading(false)
  }

  useEffect(() => {
    if(fetchApi) clearTimeout(fetchApi)
    setIsLoading(true)
    setCount(0)
    setShowEmptyState(false)

    const fetchFunc = setTimeout(() => {
      getDatasets({
        q: query?.q === undefined ? "" : query?.q || "",
        filters: fetchFilter(query),
        page: query?.page || 1
      })
    }, 1000)

    setSelectedFilters(fetchFilter(query))
    setFetchApi(fetchFunc)
  }, [query])

  function flattenArray(arr) {
    let result = []

    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i][1])) {
        for (let j = 0; j < arr[i][1].length; j++) {
          result.push([arr[i][0], arr[i][1][j]])
        }
      } else {
        result.push(arr[i])
      }
    }

    return result
  }

  const fetchFilter = (obj) => {
    const objQuery = Object.entries(obj)
    
    const filterQueryFilters = (id) => {
      const indice = objQuery.findIndex(arr => arr[0] === id)
      if (indice != -1) objQuery.splice(indice, 1)
    }
    filterQueryFilters("page")

    return flattenArray(objQuery)
  }

  const handleSelectFilter = (elm) => {
    const newArray = [...selectedFilters]
    const indice = newArray.findIndex(arr => arr[0] === elm[0] && arr[1] === elm[1])

    if (indice === -1) {
      newArray.push(elm)
      if(elm[0] === "theme") {
        triggerGAEvent("theme_dataset", elm[1])
        triggerGAEvent("theme", elm[1])
      }
    } else {
      newArray.splice(indice, 1)
    }

    let objectQuery = []

    newArray.map(res => {
      const [key, value] = res
      objectQuery.push({[key] : value})
    })

    const queryParams = objectQuery.reduce((accumulator, elm) => {
      for (const key in elm) {
        if (accumulator.hasOwnProperty(key)) {
          if (Array.isArray(accumulator[key])) {
            accumulator[key].push(elm[key])
          } else {
            accumulator[key] = [accumulator[key], elm[key]]
          }
        } else {
          accumulator[key] = elm[key]
        }
      }
      return accumulator
    }, {})

    router.push({
      pathname: router.pathname,
      query: {
        ...(queryParams || {}),
        page: 1
      }
    })
  }

  const valuesCheckedFilter = (filter) => {
    const objQuery = Object.entries(query)
    const found = objQuery.find(elm => elm[0] === filter)
    if(!found) return []
    if(typeof found[1] === "object") return found?.[1]
    return [found?.[1]]
  }

  const DataProposalBox = ({image, display, text, bodyText}) => {
    return (
      <Stack
        alignItems="center"
        width="100%"
        spacing={0}
        borderRadius="16px"
        border={!display && "1px solid #DEDFE0"}
        padding={display ? "0 16px 40px" :"40px 16px"}
      >
        {image && 
          <NotFoundImage
            widthImage="100%"
            heightImage="100%"
            marginBottom="16px"
            marginTop={isMobileMod() && "24px"}
          />
        }

        {display &&
          <Text
            width="100%"
            textAlign="center"
            marginBottom="16px !important"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="28px"
            lineHeight="42px"
            color="#252A32"
          >{display}</Text>
        }

        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize={display ? "18px" : "24px"}
          lineHeight="36px"
          textAlign="center"
          color="#252A32"
        >
          {text}
        </Text>

        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="18px"
          lineHeight="28px"
          textAlign="center"
          color="#71757A"
        >
          {bodyText}
        </Text>

        <HStack
          width="100%"
          marginTop="16px !important"
          spacing={isMobileMod() ? 0 : "16px"}
          justifyContent="center"
          alignItems={isMobileMod() && "center"}
          flexDirection={isMobileMod() && "column"}
          gridGap={isMobileMod() && "16px"}
        >
          <Box
            as="button"
            onClick={() => window.open("https://discord.gg/Ec7tfBaTVV", "_blank")}
<<<<<<< HEAD
          >{t("Make a proposal")}</RoundedButton>
          <RoundedButton
            fontSize="15px"
            minWidth="240px"
            backgroundColor="#FFF"
            border="1px solid #42B0FF"
            color="#42B0FF"
            padding="10px 24px"
            onClick={() => window.open("https://github.com/orgs/basedosdados/projects/17", "_blank")}
          >{t("See data roadmap")}</RoundedButton>
=======
            display="flex"
            alignItems="center"
            height="40px"
            width="fit-content"
            borderRadius="8px"
            backgroundColor="#2B8C4D"
            padding="8px 16px"
            cursor="pointer"
            color="#FFF"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="14px"
            gap="8px"
            lineHeight="20px"
            _hover={{
              backgroundColor: "#22703E"
            }}
          >
            Fazer uma proposta
          </Box>

          <Box
            as="button"
            onClick={() => window.open("https://github.com/orgs/basedosdados/projects/17", "_blank")}
            display="flex"
            alignItems="center"
            height="40px"
            width="fit-content"
            borderRadius="8px"
            backgroundColor="#FFF"
            border="1px solid #2B8C4D"
            padding="8px 16px"
            cursor="pointer"
            color="#2B8C4D"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="14px"
            gap="8px"
            lineHeight="20px"
            _hover={{
              color: "#22703E"
            }}
          >
            Ver roadmap de dados
          </Box>
>>>>>>> main
        </HStack>
      </Stack>
    )
  }

<<<<<<< HEAD
  const optionsUpdateFrequencies = {
    "unique" : "-16",
    "hour": "-15",
    "day": "-14",
    "week": "-13",
    "month": "-12",
    "quarter": "-11",
    "semester": "-10",
    "one_year": "-9",
    "two_years": "-8",
    "three_years": "-7",
    "four_years": "-6",
    "five_years": "-5",
    "ten_years": "-4",
    "recurring": "-3",
    "uncertain": "-2",
    "other": "-1",
  }

  const optionsRawQualityTiers = {
    "low" : "-3",
    "medium": "-2",
    "high": "-1"
  }

  const fieldTranslations = {
    organization: t("Organization"),
    tag: t("Tag"),
    group: t("Theme"),
    resource_type: t("Sets with"),
    spatial_coverage: t("Spatial coverage"),
    temporal_coverage: t("Temporal coverage"),
    entity: t("Observation level"),
    update_frequency: t("Update frequency"),
    raw_quality_tier: t("Original source quality"),
  }

  const DatabaseCard = ({ data }) => {
=======
  function DatabaseCard({ data }) {
>>>>>>> main
    return (
      <Database
        id={data.id}
        themes={data?.themes}
        name={data?.name || t("Unnamed set")}
        temporalCoverageText={data?.temporal_coverages[0] || ""}
        organization={data.organizations[0]}
        tables={{
          id: data?.first_table_id,
          number: data?.n_tables
        }}
        rawDataSources={{
          id: data?.first_raw_data_source_id,
          number: data?.n_raw_data_sources
        }}
        informationRequests={{
          id: data?.first_information_request_id,
          number: data?.n_information_requests
        }}
        contains={{
          free: data?.contains_open_data,
          pro: data?.contains_closed_data
        }}
      />
    )
  }

  function FilterTags() {
    function mapArrayProps(obj) {
      let newObj = {}
      for (let key in obj) {
        if (Array.isArray(obj[key])) {
          newObj[key] = obj[key].map(item => ({ name: item }))
        } else {
          newObj[key] = obj[key]
        }
      }
      return newObj
    }

    let tags = { ...query }
    delete tags.page

    if(Object.keys(tags).length === 0) return null

    return (
      <Stack gap="16px" spacing={0} alignItems="center" flexDirection="row" flexWrap="wrap">
        {Object.entries(mapArrayProps(tags)).map(([key, value]) =>
          Array.isArray(value) ? (
            value.map((tag, i) => (
              <TagFilter
                key={`${key}_${i}`}
                text={tag.name}
                handleClick={() => handleSelectFilter([`${key}`,`${tag.name}`])}
              />
            ))
          ) : (
            <TagFilter
              key={key}
              text={value}
              handleClick={() => handleSelectFilter([`${key}`,`${value}`])}
            />
          )
        )}

        <Text
          as="a"
          href="/dataset"
          target="_self"
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          color="#0068C5"
          _hover={{
            color: "#0057A4"
          }}
        >
          Limpar filtros
        </Text>
    </Stack>
    )
  }

  const validateActiveFilterAccordin = (text) => {
    return selectedFilters.map((elm) => elm[0] === text).find(res => res === true)
  }

  function CheckboxFilterComponent({value, text, count}) {
    const validateContainsQuery = (value) => {
      if (query?.contains === value) {
        return true
      }
    
      if (Array.isArray(query?.contains)) {
        return query.contains.some((elm) => elm === value)
      }
    
      return false
    }

    return (
      <Skeleton
        width="100%"
        marginBottom="5px"
        borderRadius="6px"
        startColor="#F0F0F0"
        endColor="#F3F3F3"
        isLoaded={!isLoading}
      >
        <Text
          as="label"
          display="flex"
          width="100%"
          cursor="pointer"
          gap="2px"
          alignItems="center"
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          height="20px"
          color="#71757A"
          overflow="hidden"
          pointerEvents={count === 0 ? "none" : ""}
        >
          <Checkbox
            value={value}
            onChange={(e) => handleSelectFilter(["contains", e.target.value])} 
            isChecked={validateContainsQuery(value)}
            minWidth="18px"
            minHeight="18px"
            maxWidth="18px"
            maxHeight="18px"
            marginRight="14px"
            borderColor={count === 0 ? "#ACAEB1" : "#878A8E"}
            backgroundColor={count === 0 ? "#EEEEEE" : "#FFF"}
            flexShrink={0}
          />
          <Text
            as="span"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
            marginRight="2px"
            flex="1 1 1"
          >
            {text}
          </Text>
          <Text as="span" flexShrink={0}>
            {`(${count})`}
          </Text>
        </Text>
      </Skeleton>
    )
  }

  const SkeletonWaitCard = () => {
    return (
      <Box
        display="flex"
        flexDirection="row"
        gap="24px"
        width="100%"
        borderRadius="12px"
        backgroundColor="#FFF"
      >
        <Skeleton
          minWidth="222px"
          minHeight="138px"
          borderRadius="16px"
          startColor="#F0F0F0"
          endColor="#F0F0F0"
        />

        <Box display="flex" width="100%" flexDirection="column" gap="8px">
          <Skeleton height="28px" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="18px" width="400px" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="18px" width="300px" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="18px" width="200px" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="20px" width="460px" startColor="#F0F0F0" endColor="#F0F0F0"/>
        </Box>
      </Box>
    )
  }

  const SkeletonWaitCardMobile = () => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        gap="24px"
        width="100%"
        height="100%"
        paddingY="16px"
        borderRadius="12px"
        backgroundColor="#FFF"
      >
        <Skeleton
          width="222px"
          height="138px"
          borderRadius="16px"
          startColor="#F0F0F0"
          endColor="#F0F0F0"
        />
        <Skeleton height="28px" startColor="#F0F0F0" endColor="#F0F0F0"/>

        <Box display="flex" width="100%" flexDirection="column" gap="8px">
          <Skeleton height="18px" width="100%" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="18px" width="100px" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="18px" width="100%" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="20px" width="160px" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="20px" width="100%" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="20px" width="100px" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="20px" width="100%" startColor="#F0F0F0" endColor="#F0F0F0"/>

          <Skeleton height="20px" width="100%" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="20px" width="100%" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton height="20px" width="100%" startColor="#F0F0F0" endColor="#F0F0F0"/>
        </Box>
      </Box>
    )
  }

  return (
    <MainPageTemplate userTemplate footerTemplate="simple">
      <Head>
        <title>{t("Data – Base dos Dados")}</title>
        <meta
          property="og:title"
          content={t("Data – Base dos Dados")}
          key="ogtitle"
        />
      </Head>

<<<<<<< HEAD
      <DebouncedControlledInput
        value={query?.q || ""}
        onChange={(value) => handleSearch(value)}
        placeholder={isMobileMod() ? t("Keywords, institutions or themes") : t("Search keywords, institutions or themes")}
        justifyContent="center"
        inputStyle={{
          width: "90%",
          maxWidth: "1264px",
          margin: "0 auto 64px",
          padding: "20px",
          borderRadius: "17px",
          backgroundColor: "#FFF",
          color: "#6F6F6F",
          fontSize: "16px",
          height: "50px",
          boxShadow: "0 1px 3px 0.5 rgba(100 93 103 /0.16) !important",
          _placeholder:{color:"#6F6F6F"}
        }}
        marginTop={isMobileMod() ? "60px" : "46px" }
      />

=======
>>>>>>> main
      <Stack
        maxWidth="1440px"
        boxSizing="content-box"
        paddingX="24px"
        paddingTop="24px"
        marginX="auto"
        flexDirection={{ base: "column", lg: "row" }}
        spacing={isMobileMod() ? 10 : 0}
      >
        <VStack
          justifyContent="flex-start"
          alignItems="flex-start"
          minWidth={{ base: "100%", lg: "300px" }}
          maxWidth={{ base: "100%", lg: "300px" }}
          spacing={0}
        >
          <Box display="flex" marginBottom="24px" alignItems="center">
            <FilterIcon
              alt={t("filter sets")}
              width="20px"
              height="20px"
              fill="#252A32"
            />
            <Text
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="16px"
              lineHeight="24px"
              color="#252A32"
              textAlign="center"
              width="100%"
              marginLeft="8px"
            >
<<<<<<< HEAD
              {t("Filter results")}
            </Text>
          </Box>

          <CheckboxFilterAccordion
            alwaysOpen= {isLoading ? false : true}
            choices={[
              {
                key: "tables",
                name: t("Processed tables"),
                count: aggregations?.contains_tables?.filter(elm => elm.key === 1)[0]?.count || 0
              },
              {
                key: "raw_data_sources",
                name: t("Original sources"),
                count: aggregations?.contains_raw_data_sources?.filter(elm => elm.key === 1)[0]?.count || 0
              },
              {
                key: "information_requests",
                name: t("Information requests"),
                count: aggregations?.contains_information_requests?.filter(elm => elm.key === 1)[0]?.count || 0
              },
            ]}
            isActive={validateActiveSetsWith("contains")}
            valueField="key"
            displayField="name"
            fieldName={t("Sets with")}
            valuesChecked={valuesCheckedFilter("contains")}
            onChange={(value) => handleSelectFilter(["contains",`${value}`])}
          />

          <CheckboxFilterAccordion
            alwaysOpen= {isLoading ? false : true}
            choices={[
              {
                key: "open_data",
                name: t("Free"),
                count: aggregations?.contains_open_data?.filter(elm => elm.key === 1)[0]?.count || 0
              },
              {
                key: "closed_data",
                name: t("Paid"),
                count: aggregations?.contains_closed_data?.filter(elm => elm.key === 1)[0]?.count || 0
              }
            ]}
            isActive={validateActiveResource("contains")}
            valueField="key"
            displayField="name"
            fieldName={t("Resources")}
            valuesChecked={valuesCheckedFilter("contains")}
            onChange={(value) => handleSelectFilter(["contains",`${value}`])}
          />
=======
              Filtrar
            </Text>
          </Box>

          <VStack
            width="100%"
            spacing="14px"
            alignItems="start"
          >
            <Text
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="16px"
              lineHeight="24px"
              color="#464A51"
              marginBottom="4px"
            >
              Conjuntos com
            </Text>

            <CheckboxFilterComponent
              value="tables"
              text="Tabelas tratadas"
              count={aggregations?.contains_tables?.filter(elm => elm.key === 1)[0]?.count || 0}
            />

            <CheckboxFilterComponent
              value="raw_data_sources"
              text="Fontes originais"
              count={aggregations?.contains_raw_data_sources?.filter(elm => elm.key === 1)[0]?.count || 0}
            />

            <CheckboxFilterComponent
              value="information_requests"
              text="Pedidos LAI"
              count={aggregations?.contains_information_requests?.filter(elm => elm.key === 1)[0]?.count || 0}
            />
          </VStack>

          <Divider marginY="16px !important" borderColor="#DEDFE0"/>

          <VStack
            width="100%"
            spacing="14px"
            alignItems="start"
          >
            <Text
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="16px"
              lineHeight="24px"
              color="#464A51"
              marginBottom="4px"
            >
              Recursos
            </Text>

            <CheckboxFilterComponent
              value="open_data"
              text="Grátis"
              count={aggregations?.contains_open_data?.filter(elm => elm.key === 1)[0]?.count || 0}
            />

            <CheckboxFilterComponent
              value="closed_data"
              text="Pagos"
              count={aggregations?.contains_closed_data?.filter(elm => elm.key === 1)[0]?.count || 0}
            />
          </VStack>

          <Divider marginY="16px !important" borderColor="#DEDFE0"/>
>>>>>>> main

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("theme")}
            choices={aggregations?.themes}
            valueField="key"
            displayField="name"
            fieldName={t("Theme")}
            valuesChecked={valuesCheckedFilter("theme")}
            onChange={(value) => handleSelectFilter(["theme",`${value}`])}
            isLoading={!isLoading}
          />

          <Divider marginY="16px !important" borderColor="#DEDFE0"/>

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("organization")}
            choices={aggregations?.organizations}
            valueField="key"
            displayField="name"
<<<<<<< HEAD
            fieldName={t("Organizations")}
=======
            fieldName="Organização"
>>>>>>> main
            valuesChecked={valuesCheckedFilter("organization")}
            onChange={(value) => handleSelectFilter(["organization",`${value}`])}
            isLoading={!isLoading}
          />

          <Divider marginY="16px !important" borderColor="#DEDFE0"/>

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("tag")}
            choices={aggregations?.tags}
            valueField="key"
            displayField="name"
            fieldName={t("Tag")}
            valuesChecked={valuesCheckedFilter("tag")}
            onChange={(value) => handleSelectFilter(["tag",`${value}`])}
            isLoading={!isLoading}
          />

          <Divider marginY="16px !important" borderColor="#DEDFE0"/>

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("observation_level")}
            choices={aggregations?.observation_levels}
            valueField="key"
            displayField="name"
            fieldName={t("Observation level")}
            valuesChecked={valuesCheckedFilter("observation_level")}
            onChange={(value) => handleSelectFilter(["observation_level",`${value}`])}
            isLoading={!isLoading}
          />
        </VStack>

        <VStack
          alignItems="flex-start"
          width="100%"
          paddingLeft={isMobileMod() ? "" : "40px !important"}
          spacing="40px"
        >
          <FilterTags/>

          <Flex
            width="100%"
            justify="center"
            align="baseline"
          >
            <Text
              as="div"
              display="flex"
              flexDirection="column"
              gap="6px"
              width="100%"
              fontFamily="Roboto"
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
              color="#71757A"
            >
              {count ?
                `${count} conjunto${count > 1 ? "s": ""} encontrado${count > 1 ? "s": ""} ${!!query.q ? ` para ${query.q}` : ""}`
                :
                count === 0  && showEmptyState ?
                  `0 conjuntos encontrados`
                :
                <Box as="span" width="fit-content" display="flex" flexDirection="row" gap="8px" alignItems="center">
                  <Spinner height="18px" width="18px" color="#252A32"/> <Text as="span">encontrando conjuntos {!!query.q ? ` para ${query.q}` : ""}</Text>
                </Box>
              }
            </Text>
          </Flex>

          {showEmptyState &&
            <DataProposalBox 
              image= {true}
              display= "Ooops..."
              text= "Infelizmente não encontramos nenhum conjunto para sua busca."
              bodyText= "Tente pesquisar por termos relacionados ou proponha novos dados para adicionarmos na BD."
            />
          }

<<<<<<< HEAD
          {!showEmptyState &&
            <Flex width="100%" justify="center" align="baseline">
              <Heading
                display="flex"
                flexDirection={useCheckMobile() ? "column" : {base: "column", lg:"row"}}
                gap="6px"
                width="100%"
                fontFamily="Ubuntu"
                fontSize="26px"
                fontWeight="400"
                letterSpacing="-0.2px"
                color="#252A32"
              >
                {
                  count ?
                    t('{{count}} datasets found', {count})
                    + (!!query.q ? ` ${t('to')} '${query.q}'` : "")
                  :
                    <Box width="fit-content" display="flex" flexDirection="row" gap="8px" alignItems="center">
                      <Spinner color="#252A32"/> <Text> {t("finding datasets")} {!!query.q ? ` ${t('to')} '${query.q}'` : ""}</Text>
                    </Box>
                }
              </Heading>
            </Flex>
          }

=======
>>>>>>> main
          <VStack
            width="100%"
            alignItems="flex-start"
            spacing="40px"
          >
            {isLoading
              ? new Array(10).fill(0).map((e, i) => (
                useCheckMobile() ?
                  <SkeletonWaitCardMobile key={i}/>
                :
                  <SkeletonWaitCard key={i}/>
              ))
              :
              (resource || []).map((res, i) => (
                <DatabaseCard data={res} key={i}/>
              ))
            }

<<<<<<< HEAD
            {!showEmptyState &&
              <ReactPaginate
                previousLabel={useCheckMobile() ? "<" : "Anterior"}
                nextLabel={useCheckMobile() ? ">" : "Próxima"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                forcePage={pageInfo.page - 1 || 0}
                pageCount={Math.ceil(pageInfo.count / 10) || 1}
                marginPagesDisplayed={useCheckMobile() ? 0 : 1}
                pageRangeDisplayed={useCheckMobile() ? 0 : 2}
                onPageChange={(newPage) => {
                  router.push({
                    pathname: router.pathname,
                    query: {...query, page: newPage.selected + 1 || 1}
                  })
                }}
                containerClassName={"pagination"}
                activeClassName={"active"}
                pageClassName={isLoading && "disabled"}
                previousClassName={isLoading && "disabled"}
                nextClassName={isLoading && "disabled"}
              />
            }
          </VStack>

          {
              (pageInfo?.count >=1 && pageInfo?.count <=10) || pageInfo.page >= 2
            ?
              <DataProposalBox 
                text= {t("Haven't found what you're looking for?")}
                bodyText= {t("Try searching for related terms or propose new data for us to add to the database.")}
              />
            : ""
=======
          {pageInfo?.count >=1 && pageInfo?.count <=10 &&
            <DataProposalBox 
              text= "Ainda não encontrou o que está procurando?"
              bodyText= "Tente pesquisar por termos relacionados ou proponha novos dados para adicionarmos na BD."
            />
          }

          {pageInfo.page >= 2 &&
            <DataProposalBox 
              text= "Ainda não encontrou o que está procurando?"
              bodyText= "Tente pesquisar por termos relacionados ou proponha novos dados para adicionarmos na BD."
            />
>>>>>>> main
          }

            {!showEmptyState &&
              <ReactPaginate
                previousLabel={"Anterior"}
                nextLabel={"Próxima"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                forcePage={pageInfo.page - 1 || 0}
                pageCount={Math.ceil(pageInfo.count / 10) || 1}
                marginPagesDisplayed={useCheckMobile() ? 0 : 1}
                pageRangeDisplayed={useCheckMobile() ? 0 : 2}
                onPageChange={(newPage) => {
                  router.push({
                    pathname: router.pathname,
                    query: {...query, page: newPage.selected + 1 || 1}
                  })
                }}
                containerClassName={"pagination"}
                activeClassName={"active"}
                pageClassName={isLoading ? "disabled" : ""}
                previousClassName={isLoading ? "disabled" : "previous-page"}
                nextClassName={isLoading ? "disabled" : "next-page"}
              />
            }
          </VStack>
        </VStack>
      </Stack>
    </MainPageTemplate>
  )
}
