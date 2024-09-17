import { getAllPosts, getPostsByCategory } from "./../../api/blog";
import { BlogGrid, prettyCategory } from "../../../components/organisms/Blog";
import { MainPageTemplate } from "../../../components/templates/main";
import Head from "next/head";

export async function getStaticProps({ params }) {
  const { category } = params;

  const posts = await getPostsByCategory(category);

  return {
    props: {
      category,
      posts,
    },
  };
}

export async function getStaticPaths() {
  const allPosts = await getAllPosts();

  const allCategories = allPosts
    .map(({ frontmatter }) => frontmatter?.categories)
    .filter((categories) => categories !== undefined)
    .flat();

  const paths = [...new Set(allCategories)].map((category) => ({
    params: { category: category.trim() },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default function TaggedPosts({ category, posts }) {
  const categoryName = prettyCategory(category);
  const metaContent = `Posts em ${categoryName} – Blog – Base dos Dados`;
  return (
    <MainPageTemplate maxWidth={"1310px"} margin={"0 auto"} paddingX="24px">
      <Head>
        <title>{metaContent}</title>
        <meta property="og:title" content={metaContent} key="ogtitle" />
        <meta property="og:description" content={metaContent} key="ogdesc" />
      </Head>

      <BlogGrid posts={posts} category={category} />
    </MainPageTemplate>
  );
}
