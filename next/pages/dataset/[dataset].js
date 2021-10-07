import { VStack, Stack, HStack, Image, Flex } from "@chakra-ui/react";
import Head from "next/head";
import { MainPageTemplate } from "../../components/templates/main";
import { withStrapiPages } from "../../hooks/strapi.hook";
import {
    createResource,
    listDatasets,
    showDataset,
    updateResource,
} from "../api/datasets";
import SectionText from "../../components/atoms/SectionText";
import Title from "../../components/atoms/Title";
import { CategoryIcon } from "../../components/atoms/CategoryIcon";
import BigTitle from "../../components/atoms/BigTitle";
import { FilterAccordion } from "../../components/atoms/FilterAccordion";
import { useContext, useState } from "react";
import { isBdPlus } from "../../utils";
import Link from "../../components/atoms/Link";
import { SimpleButton } from "../../components/atoms/SimpleButton";
import { Markdown } from "../../components/atoms/Markdown";
import { getTranslations } from "../api/translations";
import { ExternalLinkPage } from "../../components/organisms/ExternalLinkPage";
import { BdmTablePage } from "../../components/organisms/BdmTablePage";
import { MetadataPage } from "../../components/organisms/MetadataPage";
import UserContext from "../../context/user";
import { SchemaForm } from "../../components/molecules/SchemaForm";
import { getBdmTableSchema, getExternalLinkSchema } from "../api/schemas";
import { BaseResourcePage } from "../../components/molecules/BaseResourcePage"; <<
<< << < HEAD
import NextImage from "next/image"; ===
=== = >>>
>>> > master

export async function getStaticProps(context) {
    const dataset = await showDataset(context.params.dataset);
    const translations = await getTranslations();
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
            translations,
            isPlus: isBdPlus(dataset),
        },
        revalidate: 1, //TODO: Increase this timer
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

function AdminButtons({ resource, setResource }) {
    const userData = useContext(UserContext);

    if (!userData ? .is_admin) return < > < />;

    return ( <
        >
        <
        SimpleButton isActive = { resource.resource_type === "create_bdm_table" }
        onClick = {
            () => setResource({ resource_type: "create_bdm_table" }) } >
        Criar tabela tratada <
        /SimpleButton> <
        SimpleButton isActive = { resource.resource_type === "create_external_link" }
        onClick = {
            () => setResource({ resource_type: "create_external_link" }) } >
        Criar link externo <
        /SimpleButton> <
        />
    );
}

