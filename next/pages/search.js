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
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { searchDatasets } from "./api/datasets";
import ControlledInput, {
  DebouncedControlledInput,
} from "../components/atoms/ControlledInput";
import { Database } from "../components/organisms/Database";
import { CheckboxFilterAccordion } from "../components/atoms/FilterAccordion";
import { withStrapiPages } from "../hooks/strapi.hook";
import { MainPageTemplate } from "../components/templates/main";

export async function getStaticProps(context) {
  return withStrapiPages({
    revalidate: 60, //TODO: Increase this timer
  });
}

export default function SearchPage({ strapiPages }) {
  const { query } = useRouter();
  const orderQuery = decodeURI(query.order_by || "score");
  const [order, setOrder] = useState(orderQuery);
  const [search, setSearch] = useState("");
  const [paramFilters, setParamFilters] = useState({});
  const [filterKey, setFilterKey] = useState(0);
  const { data, isLoading } = useQuery(
    ["datasets", search, order, paramFilters],
    () => searchDatasets({ search, sort: order, paramFilters })
  );
  const organizations = data?.organizations
    ? Object.keys(data?.organizations).map((o) => ({
        name: o,
        displayName:
          data.organizations_display_names[o] + ` (${data.organizations[o]})`,
      }))
    : [];

  const groups = data?.groups
    ? Object.keys(data?.groups).map((o) => ({
        name: o,
        displayName: data.groups_display_names[o] + ` (${data.groups[o]})`,
      }))
    : [];

  const tags = data?.tags
    ? Object.keys(data.tags).map((t) => ({
        name: t,
        displayName: t + ` (${data.tags[t]})`,
      }))
    : [];

  useEffect(() => {
    if (query.q) setSearch(decodeURI(query.q));

    setParamFilters({
      ...paramFilters,
      tag: query.tag ? [query.tag] : [],
      organization: query.organization ? [query.organization] : [],
      group: query.group ? [query.group] : [],
    });

    setFilterKey(filterKey + 1);
  }, [query.tag, query.organization, query.group, query.q]);

  return (
    <MainPageTemplate strapiPages={strapiPages}>
      <HStack
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={10}
        width="85%"
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
            borderRadius="20px"
            color="white"
            backgroundColor="#2B8C4D"
            width="100%"
            height="50px"
            paddingLeft="20px"
            justifyContent="flex-start"
            alignItems="center"
            display="flex"
          >
            Filtrar por
          </SectionTitle>
          <CheckboxFilterAccordion
            isActive={(paramFilters.download_type || []).length > 0}
            choices={[
              {
                name: "BD Mais",
              },
              { name: "Link Externo" },
            ]}
            values={paramFilters.download_type}
            valueField="name"
            displayField="name"
            fieldName="Forma de Download"
            onChange={(values) =>
              setParamFilters({ ...paramFilters, download_type: values })
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
              height: "50px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.20)",
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
                    <option value="score">Relevância</option>
                    <option value="recent">Recente</option>
                    <option value="popular">Poupulares</option>
                  </Select>
                </Stack>
              </HStack>
              <VStack
                width="100%"
                alignItems="flex-start"
                spacing={3}
                padding="60px 0px"
              >
                {(data?.datasets || []).map((d) => (
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
