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
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { createDataset, searchDatasets } from "../api/datasets";
import {
  getAvailableOptionsTranslations,
  getTranslationsOptions,
  getTranslations,
} from "../api/translations";
import { getDatasetSchema } from "../api/schemas";
import { getUser } from "../api/user";
import { withPages } from "../../hooks/pages.hook";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
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

export async function getStaticProps(context) {
  const translations = await getTranslations();
  const availableOptionsTranslations = await getAvailableOptionsTranslations();
  const optionsTranslations = await getTranslationsOptions();
  return withPages({
    revalidate: 60, //TODO: Increase this timer
    props: {
      translations,
      availableOptionsTranslations,
      optionsTranslations,
    },
  });
}

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
            loadSchemaFunction={getDatasetSchema}
            updateFunction={createDataset}
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
  );
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
  );
}

export default function SearchPage({
  pages,
  availableOptionsTranslations,
  translations,
  optionsTranslations,
}) {
  const { query } = useRouter();
  const isMobile = useCheckMobile();
  const [isMobileMode, setIsMobileMode] = useState(false)
  const datasetDisclosure = useDisclosure();
  const { data: userData = null } = useQuery("user", getUser);
  const [order, setOrder] = useState("score");
  const [search, setSearch] = useState("");
  const [paramFilters, setParamFilters] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);
  const [filterKey, setFilterKey] = useState(0);
  const { data, isLoading } = useQuery(
    ["datasets", search, order, paramFilters, page],
    () => searchDatasets({ search, sort: order, page, paramFilters }),
    {
      onSuccess(data) {
        setPageSize(Math.ceil(data.count / 10));
      },
    }
  );

  useEffect(() => {
    setIsMobileMode(isMobile)
  },[isMobile])

  const DataProposalBox = ({image, display, text, bodyText}) => {
    return (
      <Stack alignItems="center" width="100%" spacing={0} marginTop={!display && "24px !important"}>
        {image && 
          <NotFoundImage
            transform={!isMobileMode && "translateX(-36px)"}
            widthImage="100%"
            heightImage="100%"
            marginBottom="24px"
            marginTop={isMobileMode && "24px"}
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
          spacing={isMobileMode ? 0 : "16px"}
          justifyContent="center"
          alignItems={isMobileMode && "center"}
          flexDirection={isMobileMode && "column"}
          gridGap={isMobileMode && "16px"}
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
  };

  const organizations = data?.organizations
    ? Object.keys(data?.organizations)
      .map((t) => ({
        name: t,
        displayName:
          data.organizations_display_names[t] + ` (${data.organizations[t]})`,
        value: data.organizations[t],
      }))
      .sort((a, b) => b.value - a.value)
    : [];

  const groups = data?.groups
    ? Object.keys(data?.groups)
      .map((t) => ({
        name: t,
        displayName: data.groups_display_names[t] + ` (${data.groups[t]})`,
        value: data.groups[t],
      }))
      .sort((a, b) => b.value - a.value)
    : [];

  const tags = data?.tags
    ? Object.keys(data.tags)
      .map((t) => ({
        name: t,
        displayName: t + ` (${data.tags[t]})`,
        value: data.tags[t],
      }))
      .sort((a, b) => b.value - a.value)
    : [];

  const entities = data?.entities
    ? Object.keys(data.entities)
      .map((t) => ({
        name: t,
        displayName:
        optionsTranslations["Entity"][t] + ` (${data.entities[t]})`,
        value: data.entities[t],
      }))
      .sort((a, b) => b.value - a.value)
    : [];

  const updateFrequencies = data?.update_frequencies
    ? Object.keys(data.update_frequencies)
      .map((t) => ({
        name: t,
        displayName:
        optionsTranslations["Time Unit"][t] + ` (${data.update_frequencies[t]})`,
        value: data.update_frequencies[t],
      }))
      .sort((a, b) => optionsUpdateFrequencies[a.name] - optionsUpdateFrequencies[b.name])
    : [];

    const rawQualityTiers = data?.raw_quality_tiers
    ? Object.keys(data.raw_quality_tiers)
      .map((t) => ({
        name: t,
        displayName:
        optionsTranslations["Raw Quality Tier"][t] + ` (${data.raw_quality_tiers[t]})`,
        value: data.raw_quality_tiers[t],
      }))
      .sort((a, b) => optionsRawQualityTiers[a.name] - optionsRawQualityTiers[b.name])
    : [];

  const spatialCoverages = {
    continent: data?.spatial_coverage_continent
      ? Object.keys(data.spatial_coverage_continent)
        .map((t) => ({
          name: t,
          displayName:
          optionsTranslations["Spatial Coverage"][t] +
            ` (${data.spatial_coverage_continent[t]})`,
          value: data.spatial_coverage_continent[t],
        }))
        .sort((a, b) => b.value - a.value)
      : [],
    country: data?.spatial_coverage_country
      ? Object.keys(data.spatial_coverage_country)
        .map((t) => ({
          name: t,
          displayName:
          optionsTranslations["Spatial Coverage"][t] + ` (${data.spatial_coverage_country[t]})`,
          value: data.spatial_coverage_country[t],
        }))
        .sort((a, b) => b.value - a.value)
      : [],
    admin1: data?.spatial_coverage_admin1
      ? Object.keys(data.spatial_coverage_admin1)
        .map((t) => ({
          name: t,
          displayName:
          optionsTranslations["Spatial Coverage"][t] +
            ` (${data.spatial_coverage_admin1[t]})`,
          value: data.spatial_coverage_admin1[t],
        }))
        .sort((a, b) => b.value - a.value)
      : [],
    /*
    admin2: data?.spatial_coverage_admin2
      ? Object.keys(data.spatial_coverage_admin2)
        .map((t) => ({
          name: t,
          displayName:
            optionsTranslations["Spatial Coverage"][t] +
            ` (${data.spatial_coverage_admin2[t]})`,
          value: data.spatial_coverage_admin2[t],
        }))
        .sort((a, b) => b.value - a.value)
      : [],
    */
  };

  // Loads filter from URL
  useEffect(() => {
    if (query.q) setSearch(decodeURI(query.q));
    if (query.order_by) setOrder(decodeURI(query.order_by));

    if (query.temporal_coverage) {
      const [start, end] = query.temporal_coverage
        .split("-")
        .map((v) => parseFloat(v));
      setParamFilters({
        ...paramFilters,
        temporal_coverage: new Array(end - start).map((_, i) => start + i),
      });
    }

    setParamFilters({
      ...paramFilters,
      tag: query.tag ? query.tag.split(",") : [],
      organization: query.organization ? query.organization.split(",") : [],
      group: query.group ? query.group.split(',') : [],
      resource_type: query.resource_type ? query.resource_type.split(",") : [],
      spatial_coverage: query.spatial_coverage ? query.spatial_coverage.split(",") : [],
      temporal_coverage: query.temporal_coverage ? query.temporal_coverage.split("-") : [],
      entity: query.entity ? query.entity.split(",") : [],
    });

    setFilterKey(filterKey + 1);
  }, [
    query.resource_type,
    query.tag,
    query.organization,
    query.group,
    query.q,
    query.bdPlus,
    query.order,
    query.spatial_coverage,
    query.temporal_coverage,
    query.entity,
  ]);

  useEffect(() => {
    const paramObj = { ...paramFilters, order_by: order, q: search };

    Object.keys(paramObj).forEach((p) => {
      const value = paramObj[p];

      if (value?.length === 0 || value === "") delete paramObj[p];
    });

    // Only add 2000-2005 to url instead of 2000,2001,2002,2003,2004,2005 which can cause error 414
    if (
      paramFilters.temporal_coverage &&
      paramFilters.temporal_coverage.length
    ) {
      paramObj.temporal_coverage = `${paramObj.temporal_coverage[0]}-${paramObj.temporal_coverage[paramObj.temporal_coverage.length - 1]
        }`;
    }

    addParametersToCurrentURL(paramObj);
    setPage(1);
  }, [paramFilters, search, order]);

  const DatabaseCard = ({
    name,
    title,
    imageUrl,
    organization,
    tags,
    resources,
    updatedSince,
    groups,
    isPlus
  }) => {
    const [urlImage, setUrlImage] = useState("")

    useEffect(() => {
      imageUrl.startsWith("https://") ? setUrlImage(imageUrl) : setUrlImage("https://basedosdados.org/uploads/group/" + imageUrl)
    },[])

    return (
      <Database
        link={`/dataset/${name}`}
        name={title || "Conjunto sem nome"}
        image={urlImage}
        organization={organization}
        tags={tags.map((g) => g.name)}
        size={
          resources.filter((r) => r.bdm_file_size).length > 0
            ? resources.filter((r) => r.bdm_file_size)[0]
              .bdm_file_size
            : null
        }
        temporalCoverage={unionArrays(
          resources.filter((r) => r?.temporal_coverage?.length)
            .map((r) => r.temporal_coverage)
        ).sort()}
        tableNum={
          resources.filter(
            (r) => r.resource_type === "bdm_table"
          ).length
        }
        externalLinkNum={
          resources.filter(
            (r) => r.resource_type === "external_link"
          ).length
        }
        informationRequestNum={
          resources.filter(
            (r) => r.resource_type === "information_request"
          ).length
        }
        updatedSince={updatedSince}
        updatedAuthor="Ricardo Dahis"
        categories={groups.map((g) => [g.name, g.display_name])}
        spatialCoverage={null}
        updateFrequency={
          resources.filter((r) => r.update_frequency).length >
            0
            ? resources.filter((r) => r.update_frequency)[0]
              .update_frequency
            : null
        }
        isPlus={isBdPlus(isPlus)}
      />
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

      <NewDatasetModal {...datasetDisclosure} />
      <DebouncedControlledInput
        value={search}
        onChange={(val) => setSearch(val)}
        placeholder={isMobileMode ? "Palavras-chave, instituições ou temas" :"Pesquise palavras-chave, instituições ou temas"}
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
        marginTop={isMobileMode && "70px"}
      />

      <Stack
        spacing={isMobileMode ? 10 : 0}
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
          borderRight={isMobileMode ? "" : "1px solid #DEDFE0"}
          padding={isMobileMode ? "" : "0 20px 0 0"}
          key={filterKey}
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
          />

          <CheckboxFilterAccordion
            canSearch={true}
            isActive={(paramFilters.group || []).length > 0}
            choices={groups}
            values={paramFilters.group}
            valueField="name"
            displayField="displayName"
            fieldName="Tema"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, group: values })
            }
          />

          <CheckboxFilterAccordion
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

              {/* <CheckboxFilterAccordion
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
              /> */}
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
          />
        </VStack>
        <VStack
          alignItems="flex-start"
          overflow="hidden"
          width="100%"
          paddingLeft={isMobileMode ? "" : "40px"}
        >
          {data?.datasets.length === 0 ?
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
                {data?.count || "..."} {`conjunto${data?.count > 1 ? "s": ""} encontrado${data?.count > 1 ? "s": ""}`}
                {search ? " para " + search : ""}
              </Heading>

              {userData?.is_admin && 
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
              }
            </Flex>

            <Stack
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
            </Stack>

            <HStack
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
            </HStack>

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
                        height="130px"
                        borderRadius="12px"
                        startColor="#F0F0F0"
                        endColor="#F0F0F0"
                      />
                      <Divider />
                    </>
                ))
                : (data?.datasets || []).map((d) => (
                  <>
                    <DatabaseCard 
                      name={d.name}
                      title={d.title}
                      imageUrl={d.organization.image_url}
                      organization={d.organization}
                      tags={d.tags}
                      resources={d.resources}
                      updatedSince={d.metadata_modified}
                      groups={d.groups}
                      isPlus={d}
                    />
                    <Divider border="0" borderBottom="1px solid #DEDFE0" opacity={1}/>
                  </>
                ))}
              <ReactPaginate
                previousLabel={isMobileMode ? "<" : "Anterior"}
                nextLabel={isMobileMode ? ">" : "Próxima"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                forcePage={page - 1}
                pageCount={pageSize}
                marginPagesDisplayed={isMobileMode ? 0 : 1}
                pageRangeDisplayed={isMobileMode ? 0 : 2}
                onPageChange={(data) => {
                  setPage(data.selected + 1);
                }}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            </VStack>
            
            {pageSize === 1 &&
              <DataProposalBox 
                text= "Ainda não encontrou o que está procurando?"
                bodyText= "Tente pesquisar por termos relacionados ou proponha novos dados para adicionarmos na BD."
              />
            }
            {page >= 2 &&
              <DataProposalBox 
                text= "Ainda não encontrou o que está procurando?"
                bodyText= "Tente pesquisar por termos relacionados ou proponha novos dados para adicionarmos na BD."
              />
            }
          </>
          }
          )
        </VStack>
      </Stack>
      <script
        src="/vendor/terminal.js"
        data-termynal-container="#termynal"
      ></script>
    </MainPageTemplate>
  );
}