export default function DatasetPage({
    dataset,
    bdmTables,
    externalLinks,
    strapiPages,
    isPlus,
    translations,
}) {
    const [resource, setResource] = useState(
        bdmTables.length > 0 ? bdmTables[0] : externalLinks[0]
    );
    const [bdmTableFilter, setBdmTableFilter] = useState(
        resource.resource_type === "bdm_table"
    );
    const [externalLinkTableFilter, setExternalLinkTableFilter] = useState(
        resource.resource_type === "external_link"
    );

    function getResourcePage() {
        switch (resource.resource_type) {
            case "bdm_table":
                return ( <
                    BdmTablePage translations = { translations["bdm_table"] }
                    datasetName = { dataset.dataset_id }
                    resource = { resource }
                    />
                );

            case "external_link":
                return ( <
                    ExternalLinkPage translations = { translations["external_link"] }
                    resource = { resource }
                    />
                );

            case "create_bdm_table":
                return ( <
                    BaseResourcePage title = "Criar tabela tratada"
                    forceForm formComponent = { <
                        SchemaForm
                        schemaName = "Tabela tratada"
                        loadSchemaFunction = { getBdmTableSchema }
                        updateFunction = {
                            (data) => createResource(data, dataset.id) }
                        />
                    }
                    />
                );

            case "create_external_link":
                return ( <
                    BaseResourcePage title = "Criar link externo"
                    forceForm formComponent = { <
                        SchemaForm
                        schemaName = "Link externo"
                        loadSchemaFunction = { getExternalLinkSchema }
                        updateFunction = {
                            (data) => createResource(data, dataset.id) }
                        />
                    }
                    />
                );

            default:
                return ( <
                    MetadataPage translations = { translations["dataset"] }
                    dataset = { dataset }
                    />
                );
        }
    }

    return ( <
        MainPageTemplate strapiPages = { strapiPages } >
        <
        Head >
        <
        title > Base dos Dados - { dataset.title } < /title>

        { /* Open Graph */ } <
        link rel = "image_src"
        href = "https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/thumbnail_conjunto.png" /
        >
        <
        meta property = "og:image"
        content = "https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/thumbnail_conjunto.png"
        key = "ogimage" /
        >
        <
        meta name = "twitter:image"
        content = "https://basedosdados-static.s3.us-east-2.amazonaws.com/thumbnails/thumbnail_conjunto.png"
        key = "twimage" /
        >
        <
        meta property = "og:title"
        content = { `Base dos Dados - ${dataset.title}` }
        key = "ogtitle" /
        >
        <
        meta property = "og:description"
        content = { dataset.notes }
        key = "ogdesc" / >
        <
        /Head> <
        Flex direction = {
            { base: "column", lg: "row" } }
        width = {
            { base: "90%", lg: "85%" } }
        margin = "auto"
        spacing = { 10 }
        paddingTop = {
            { base: "80px", lg: "0px" } } >
        <
        VStack alignItems = {
            { base: "flex-start", lg: "flex-start" } }
        justifyContent = "flex-start"
        width = "220px" >
        <
        Box position = "relative"
        minWidth = "220px"
        minHeight = "220px"
        maxWidth = "220px"
        boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.25)"
        borderRadius = "31.8889px" >
        <
        NextImage layout = "fill"
        className = "rounded"
        priority = "eager"
        objectFit = "contain"
        src = {
            "https://basedosdados.org/uploads/group/" +
            dataset.organization.image_url
        }
        /> <
        /Box> <
        Stack paddingTop = {
            { base: "30px", lg: "20px" } }
        spacing = { 6 }
        direction = {
            { base: "column", lg: "column" } } >
        <
        VStack alignItems = "flex-start" >
        <
        Title > Organização < /Title> <
        Link href = { `/dataset?organization=${dataset.organization.name}` } >
        <
        SectionText fontWeight = "400"
        fontSize = "14px" > { dataset.organization.title } <
        /SectionText> <
        /Link> <
        /VStack> <
        VStack alignItems = "flex-start" >
        <
        Title paddingTop = "" > Temas < /Title> {
            dataset.groups.map((g) => ( <
                Link href = { `/dataset?group=${g.name}` } >
                <
                HStack key = { g.name } >
                <
                CategoryIcon size = "39px"
                url = { `https://basedosdados-static.s3.us-east-2.amazonaws.com/category_icons/icone_${
                        g.name
                      }${isPlus ? "-1" : ""}.svg` }
                /> <
                SectionText > { g.display_name } < /SectionText> <
                /HStack> <
                /Link>
            ))
        } <
        /VStack> <
        /Stack> <
        /VStack> <
        VStack width = "100%"
        paddingTop = {
            { base: "50px", lg: "0px" } }
        transform = {
            { base: "", lg: "translateX(50px)" } }
        alignItems = "flex-start" >
        <
        BigTitle fontSize = "30px"
        color = "black" > { dataset.title } <
        /BigTitle> <
        Markdown > { dataset.notes } < /Markdown>

        <
        Stack paddingTop = "20px"
        direction = {
            { base: "column", lg: "row" } }
        spacing = { 4 }
        width = "100%" >
        <
        VStack minWidth = {
            { base: "100%", lg: "230px" } }
        maxWidth = {
            { base: "100%", lg: "230px" } }
        spacing = { 5 }
        align = "flex-start"
        justify = "flex-start" >
        <
        BigTitle fontSize = "18px"
        color = "black"
        margin = "0px"
        padding = "0px"
        height = "40px"
        paddingLeft = "15px" >
        Recursos <
        /BigTitle> <
        SimpleButton isActive = { resource.resource_type === "metadata" }
        onClick = {
            () => setResource({ resource_type: "metadata" }) } >
        Metadados do conjunto <
            /SimpleButton> <
            AdminButtons resource = { resource }
        setResource = { setResource }
        /> {
            bdmTables.length > 0 ? ( <
                FilterAccordion alwaysOpen = { true }
                choices = { bdmTables }
                value = { resource.name }
                valueField = "name"
                displayField = "name"
                isActive = { resource.resource_type === "bdm_table" }
                isOpen = { bdmTableFilter }
                fieldName = "Tabelas tratadas"
                bdPlus = { true }
                onChange = {
                    (name) =>
                    setResource(bdmTables.filter((b) => b.name === name)[0])
                }
                onToggle = {
                    () => setBdmTableFilter(!bdmTableFilter) }
                />
            ) : ( <
                > < />
            )
        } {
            externalLinks.length > 0 ? ( <
                FilterAccordion alwaysOpen = { true }
                choices = { externalLinks }
                valueField = "url"
                displayField = "name"
                isActive = { resource.resource_type === "external_link" }
                isOpen = { externalLinkTableFilter }
                fieldName = "Links externos"
                value = { resource.url }
                onChange = {
                    (url) =>
                    setResource(externalLinks.filter((b) => b.url === url)[0])
                }
                onToggle = {
                    () =>
                    setExternalLinkTableFilter(!externalLinkTableFilter)
                }
                />
            ) : ( <
                > < />
            )
        } <
        /VStack> <
        VStack width = "100%"
        flex = "1" > { getResourcePage() } <
        /VStack> <
        /Stack> <
        /VStack> <
        /Flex> <
        /MainPageTemplate>
    );
}