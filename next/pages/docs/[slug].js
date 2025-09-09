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
  Image,
  AspectRatio,
  useClipboard,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem,
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
import InfoIcon from "../../public/img/icons/infoIcon";
import WarningIcon from "../../public/img/icons/warningIcon";
import { CopyIcon } from "../../public/img/icons/copyIcon";
import styles from "../../styles/docs.module.css";

import {
  getAllDocs,
  getDocsBySlug,
  serializeDoc
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

  const allDocs = await getAllDocs(locale);

  const serialize = await serializeDoc(content);

  return {
    props: {
      allDocs,
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

function Toc({ allDocs, headings, slug, locale }) {
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

    const sanitizeId = (id) => {
      return id.replace(/^(\d)/, 'id-$1');
    };

    const headingElements = document.querySelectorAll(
      headings.map(({ id }) => `#${sanitizeId(id)}`).join(", ")
    );
    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [headings]);

  const translations = {
    en: "Contribute",
    es: "Contribuir",
    default: "Contribua"
  };

  const schemeCategories = ["Docs", "APIs", translations[locale] || translations.default];

  const groupedDocs = allDocs.reduce((acc, doc) => {
    const category = doc.frontmatter.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {});

  if(headings.length === 0) return null

  return (
    <Box>
    {schemeCategories.map((category, index) => {
      const docsInCategory = groupedDocs[category] || [];
      return (
        <Box key={index}>
          <LabelText
            typography="small"
            marginY="8px"
          >
            {category}
          </LabelText>

          {docsInCategory.map((doc) => (
            <Box key={doc.slug}>
              <Link
                width="100%"
                href={`/docs/${doc.slug}`}
              >
                <LabelText
                  display={slug === doc.slug ? "none" : "block"}
                  cursor="pointer"
                  typography="small"
                  width="100%"
                  borderRadius="8px"
                  padding="6px 8px"
                  marginLeft="8px"
                  color="#71757A"
                  _hover={{
                    backgroundColor: "#EEEEEE",
                  }}
                >
                  {doc.frontmatter.title}
                </LabelText>
              </Link>

              <Box display={slug === doc.slug ? "block" : "none"}>
                {headings.map(({ id, title, level }, i) => (
                  <HStack
                    key={id}
                    spacing="4px"
                    cursor="pointer"
                    paddingLeft="14px"
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
                        color={id === activeId ? "#2B8C4D" : "#71757A"}
                        backgroundColor={id === activeId && "#F7F7F7"}
                        _hover={{
                          backgroundColor: id === activeId ? "#F7F7F7" : "#EEEEEE",
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
          ))}
        </Box>
      );
    })}
  </Box>
  );
}

const LANGS_SUPPORTED = [
  "sql",
  "python",
  "r",
  "bash",
  "sh",
  "stata",
  "markdown",
  "md",
];

function CodeBlock({ children }) {
  const code = children.props.children;

  const language = children.props.className?.replace("language-", "").trim();

  const { hasCopied, onCopy } = useClipboard(code);

  const highlighted = LANGS_SUPPORTED.includes(language)
    ? hljs.highlight(code, {
        language: language,
      })
    : { value: code };

  return (
    <Box marginY={"1rem"} borderRadius={"8px"} backgroundColor="#252A32">
      <Box display={"flex"} alignItems={"center"} padding={"0 0.5rem"}>
        {language ? (
          <Text
            as="span"
            display="block"
            paddingLeft="7px"
            fontWeight="500"
            fontSize="12px"
            color="#878A8E"
            textTransform="capitalize"
            userSelect="none"
            fontFamily="Roboto"
          >
            {["sh", "sql"].includes(language)
              ? language.toUpperCase()
              : language}
          </Text>
        ) : null}
        <Button
          variant="unstyled"
          onClick={onCopy}
          _groupActive={{ background: "transparent" }}
          backgroundColor="transparent"
          padding="0"
          display="flex"
          marginLeft="auto"
          alignItems="center"
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="12px"
          color="#878A8E"
          fill="#878A8E"
          _hover={{
            fill: "#9D9FA3",
            color: "#9D9FA3",
          }}
          rightIcon={
            hasCopied ? (
              <CheckIcon alt="copiado conteúdo" width="24px" height="24px" />
            ) : (
              <CopyIcon alt="copiar conteúdo" width="24px" height="24px" />
            )
          }
        >
          {hasCopied ? "Copiado" : "Copiar"}
        </Button>
      </Box>
      <Box
        as="pre"
        display="flex"
        justifyContent="space-between"
        width="100%"
        maxHeight="70vh"
        overflowX="auto"
        overflowY="auto"
        whiteSpace="pre"
        borderBottomLeftRadius="8px"
        borderBottomRightRadius="8px"
      >
        <Text
          as="code"
          paddingTop="0 !important"
          width="100%"
          className={`hljs ${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted.value }}
        />
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
      scrollMarginTop="100px"
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

function FigCaption(props) {
  return props.children ? (
    <Text
      as="figcaption"
      fontFamily="Roboto"
      fontSize="14px"
      color="#71757A"
      textAlign="center"
      marginY="8px"
    >
      {props.children}
    </Text>
  ) : null;
}

export const mdxComponents = {
  h1: (props) => <HeadingWithAnchor {...props} />,
  h2: (props) => <HeadingSimple as="h3" fontSize="20px" lineHeight="28px" {...props} />,
  h3: (props) => <HeadingSimple as="h3" fontSize="16px" lineHeight="24px" {...props} />,
  h4: (props) => <HeadingSimple as="h4" fontSize="16px" lineHeight="24px" {...props} />,
  h5: (props) => <HeadingSimple as="h5" fontSize="16px" lineHeight="24px" {...props} />,
  h6: (props) => <HeadingSimple as="h6" fontSize="15px" lineHeight="24px" {...props} />,
  blockquote: (props) => (
    <Box
      as="blockquote"
      position="relative"
      display="flex"
      flexDirection="row"
      margin="8px 0 16px"
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
          position="relative"
          top="2px"
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
      fontFamily="ui-monospace, monospace"
      backgroundColor="#e7e7e7"
      color="#3b3b3b"
      fontSize="90%"
      padding="2px 4px"
      borderRadius="3px"
      {...props}
    />
  ),
  pre: (props) => <CodeBlock {...props} />,
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
    <TableContainer margin="16px 0">
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
  Button: (props) => (
    <Button
      margin="16px 0 8px"
      onClick={() => window.open(props.href, "_blank")}
    >
      {props.text}
    </Button>
  ),
  Warning: (props) => (
    <Box
      as="blockquote"
      position="relative"
      display="flex"
      flexDirection="row"
      margin="16px 0"
    >
      <Box
        position="absolute"
        left={0}
        width="40px"
        height="100%"
        borderRadius="10px"
        backgroundColor="#F9C50B"
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
        backgroundColor="#FFF8DF"
        zIndex="10"
      >
        <WarningIcon
          width="20px"
          height="20px"
          padding="2px"
          fill="#F9C50B"
        />
        <BodyText
          position="relative"
          top="2px"
          typography="small"
          as="span"
          {...props}
        />
      </Stack>
    </Box>
  ),
  Image: (props) => (
    <Box
      as="figure"
      marginY="16px"
      boxShadow="0 1.6px 16px 0 rgba(100, 96, 103, 0.16)"
    >
      <Image margin="0 auto" src={props.src} />
      <FigCaption {...props} />
    </Box>
  ),
  Video: (props) => (
    <Box as="figure" marginY="16px">
      <video width="100%" controls preload="metadata" src={props.src} />
      <FigCaption {...props} />
    </Box>
  ),
  Embed: ({ children }) => (
    <Box marginY="16px">
      <AspectRatio ratio={16 / 9}>{children}</AspectRatio>
      <FigCaption {...children.props} />
    </Box>
  ),
  PDF: (props) => (
    <Box marginY="16px">
      <object
        data={props.url}
        type="application/pdf"
        width="100%"
        height="700px"
        aria-label="PDF Embedding"
      >
        <embed src={props.url} type="application/pdf" width="100%" height="700px" />
        <p>
          Your browser does not support PDF viewing. Please download the PDF to view it:{" "}
          <a href={props.url} target="_blank" rel="noopener noreferrer">Download PDF</a>.
        </p>
      </object>
    </Box>
  ),
  Tip: ({ children }) => {
    const withCaption = children.length > 1;
    const tip = withCaption ? children[0] : children;
    const body = withCaption ? children[1] : null;

    return (
      <Box
        as="blockquote"
        position="relative"
        display="flex"
        flexDirection="row"
        margin="8px 0 16px"
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
          <Box display="flex" flexDirection="column" gap="8px"> 
            <BodyText
              position="relative"
              top="2px"
              typography="small"
              as="span"
              {...tip.props}
            />
            {body &&
              <BodyText
                position="relative"
                top="2px"
                typography="small"
                as="span"
                {...body.props}
              />
            }
          </Box>
        </Stack>
      </Box>
    )
  },
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

export default function Docs({ allDocs, slug, locale, mdxSource, headings }) {
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
        paddingTop={{base: "40px", md: "0"}}
        gap={{base: "80px", md: "0"}}
        height="100%"
        maxWidth="100%"
      >
        {allDocs && allDocs.length > 0 &&
          <Box
            as="aside"
            position={{base: "relative", md: "sticky"}}
            top={{base: "0", md: "80px"}}
            overflowY="auto"
            maxWidth="272px"
            minWidth="272px"
            maxHeight={{base: "100%", md: "calc(100vh - 6rem)"}}
            height="100%"
            boxSizing="content-box"
            paddingRight="26px"
          >
            <Toc
              allDocs={allDocs}
              slug={slug}
              headings={headings}
              locale={locale}
            />
          </Box>
        }

        <Box
          as="section"
          width="100%"
          display="flex"
          flexDirection="column"
          paddingLeft="16px"
          overflow="auto"
        >
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </Box>
      </Box>
    </MainPageTemplate>
  )
}