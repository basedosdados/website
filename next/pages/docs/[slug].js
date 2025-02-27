import {
  Box,
  Text,
  Tooltip,
  UnorderedList,
  ListItem,
  OrderedList,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Stack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { MDXRemote } from "next-mdx-remote";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../../components/templates/main";
import TitleText from "../../components/atoms/Text/TitleText";
import LabelText from "../../components/atoms/Text/LabelText";
import BodyText from "../../components/atoms/Text/BodyText";
import Button from "../../components/atoms/Button";
import Link from "../../components/atoms/Link";

import {
  getAllDocs,
  getDocsBySlug,
  serializeDocs
} from "../api/docs";


import hljs from "highlight.js/lib/core";
import sqlHighlight from "highlight.js/lib/languages/sql";
import pythonHighlight from "highlight.js/lib/languages/python";
import rHighlight from "highlight.js/lib/languages/r";
import bashHighlight from "highlight.js/lib/languages/bash";
import stataHighlight from "highlight.js/lib/languages/stata";
import markdownHighlight from "highlight.js/lib/languages/markdown";

import "highlight.js/styles/obsidian.css";

hljs.registerLanguage("sql", sqlHighlight);
hljs.registerLanguage("python", pythonHighlight);
hljs.registerLanguage("r", rHighlight);
hljs.registerLanguage("bash", bashHighlight);
hljs.registerLanguage("sh", bashHighlight);
hljs.registerLanguage("stata", stataHighlight);
hljs.registerLanguage("markdown", markdownHighlight);
hljs.registerLanguage("md", markdownHighlight);

export async function getStaticProps({ params, locale }) {
  const { slug } = params;

  const content = await getDocsBySlug(slug || "home", locale);

  if (!content) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  const serialize = await serializeDocs(content);

  return {
    props: {
      slug,
      locale,
      ...serialize,
      ...(await serverSideTranslations(locale, ['common', 'docs', 'menu'])),
    },
  };
}

export async function getStaticPaths() {
  const allDocs = await getAllDocs();
  return {
    paths: allDocs.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking"
  };
}

function Toc({ title, headings }) {
  const [isOverflow, setIsOverflow] = useState({});
  const textRefs = useRef({});
  const [activeId, setActiveId] = useState(null);
  const observerRef = useRef();

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    headings.forEach((elm, i) => {
      const textElement = textRefs.current[i]
      if (textElement) {
        setIsOverflow((prev) => ({
          ...prev,
          [i]: textElement.scrollWidth > textElement.clientWidth,
        }))
      }
    })

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50% 0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observerRef.current = observer;

    const headingElements = document.querySelectorAll(
      headings.map(({ id }) => `#${id}`).join(", ")
    );
    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [headings]);

  if(headings.length === 0) return null

  return (
    <Box>
      <LabelText
        typography="small"
        paddingLeft="15px"
        marginBottom="8px"
      >
        {title}
      </LabelText>

      <Box>
        {headings.map(({ id, title, level }, i) => (
          <HStack
            key={id}
            spacing="4px"
            cursor="pointer"
            marginLeft={`${level * 5}%`}
            pointerEvents={id === activeId ? "none" : "default"}
          >
            <Box 
              width="3px"
              height="24px"
              backgroundColor={id === activeId && "#2B8C4D"}
              borderRadius="10px"
            />
            <Tooltip
              label={title}
              isDisabled={!isOverflow[i]}
              hasArrow
              padding="16px"
              backgroundColor="#252A32"
              boxSizing="border-box"
              borderRadius="8px"
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              lineHeight="20px"
              textAlign="center"
              color="#FFFFFF"
              placement="top"
              maxWidth="100%"
            >
              <LabelText
                typography="small"
                as="a"
                href={`#${id}`}
                ref={(el) => (textRefs.current[i] = el)}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                width="100%"
                color={id === activeId  ? "#2B8C4D" : "#71757A"}
                backgroundColor={id === activeId  && "#F7F7F7"}
                _hover={{
                  backgroundColor: id === activeId  ? "#F7F7F7" :"#EEEEEE",
                }}
                borderRadius="8px"
                padding="6px 8px"
              >
                {title}
              </LabelText>
            </Tooltip>
          </HStack>
        ))}
      </Box>
    </Box>
  );
}

function HeadingWithAnchor(props) {
  return (
    <TitleText
      as="h2"
      scrollMarginTop="100px"
      margin="40px 0 16px"
      role="group"
      _first={{ marginTop: "0" }}
      {...props}
    >
      {props.children}
    </TitleText>
  );
}

function HeadingSimple(props) {
  return (
    <Text
      fontFamily="Roboto"
      fontWeight="500"
      color="#252A32"
      margin="16px 0 8px"
      {...props}
    >
      {props.children}
    </Text>
  );
}

