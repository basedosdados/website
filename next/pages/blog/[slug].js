import {
  Box,
  Center,
  CircularProgress,
  Flex,
  // Image,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import BigTitle from "../../components/atoms/BigTitle";
import Image from "next/image";
// import { getPages } from "../api/pages";
import { useEffect, useState } from "react";
// import showdown from "showdown";
import { MainPageTemplate } from "../../components/templates/main";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { getAllPosts, getPostBySlug } from "../api/blog";

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

export default function Blog({ slug, mdxSource }) {
  const { frontmatter } = mdxSource;
  const router = useRouter();
  console.log(mdxSource);

  const components = {
    img: (props) => {
      return (
        <Image
          src={`${router.query.slug}/${props.src}`}
          width={500}
          height={500}
          priority
        />
      );
    },
  };

  return (
    <MainPageTemplate>
      <VStack
        alignItems="center"
        width="100%"
        backgroundColor="#FFFFFF"
        padding="0px 8%"
        paddingTop="50px"
        minHeight="60vh"
      >
        <>
          <BigTitle>{frontmatter.title}</BigTitle>
          <MDXRemote {...mdxSource} components={components}/>
        </>
      </VStack>
    </MainPageTemplate>
  );
}
