import { Box } from "@chakra-ui/react";
import Head from "next/head";
import { MDXRemote } from "next-mdx-remote";
import { MainPageTemplate } from "../../components/templates/main";
import { getAllPosts, getPostBySlug, serializePost } from "../api/blog";
import {
  Header,
  Toc,
  Contribute,
  ShareButtons,
  mdxComponents,
} from "../../components/organisms/Blog";

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

export async function getStaticProps({ params }) {
  const { slug } = params;

  const content = await getPostBySlug(slug);
  const serialize = await serializePost(content);

  return {
    props: {
      slug,
      ...serialize,
    },
  };
}

export async function getStaticPaths() {
  const allPosts = await getAllPosts();
  return {
    paths: allPosts.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
}

export default function Post({ slug, mdxSource, headings }) {
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
        <meta
          property="article:published_time"
          content={frontmatter.date.created}
        />
      </Head>
      <Box paddingTop={"4rem"}>
        <Header frontmatter={frontmatter} slug={slug} />
        <Box
          display={"flex"}
          flexDirection={{ base: "column", md: "row" }}
          alignItems={"start"}
          maxWidth={"100%"}
        >
          <Box as="section" width={{ base: "100%", md: "65%", xl: "65%" }}>
            <MDXRemote {...mdxSource} components={mdxComponents} />
          </Box>
          <Box
            as="aside"
            marginLeft={"auto"}
            marginTop={{ base: "0", md: "2rem" }}
            position={"sticky"}
            top="6rem"
            maxHeight={"calc(100vh - 6rem)"}
            overflowY={"auto"}
            paddingLeft={{ base: "0", md: "5rem" }}
            paddingRight={"1rem"}
            paddingBottom={"2rem"}
            width={{ base: "100%", md: "35%", xl: "35%" }}
          >
            <Box display={{ base: "none", md: "block" }}>
              {headings.length > 0 ? (
                <>
                  <Toc headings={headings} />
                  <Box as="hr" marginBottom={"1rem"} />
                </>
              ) : null}
            </Box>
            <Box
              borderTop="0px solid rgb(226, 232, 240)"
              borderTopWidth={{ base: "1px", md: "0px" }}
              paddingTop={{ base: "1rem", md: "0" }}
              paddingBottom={"1rem"}
              borderBottom="1px solid rgb(226, 232, 240)"
            >
              <Contribute slug={slug} />
            </Box>
            <ShareButtons frontmatter={frontmatter} />
          </Box>
        </Box>
      </Box>
    </MainPageTemplate>
  );
}