export const mdxComponents = {
  h1: (props) => <HeadingWithAnchor {...props} />,
  h2: (props) => <HeadingSimple as="h3" fontSize="18px" lineHeight="28px" {...props} />,
  h3: (props) => <HeadingSimple as="h3" fontSize="18px" lineHeight="28px" {...props} />,
  h4: (props) => <HeadingSimple as="h4" fontSize="18px" lineHeight="28px" {...props} />,
  h5: (props) => <HeadingSimple as="h5" fontSize="16px" lineHeight="24px" {...props} />,
  h6: (props) => <HeadingSimple as="h6" fontSize="15px" lineHeight="24px" {...props} />,
  blockquote: (props) => (
    <Box
      as="blockquote"
      position="relative"
      display="flex"
      flexDirection="row"
      marginBottom="16px"
    >
      <Box
        position="absolute"
        left={0}
        width="40px"
        height="100%"
        borderRadius="10px"
        backgroundColor="#0068C5"
      />
      <Stack
        flexDirection="row"
        alignItems="center"
        spacing={0}
        gap="16px"
        width="100%"
        padding="16px 24px"
        marginLeft="4px"
        borderRadius="8px"
        backgroundColor="#E4F2FF"
        zIndex="10"
      >
        <InfoIcon
          width="20px"
          height="20px"
          padding="2px"
          fill="#0068C5"
        />
        <BodyText
          typography="small"
          as="span"
          {...props}
        />
      </Stack>
    </Box>
  ),
  a: (props) => (
  <BodyText
    typography="small"
    as="a"
    color="#0068C5"
    _hover={{
      color: "#0057A4"
    }}
    {...props} 
  />
  ),
  hr: (props) => (
    <Divider
      borderWidth="0px"
      borderTop="3px solid #252A32"
      opacity="1"
      margin="24px 0"
      {...props}
    />
  ),
  p: (props) => (
    <BodyText
      typography="small"
      as="p"
      color="#464A51"
      marginBottom="4px"
      {...props}
    />
  ),
  code: (props) => (
    <Text
      as="code"
      fontFamily={"ui-monospace, monospace"}
      backgroundColor={"#e7e7e7"}
      color="#3b3b3b"
      fontSize={"90%"}
      padding="2px 4px"
      borderRadius={"3px"}
      {...props}
    />
  ),
  ol: (props) => <OrderedList {...props} />,
  ul: (props) => <UnorderedList margin="8px 0 8px 20px" {...props} />,
  li: (props) => (
    <ListItem
      fontFamily="Roboto"
      fontWeight="400"
      fontSize="14px"
      lineHeight="20px"
      letterSpacing="0.1px"
      color="#464A51"
      margin="0 0 4px 0"
      {...props}
    />
  ),
  table: (props) => (
    <TableContainer>
      <Table variant="simple" border="1px solid #edf2f7" {...props} />
    </TableContainer>
  ),
  thead: (props) => <Thead {...props} />,
  tbody: (props) => <Tbody {...props} />,
  tr: (props) => <Tr {...props} />,
  td: (props) => (
    <Td
      fontFamily={"Roboto"}
      color="rgb(55, 65, 81)"
      paddingY={"0.5rem"}
      style={{ textWrap: "wrap" }}
      {...props}
    />
  ),
  th: (props) => <Th fontFamily={"Roboto"} {...props} />,
  Blockquote: ({ children }) => {
    const withCaption = children.length > 1;

    const figcaption = withCaption ? children[0] : null;
    const body = withCaption ? children[1] : children;

    return (
      <Box
        as="blockquote"
        padding="16px 20px"
        borderLeft="4px solid #2B8C4D"
        marginY="24px"
        position="relative"
      >
        <Text
          as="span"
          position="absolute"
          top="0"
          pointerEvents="none"
          userSelect="none"
          fontFamily="Roboto"
          fontSize="65px"
        >
          “
        </Text>
        <BodyText
          marginTop="35px"
          {...body.props}
        />
        {figcaption ? (
          <BodyText
            marginTop="16px"
            color="#71757A"
            {...figcaption.props}
          />
        ) : null}
      </Box>
    );
  },
};

export default function Docs({ slug, locale, mdxSource, headings }) {
  const { t } = useTranslation('docs')
  const { frontmatter } = mdxSource;

  return (
    <MainPageTemplate
      width="100%"
      maxWidth="1440px"
      margin="0 auto"
      paddingX="24px"
    >
      <Head>
        <title>{frontmatter.title} – {t("pageTitle")}</title>
        <meta
          property="og:title"
          content={`${frontmatter.title} – ${t("pageTitle")}`}
          key="ogtitle"
        />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://basedosdados.org/docs/${slug}`}
        />
      </Head>

      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        alignItems="start"
        paddingTop="70px"
        maxWidth="100%"
      >
        {headings && headings.length > 0 &&
          <Box
            as="aside"
            position="sticky"
            height="100%"
            top="80px"
            overflowY="auto"
            maxWidth="272px"
            minWidth="272px"
            boxSizing="content-box"
            padding="4px 26px 0 0"
          >
            <Toc headings={headings} />
          </Box>
        }

        <Box
          as="section"
          width="100%"
          display="flex"
          flexDirection="column"
          gap="24px"
        >
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </Box>
      </Box>
    </MainPageTemplate>
  )
}