import { Box, Center, CircularProgress, Stack, VStack } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import BigTitle from "../../components/atoms/BigTitle";
import SiteHead from "../../components/atoms/SiteHead";
import Menu from "../../components/molecules/Menu";
import Footer from "../../components/molecules/Footer";
import { getStrapiPage, getStrapiPages } from "../api/strapi";
import { useState } from "react";
import showdown from "showdown";

export async function getStaticPaths(context) {
  let { data: strapiPages } = await getStrapiPages();

  return {
    paths: strapiPages.map((p) => ({
      params: { page: p.id.toString() },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  let { data: strapiPages } = await getStrapiPages();

  return {
    props: {
      strapiPages,
    },
  };
}

function BlogPage({ strapiPages = [] }) {
  const router = useRouter();
  const [converter, _] = useState(new showdown.Converter());
  const [leftColumnHtml, setLeftColumnHtml] = useState("");
  const [rightColumnHtml, setRightColumnHtml] = useState("");
  const { page } = router.query;
  const { data = null, isLoading } = useQuery(
    ["page", page],
    () => getStrapiPage(page),
    {
      onSuccess: function (data) {
        if (!data) return;

        setRightColumnHtml(converter.makeHtml(data.RightColumnText));
        setLeftColumnHtml(converter.makeHtml(data.LeftColumnText));
      },
    }
  );

  if (isLoading || !data)
    return (
      <>
        <SiteHead />
        <Menu strapiPages={strapiPages} />
        <Center
          minHeight="600px"
          width="100%"
          backgroundColor="#fafafa"
          padding="0px 5%"
        >
          <CircularProgress isIndeterminate />
        </Center>
        <Footer />
      </>
    );

  return (
    <>
      <SiteHead />
      <Menu strapiPages={strapiPages} />
      <VStack
        alignItems="center"
        width="100%"
        backgroundColor="#fafafa"
        padding="50px 5%"
        marginTop="80px"
        minHeight="60vh"
      >
        <>
          <BigTitle>{data.title}</BigTitle>
          <Stack
            spacing={20}
            id="blog"
            direction={{ base: "column", lg: "row" }}
          >
            <Box dangerouslySetInnerHTML={{ __html: leftColumnHtml }} />
            <Box dangerouslySetInnerHTML={{ __html: rightColumnHtml }} />
          </Stack>
        </>
      </VStack>
      <Footer />
    </>
  );
}

export default BlogPage;
