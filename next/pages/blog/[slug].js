import {
  Box,
  Heading,
  Image,
  Text,
  Wrap,
  WrapItem,
  Avatar,
  UnorderedList,
  ListItem,
  OrderedList,
  Button,
  useClipboard,
  createIcon,
  AspectRatio,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
} from "@chakra-ui/react";
import Head from "next/head";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { fromMarkdown } from "mdast-util-from-markdown";
import { visit } from "unist-util-visit";
import { MDXRemote } from "next-mdx-remote";
import { MainPageTemplate } from "../../components/templates/main";
import Link from "../../components/atoms/Link";
import { getAllPosts, getPostBySlug } from "../api/blog";
import { DatePost, authorIconFallback } from "../blog";

import { CopyIcon } from "../../public/img/icons/copyIcon";
import CheckIcon from "../../public/img/icons/checkIcon";

import hljs from "highlight.js/lib/core";
import sqlHighlight from "highlight.js/lib/languages/sql";
import pythonHighlight from "highlight.js/lib/languages/python";
import rHighlight from "highlight.js/lib/languages/r";
import bashHighlight from "highlight.js/lib/languages/bash";
import stataHighlight from "highlight.js/lib/languages/stata";
import markdownHighlight from "highlight.js/lib/languages/markdown";

import "highlight.js/styles/obsidian.css";

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

hljs.registerLanguage("sql", sqlHighlight);
hljs.registerLanguage("python", pythonHighlight);
hljs.registerLanguage("r", rHighlight);
hljs.registerLanguage("bash", bashHighlight);
hljs.registerLanguage("sh", bashHighlight);
hljs.registerLanguage("stata", stataHighlight);
hljs.registerLanguage("markdown", markdownHighlight);
hljs.registerLanguage("md", markdownHighlight);

const remarkPluginCaption = () => (tree) =>
  visit(
    tree,
    (node) =>
      ["Image", "Video", "Embed", "Blockquote"].includes(node.name) &&
      node.attributes.find(({ name }) => name === "caption"),
    (node) => {
      const caption = node.attributes.filter(({ name }) => name === "caption");
      const tree = fromMarkdown(caption[0].value);
      const children = tree.children.map((node) => ({
        ...node,
        type: "figcaption",
      }));

      if (node.name === "Embed") {
        // Since Embed component has a children (`iframe`), set children as children of iframe
        // React does not support two children, should be nested childrens
        node.children[0].children = children;
      } else {
        node.children = children;
      }

      // Remove caption attributes
      node.attributes = node.attributes.filter(
        ({ name }) => name !== "caption",
      );
    },
  );

const rehypeExtractHeadings =
  ({ headings }) =>
  (tree) => {
    visit(
      tree,
      (node) => node.tagName === "h2",
      (node) => {
        if (node?.properties?.id) {
          headings.push({
            title: node.children[0]?.value ?? null,
            id: node.properties.id.toString() ?? null,
          });
        }
      },
    );
  };

export async function getStaticProps({ params }) {
  const { slug } = params;

  const headings = [];
  const content = getPostBySlug(slug);
  const mdxSource = await serialize(content, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkPluginCaption],
      rehypePlugins: [rehypeSlug, [rehypeExtractHeadings, { headings }]],
    },
  });

  return {
    props: {
      slug,
      headings,
      mdxSource,
    },
  };
}

