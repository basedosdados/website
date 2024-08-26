import {
  Heading,
  Box,
  Text,
  Grid,
  GridItem,
  Wrap,
  WrapItem,
  Avatar,
  createIcon,
  Image,
} from "@chakra-ui/react";
import Head from "next/head";
// import Display from "../components/atoms/Display";
import { MainPageTemplate } from "../components/templates/main";
// import { isMobileMod } from "../hooks/useCheckMobile.hook";
import { getAllPosts } from "./api/blog";
import Link from "../components/atoms/Link";
// import Subtitle from "../components/atoms/Subtitle";

export const authorIconFallback = createIcon({
  displayName: "user",
  viewBox: "0 0 22 22",
  path: (
    <path
      fill="current-color"
      d="M11.4998 1.87695C14.5058 1.87695 16.9425 4.31372 16.9425 7.31966C16.9425 10.3256 14.5058 12.7624 11.4998 12.7624C8.4939 12.7624 6.05713 10.3256 6.05713 7.31966C6.05713 4.31372 8.4939 1.87695 11.4998 1.87695ZM17.7346 13.2325L15.3087 12.6261C12.7601 14.4592 9.67081 14.0501 7.69096 12.6261L5.26511 13.2325C3.81137 13.596 2.7915 14.9021 2.7915 16.4006V17.6608C2.7915 18.5626 3.52253 19.2936 4.42432 19.2936H18.5754C19.4771 19.2936 20.2082 18.5626 20.2082 17.6608V16.4006C20.2082 14.9021 19.1883 13.596 17.7346 13.2325Z"
    />
  ),
});

// @ts-check
export async function getStaticProps() {
  return { props: { posts: getAllPosts() } };
}

export function DatePost({ date }) {
  if (date.trim().length === 0) {
    console.error(`Invalid date ${date}`);
    return null;
  }
  const localeDate = new Date(date).toLocaleString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <Text
      as="p"
      fontFamily={"Roboto"}
      fontSize={"sm"}
      marginTop={"0.5rem"}
      color="gray"
    >
      {localeDate}
    </Text>
  );
}

function LatestBlogCard({ slug, frontmatter, latest }) {
  const { title, description, date, authors } = frontmatter;
  return (
    <Box display={"flex"} flexDir={"column"}>
      <Box role="group">
        <a href={`/blog/${slug}`}>
          <Box overflow={"hidden"}>
            <Image
              width={"100%"}
              height={"300px"}
              src={
                frontmatter.thumbnail ||
                "https://storage.googleapis.com/basedosdados-website/blog/um-site-feito-a-varias-maos/image_9.png"
              }
              objectFit={"none"}
              transition={"transform .6s cubic-bezier(0.01, 0.97, 0.42, 1.09)"}
              _groupHover={{ transform: "scale(1.1)" }}
            />
          </Box>
          <Heading
            as="h1"
            marginY={"1rem"}
            fontSize="3xl"
            fontWeight={500}
            fontFamily={"Roboto"}
            _groupHover={{ color: "rgb(43, 140, 77)" }}
          >
            {title}
          </Heading>
          <Text
            as="p"
            fontFamily={"Roboto"}
            fontWeight={400}
            fontSize={"1rem"}
            marginTop={4}
            color={"gray"}
          >
            {description}
          </Text>
        </a>
      </Box>
      {authors ? (
        <Box>
          <Wrap display={"flex"} alignItems={"center"}>
            {authors.map((author, index) => (
              <WrapItem alignItems={"center"}>
                <Avatar
                  size="sm"
                  marginLeft={index !== 0 ? "-15px" : "0"}
                  title={author.name}
                  name={author.name}
                  src={author.avatar}
                  icon={authorIconFallback}
                />
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      ) : null}
      <DatePost date={date} />
    </Box>
  );
}

function MiniBlogCard({ slug, frontmatter }) {
  const { title, description, date, authors } = frontmatter;
  return (
    <Box role="group">
      <a href={`/blog/${slug}`}>
        <Box display={"flex"}>
          <Box
            overflow={"hidden"}
            position={"relative"}
            width={"150px"}
            height={"150px"}
          >
            <Image
              position={"absolute"}
              top="0"
              width={"100%"}
              height={"100%"}
              // minWidth={"100px"}
              // height={"100px"}
              src={
                frontmatter.thumbnail ||
                "https://storage.googleapis.com/basedosdados-website/blog/um-site-feito-a-varias-maos/image_9.png"
              }
              objectFit={"cover"}
              transition={"transform .6s cubic-bezier(0.01, 0.97, 0.42, 1.09)"}
              _groupHover={{ transform: "scale(1.1)" }}
            />
          </Box>
          <Box marginLeft={"1rem"} width={"75%"}>
            <Heading
              as="h3"
              fontSize={"xl"}
              fontWeight={500}
              fontFamily={"Roboto"}
              _groupHover={{ color: "rgb(43, 140, 77)" }}
            >
              {title}
            </Heading>
            <Text
              as="p"
              fontFamily={"Roboto"}
              fontWeight={400}
              fontSize={"1rem"}
              marginY={4}
              color={"gray"}
            >
              {description}
            </Text>
            <Box display={"flex"}>
              {authors ? (
                <Wrap
                  display={"flex"}
                  alignItems={"center"}
                  marginRight={".5rem"}
                >
                  {authors.map((author, index) => (
                    <WrapItem key={index} alignItems={"center"}>
                      <Avatar
                        size="sm"
                        marginLeft={index !== 0 ? "-15px" : "0"}
                        title={author.name}
                        name={author.name}
                        src={author.avatar}
                        icon={authorIconFallback}
                      />
                    </WrapItem>
                  ))}
                </Wrap>
              ) : null}
              <DatePost date={date} />
            </Box>
          </Box>
        </Box>
      </a>
    </Box>
  );
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

      <Grid
        marginTop={"5rem"}
        // h="200px"
        templateRows="min-content min-content 1fr"
        templateColumns="1fr 1fr"
        gap={"5rem"}
      >
        {posts.map((post, index) => {
          if (index === 0) {
            return (
              <GridItem key={index} colSpan={"1"} gridRow={"span 2"}>
                <LatestBlogCard key={post.slug} {...post} />
              </GridItem>
            );
          } else {
            return (
              <GridItem
                key={index}
                // colSpan={index === 0 ? 1 : ""}
                // gridRow={index === 0 ? "span 2" : ""}
              >
                <MiniBlogCard key={post.slug} {...post} />
              </GridItem>
            );
          }
        })}
      </Grid>
    </MainPageTemplate>
  );
}
