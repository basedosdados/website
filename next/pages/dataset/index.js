import {
  VStack,
  Heading,
  HStack,
  Text,
  Divider,
  Stack,
  Select,
  Image,
  Skeleton,
  Flex,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import SectionTitle from "../../components/atoms/SectionTitle";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { createDataset, searchDatasets } from "../api/datasets";
import { DebouncedControlledInput } from "../../components/atoms/ControlledInput";
import { Database } from "../../components/organisms/Database";
import {
  CheckboxFilterAccordion,
  RangeFilterAccordion,
} from "../../components/atoms/FilterAccordion";
import { withPages } from "../../hooks/pages.hook";
import { MainPageTemplate } from "../../components/templates/main";
import { addParametersToCurrentURL, isBdPlus, unionArrays } from "../../utils";
import { Tag } from "../../components/atoms/Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { SchemaForm } from "../../components/molecules/SchemaForm";
import { getDatasetSchema } from "../api/schemas";
import { getUser } from "../api/user";
import {
  getAvailableOptionsTranslations,
  getTranslations,
} from "../api/translations";

export async function getStaticProps(context) {
  const translations = await getTranslations();
  const availableOptionsTranslations = await getAvailableOptionsTranslations();
  return withPages({
    revalidate: 60, //TODO: Increase this timer
    props: {
      translations,
      availableOptionsTranslations,
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
}) {
  return (
    <>
      <Text
        fontFamily="Lato"
        letterSpacing="0.1em"
        fontWeight="100"
        fontSize="16px"
        color="#6F6F6F"
      >
        {label}
      </Text>
      <Stack direction={{ base: "column", lg: "row" }}>
        {values.map((v) => (
          <Tag
            whiteSpace="nowrap"
            onClick={() => {
              let newArr = [...values];
              newArr.splice(values.indexOf(v), 1);
              setParamFilters({ ...paramFilters, [fieldName]: newArr });
            }}
            hover={false}
            backgroundColor="#7D7D7D"
            color="white"
            borderRadius="7px"
            padding="5px 8px"
            cursor="pointer"
          >
            <b>{v} x</b>
          </Tag>
        ))}
      </Stack>
    </>
  );
}

export default function SearchPage({
  pages,
  availableOptionsTranslations,
  translations,
}) {
  const { query } = useRouter();
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

  const fieldTranslations = {
    organization: "Organização",
    tag: "Tag",
    group: "Tema",
    resource_type: "Forma de consulta",
    temporal_coverage: "Cobertura temporal",
    entity: "Entidade",
    spatial_coverage: "Cobertura espacial",
    update_frequency: "Frequência de atualização",
  };

  const organizations = data?.organizations
    ? Object.keys(data?.organizations)
        .map((o) => ({
          name: o,
          displayName:
            data.organizations_display_names[o] + ` (${data.organizations[o]})`,
          value: data.organizations[o],
        }))
        .sort((a, b) => b.value - a.value)
    : [];

  const groups = data?.groups
    ? Object.keys(data?.groups)
        .map((o) => ({
          name: o,
          displayName: data.groups_display_names[o] + ` (${data.groups[o]})`,
          value: data.groups[o],
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
            availableOptionsTranslations[t] + ` (${data.entities[t]})`,
          value: t,
        }))
        .sort((a, b) => b.value - a.value)
    : [];

  const updateFrequencies = data?.update_frequencies
    ? Object.keys(data.update_frequencies)
        .map((t) => ({
          name: t,
          displayName:
            availableOptionsTranslations[t] +
            ` (${data.update_frequencies[t]})`,
          value: t,
        }))
        .sort((a, b) => b.value - a.value)
    : [];

  const spatialCoverages = {
    Continente: data?.spatial_coverage_continent
      ? Object.keys(data.spatial_coverage_continent)
          .map((t) => ({
            name: t,
            displayName:
              availableOptionsTranslations[t] +
              ` (${data.spatial_coverage_continent[t]})`,
            value: t,
          }))
          .sort((a, b) => b.value - a.value)
      : [],
    País: data?.spatial_coverage_country
      ? Object.keys(data.spatial_coverage_country)
          .map((t) => ({
            name: t,
            displayName:
              availableOptionsTranslations[t] +
              ` (${data.spatial_coverage_country[t]})`,
            value: t,
          }))
          .sort((a, b) => b.value - a.value)
      : [],
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
      organization: query.organization ? [query.organization] : [],
      group: query.group ? [query.group] : [],
      resource_type: query.resource_type ? [query.resource_type] : [],
      entity: query.entity ? [query.entity] : [],
      spatial_coverage: query.spatial_coverage ? [query.spatial_coverage] : [],
      temporal_coverage: query.temporal_coverage
        ? query.temporal_coverage.split("-")
        : [],
    });

    setFilterKey(filterKey + 1);
  }, [
    query.tag,
    query.organization,
    query.group,
    query.q,
    query.bdPlus,
    query.order,
    query.temporal_coverage,
    query.entity,
    query.spatial_coverage,
  ]);

  useEffect(() => {
    const paramObj = { ...paramFilters, order_by: order };

    Object.keys(paramObj).forEach((p) => {
      const value = paramObj[p];

      if (value?.length === 0 || value === "") delete paramObj[p];
    });

    // Only add 2000-2005 to url instead of 2000,2001,2002,2003,2004,2005 which can cause error 414
    if (
      paramFilters.temporal_coverage &&
      paramFilters.temporal_coverage.length
    ) {
      paramObj.temporal_coverage = `${paramObj.temporal_coverage[0]}-${
        paramObj.temporal_coverage[paramObj.temporal_coverage.length - 1]
      }`;
    }

    addParametersToCurrentURL(paramObj);
    setPage(1);
  }, [paramFilters, search, order]);

  return (
    <MainPageTemplate pages={pages}>
      <NewDatasetModal {...datasetDisclosure} />
      <Stack
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={10}
        width="85%"
        margin="auto"
        direction={{ base: "column", lg: "row" }}
      >
        <VStack
          justifyContent="flex-start"
          alignItems="flex-start"
          minWidth={{ base: "100%", lg: "300px" }}
          maxWidth={{ base: "100%", lg: "300px" }}
          key={filterKey}
        >
          <SectionTitle
            fontSize="16px"
            textAlign="top"
            color="#252A32"
            fontWeigth="300"
            width="100%"
            height="50px"
            paddingLeft="20px"
            justifyContent="flex-start"
            alignItems="center"
            display="flex"
          >
            Filtrar resultados por
          </SectionTitle>
          <CheckboxFilterAccordion
            isActive={(paramFilters.resource_type || []).length > 0}
            alwaysOpen
            choices={[
              {
                key: "bdm_table",
                name: (
                  <HStack whiteSpace="nowrap">
                    <div>Tabelas tratadas</div>
                    <Image height="30px" src="/img/logo_plus.png" />{" "}
                    <div>{`(${data?.resource_bdm_table_count || "0"})`}</div>
                  </HStack>
                ),
              },
              {
                key: "external_link",
                name: `Links externos (${
                  data?.resource_external_link_count || "0"
                })`,
              },
            ]}
            values={paramFilters.resource_type}
            valueField="key"
            displayField="name"
            fieldName="Forma de consulta"
            onChange={(values) => {
              setParamFilters({ ...paramFilters, resource_type: values });
            }}
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
            isActive={(paramFilters.group || []).length > 0}
            choices={groups}
            values={paramFilters.group}
            valueField="name"
            displayField="displayName"
            fieldName="Temas"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, group: values })
            }
          />
          <CheckboxFilterAccordion
            canSearch={true}
            isActive={(paramFilters.tag || []).length > 0}
            choices={tags}
            valueField="name"
            displayField="displayName"
            fieldName="Tags"
            values={paramFilters.tag}
            onChange={(values) =>
              setParamFilters({ ...paramFilters, tag: values })
            }
          />
          <CheckboxFilterAccordion
            canSearch={true}
            isActive={(paramFilters.spatial_coverage || []).length > 0}
            choices={[...spatialCoverages.Continente, ...spatialCoverages.País]}
            values={paramFilters.spatial_coverage}
            valueField="name"
            displayField="displayName"
            fieldName="Cobertura espacial"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, spatial_coverage: values })
            }
          />
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
              if (val.min < 1000 || !val.min || val.max < 1000 || !val.max)
                return;

              const start = parseInt(val.min || val.max);
              const range =
                Math.max((val.max || val.min) - (val.min || val.max), 0) + 1;

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
            fieldName="Entidade"
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
        </VStack>
        <VStack alignItems="flex-start" spacing={5} width="100%">
          <DebouncedControlledInput
            value={search}
            onChange={(val) => {
              setSearch(val);
            }}
            flex="3"
            placeholder="Pesquise palavras-chave, instituições e temas"
            justifyContent="center"
            inputStyle={{
              padding: "20px",
              borderRadius: "17px",
              backgroundColor: "#ffffff",
              color: "#6F6F6F",
              fontSize: "16px",
              fontWeight: 500,
              height: "50px",
              boxShadow: "0 2px 5px 1px rgba(64, 60, 67, 0.16) !important",
            }}
          />
          <>
            <Flex width="100%" justify="center" align="baseline">
              <Heading
                width="100%"
                fontFamily="Ubuntu"
                fontSize="30px"
                fontWeight="400"
                paddingTop="20px"
                letterSpacing="0.1em"
              >
                {data?.count || "..."} conjunto(s) encontrado(s){" "}
                {search ? " para " + search : ""}
              </Heading>
              {userData?.is_admin ? (
                <Button
                  w="170px"
                  backgroundColor="#3AA1EB"
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
              ) : (
                <></>
              )}
            </Flex>
            <Stack
              overflowX="scroll"
              width="60vw"
              whiteSpace="nowrap"
              paddingBottom="10px"
              spacing={3}
              direction={{ base: "column", lg: "row" }}
            >
              {Object.entries(paramFilters)
                .filter(([k, v]) => v.length > 0)
                .map(([k, values]) => (
                  <FilterTags
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
              letterSpacing="0.1em"
              fontWeight="100"
              fontSize="16px"
              color="#6F6F6F"
            >
              <Stack
                alignItems="center"
                direction={{ base: "column", md: "row" }}
                spacing={5}
              >
                <Text whiteSpace="nowrap">Ordenar por:</Text>
                <Select
                  fontWeight="bold"
                  fontFamily="Lato"
                  minWidth="200px"
                  color="black"
                  borderRadius="20px"
                  height="45px"
                  value={order}
                  onChange={(event) => {
                    setOrder(event.target.value);
                  }}
                >
                  <option value="score">Relevância</option>
                  <option value="recent">Recente</option>
                  <option value="popular">Populares</option>
                </Select>
              </Stack>
            </HStack>
            <VStack
              width="100%"
              alignItems="flex-start"
              spacing={3}
              padding="30px 0px"
            >
              {isLoading
                ? new Array(10).fill(0).map(() => (
                    <>
                      <Skeleton width="100%" height="130px" /> <Divider />
                    </>
                  ))
                : (data?.datasets || []).map((d) => (
                    <>
                      <Database
                        link={`/dataset/${d.name}`}
                        name={d.title || "Conjunto sem nome"}
                        image={
                          "https://basedosdados.org/uploads/group/" +
                          d.organization.image_url
                        }
                        organization={d.organization}
                        tags={d.tags.map((g) => g.name)}
                        size={
                          d.resources.filter((r) => r.bdm_file_size).length > 0
                            ? d.resources.filter((r) => r.bdm_file_size)[0]
                                .bdm_file_size
                            : null
                        }
                        temporalCoverage={unionArrays(
                          d.resources
                            .filter((r) => r?.temporal_coverage?.length)
                            .map((r) => r.temporal_coverage)
                        ).sort()}
                        tableNum={
                          d.resources.filter(
                            (r) => r.resource_type === "bdm_table"
                          ).length
                        }
                        externalLinkNum={
                          d.resources.filter(
                            (r) => r.resource_type === "external_link"
                          ).length
                        }
                        updatedSince={d.metadata_modified}
                        updatedAuthor="Ricardo Dahis"
                        categories={d.groups.map((g) => g.name)}
                        categoriesDisplay={d.groups.map((g) => g.display_name)}
                        spatialCoverage={null}
                        updateFrequency={
                          d.resources.filter((r) => r.update_frequency).length >
                          0
                            ? d.resources.filter((r) => r.update_frequency)[0]
                                .update_frequency
                            : null
                        }
                        isPlus={isBdPlus(d)}
                      />
                      <Divider />
                    </>
                  ))}
              <ReactPaginate
                previousLabel={"Anterior"}
                nextLabel={"Próxima"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                forcePage={page - 1}
                pageCount={pageSize}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={(data) => {
                  setPage(data.selected + 1);
                }}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            </VStack>
          </>
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
