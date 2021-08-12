import { VStack, Box, Stack, HStack, Image } from "@chakra-ui/react";
import { MainPageTemplate } from "../../components/templates/main";
import { withStrapiPages } from "../../hooks/strapi.hook";
import { listDatasets, showDataset } from "../api/datasets";
import SectionTitle from "../../components/atoms/SectionTitle";
import SectionText from "../../components/atoms/SectionText";
import Title from "../../components/atoms/Title";
import { CategoryIcon } from "../../components/atoms/CategoryIcon";
import BigTitle from "../../components/atoms/BigTitle";
import { SelectFilterAccordion } from "../../components/atoms/FilterAccordion";
import { useState } from "react";

export async function getStaticProps(context) {
  const dataset = await showDataset(context.params.dataset);
  const resources = dataset["resources"];
  const bdmTables = resources.filter((r) => r.resource_type === "bdm_table");
  const externalLinks = resources.filter(
    (r) => r.resource_type === "external_link"
  );

  return await withStrapiPages({
    props: {
      dataset,
      bdmTables,
      externalLinks,
      isPlus: dataset.download_type === "BD Mais",
    },
    revalidate: 30, //TODO: Increase this timer
  });
}

export async function getStaticPaths(context) {
  let datasets = await listDatasets();

  return {
    paths: datasets.map((d) => ({
      params: { dataset: d },
    })),
    fallback: "blocking",
  };
}

function BdmTablePage({ resource }) {
  return (
    <VStack
      width="100%"
      border="1px solid #DEDFE0"
      borderRadius="20px"
      padding="20px"
      alignItems="flex-start"
      spacing={7}
    >
      <Title>{resource.name}</Title>
      <VStack spacing={0} alignItems="flex-start">
        <SectionText>
          <b>Descrição</b>
        </SectionText>
        <SectionText fontSize="16px">
          {resource.description || "Nenhuma descrição fornecida."}
        </SectionText>
      </VStack>
      <VStack spacing={0} alignItems="flex-start">
        <SectionText>
          <b>Coluna</b>
        </SectionText>
        <SectionText fontSize="16px">
          {resource.description || "Nenhuma descrição fornecida."}
        </SectionText>
      </VStack>
    </VStack>
  );
}

export default function DatasetPage({
  dataset,
  bdmTables,
  externalLinks,
  strapiPages,
  isPlus,
}) {
  const [resource, setResource] = useState(
    bdmTables.length > 0 ? bdmTables[0] : externalLinks[0]
  );

  function getResourcePage() {
    switch (resource.resource_type) {
      case "bdm_table":
        return <BdmTablePage resource={resource} />;

      case "external_link":
        return <BdmTablePage resource={resource} />;

      default:
        return <BdmTablePage resource={resource} />;
    }
  }

  return (
    <MainPageTemplate strapiPages={strapiPages}>
      <Stack
        direction={{ base: "column", lg: "row" }}
        width={{ base: "90%", lg: "85%" }}
        margin="auto"
        spacing={20}
      >
        <VStack alignItems="flex-start" spacing={6}>
          <Image
            borderRadius="31.8889px"
            boxShadow="0px 0px 10px rgba(0,0,0,0.25)"
            minWidth="200px"
            minHeight="200px"
            borderRadius="31px"
            objectFit="contain"
            src={
              "https://basedosdados.org/uploads/group/" +
              dataset.organization.image_url
            }
          />
          <Stack spacing={6} direction={{ base: "row", lg: "column" }}>
            <VStack alignItems="flex-start">
              <Title>Organização</Title>
              <SectionText>{dataset.organization.title}</SectionText>
            </VStack>
            <VStack alignItems="flex-start">
              <Title paddingTop="">Temas</Title>
              {dataset.groups.map((g) => (
                <HStack key={g.name}>
                  <CategoryIcon
                    size="39px"
                    url={`/_nxt/img/categories/icone_${g.name}${
                      isPlus ? "-1" : ""
                    }.svg`}
                  />
                  <SectionText>{g.display_name}</SectionText>
                </HStack>
              ))}
            </VStack>
          </Stack>
        </VStack>
        <VStack spacing={5} alignItems="flex-start">
          <BigTitle fontSize="30px" color="black">
            {dataset.title}
          </BigTitle>
          <SectionText textAlign="left">{dataset.notes}</SectionText>
          <Stack
            paddingTop="20px"
            direction={{ base: "column", lg: "row" }}
            spacing={10}
            width="100%"
          >
            <VStack minWidth="200px" spacing={5}>
              <SelectFilterAccordion
                choices={bdmTables}
                valueField="name"
                displayField="name"
                fieldName="Tabelas"
              />
              <SelectFilterAccordion
                choices={[]}
                valueField="name"
                displayField="display_name"
                fieldName="Links Externos"
              />
            </VStack>
            {getResourcePage()}
          </Stack>
        </VStack>
      </Stack>
    </MainPageTemplate>
  );
}
