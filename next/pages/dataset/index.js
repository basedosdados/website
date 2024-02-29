import {
  VStack,
  Heading,
  HStack,
  Text,
  Divider,
  Stack,
  Skeleton,
  Flex,
  Box,
} from "@chakra-ui/react";
import Head from "next/head";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isMobileMod, useCheckMobile } from "../../hooks/useCheckMobile.hook";
import { 
  getUserDataJson,
  triggerGAEvent
} from "../../utils";

import {
  getSearchDatasets
} from "../api/datasets/index";

import { DebouncedControlledInput } from "../../components/atoms/ControlledInput";
import {
  SimpleFilterAccordion,
  CheckboxFilterAccordion,
  RangeFilterAccordion,
} from "../../components/atoms/FilterAccordion";
import Tag from "../../components/atoms/Tag";
import BodyText from "../../components/atoms/BodyText";
import Display from "../../components/atoms/Display";
import RoundedButton from "../../components/atoms/RoundedButton";
import Database from "../../components/organisms/Database";
import { MainPageTemplate } from "../../components/templates/main";

import FilterIcon from "../../public/img/icons/filterIcon";
import NotFoundImage from "../../public/img/notFoundImage";

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

export default function SearchPage({ pages }) {
  const router =  useRouter()
  const query = router.query
  const [fetchApi, setFetchApi] = useState(null)
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [resource, setResource] = useState([])
  const [selectedFilters, setSelectedFilters] = useState([])
  const [aggregations, setAggregations] = useState({})
  const [count, setCount] = useState(0)
  const [pageInfo, setPageInfo] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  let userData = getUserDataJson()

  // const [order, setOrder] = useState("score")

  async function getDatasets({q, filters, page}) {
    setIsLoading(true)
    const res = await getSearchDatasets({q:q, filter: filters, page:page})
    setPageInfo({page: page, count: res?.count})
    setIsLoading(false)
    setShowEmptyState(true)
    if(res === undefined) return router.push({pathname:"500"})
    setResource(res?.results || null)
    setAggregations(res?.aggregations)
    setCount(res?.count)
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

  useEffect(() => {
    if(fetchApi) clearTimeout(fetchApi)

    const fetchFunc = setTimeout(() => {
      getDatasets({
        q: query?.q,
        filters: fetchFilter(query),
        page: query?.page || 1
      })
    }, 400)

    setSelectedFilters(fetchFilter(query))
    setFetchApi(fetchFunc)
  }, [query])

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
        q: query.q,
        ...queryParams || "",        
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
    organization: "Organização",
    tag: "Etiqueta",
    group: "Tema",
    resource_type: "Conjuntos com",
    spatial_coverage: "Cobertura espacial",
    temporal_coverage: "Cobertura temporal",
    entity: "Nível da observação",
    update_frequency: "Frequência de atualização",
    raw_quality_tier: "Qualidade da fonte original",
  }

  const DatabaseCard = ({ data }) => {
    const organizationTypeof = typeof data.organization === "object"

    return (
      <Database
        id={data.id}
        themes={data?.themes}
        name={data?.name || "Conjunto sem nome"}
        temporalCoverageText={data?.temporal_coverage[0] || ""}
        organization={data.organization[0]}
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

  const SearchQuery = (value) => {
    if(value) {
      triggerGAEvent("search", value)
      triggerGAEvent("search_dataset", value)
    }
    if(query.page && value === undefined || "") {
      router.push({
        pathname: router.pathname,
        query: {...query, page: value !== query.q ? 1 : query.page}
      })
    }
    if(value || value === "" && query.page === undefined) {
      router.push({
        pathname: router.pathname,
        query: {...query, q: value}
      })
    }  
    if(value || value === "" && query.page) {
      router.push({
        pathname: router.pathname,
        query: {...query, q: value, page: value !== query.q ? 1 : query.page }
      })
    }
  }

  const validateActiveFilterAccordin = (text) => {
    return selectedFilters.map((elm) => elm[0] === text).find(res => res === true)
  }

  const validateActiveSetsWith = (text) => {
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

  return (
    <MainPageTemplate pages={pages}>
      <Head>
        <title>Dados – Base dos Dados</title>
        <meta
          property="og:title"
          content="Dados – Base dos Dados"
          key="ogtitle"
        />
      </Head>

      <DebouncedControlledInput
        value={query.q}
        onChange={(value) => { SearchQuery(value) }}
        placeholder={isMobileMod() ? "Palavras-chave, instituições ou temas" :"Pesquise palavras-chave, instituições ou temas"}
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
        marginTop={{ base: isMobileMod() ? "160px" : "140px", lg: "46px" }}
      />

      <Stack
        spacing={isMobileMod() ? 10 : 0}
        width="90%"
        maxWidth="1264px"
        margin="auto"
        direction={{ base: "column", lg: "row" }}
      >
        <VStack
          justifyContent="flex-start"
          alignItems="flex-start"
          minWidth={{ base: "100%", lg: "320px" }}
          maxWidth={{ base: "100%", lg: "320px" }}
          borderRight={isMobileMod() ? "" : "1px solid #DEDFE0"}
          padding={isMobileMod() ? "" : "0 20px 0 0"}
        >
          <Box display="flex" marginBottom="10px" alignItems="center">
            <FilterIcon
              alt="filtrar conjuntos"
              width="20px"
              height="20px"
              fill="#252A32"
            />
            <Text
              fontFamily="Ubuntu"
              fontSize="20px"
              fontWeight="400"
              textAlign="top"
              width="100%"
              marginLeft="8px"
              color="#252A32"
              letterSpacing="0.2px"
            >
              Filtrar resultados
            </Text>
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
                name: "Pro",
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

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("theme")}
            choices={aggregations?.themes}
            valueField="key"
            displayField="name"
            fieldName="Tema"
            valuesChecked={valuesCheckedFilter("theme")}
            onChange={(value) => handleSelectFilter(["theme",`${value}`])}
          />

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("organization")}
            choices={aggregations?.organizations}
            valueField="key"
            displayField="name"
            fieldName="Organizações"
            valuesChecked={valuesCheckedFilter("organization")}
            onChange={(value) => handleSelectFilter(["organization",`${value}`])}
          />

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("tag")}
            choices={aggregations?.tags}
            valueField="key"
            displayField="name"
            fieldName="Etiqueta"
            valuesChecked={valuesCheckedFilter("tag")}
            onChange={(value) => handleSelectFilter(["tag",`${value}`])}
          />

          {/* <SimpleFilterAccordion
            fieldName="Cobertura espacial"
            isActive={(paramFilters.spatial_coverage || []).length > 0}
            styleChildren={{
              marginLeft:"16px !important",
              width:"95%"
            }}
          >
            <Stack width="100%">
              <CheckboxFilterAccordion
                canSearch={true}
                isActive={(paramFilters.spatial_coverage || []).length > 0}
                choices={[...spatialCoverages.continent]}
                values={paramFilters.spatial_coverage}
                valueField="name"
                displayField="displayName"
                fieldName="Continente"
                onChange={(values) =>
                  setParamFilters({ ...paramFilters, spatial_coverage: values })
                }
              />

              <CheckboxFilterAccordion
                canSearch={true}
                isActive={(paramFilters.spatial_coverage || []).length > 0}
                choices={[...spatialCoverages.country]}
                values={paramFilters.spatial_coverage}
                valueField="name"
                displayField="displayName"
                fieldName="País"
                onChange={(values) =>
                  setParamFilters({ ...paramFilters, spatial_coverage: values })
                }
              />

              <CheckboxFilterAccordion
                canSearch={true}
                isActive={(paramFilters.spatial_coverage || []).length > 0}
                choices={[...spatialCoverages.admin1]}
                values={paramFilters.spatial_coverage}
                valueField="name"
                displayField="displayName"
                fieldName="UF"
                onChange={(values) =>
                  setParamFilters({ ...paramFilters, spatial_coverage: values })
                }
              />

              Filter null
              <CheckboxFilterAccordion
                canSearch={true}
                isActive={(paramFilters.spatial_coverage || []).length > 0}
                choices={[...spatialCoverages.admin2]}
                values={paramFilters.spatial_coverage}
                valueField="name"
                displayField="displayName"
                fieldName="Município"
                onChange={(values) =>
                  setParamFilters({ ...paramFilters, spatial_coverage: values })
                }
              /> 
            </Stack>
          </SimpleFilterAccordion>

          <RangeFilterAccordion
            isActive={(paramFilters.temporal_coverage || []).length > 0}
            fieldName="Cobertura temporal"
            minValue={(paramFilters.temporal_coverage || [])[0]}
            maxValue={
              (paramFilters.temporal_coverage || [])[
                (paramFilters.temporal_coverage || []).length - 1
              ]
            }
            onChange={(val) => {
              if (val.min < 0 || !val.min || val.max < 0 || !val.max || val.min > val.max)
                return;
              
              const start = parseInt(Math.max(val.min, 0));
              const range =
                Math.max((val.max - val.min), 0) + 1;

              setParamFilters({
                ...paramFilters,
                temporal_coverage: new Array(range)
                .fill(0)
                .map((_, i) => start + i),
              });
            }}
          /> */

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("observation_level")}
            choices={aggregations?.observation_levels}
            valueField="key"
            displayField="name"
            fieldName="Nível da observação"
            valuesChecked={valuesCheckedFilter("observation_level")}
            onChange={(value) => handleSelectFilter(["observation_level",`${value}`])}
          />

          /*<CheckboxFilterAccordion
            canSearch={true}
            isActive={(paramFilters.update_frequency || []).length > 0}
            choices={updateFrequencies}
            values={paramFilters.update_frequency}
            valueField="name"
            displayField="displayName"
            fieldName="Frequência de atualização"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, update_frequency: values })
            }
          />

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={(paramFilters.raw_quality_tier || []).length > 0}
            choices={rawQualityTiers}
            values={paramFilters.raw_quality_tier}
            valueField="name"
            displayField="displayName"
            fieldName="Qualidade da fonte original"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, raw_quality_tier: values })
            }
          /> */}
        </VStack>

        <VStack
          alignItems="flex-start"
          overflow="hidden"
          width="100%"
          paddingLeft={isMobileMod() ? "" : "40px !important"}
        >
          {showEmptyState && !resource ?
            <DataProposalBox 
              image= {true}
              display= "Ooops..."
              text= "Infelizmente não encontramos nenhum conjunto para sua busca."
              bodyText= "Tente pesquisar por termos relacionados ou proponha novos dados para adicionarmos na BD."
            />
          :
          <>
            <Flex width="100%" justify="center" align="baseline">
              <Heading
                width="100%"
                fontFamily="Ubuntu"
                fontSize="26px"
                fontWeight="400"
                letterSpacing="-0.2px"
                color="#252A32"
              >
                {count || "..."} {`conjunto${count > 1 ? "s": ""} encontrado${count > 1 ? "s": ""}`}
                {query.q ? ` para ${query.q}` : ""}
              </Heading>

              {userData?.isAdmin && 
                <RoundedButton
                  width="fit-content"
                  padding="20px"
                  onClick={() => window.open("/dataset/edit", "_self")}
                  marginLeft="auto"
                  _hover={{transform: "none", opacity: "0.8"}}
                >
                  Criar Conjunto
                </RoundedButton>
              }
            </Flex>

            {/* Tags container */}
            {/* <Stack
              overflow="auto"
              width="100%"
              flexWrap="wrap"
              gridGap={3}
              margin="16px 0px 24px !important"
              whiteSpace="nowrap"
              spacing={0}
              direction={{ base: "column", lg: "row" }}
            >
              {Object.entries(paramFilters)
                .filter(([k, v]) => v.length > 0)
                .map(([k, values]) => (
                  <FilterTags
                    translations={availableOptionsTranslations}
                    label={fieldTranslations[k]}
                    fieldName={k}
                    values={
                      k === "temporal_coverage"
                        ? [`${values[0]}-${values[values.length - 1]}`]
                        : values
                    }
                    paramFilters={paramFilters}
                    setParamFilters={setParamFilters}
                  />
                ))}
            </Stack> */}

            {/* Order container */}
            {/* <HStack
              fontFamily="Lato"
              letterSpacing="0.5px"
              fontWeight="300"
              fontSize="16px"
              color="#6F6F6F"
            >
              <Stack
                alignItems="center"
                direction="row"
                spacing="8px"
              >
                <Text whiteSpace="nowrap">Ordenar:</Text>
                <Select
                  fontFamily="Lato"
                  minWidth="150px"
                  color="#252A32"
                  borderRadius="16px"
                  focusBorderColor="#42B0FF"
                  border="1px solid #DEDFE0"
                  height="40px"
                  value={order}
                  onChange={(event) => {
                    setOrder(event.target.value);
                  }}
                >
                  <option value="score">Mais relevantes</option>
                  <option value="recent">Mais recentes</option>
                  <option value="popular">Mais populares</option>
                </Select>
              </Stack>
            </HStack> */}

            <VStack
              width="100%"
              alignItems="flex-start"
              spacing={3}
              padding="28px 0px"
            >
              {isLoading
                ? new Array(10).fill(0).map(() => (
                    <>
                      <Skeleton
                        width="100%"
                        height="148px"
                        borderRadius="12px"
                        startColor="#F0F0F0"
                        endColor="#F0F0F0"
                      />
                      <Divider />
                    </>
                ))
                :
                (resource || []).map((res) => (
                  <>
                    <DatabaseCard data={res} />
                    <Divider border="0" borderBottom="1px solid #DEDFE0" opacity={1}/>
                  </>
                ))
              }
              {showEmptyState &&
                <ReactPaginate
                  previousLabel={useCheckMobile() ? "<" : "Anterior"}
                  nextLabel={useCheckMobile() ? ">" : "Próxima"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  forcePage={pageInfo.page - 1 || 0}
                  pageCount={Math.ceil(pageInfo.count / 10)}
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
            {pageInfo?.count === 1 &&
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
          </>}
        </VStack>
      </Stack>
      <script
        src="/vendor/terminal.js"
        data-termynal-container="#termynal"
      ></script>
    </MainPageTemplate>
  )
}
