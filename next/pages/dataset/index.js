import {
  VStack,
  Heading,
  HStack,
  Text,
  Divider,
  Stack,
  Select,
  Skeleton,
  Flex,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import Head from "next/head";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isMobileMod, useCheckMobile } from "../../hooks/useCheckMobile.hook";

import { getSearchDatasets } from "../api/datasets/index";

import { addParametersToCurrentURL, isBdPlus, unionArrays } from "../../utils";

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
import { SchemaForm } from "../../components/molecules/SchemaForm";
import { Database } from "../../components/organisms/Database";
import { MainPageTemplate } from "../../components/templates/main";

import FilterIcon from "../../public/img/icons/filterIcon";
import BDLogoPlusImage from "../../public/img/logos/bd_logo_plus";
import NotFoundImage from "../../public/img/notFoundImage";

function NewDatasetModal({ isOpen, onClose }) {
  return (
    <Modal
      size="2xl"
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay zIndex="999" />
      <ModalContent zIndex="9999">
        <ModalCloseButton />
        <ModalBody padding="20px 20px">
          <SchemaForm
            schemaName="Dataset"
            // loadSchemaFunction={getDatasetSchema}
            // updateFunction={createDataset}
            prepareData={(d) => {
              d.private = false;

              return d;
            }}
            onSuccess={(data) => {
              const name = data.result.name;
              window.open("/dataset/" + name, "_self");
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
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

export default function SearchPage({ pages }) {
  const router =  useRouter()
  const query = router.query
  const [fetchApi, setFetchApi] = useState(null)
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [resource, setResource] = useState([])
  const [aggregations, setAggregations] = useState({})
  const [count, setCount] = useState(0)
  const [pageInfo, setPageInfo] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // const datasetDisclosure = useDisclosure()
  // const [order, setOrder] = useState("score")

  async function getDatasets({q, page}) {
    setIsLoading(true)
    const res = await getSearchDatasets({q:q, page:page})
    setPageInfo({page: page, count: res?.count})
    setIsLoading(false)
    setShowEmptyState(true)
    setResource(res.results || [])
    setAggregations(res.aggregations)
    setCount(res.count)
  }

  useEffect(() => {
    if(fetchApi) clearTimeout(fetchApi)

    const fetchFunc = setTimeout(() => {
      getDatasets({q:query?.q, page: query?.page || 1})
    }, 400)

    setFetchApi(fetchFunc)
  }, [query])

  const DataProposalBox = ({image, display, text, bodyText}) => {
    return (
      <Stack alignItems="center" width="100%" spacing={0} marginTop={!display && "24px !important"}>
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
    return (
      <Database
        id={data.id}
        themes={data?.themes}
        name={data?.name || "Conjunto sem nome"}
        temporalCoverageText={data?.temporal_coverage}
        organization={data.organization[0] || {
          name: data?.organization,
          slug: data?.organization_slug,
          website: data?.organization_website,
          image: data?.organization_picture
        }}
        tables={{
          id: data?.tables?.[0]?.id || data?.first_table_id,
          number: data?.n_bdm_tables
        }}
        rawDataSources={{
          id: data?.first_original_source_id,
          number: data?.n_original_sources
        }}
        informationRequests={{
          id: data?.first_lai_id,
          number: data?.n_lais
        }}
      />
    )
  }

  const SearchQuery = (value) => {
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

      {/* modal para a criacao de datasets */}
      {/* <NewDatasetModal {...datasetDisclosure} />*/}

      <DebouncedControlledInput
        value={query.q}
        onChange={(value) => { SearchQuery(value) }}
        placeholder={useCheckMobile() ? "Palavras-chave, instituições ou temas" :"Pesquise palavras-chave, instituições ou temas"}
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
        marginTop={useCheckMobile() && "70px"}
      />

      <Stack
        spacing={useCheckMobile() ? 10 : 0}
        width="90%"
        maxWidth="1264px"
        margin="auto"
        direction={{ base: "column", lg: "row" }}
      >
        <VStack
          display="none"
          justifyContent="flex-start"
          alignItems="flex-start"
          minWidth={{ base: "100%", lg: "320px" }}
          maxWidth={{ base: "100%", lg: "320px" }}
          borderRight={useCheckMobile() ? "" : "1px solid #DEDFE0"}
          padding={useCheckMobile() ? "" : "0 20px 0 0"}
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

          {/* <CheckboxFilterAccordion
            isActive={(paramFilters.resource_type || []).length > 0}
            alwaysOpen
            choices={[
              {
                key: "bdm_table",
                name: (
                  <HStack whiteSpace="nowrap">
                    <div>Tabelas tratadas</div>
                    <BDLogoPlusImage
                      marginLeft="5px !important"
                      widthImage="40px"
                    />
                    <div>{`(${data?.resource_bdm_table_count || "0"})`}</div>
                  </HStack>
                ),
              },
              {
                key: "external_link",
                name: `Fontes originais (${data?.resource_external_link_count || "0"
                  })`,
              },
              {
                key: "information_request",
                name: `Pedidos LAI (${data?.resource_information_request_count || "0"
                  })`,
              },
            ]}
            values={paramFilters.resource_type}
            valueField="key"
            displayField="name"
            fieldName="Conjuntos com"
            onChange={(values) => {
              setParamFilters({ ...paramFilters, resource_type: values });
            }}
          /> */}

          {/* <CheckboxFilterAccordion
            // canSearch={true}
            // isActive={(paramFilters.group || []).length > 0}
            choices={aggregations?.themes}
            values={aggregations?.themes}
            valueField="key"
            displayField="name"
            fieldName="Tema"
            // onChange={(values) =>
            //   setParamFilters({ ...paramFilters, group: values })
            // }
          /> */}

          {/* <CheckboxFilterAccordion
            canSearch={true}
            isActive={(paramFilters.organization || []).length > 0}
            choices={organizations}
            values={paramFilters.organization}
            valueField="name"
            displayField="displayName"
            fieldName="Organização"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, organization: values })
            }
          />

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={(paramFilters.tag || []).length > 0}
            choices={tags}
            valueField="name"
            displayField="displayName"
            fieldName="Etiqueta"
            values={paramFilters.tag}
            onChange={(values) =>
              setParamFilters({ ...paramFilters, tag: values })
            }
          />

          <SimpleFilterAccordion
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
          />

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={(paramFilters.entity || []).length > 0}
            choices={entities}
            values={paramFilters.entity}
            valueField="name"
            displayField="displayName"
            fieldName="Nível da observação"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, entity: values })
            }
          />

          <CheckboxFilterAccordion
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
          // paddingLeft={isMobileMod() ? "" : "40px !important"}
        >
          {showEmptyState && !resource || resource.length === 0 ?
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

              {/* Button create dataset */}
              {/* {userData?.is_admin && 
                <Button
                  w="170px"
                  backgroundColor="#42B0FF"
                  colorScheme="blue"
                  onClick={datasetDisclosure.onOpen}
                  leftIcon={
                    <Icon>
                      <FontAwesomeIcon icon={faPlus} />
                    </Icon>
                  }
                  marginLeft="auto"
                >
                  Criar Conjunto
                </Button>
              } */}
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
          </>})
        </VStack>
      </Stack>
      <script
        src="/vendor/terminal.js"
        data-termynal-container="#termynal"
      ></script>
    </MainPageTemplate>
  )
}
