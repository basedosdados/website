import { VStack, Heading, Box, Text, Stack } from "@chakra-ui/react";
import Head from "next/head";
import Display from "../components/atoms/Display";
import { MainPageTemplate } from "../components/templates/main";
import { isMobileMod } from "../hooks/useCheckMobile.hook";
import { getAllPosts } from "./api/blog";
import Link from "../components/atoms/Link";
import Subtitle from "../components/atoms/Subtitle";

export async function getStaticProps() {
  return { props: { posts: getAllPosts() } };
}

function BlogCard({ slug, frontmatter }) {
  const { title, spoiler, date, authors } = frontmatter;
  return (
    <Box display={"flex"} flexDir={"column"}>
      <Heading fontSize="xl">{title}</Heading>
      <Text mt={4}>{spoiler}</Text>
      <Text>
        {new Date(date).toLocaleString("pt-BR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
      <Link href={`/blog/${slug}`}>Leia mais</Link>
    </Box>
  );
}

export default function Blog({ posts }) {
  console.log(posts);
  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>Blog – Base dos Dados</title>
        <meta
          property="og:title"
          content="Blog – Base dos Dados"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Blog da Base dos Dados"
          key="ogdesc"
        />
      </Head>

      <Stack direction={"row"} width="90%" maxWidth="1264px" margin="auto">
        {posts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </Stack>
    </MainPageTemplate>
  );
}
