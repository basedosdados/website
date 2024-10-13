import Head from "next/head";
import { MainPageTemplate } from "../components/templates/main";
import { BlogGrid } from "../components/organisms/Blog";
import { getAllPosts } from "./api/blog";

export async function getStaticProps() {
  const posts = await getAllPosts();
  return { props: { posts } };
}

export default function Blog({ posts }) {
  return (
    <MainPageTemplate maxWidth={"1310px"} margin={"0 auto"} paddingX="24px">
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

      <BlogGrid posts={posts} category={"Todos"} />
    </MainPageTemplate>
  );
}
