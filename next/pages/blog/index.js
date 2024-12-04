import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MainPageTemplate } from "../../components/templates/main";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BlogGrid } from "../../components/organisms/Blog/Home";
import { getAllPosts } from "../api/blog";

export async function getStaticProps({ locale }) {
  const posts = await getAllPosts(locale)

  return { 
    props: {
      posts,
      ...(await serverSideTranslations(locale, ['common', 'blog', 'menu'])),
    }
  };
}

export default function Blog({ posts }) {
  const router = useRouter()
  const { query } = router
  const [data, setData] = useState([])
  const [category, setCategory] = useState("all")

  useEffect(() => {
    setData(posts)
  }, [posts])

  useEffect(() => {
    if(!query.category) {
      setCategory("all")
    } else {
      const filteredPost = posts.filter(({ frontmatter }) =>
        frontmatter?.categories?.includes(query.category),
      );

      if(filteredPost.length > 0) {
        setCategory(query.category)
        return setData(filteredPost)
      } else {
        router.replace({
          pathname: router.pathname,
        }, undefined, { shallow: true });
      }
    }
  }, [query.category])

  return (
    <MainPageTemplate>
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

      <BlogGrid posts={data} category={category}/>
    </MainPageTemplate>
  );
}
