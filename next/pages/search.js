import {
  Input,
  VStack,
  Heading,
  HStack,
  Text,
  Divider,
  Link,
  InputGroup,
  InputRightElement,
  Stack,
  AbsoluteCenter,
  CircularProgress,
  Center,
  Image,
  Box,
  Select,
} from "@chakra-ui/react";
import SectionTitle from "../components/atoms/SectionTitle";
import SiteHead from "../components/atoms/SiteHead";
import Footer from "../components/molecules/Footer";
import Menu from "../components/molecules/Menu";
import { useRouter } from "next/router";
import { Dot } from "../components/atoms/Dot";
import Subtitle from "../components/atoms/Subtitle";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CategoryIcon } from "../components/atoms/CategoryIcon";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getDatasets } from "./api/datasets";
import { getStrapiPages } from "./api/strapi";
import ControlledInput from "../components/atoms/ControlledInput";
import { Database } from "../components/organisms/Database";
import _ from "lodash";
import {
  FilterAccordion,
  SelectFilterAccordion,
} from "../components/atoms/FilterAccordion";
import { getOrganizationList } from "./api/organizations";
import { getGroupList } from "./api/groups";
import { getTagList } from "./api/tags";

export async function getStaticProps(context) {
  let { data: strapiPages } = await getStrapiPages();
  let { data: organizations } = await getOrganizationList();
  let { data: groups } = await getGroupList();
  let { data: tags } = await getTagList();

  return {
    props: {
      strapiPages,
      organizations: organizations.result,
      groups: groups.result,
      tags: tags.result,
    },
    revalidate: 60, //TODO: Increase this timer
  };
}

export default function SearchPage({
  strapiPages,
  organizations,
  groups,
  tags,
}) {
  const { query } = useRouter();
  const searchQuery = decodeURI(query.q || "");
  const orderQuery = decodeURI(query.order_by || "score desc");
  const [order, setOrder] = useState(orderQuery);
  const [search, setSearch] = useState(searchQuery);
  const [paramFilters, setParamFilters] = useState({});
  const [_search, _setSearch] = useState(searchQuery); // For debouncing
  const { data, isLoading } = useQuery(
    ["datasets", search, order, paramFilters],
    () => getDatasets({ search, sort: order, paramFilters })
  );

  const debouncedSetSearch = useCallback(
    _.debounce((value) => setSearch(value), 500),
    []
  );

  return (
    <VStack width="100%" backgroundColor="#FAFAFA">
      <SiteHead />
      <Menu strapiPages={strapiPages} />
      <HStack
        paddingTop="120px"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={10}
        width="90%"
      >
        <VStack
          justifyContent="flex-start"
          alignItems="flex-start"
          minWidth="300px"
          maxWidth="300px"
        >
          <SectionTitle
            fontSize="16px"
            textAlign="top"
            padding="16px 20px"
            borderRadius="20px"
            color="white"
            backgroundColor="#2B8C4D"
            width="100%"
          >
            Filtrar por
          </SectionTitle>
          <SelectFilterAccordion
            choices={organizations}
            valueField="name"
            displayField="display_name"
            fieldName="Organização"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, organization: values })
            }
          />
          <SelectFilterAccordion
            choices={groups}
            valueField="name"
            displayField="display_name"
            fieldName="Temas"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, groups: values })
            }
          />
          <SelectFilterAccordion
            choices={tags}
            valueField="name"
            displayField="display_name"
            fieldName="Tags"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, tags: values })
            }
          />
        </VStack>
        <VStack alignItems="flex-start" spacing={5} width="100%">
          <ControlledInput
            value={_search}
            onChange={(val) => {
              _setSearch(val);
              debouncedSetSearch(val);
            }}
            flex="3"
            placeholder="Pesquisar palavras-chave, instituições e temas"
            justifyContent="center"
            inputStyle={{
              padding: "25px",
              borderRadius: "20px",
              backgroundColor: "#ffffff",
              fontSize: "18px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            }}
          />
          {isLoading ? (
            <Center width="100%" height="500px">
              <CircularProgress isIndeterminate />
            </Center>
          ) : (
            <>
              <Heading
                fontFamily="Ubuntu"
                fontSize="30px"
                fontWeight="400"
                paddingTop="20px"
                letterSpacing="0.1em"
              >
                {data?.count} itens encontrados{" "}
                {search ? " para " + search : ""}
              </Heading>
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
                    <option value="score desc">Relevância</option>
                    <option value="views_recent desc">Recente</option>
                    <option value="metadata_modified desc">
                      Última Atualização
                    </option>
                  </Select>
                </Stack>
              </HStack>
              <VStack
                width="100%"
                alignItems="flex-start"
                spacing={10}
                padding="60px 0px"
              >
                {(data?.results || []).map((d) => (
                  <>
                    <Database
                      link={`/dataset/${d.name}`}
                      name={d.title}
                      image={
                        "https://basedosdados.org/uploads/group/" +
                        d.organization.image_url
                      }
                      organization={d.organization.title}
                      tags={d.tags.map((g) => g.name)}
                      size={
                        d.resources.filter((r) => r.size).length > 0
                          ? d.resources.filter((r) => r.size)[0].size
                          : null
                      }
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
                      spatialCoverage={
                        d.resources.filter((r) => r.spatial_coverage).length > 0
                          ? d.resources.filter((r) => r.spatial_coverage)[0]
                              .spatial_coverage
                          : null
                      }
                      updateFrequency={
                        d.resources.filter((r) => r.update_frequency).length > 0
                          ? d.resources.filter((r) => r.update_frequency)[0]
                              .update_frequency
                          : null
                      }
                      isPlus={d.download_type === "BD Mais"}
                    />
                    <Divider />
                  </>
                ))}
              </VStack>
            </>
          )}
        </VStack>
      </HStack>
      <Footer />
      <script
        src="/_nxt/vendor/terminal.js"
        data-termynal-container="#termynal"
      ></script>
    </VStack>
  );
}