export async function getStaticPaths() {
  const allPosts = getAllPosts();
  return {
    paths: allPosts.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
}

function CodeBlock({ children }) {
  const code = children.props.children;

  const language = children.props.className?.replace("language-", "").trim();

  const { hasCopied, onCopy } = useClipboard(code);

  const highlighted =
    language !== undefined && LANGS_SUPPORTED.includes(language)
      ? hljs.highlight(code, {
          language: language,
        })
      : hljs.highlightAuto(code);

  return (
    <Box
      padding="0.2rem"
      marginY={"1rem"}
      borderRadius={"8px"}
      backgroundColor={"#282b2e"}
    >
      <Box display={"flex"} alignItems={"center"} padding={"0 0.5rem"}>
        {language ? (
          <Text
            as="span"
            display={"block"}
            paddingLeft={"7px"}
            fontWeight={500}
            fontSize="12px"
            color="#878A8E"
            textTransform={"capitalize"}
            userSelect={"none"}
            fontFamily={"Roboto"}
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
          backgroundColor={"transparent"}
          padding={0}
          display={"flex"}
          marginLeft={"auto"}
          alignItems={"center"}
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
        overflowX="auto"
        whiteSpace={"pre"}
      >
        <Text
          as="code"
          paddingTop={"0 !important"}
          width={"100%"}
          className={`hljs ${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted.value }}
        />
      </Box>
    </Box>
  );
}

function HeadingWithAnchor(props) {
  return (
    <Heading
      {...props}
      scrollMarginTop={"6rem"}
      fontFamily="Roboto"
      marginY={"1.5rem"}
      role="group"
    >
      {props.children}
      <Link
        href={`#${props.id}`}
        variant="unstyled"
        opacity="0"
        color="gray"
        fontSize={"inherit"}
        marginLeft="5px"
        transition="none"
        _groupHover={{ opacity: "1" }}
      >
        {"#"}
      </Link>
    </Heading>
  );
}

function FigCaption(props) {
  return props.children ? (
    <Text
      as="figcaption"
      fontFamily={"Roboto"}
      fontSize={"sm"}
      color={"gray"}
      textAlign={"center"}
      marginY="0.5rem"
    >
      {props.children}
    </Text>
  ) : null;
}

const components = {
  h1: (props) => <HeadingWithAnchor as="h2" size="1.8rem" {...props} />,
  h2: (props) => <HeadingWithAnchor as="h2" fontSize="1.8rem" {...props} />,
  h3: (props) => <HeadingWithAnchor as="h3" fontSize="1.5rem" {...props} />,
  h4: (props) => <HeadingWithAnchor as="h4" fontSize="1.2rem" {...props} />,
  h5: (props) => <HeadingWithAnchor as="h5" fontSize={"1.1rem"} {...props} />,
  h6: (props) => <HeadingWithAnchor as="h6" fontSize={"1.05rem"} {...props} />,
  blockquote: (props) => (
    <Box
      as="blockquote"
      paddingY={"0.1rem"}
      paddingLeft={"1.5rem"}
      borderLeft={"3px solid #7ec876"}
      {...props}
    />
  ),
  a: (props) => <Text as="a" color="#0068C5" {...props} />,
  p: (props) => (
    <Text
      as={"p"}
      lineHeight={"7"}
      marginY={"1.5rem"}
      // TODO(aspeddro): check color
      color="#252A32"
      fontFamily={"Roboto"}
      {...props}
    />
  ),
  // Inline code
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
  pre: (props) => <CodeBlock {...props} />,
  ol: (props) => <OrderedList {...props} />,
  ul: (props) => <UnorderedList {...props} />,
  li: (props) => <ListItem marginY={"2"} {...props} />,
  table: (props) => (
    <TableContainer>
      <Table variant="simple" {...props} />
    </TableContainer>
  ),
  thead: (props) => <Thead {...props} />,
  tbody: (props) => <Tbody {...props} />,
  tr: (props) => <Tr {...props} />,
  td: (props) => <Td {...props} />,
  th: (props) => <Th {...props} />,
  // custom components
  Image: (props) => (
    <Box as="figure" marginY={"2rem"}>
      <Image margin={"0 auto"} src={props.src} />
      <FigCaption {...props.children} />
    </Box>
  ),
  Video: (props) => (
    <Box as="figure" marginY="2rem">
      <video width="100%" controls preload="metadata" src={props.src} />
      <FigCaption {...props} />
    </Box>
  ),
  Embed: ({ children }) => (
    <Box marginY="2rem">
      <AspectRatio ratio={16 / 9}>{children}</AspectRatio>
      <FigCaption {...children.props} />
    </Box>
  ),
  Blockquote: (props) => (
    <Box
      as="blockquote"
      padding={"2rem 2.5rem"}
      borderLeft={"4px solid #7ec876"}
      marginY={"3rem"}
      position={"relative"}
    >
      <Text
        as="span"
        fontSize={"4rem"}
        pointerEvents={"none"}
        userSelect={"none"}
        position={"absolute"}
        lineHeight={"1"}
        top="1rem"
      >
        “
      </Text>
      <Text
        as="p"
        marginTop={"1.5rem"}
        fontFamily={"Roboto"}
        fontSize={"lg"}
        {...props}
      />
      <Text as="p" fontFamily={"Roboto"} color="gray">
        {props.author}
      </Text>
    </Box>
  ),
};

function Toc({ headings }) {
  return (
    <Box marginBottom={"1rem"}>
      <Text
        as="p"
        fontFamily={"Roboto"}
        fontWeight={"500"}
        // paddingLeft={"1rem"}
        // borderBottom={"1px solid #DEDFE0"}
        paddingBottom={"0.6rem"}
      >
        Tabela de conteúdo
      </Text>
      <Box as="hr" />
      <UnorderedList marginTop={"1rem"}>
        {headings.map((header) => (
          <ListItem margin={"0.5rem 0"}>
            <Link
              href={`#${header.id}`}
              fontFamily="Roboto"
              fontWeight="normal"
              display="block"
            >
              {header.title}
            </Link>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}

const ForkIcon = createIcon({
  displayName: "fork",
  viewBox: "0 0 16 16",
  path: (
    <path
      fill="current-color"
      d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"
    />
  ),
});

function Contribute({ slug }) {
  return (
    <Box marginTop={"1rem"}>
      <Text
        as="p"
        color="gray"
        fontSize={"0.9rem"}
        fontFamily={"Roboto"}
        marginBottom={"1rem"}
      >
        Todos os documentos são abertos. Viu algo errado ou pouco claro? Envie
        um pull request e contribua na Base dos Dados {"💚"}
      </Text>
      <Link
        href={`https://github.com/basedosdados/website/edit/main/next/blog/${slug}.mdx`}
        display={"flex"}
        alignItems={"center"}
        borderRadius="8px"
        // backgroundColor="#2B8C4D"
        // padding="8px 16px"
        // width="fit-content"
        // fill="#fff"
        // color="#fff"
        fontFamily={"Roboto"}
        // fontSize={"0.9rem"}
        fontWeight={"500"}
        letterSpacing={"0"}
        // marginLeft="auto"
        // _hover={{
        //   backgroundColor: "#22703E",
        // }}
        isExternal
      >
        <>
          <ForkIcon width={"16px"} height={"16px"} marginRight={"0.5rem"} />
          Editar essa página no GitHub
        </>
      </Link>
    </Box>
  );
}

function Header({ frontmatter }) {
  return (
    <Box as="header">
      <Text
        as="span"
        display={"block"}
        marginBottom={"10"}
        color={"gray"}
        fontFamily={"Roboto"}
      >
        <DatePost date={frontmatter.date} />
      </Text>
      <Heading as="h1" fontFamily={"Roboto"} size="2xl">
        {frontmatter.title}
      </Heading>
      <Heading
        as="h2"
        fontFamily={"Roboto"}
        fontWeight={"normal"}
        fontSize={"xl"}
        color={"gray"}
        marginY={"10"}
      >
        {frontmatter.description}
      </Heading>
      {frontmatter.authors ? (
        <Box marginBottom={"4rem"}>
          <Wrap display={"flex"} alignItems={"center"}>
            {frontmatter.authors.map((author, index) => {
              const authorComponent = (
                <WrapItem alignItems={"center"}>
                  <Box
                    // href={author.social}
                    fontFamily={"Roboto"}
                    fontSize={"0.9rem"}
                    fontWeight={500}
                    display="flex"
                    alignItems={"center"}
                  >
                    <Avatar
                      size="sm"
                      name={author.name}
                      src={author.avatar}
                      icon={authorIconFallback}
                    />
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"start"}
                      marginLeft={"2"}
                      marginRight={"4"}
                    >
                      {author.name}
                      {author?.role ? (
                        <Text
                          as="span"
                          marginTop={"-0.2rem"}
                          fontSize={"0.7rem"}
                          fontFamily={"Roboto"}
                          color="gray"
                        >
                          {author.role}
                        </Text>
                      ) : null}
                    </Box>
                  </Box>
                </WrapItem>
              );

              return (
                <Box key={index}>
                  {author?.social ? (
                    <Link href={author.social}>{authorComponent}</Link>
                  ) : (
                    <>{authorComponent}</>
                  )}
                </Box>
              );
            })}
          </Wrap>
        </Box>
      ) : null}
    </Box>
  );
}

export default function Blog({ slug, mdxSource, headings }) {
  const { frontmatter } = mdxSource;

  return (
    <MainPageTemplate maxWidth={"1100px"} margin={"0 auto"} paddingX="24px">
      <Head>
        <title>{frontmatter.title} – Blog – Base dos Dados</title>
        <meta
          property="og:title"
          content={`${frontmatter.title} – Blog – Base dos Dados`}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={frontmatter.description}
          key="ogdesc"
        />
        <meta name="description" content={frontmatter.description} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://basedosdados.org/blog/${slug}`}
        />
        <meta
          property="og:image"
          content={frontmatter.thumbnail}
          key="ogimage"
        />
        <meta
          name="twitter:image"
          content={frontmatter.thumbnail}
          key="twimage"
        />
        <meta property="article:published_time" content={frontmatter.date} />
      </Head>
      <Box paddingTop={"4rem"}>
        <Header frontmatter={frontmatter} />
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"start"}
          maxWidth={"100%"}
        >
          <Box as="section" width={"65%"}>
            <MDXRemote {...mdxSource} components={components} />
          </Box>
          <Box
            as="aside"
            marginLeft={"auto"}
            marginTop={"2rem"}
            position={"sticky"}
            top="6rem"
            paddingLeft={"5rem"}
          >
            <Toc headings={headings} />
            <Box as="hr" />
            <Contribute slug={slug} />
          </Box>
        </Box>
      </Box>
    </MainPageTemplate>
  );
}
