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
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useCheckMobile } from "../hooks/useCheckMobile.hook";
import { triggerGAEvent } from "../utils";
import Button from "../components/atoms/Button";
import Link from "../components/atoms/Link";
import TitleText from "../components/atoms/Text/TitleText";
import LabelText from "../components/atoms/Text/LabelText";
import BodyText from "../components/atoms/Text/BodyText";

import {
  getSearchDatasets
} from "./api/datasets/index";

import { CheckboxFilterAccordion } from "../components/atoms/FilterAccordion";
import Checkbox from "../components/atoms/Checkbox";
import { TagFilter } from "../components/atoms/Tag";
import DatasetSearchCard from "../components/organisms/DatasetSearchCard";
import { MainPageTemplate } from "../components/templates/main";

import FilterIcon from "../public/img/icons/filterIcon";
import NotFoundImage from "../public/img/notFoundImage";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dataset', 'menu', 'search'])),
    },
  };
}

export default function SearchDatasetPage() {
  const { t } = useTranslation('dataset')
  const { locale } = useRouter()
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

  async function getDatasets({q, filters, page}) {
    const res = await getSearchDatasets({q, filter: filters, page, locale: locale || 'pt'})
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
            widthImage="256px"
            heightImage="186px"
            marginBottom="16px"
            marginTop={{base: "24px", lg: "0"}}
          />
        }

        {display &&
          <TitleText
            typography="large"
            width="100%"
            textAlign="center"
            marginBottom="16px !important"
          >{display}</TitleText>
        }

        <TitleText textAlign="center" fontSize={display ? "18px" : "24px"}>
          {text}
        </TitleText>

        <TitleText
          typography="small"
          textAlign="center"
          color="#71757A"
        >
          {bodyText}
        </TitleText>

        <HStack
          width="100%"
          marginTop="16px !important"
          spacing={{base: 0, lg: "16px"}}
          justifyContent="center"
          alignItems={{base: "center", lg: "start"}}
          flexDirection={{base: "column", lg: "row"}}
          gridGap={{base: "16px", lg: "0"}}
        >
          <Button
            onClick={() => window.open("https://discord.gg/Ec7tfBaTVV", "_blank")}
          >
            {t('suggestData')}
          </Button>

          <Button
            onClick={() => window.open("https://github.com/orgs/basedosdados/projects/17", "_blank")}
            backgroundColor="#FFF"
            border="1px solid #2B8C4D"
            color="#2B8C4D"
            _hover={{
              color: "#22703E",
              backgroundColor: "#FFF"
            }}
          >
            {t('viewDataRoadmap')}
          </Button>
        </HStack>
      </Stack>
    )
  }

  function DatasetCard({ data }) {
    return (
      <DatasetSearchCard
        id={data.id}
        themes={data?.themes}
        name={data?.name || t('noName')}
        temporalCoverageText={(data?.temporal_coverage && data.temporal_coverage[0]) || ""}
        spatialCoverage={data?.spatial_coverage
          ?.map(coverage => coverage.name)
          .sort((a, b) => a.localeCompare(b, locale))
          .join(', ')}
        organizations={data.organizations}
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
        locale={locale}
      />
    )
  }

  function FilterTags() {
    function getLocalizedName(key, value) {
      // Handle special case for contains filters
      if (key === "contains") {
        const containsMap = {
          "tables": t('tables'),
          "raw_data_sources": t('rawDataSources'),
          "information_requests": t('informationRequests'),
          "open_data": t('openData'),
          "closed_data": t('closedData'),
          "direct_download_free": t('downloadDirectFree'),
          "direct_download_paid": t('downloadDirectPaid'),
          "temporalcoverage_free": t('temporalcoverageFree'),
          "temporalcoverage_paid": t('temporalcoveragePaid'),
        };
        return containsMap[value] || value;
      }

      // Look up the display name in aggregations
      const aggregationKey = {
        "theme": "themes",
        "organization": "organizations",
        "spatial_coverage": "spatial_coverages",
        "tag": "tags",
        "observation_level": "observation_levels"
      }[key];

      if (aggregationKey && aggregations[aggregationKey]) {
        const item = aggregations[aggregationKey].find(item => item.key === value);
        return item?.name || value;
      }

      return value;
    }

    function mapArrayProps(obj) {
      let newObj = {}
      for (let key in obj) {
        if (Array.isArray(obj[key])) {
          newObj[key] = obj[key].map(item => ({ 
            name: item,
            displayName: getLocalizedName(key, item)
          }))
        } else {
          newObj[key] = {
            name: obj[key],
            displayName: getLocalizedName(key, obj[key])
          }
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
                text={tag.displayName}
                handleClick={() => handleSelectFilter([`${key}`, tag.name])}
              />
            ))
          ) : (
            <TagFilter
              key={key}
              text={value.displayName}
              handleClick={() => handleSelectFilter([`${key}`,`${value.name}`])}
            />
          )
        )}

        <Link
          href="/search"
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          color="#0068C5"
          _hover={{
            color: "#0057A4"
          }}
        >
          {t('clearFilters')}
        </Link>
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
        borderRadius="6px"
        startColor="#F0F0F0"
        endColor="#F3F3F3"
        isLoaded={!isLoading}
      >
        <BodyText
          typography="small"
          as="label"
          display="flex"
          width="100%"
          cursor="pointer"
          gap="2px"
          alignItems="center"
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
        </BodyText>
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
        <title>{t('pageTitle')}</title>
        <meta
          property="og:title"
          content={t('pageTitle')}
          key="ogtitle"
        />
      </Head>

      <Stack
        maxWidth="1440px"
        boxSizing="content-box"
        paddingX="24px"
        paddingTop="24px"
        marginX="auto"
        flexDirection={{ base: "column", lg: "row" }}
        spacing={{base: 10, lg: 0}}
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
              alt="filtrar conjuntos"
              width="20px"
              height="20px"
              fill="#252A32"
            />
            <LabelText
              textAlign="center"
              width="100%"
              marginLeft="8px"
            >
              {t('filter')}
            </LabelText>
          </Box>

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("theme")}
            choices={aggregations?.themes}
            valueField="key"
            displayField="name"
            fieldName={t('theme')}
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
            fieldName={t('organization')}
            valuesChecked={valuesCheckedFilter("organization")}
            onChange={(value) => handleSelectFilter(["organization",`${value}`])}
            isLoading={!isLoading}
          />

          <Divider marginY="16px !important" borderColor="#DEDFE0"/>

          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            gap="14px"
            alignItems="start"
          >
            <LabelText
              color="#464A51"
              marginBottom="4px"
            >
              {t('resources')}
            </LabelText>

            <CheckboxFilterComponent
              value="tables"
              text={t('tables')}
              count={aggregations?.contains_tables?.filter(elm => elm.key === 1)[0]?.count || 0}
            />

            <CheckboxFilterComponent
              value="raw_data_sources"
              text={t('rawDataSources')}
              count={aggregations?.contains_raw_data_sources?.filter(elm => elm.key === 1)[0]?.count || 0}
            />
          </Box>

          <Divider marginY="16px !important" borderColor="#DEDFE0"/>

          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            gap="14px"
            alignItems="start"
          >
            <LabelText
              color="#464A51"
              marginBottom="4px"
            >
              {t('temporalCoverage')}
            </LabelText>

            <CheckboxFilterComponent
              value="temporalcoverage_free"
              text={t('temporalcoverageFree')}
              count={aggregations?.contains_temporalcoverage_free?.filter(elm => elm.key === 1)[0]?.count || 0}
            />

            <CheckboxFilterComponent
              value="temporalcoverage_paid"
              text={t('temporalcoveragePaid')}
              count={aggregations?.contains_temporalcoverage_paid?.filter(elm => elm.key === 1)[0]?.count || 0}
            />
          </Box>

          <Divider marginY="16px !important" borderColor="#DEDFE0"/>

          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            gap="14px"
            alignItems="start"
          >
            <LabelText
              color="#464A51"
              marginBottom="4px"
            >
              {t('downloadDirect')}
            </LabelText>

            <CheckboxFilterComponent
              value="direct_download_free"
              text={t('openData')}
              count={aggregations?.contains_direct_download_free?.filter(elm => elm.key === 1)[0]?.count || 0}
            />

            <CheckboxFilterComponent
              value="direct_download_paid"
              text={t('paid')}
              count={aggregations?.contains_direct_download_paid?.filter(elm => elm.key === 1)[0]?.count || 0}
            />
          </Box>

          <Divider marginY="16px !important" borderColor="#DEDFE0"/>

          {locale !== 'pt' ?
            <>
              <CheckboxFilterAccordion
                canSearch={true}
                isActive={validateActiveFilterAccordin("spatial_coverage")}
                choices={aggregations?.spatial_coverages}
                valueField="key"
                displayField="name"
                fieldName={t('spatialCoverage')}
                valuesChecked={valuesCheckedFilter("spatial_coverage")}
                onChange={(value) => handleSelectFilter(["spatial_coverage",`${value}`])}
                isLoading={!isLoading}
              />
              <Divider marginY="16px !important" borderColor="#DEDFE0"/>
            </>
            :
            <></>
          }

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={validateActiveFilterAccordin("tag")}
            choices={aggregations?.tags}
            valueField="key"
            displayField="name"
            fieldName={t('tag')}
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
            fieldName={t('observationLevel')}
            valuesChecked={valuesCheckedFilter("observation_level")}
            onChange={(value) => handleSelectFilter(["observation_level",`${value}`])}
            isLoading={!isLoading}
          />
        </VStack>

        <VStack
          alignItems="flex-start"
          width="100%"
          paddingLeft={{base: "0", lg: "40px !important"}}
          spacing="40px"
        >
          <FilterTags/>

          <Flex
            width="100%"
            justify="center"
            align="baseline"
          >
            <BodyText
              typography="small"
              as="div"
              display="flex"
              flexDirection="column"
              gap="6px"
              width="100%"
              color="#71757A"
            >
              {count ? (
                t('datasetsFound_plural', {
                  count: count,
                  query: query.q ? t('forQuery', { query: query.q }) : ''
                })
              ) : count === 0 && showEmptyState ? (
                t('noDatasetsFound')
              ) : (
                <Box as="span" width="fit-content" display="flex" flexDirection="row" gap="8px" alignItems="center">
                  <Spinner height="18px" width="18px" color="#252A32"/>
                  <Text as="span">
                    {t('findingDatasets', {
                      query: query.q ? t('forQuery', { query: query.q }) : ''
                    })}
                  </Text>
                </Box>
              )}
            </BodyText>
          </Flex>

          {showEmptyState &&
            <DataProposalBox 
              image= {true}
              display= {t('ooops')}
              text= {t('unfortunatelyNoDatasetsFound')}
              bodyText= {t('tryRelatedTerms')}
            />
          }

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
                <DatasetCard data={res} key={i}/>
              ))
            }

            {pageInfo?.count >=1 && pageInfo?.count <=10 &&
              <DataProposalBox 
                text={t('stillNotFound')}
                bodyText={t('tryRelatedTerms')}
              />
            }

            {pageInfo.page >= 2 &&
              <DataProposalBox 
                text={t('stillNotFound')}
                bodyText={t('tryRelatedTerms')}
              />
            }

            {!showEmptyState &&
              <ReactPaginate
                previousLabel={t('previous')}
                nextLabel={t('next')}
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
