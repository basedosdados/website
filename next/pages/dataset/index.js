import {
  VStack,
  Heading,
  HStack,
  Text,
  Divider,
  Stack,
  Skeleton,
  SkeletonText,
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

import {
  getSearchDatasets
} from "../api/datasets/index";

import { CheckboxFilterAccordion } from "../../components/atoms/FilterAccordion";
import Checkbox from "../../components/atoms/Checkbox";
import Tag from "../../components/atoms/Tag";
import BodyText from "../../components/atoms/BodyText";
import Display from "../../components/atoms/Display";
import RoundedButton from "../../components/atoms/RoundedButton";
import Database from "../../components/organisms/Database";
import { MainPageTemplate } from "../../components/templates/main";

import FilterIcon from "../../public/img/icons/filterIcon";
import NotFoundImage from "../../public/img/notFoundImage";

export async function getStaticProps() {
  return await withPages()
}

function FilterTags({
  label,
  fieldName,
  values,
  setParamFilters,
  paramFilters,
  translations
}) {
  function translate (field, translation) {
    return translation[field] || field
  }

  return (
    <HStack spacing={3} alignItems="center" flexDirection="row">
      <Text
        fontFamily="Lato"
        letterSpacing="0.5px"
        fontWeight="300"
        fontSize="14px"
        color="#6F6F6F"
      >
        {label}
      </Text>
      <Stack direction={{ base: "column", lg: "row" }}>
        {values.map((v) => (
          <Tag
            handleClick={() => {
              let newArr = [...values];
              newArr.splice(values.indexOf(v), 1);
              setParamFilters({ ...paramFilters, [fieldName]: newArr });
            }}
            text={translations ? translate(v, translations) : v}
          />
        ))}
      </Stack>
    </HStack>
  )
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
    filterQueryFilters("q")
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
        ...(query.q ? { q: query.q } : {}),
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
        marginTop={!display && "24px !important"}
      >
        {image && 
          <NotFoundImage
            transform={!isMobileMod() && "translateX(-36px)"}
            widthImage="100%"
            heightImage="100%"
            marginBottom="24px"
            marginTop={isMobileMod() && "24px"}
          />
        }
        {display &&
          <Display
            width="100%"
            fontSize="50px"
            textAlign="center"
            lineHeight="54px"
            letterSpacing="-0.8px"
            marginBottom="24px !important"
          >{display}</Display>
        }
        <Text
          fontFamily="ubuntu"
          fontWeight="400"
          fontSize={display ? "20px" : "16px"}
          lineHeight="23px"
          letterSpacing="0.2px"
          marginBottom="0 !important"
          textAlign="center"
        >
          {text}
        </Text>
        <BodyText
          fontSize={display ? "18px" : "16px"}
          lineHeight="28px"
          textAlign="center"
        >
          {bodyText}
        </BodyText>
        <HStack
          width="100%"
          marginTop={display ? "24px !important" : "16px !important"}
          spacing={isMobileMod() ? 0 : "16px"}
          justifyContent="center"
          alignItems={isMobileMod() && "center"}
          flexDirection={isMobileMod() && "column"}
          gridGap={isMobileMod() && "16px"}
        >
          <RoundedButton
            fontSize="15px"
            minWidth="240px"
            padding="10px 24px"
            onClick={() => window.open("https://discord.gg/Ec7tfBaTVV", "_blank")}
          >Fazer uma proposta</RoundedButton>
          <RoundedButton
            fontSize="15px"
            minWidth="240px"
            backgroundColor="#FFF"
            border="1px solid #42B0FF"
            color="#42B0FF"
            padding="10px 24px"
            onClick={() => window.open("https://github.com/orgs/basedosdados/projects/17", "_blank")}
          >Ver roadmap de dados</RoundedButton>
        </HStack>
      </Stack>
    )
  }

  const DatabaseCard = ({ data }) => {
    return (
      <Database
        id={data.id}
        themes={data?.themes}
        name={data?.name || "Conjunto sem nome"}
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

  const validateActiveFilterAccordin = (text) => {
    return selectedFilters.map((elm) => elm[0] === text).find(res => res === true)
  }

  const validateActiveSetsWith = () => {
    return selectedFilters.map((elm) => 
        elm[1] === "tables"
      ||elm[1] === "raw_data_sources"
      ||elm[1] === "information_requests").find(
      res => res === true
    )
  }

  const validateActiveResource = (text) => {
    return selectedFilters.map((elm) => 
        elm[1] === "open_data"
      ||elm[1] === "closed_data").find(
      res => res === true
    )
  }

  const SkeletonWaitCard = () => {
    return (
      <Box
        display="flex"
        flexDirection="row"
        gap="24px"
        width="100%"
        height="172px"
        paddingY="16px"
        borderRadius="12px"
        backgroundColor="#FFF"
      >
        <Skeleton
          minWidth="138px"
          minHeight="138px"
          borderRadius="16px"
          startColor="#F0F0F0"
          endColor="#F0F0F0"
        />

        <Box display="flex" width="100%" flexDirection="column" gap="8px">
          <SkeletonText noOfLines={2} spacing="4" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <SkeletonText marginTop="26px" noOfLines={3} spacing="3" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <SkeletonText marginTop="10px" noOfLines={1} spacing="0" startColor="#F0F0F0" endColor="#F0F0F0"/>
        </Box>

        <Box display="flex" flexDirection="row" gap="8px">
          <Skeleton width="36px" height="36px" borderRadius="6px" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton width="36px" height="36px" borderRadius="6px" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton width="36px" height="36px" borderRadius="6px" startColor="#F0F0F0" endColor="#F0F0F0"/>
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
          width="138px"
          height="138px"
          borderRadius="16px"
          startColor="#F0F0F0"
          endColor="#F0F0F0"
        />
        <SkeletonText noOfLines={2} spacing="4" startColor="#F0F0F0" endColor="#F0F0F0"/>

        <Box display="flex" flexDirection="row" gap="8px">
          <Skeleton width="36px" height="36px" borderRadius="6px" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton width="36px" height="36px" borderRadius="6px" startColor="#F0F0F0" endColor="#F0F0F0"/>
          <Skeleton width="36px" height="36px" borderRadius="6px" startColor="#F0F0F0" endColor="#F0F0F0"/>
        </Box>

        <Box display="flex" width="100%" flexDirection="column" gap="8px">
          <SkeletonText marginTop="6px" noOfLines={6} spacing="3" startColor="#F0F0F0" endColor="#F0F0F0"/>
        </Box>
      </Box>
    )
  }

  return (
    <MainPageTemplate userTemplate footerTemplate="simple">
      <Head>
        <title>Dados – Base dos Dados</title>
        <meta
          property="og:title"
          content="Dados – Base dos Dados"
          key="ogtitle"
        />
      </Head>

      <Stack
        width="100%"
        maxWidth="1440px"
        boxSizing="content-box"
        overflow="auto"
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
        >
          <Box display="flex" marginBottom="24px" alignItems="center">
            <FilterIcon
              alt="filtrar conjuntos"
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
              Filtrar
            </Text>
          </Box>

          <Box
            width="100%"
          >
            <Text
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="16px"
              lineHeight="24px"
              color="#464A51"
              marginBottom="5px"
            >
              Conjuntos com
            </Text>

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
              >
                <Checkbox
                  value="tables"
                  onChange={(e) => handleSelectFilter(["contains", e.target.value])} 
                  isChecked={query?.contains === "tables" || query?.contains?.[0] ? query?.contains.map((elm) => elm === "tables" ) : false}
                  minWidth="18px"
                  minHeight="18px"
                  maxWidth="18px"
                  maxHeight="18px"
                  marginRight="14px"
                  flexShrink={0}
                />
                <Text
                  as="span"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  marginRight="2px"
                  flex="1 1 auto"
                >
                  Tabelas tratadas
                </Text>
                <Text as="span" flexShrink={0}>
                  {`(${aggregations?.contains_tables?.filter(elm => elm.key === 1)[0]?.count || 0})`}
                </Text>
              </Text>
            </Skeleton>
          </Box>

          <CheckboxFilterAccordion
            alwaysOpen= {isLoading ? false : true}
            choices={[
              {
                key: "tables",
                name: "Tabelas tratadas",
                count: aggregations?.contains_tables?.filter(elm => elm.key === 1)[0]?.count || 0
              },
              {
                key: "raw_data_sources",
                name: `Fontes originais`,
                count: aggregations?.contains_raw_data_sources?.filter(elm => elm.key === 1)[0]?.count || 0
              },
              {
                key: "information_requests",
                name: `Pedidos LAI`,
                count: aggregations?.contains_information_requests?.filter(elm => elm.key === 1)[0]?.count || 0
              },
            ]}
            isActive={validateActiveSetsWith("contains")}
            valueField="key"
            displayField="name"
            fieldName="Conjuntos com"
            valuesChecked={valuesCheckedFilter("contains")}
            onChange={(value) => handleSelectFilter(["contains",`${value}`])}
          />

          <CheckboxFilterAccordion
            alwaysOpen= {isLoading ? false : true}
            choices={[
              {
                key: "open_data",
                name: "Grátis",
                count: aggregations?.contains_open_data?.filter(elm => elm.key === 1)[0]?.count || 0
              },
              {
                key: "closed_data",
                name: "Pagos",
                count: aggregations?.contains_closed_data?.filter(elm => elm.key === 1)[0]?.count || 0
              }
            ]}
            isActive={validateActiveResource("contains")}
            valueField="key"
            displayField="name"
            fieldName="Recursos"
            valuesChecked={valuesCheckedFilter("contains")}
            onChange={(value) => handleSelectFilter(["contains",`${value}`])}
          />

          {/* <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("theme")}
            choices={aggregations?.themes}
            valueField="key"
            displayField="name"
            fieldName="Tema"
            valuesChecked={valuesCheckedFilter("theme")}
            onChange={(value) => handleSelectFilter(["theme",`${value}`])}
          /> */}

          {/* <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("organization")}
            choices={aggregations?.organizations}
            valueField="key"
            displayField="name"
            fieldName="Organizações"
            valuesChecked={valuesCheckedFilter("organization")}
            onChange={(value) => handleSelectFilter(["organization",`${value}`])}
          /> */}

          {/* <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("tag")}
            choices={aggregations?.tags}
            valueField="key"
            displayField="name"
            fieldName="Etiqueta"
            valuesChecked={valuesCheckedFilter("tag")}
            onChange={(value) => handleSelectFilter(["tag",`${value}`])}
          /> */}

          {/* <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("observation_level")}
            choices={aggregations?.observation_levels}
            valueField="key"
            displayField="name"
            fieldName="Nível da observação"
            valuesChecked={valuesCheckedFilter("observation_level")}
            onChange={(value) => handleSelectFilter(["observation_level",`${value}`])}
          /> */}
        </VStack>

        <VStack
          alignItems="flex-start"
          overflow="hidden"
          width="100%"
          paddingLeft={isMobileMod() ? "" : "40px !important"}
        >
          {showEmptyState &&
            <DataProposalBox 
              image= {true}
              display= "Ooops..."
              text= "Infelizmente não encontramos nenhum conjunto para sua busca."
              bodyText= "Tente pesquisar por termos relacionados ou proponha novos dados para adicionarmos na BD."
            />
          }

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
                {count ?
                    `${count} conjunto${count > 1 ? "s": ""} encontrado${count > 1 ? "s": ""} ${!!query.q ? ` para ${query.q}` : ""}`
                  :
                  <Box width="fit-content" display="flex" flexDirection="row" gap="8px" alignItems="center">
                    <Spinner color="#252A32"/> <Text>encontrando conjuntos {!!query.q ? ` para ${query.q}` : ""}</Text>
                  </Box>
                }
              </Heading>
            </Flex>
          }

          <VStack
            width="100%"
            alignItems="flex-start"
            spacing={3}
            padding="28px 0px"
          >
            {isLoading
              ? new Array(10).fill(0).map((e, i) => (
                <Box display="flex" flexDirection="column" width="100%" key={i}>
                  {useCheckMobile() ?
                    <SkeletonWaitCardMobile />
                  :
                    <SkeletonWaitCard />
                  }
                  <Divider />
                </Box>
              ))
              :
              (resource || []).map((res, i) => (
                <Box display="flex" flexDirection="column" width="100%" key={i}>
                  <DatabaseCard data={res} />
                  <Divider border="0" borderBottom="1px solid #DEDFE0" opacity={1}/>
                </Box>
              ))
            }

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
                pageClassName={isLoading ? "disabled" : ""}
                previousClassName={isLoading ? "disabled" : ""}
                nextClassName={isLoading ? "disabled" : ""}
              />
            }
          </VStack>

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
          }
        </VStack>
      </Stack>
    </MainPageTemplate>
  )
}
