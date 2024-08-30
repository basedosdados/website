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
} from "@chakra-ui/react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { MainPageTemplate } from "../../components/templates/main";
import Link from "../../components/atoms/Link";
import { getAllPosts, getPostBySlug } from "../api/blog";
import { DatePost, authorIconFallback } from "../blog";
import hljs from "highlight.js/lib/core";
import sqlHighlight from "highlight.js/lib/languages/sql";
import pythonHighlight from "highlight.js/lib/languages/python";
import rHighlight from "highlight.js/lib/languages/r";
import bashHighlight from "highlight.js/lib/languages/bash";

import "highlight.js/styles/obsidian.css";

hljs.registerLanguage("sql", sqlHighlight);
hljs.registerLanguage("python", pythonHighlight);
hljs.registerLanguage("r", rHighlight);
hljs.registerLanguage("bash", bashHighlight);
hljs.registerLanguage("sh", bashHighlight);

export async function getStaticProps({ params }) {
  const { slug } = params;

  const content = getPostBySlug(slug);
  const mdxSource = await serialize(content, {
    parseFrontmatter: true,
  });

  return {
    props: {
      slug,
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

const components = {
  h1: (props) => <Heading as="h1" size="xl" {...props} />,
  h2: (props) => (
    <Heading
      fontFamily={"Roboto"}
      as="h2"
      fontSize={"1.8rem"}
      marginY={"2rem"}
      {...props}
    />
  ),
  h3: (props) => (
    <Heading
      fontFamily={"Roboto"}
      as="h3"
      fontSize="1.5rem"
      marginY={"1.5rem"}
      {...props}
    />
  ),
  h4: (props) => (
    <Heading
      fontFamily={"Roboto"}
      as="h4"
      fontSize="1.2rem"
      marginY={"1.5rem"}
      {...props}
    />
  ),
  h5: (props) => (
    <Heading
      fontFamily={"Roboto"}
      as="h5"
      fontSize={"1.1rem"}
      marginY={"1.5rem"}
      {...props}
    />
  ),
  h6: (props) => (
    <Heading
      fontFamily={"Roboto"}
      as="h6"
      fontSize={"1.05rem"}
      marginY={"1.5rem"}
      {...props}
    />
  ),
  blockquote: (props) => (
    <Box
      bg={"#dbf9d7"}
      padding={"2rem 2.5rem"}
      marginY={"3rem"}
      borderRadius={"lg"}
      {...props}
    />
  ),
  a: (props) => <Text as="a" color="#0068C5" {...props} />,
  p: (props) => (
    <Text
      as={"p"}
      lineHeight={"7"}
      marginY={"1.5rem"}
      fontFamily={"Roboto"}
      {...props}
    />
  ),
  Image: (props) => (
    <Box as="figure" marginY={"2rem"}>
      <Image margin={"0 auto"} src={props.src} />
      {props.caption ? (
        <Text
          as="figcaption"
          fontFamily={"Roboto"}
          fontSize={"sm"}
          color={"gray"}
          textAlign={"center"}
        >
          {props.caption}
        </Text>
      ) : null}
    </Box>
  ),
  // img: (props) => (
  //   <Box as="figure" marginY={"2rem"}>
  //     <Image margin={"0 auto"} src={props.src} />
  //     <Text
  //       as="figcaption"
  //       fontFamily={"Roboto"}
  //       fontSize={"sm"}
  //       color={"gray"}
  //       textAlign={"center"}
  //     >
  //       {props.alt}
  //     </Text>
  //   </Box>
  // ),
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
  pre: (props) => {
    // NOTE: children of children bc pre node element has a code children node element
    const content = props.children.props.children;
    const language = props.children.props.className?.replace("language-", "");

    const highlighted =
      language !== undefined
        ? hljs.highlight(content, {
            language: language,
          })
        : hljs.highlightAuto(content);

    return (
      <Box
        as="pre"
        display="flex"
        justifyContent="space-between"
        width="100%"
        overflowX="auto"
        whiteSpace={"pre"}
        padding="0.2rem"
        marginY={"1rem"}
        borderRadius={"8px"}
        backgroundColor={"#282b2e"}
      >
        <Text
          as="code"
          width={"100%"}
          // whiteSpace="pre"
          // overflow={"auto"}
          className={`hljs ${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted.value }}
        />
      </Box>
    );
  },
  ol: (props) => <OrderedList {...props} />,
  ul: (props) => <UnorderedList {...props} />,
  li: (props) => <ListItem marginY={"2"} {...props} />,
  Blockquote: (props) => (
    <Box
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
      <Text as="p" fontFamily={"Roboto"} color="gray" marginTop={"1rem"}>
        {props.author}
      </Text>
    </Box>
  ),
};

export default function Blog({ slug, mdxSource }) {
  const { frontmatter } = mdxSource;

  return (
    <MainPageTemplate maxWidth={"800px"} margin={"0 auto"} paddingX="24px">
      <Box paddingTop={"4rem"}>
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
              {frontmatter.authors.map((author) => {
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

                return author?.social ? (
                  <Link href={author.social}>{authorComponent}</Link>
                ) : (
                  <>{authorComponent}</>
                );
              })}
            </Wrap>
          </Box>
        ) : null}
        <MDXRemote {...mdxSource} components={components} />
      </Box>
    </MainPageTemplate>
  );
}
