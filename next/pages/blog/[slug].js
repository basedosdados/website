import {
  Box,
  Divider,
  Text
} from "@chakra-ui/react";
import Head from "next/head";
import { MDXRemote } from "next-mdx-remote";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../../components/templates/main";
import { getAllPosts, getPostBySlug, serializePost } from "../api/blog";
import { categories } from "../api/blog/categories";
import BodyText from "../../components/atoms/Text/BodyText";
import Link from "../../components/atoms/Link";
import {
  Header,
  Toc,
  mdxComponents,
} from "../../components/organisms/blog/Slug";

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

  const content = await getPostBySlug(slug, locale);

  if (!content) {
    return {
      redirect: {
        destination: locale === "pt" ? "/blog" : `/${locale}/blog`,
        permanent: false,
      },
    };
  }

  const serialize = await serializePost(content);

  return {
    props: {
      slug,
      locale,
      ...serialize,
      ...(await serverSideTranslations(locale, ['common', 'blog', 'menu'])),
    },
  };
}

export async function getStaticPaths() {
  const allPosts = await getAllPosts();
  return {
    paths: allPosts.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking"
  };
}

export default function Post({ slug, locale, mdxSource, headings }) {
  const { t } = useTranslation('blog')
  const { frontmatter } = mdxSource;

  const repository = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_FRONTEND
    if (baseUrl === "http://localhost:3000" || baseUrl === "https://development.basedosdados.org") return "development" 
    if (baseUrl === "https://staging.basedosdados.org") return "staging"
    if (baseUrl === "https://basedosdados.org") return "main" 
    return null
  }

  return (
    <MainPageTemplate
      width="100%"
      maxWidth="944px"
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

      <BodyText
        as="div"
        typography="small"
        display="flex"
        flexDirection="row"
        padding="24px 0 48px"
        gap="8px"
      >
        <Link 
          href="/blog"
          fontSize="14px"
          fontWeight="400"
          lineHeight="20px"
          color="#0068C5"
          _hover={{
            color: "#0057A4"
          }}
        >{t("blog")}</Link> <Text color="#71757A">/</Text>
        {frontmatter.categories.map((elm) => {
          return (
            <Link
              key={elm}
              href={`/blog?category=${elm}`}
              fontSize="14px"
              fontWeight="400"
              lineHeight="20px"
              color="#0068C5"
              _hover={{
                color: "#0057A4"
              }}
            >{categories?.[elm] || t(elm)}</Link>
          )
        })}
      </BodyText>

      <Box>
        <Header frontmatter={frontmatter} slug={slug} />
        <Box
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          alignItems="start"
          maxWidth="100%"
        >
          <Box
            as="section"
            width={{ base: "100%", md: "65%", xl: "65%" }}
            display="flex"
            flexDirection="column"
            gap="24px"
          >
            <MDXRemote {...mdxSource} components={mdxComponents} />

            <Box
              display="flex"
              flexDirection="column"
            >
              <Divider
                borderWidth="0px"
                borderTop="3px solid #252A32"
                opacity="1"
                margin="24px 0"
              />
              <BodyText marginTop="24px">{t("noticedSomething")} </BodyText>
              <BodyText
                as="a"
                href={`https://github.com/basedosdados/website/edit/${repository()}/next/blog/${locale}/${slug}.md`}
                isexternal="true"
                color="#0068C5"
                _hover={{
                  color: "#0057A4"
                }}
              >{t("contributeToBD")}</BodyText>
              <Box id="hotjarSurveyBlog"/>
            </Box>
          </Box>
          <Box
            as="aside"
            marginLeft="auto"
            marginTop={{ base: "0", md: "48px" }}
            position="sticky"
            top="6rem"
            maxHeight="calc(100vh - 6rem)"
            overflowY="auto"
            paddingLeft={{ base: "0", md: "48px" }}
            paddingRight="24px"
            paddingBottom="24px"
            width={{ base: "100%", md: "35%", xl: "35%" }}
          >
            <Box display={{ base: "none", md: "block" }}>
              {headings.length > 0 ? (
                <Toc headings={headings} />
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>
    </MainPageTemplate>
  );
}
