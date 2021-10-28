import {
  Box,
  Center,
  CircularProgress,
  Flex,
  Image,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import BigTitle from "../../components/atoms/BigTitle";
import { getStrapiPages } from "../api/strapi";
import { useEffect, useState } from "react";
import showdown from "showdown";
import { MainPageTemplate } from "../../components/templates/main";

export async function getStaticProps(context) {
  let { data: strapiPages } = await getStrapiPages();

  return {
    props: {
      strapiPages,
    },
    revalidate: 60, //TODO: Increase this timer
  };
}

export async function getStaticPaths(context) {
  let { data: strapiPages } = await getStrapiPages();

  return {
    paths: strapiPages.map((p) => ({
      params: { page: p.id.toString() },
    })),
    fallback: "blocking",
  };
}

function BlogPage({ strapiPages = [] }) {
  const router = useRouter();
  const [converter, _] = useState(new showdown.Converter());
  const [leftColumnHtml, setLeftColumnHtml] = useState("");
  const [rightColumnHtml, setRightColumnHtml] = useState("");
  const [data, setData] = useState(null);
  const { page } = router.query;

  useEffect(() => {
    const strapiPage = strapiPages.filter((p) => p.id == page)[0];
    setRightColumnHtml(converter.makeHtml(strapiPage.RightColumnText));
    setLeftColumnHtml(converter.makeHtml(strapiPage.LeftColumnText));
    setData(strapiPage);

    typeof hbspt != "undefined" ? (
      hbspt.forms.create({
        region: "na1",
        portalId: "9331013",
        formId: "3c85cc81-2b91-4a90-b3ff-41412dfed25e",
        target: "#form-hbspt",
      })
    ) : (
      <></>
    );
  }, []);

  if (!data)
    return (
      <MainPageTemplate strapiPages={strapiPages}>
        <Center
          minHeight="600px"
          width="100%"
          backgroundColor="#FFFFFF"
          padding="0px 5%"
        >
          <CircularProgress isIndeterminate />
        </Center>
      </MainPageTemplate>
    );

  return (
    <MainPageTemplate strapiPages={strapiPages}>
      <VStack
        alignItems="center"
        width="100%"
        backgroundColor="#FFFFFF"
        padding="0px 8%"
        paddingTop="50px"
        minHeight="60vh"
      >
        <>
          <BigTitle>{data.title}</BigTitle>
          <Box position="relative" width="80%">
            <Box
              position="absolute"
              right="0px"
              top="-500%"
              minWidth="100px"
              minHeight="108px"
              zIndex="0"
            >
              <Image
                priority
                src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/fundo_rede.png"
                layout="fill"
                objectFit="contain"
              />
            </Box>
          </Box>

          <Flex
            spacing={20}
            id="blog"
            flexDirection={{ base: "column", lg: "row" }}
            position="relative"
            zIndex="1"
          >
            <Box
              flex="1"
              marginRight={{ base: "0px", lg: "5%" }}
              dangerouslySetInnerHTML={{ __html: leftColumnHtml }}
            />
            <Box
              flex="1"
              dangerouslySetInnerHTML={{ __html: rightColumnHtml }}
            />
          </Flex>
        </>
      </VStack>
    </MainPageTemplate>
  );
}

export default BlogPage;
