import {
  VStack,
  Heading,
  HStack,
  Text,
  Divider,
  Stack,
  CircularProgress,
  Center,
  Select,
  AbsoluteCenter,
} from "@chakra-ui/react";
import SectionTitle from "../components/atoms/SectionTitle";
import SiteHead from "../components/atoms/SiteHead";
import Footer from "../components/molecules/Footer";
import Menu from "../components/molecules/Menu";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { searchDatasets } from "./api/datasets";
import ControlledInput, {
  DebouncedControlledInput,
} from "../components/atoms/ControlledInput";
import { Database } from "../components/organisms/Database";
import { CheckboxFilterAccordion } from "../components/atoms/FilterAccordion";
import { getOrganizationList } from "./api/organizations";
import { getGroupList } from "./api/groups";
import { getTagList } from "./api/tags";
import { withStrapiPages } from "../hooks/strapi.hook";
import { MainPageTemplate } from "../components/templates/main";

export async function getStaticProps(context) {
  let { data: organizations } = await getOrganizationList();
  let { data: groups } = await getGroupList();
  let { data: tags } = await getTagList();

  return withStrapiPages({
    props: {
      organizations: organizations.result,
      groups: groups.result,
      tags: tags.result,
    },
    revalidate: 60, //TODO: Increase this timer
  });
}

export default function SearchPage({
  strapiPages,
  organizations,
  groups,
  tags,
}) {
  const { query } = useRouter();
  const orderQuery = decodeURI(query.order_by || "score desc");
  const [order, setOrder] = useState(orderQuery);
  const [search, setSearch] = useState("");
  const [paramFilters, setParamFilters] = useState({});
  const [filterKey, setFilterKey] = useState(0);
  const { data, isLoading } = useQuery(
    ["datasets", search, order, paramFilters],
    () => searchDatasets({ search, sort: order, paramFilters })
  );

  useEffect(() => {
    setSearch(decodeURI(query.q || ""));
    setParamFilters({
      ...paramFilters,
      tags: query.tag ? [query.tag] : [],
      organization: query.organization ? [query.organization] : [],
      groups: query.group ? [query.group] : [],
    });

    setFilterKey(filterKey + 1);
  }, [query.tag, query.organization, query.group]);

  return (
    <MainPageTemplate strapiPages={strapiPages}>
      <HStack
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={10}
        width="90%"
        margin="auto"
      >
        <VStack
          justifyContent="flex-start"
          alignItems="flex-start"
          minWidth="300px"
          maxWidth="300px"
          key={filterKey}
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
          <CheckboxFilterAccordion
            choices={organizations}
            values={paramFilters.organization}
            valueField="name"
            displayField="display_name"
            fieldName="Organização"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, organization: values })
            }
          />
          <CheckboxFilterAccordion
            choices={groups}
            values={paramFilters.groups}
            valueField="name"
            displayField="display_name"
            fieldName="Temas"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, groups: values })
            }
          />
          <CheckboxFilterAccordion
            choices={tags}
            valueField="name"
            displayField="display_name"
            fieldName="Tags"
            values={paramFilters.tags}
            onChange={(values) =>
              setParamFilters({ ...paramFilters, tags: values })
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
                      link={`/_nxt/dataset/${d.id}`}
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
                      spatialCoverage={null}
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
      <script
        src="/_nxt/vendor/terminal.js"
        data-termynal-container="#termynal"
      ></script>
    </MainPageTemplate>
  );
}
