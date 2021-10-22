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
import { CheckboxFilterAccordion } from "../../components/atoms/FilterAccordion";
import { withStrapiPages } from "../../hooks/strapi.hook";
import { MainPageTemplate } from "../../components/templates/main";
import { isBdPlus, unionArrays } from "../../utils";
import { Tag } from "../../components/atoms/Tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { SchemaForm } from "../../components/molecules/SchemaForm";
import { getDatasetSchema } from "../api/schemas";
import UserContext from "../../context/user";
import { getUser } from "../api/user";

export async function getStaticProps(context) {
  return withStrapiPages({
    revalidate: 60, //TODO: Increase this timer
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

export default function SearchPage({ strapiPages }) {
  const { query } = useRouter();
  const datasetDisclosure = useDisclosure();
  const orderQuery = decodeURI(query.order_by || "score");
  const { data: userData = null } = useQuery("user", getUser);
  const [order, setOrder] = useState(orderQuery);
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

  useEffect(() => {
    if (query.q) setSearch(decodeURI(query.q));

    setParamFilters({
      ...paramFilters,
      tag: query.tag ? [query.tag] : [],
      organization: query.organization ? [query.organization] : [],
      group: query.group ? [query.group] : [],
      resource_type: query.bdPlus ? ["bdm_table"] : [],
    });

    setFilterKey(filterKey + 1);
  }, [query.tag, query.organization, query.group, query.q, query.bdPlus]);

  useEffect(() => {
    setPage(1);
  }, [paramFilters, search]);

  return (
    <MainPageTemplate strapiPages={strapiPages}>
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
            onChange={(values) =>
              setParamFilters({ ...paramFilters, resource_type: values })
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
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.20)",
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
            <Stack spacing={3} direction={{ base: "column", lg: "row" }}>
              {Object.entries(paramFilters)
                .filter(([k, v]) => v.length > 0)
                .map(([k, values]) => (
                  <>
                    <Text
                      fontFamily="Lato"
                      letterSpacing="0.1em"
                      fontWeight="100"
                      fontSize="16px"
                      color="#6F6F6F"
                    >
                      {fieldTranslations[k]}:
                    </Text>
                    <Stack direction={{ base: "column", lg: "row" }}>
                      {values.map((v) => (
                        <Tag
                          whiteSpace="nowrap"
                          onClick={() => {
                            let newArr = [...values];
                            newArr.splice(values.indexOf(v), 1);
                            setParamFilters({ ...paramFilters, [k]: newArr });
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
