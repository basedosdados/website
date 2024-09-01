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
  Link,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { MainPageTemplate } from "../components/templates/main";
import { getAllPosts } from "./api/blog";

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
    <Text as="p" fontFamily={"Roboto"} fontSize={"sm"} color="gray">
      {localeDate}
    </Text>
  );
}

function Authors({ authors }) {
  const MAX_ICONS = 3;

  return authors.slice(0, MAX_ICONS).map((author, index) => {
    return (
      <WrapItem key={index} alignItems={"center"}>
        {authors.length > MAX_ICONS && index == 2 ? (
          <Avatar
            size="sm"
            backgroundColor={"#efefef"}
            marginLeft={"-15px"}
            title={`${authors
              .slice(MAX_ICONS - 1)
              .map((author) => author.name)
              .join(", ")}`}
            icon={<span>{`+${authors.length - MAX_ICONS + 1}`}</span>}
          />
        ) : (
          <Avatar
            size="sm"
            marginLeft={index !== 0 ? "-15px" : "0"}
            title={author.name}
            name={author.name}
            src={author?.avatar}
            icon={authorIconFallback}
          />
        )}
      </WrapItem>
    );
  });
}

function LatestBlogCard({ slug, frontmatter }) {
  const { title, description, date, authors } = frontmatter;
  return (
    <Box display={"flex"}>
      <Box role="group" flexGrow={"1"}>
        <Box
          overflow={"hidden"}
          border="1px solid #DEDFE0"
          borderRadius="16px"
          marginRight={"2rem"}
        >
          <NextLink href={`/blog/${slug}`} passHref>
            <Link>
              <Image
                cursor="pointer"
                width={"100%"}
                height={"370px"}
                src={
                  frontmatter.thumbnail ||
                  "https://storage.googleapis.com/basedosdados-website/blog/um-site-feito-a-varias-maos/image_9.png"
                }
                objectFit={"none"}
                transition={
                  "transform .6s cubic-bezier(0.01, 0.97, 0.42, 1.09)"
                }
                _groupHover={{ transform: "scale(1.03)" }}
              />
            </Link>
          </NextLink>
        </Box>
      </Box>
      <Box width={"40%"}>
        <Heading
          as="h1"
          fontSize="4xl"
          fontWeight={500}
          fontFamily={"Roboto"}
          _groupHover={{ color: "rgb(43, 140, 77)" }}
        >
          <NextLink href={`/blog/${slug}`} passHref>
            <Link>{title}</Link>
          </NextLink>
        </Heading>
        <Text
          as="p"
          fontFamily={"Roboto"}
          fontWeight={400}
          fontSize={"1rem"}
          marginY={"2"}
          color={"gray"}
        >
          {description}
        </Text>
        <Box display={"flex"} alignItems={"center"}>
          {authors ? (
            <Wrap display={"flex"} alignItems={"center"} marginRight={"0.5rem"}>
              <Authors authors={authors} />
            </Wrap>
          ) : null}
          <DatePost date={date} />
        </Box>
      </Box>
    </Box>
  );
}

function MiniBlogCard({ slug, frontmatter }) {
  const { title, description, date, authors } = frontmatter;
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box role="group">
        <Box overflow={"hidden"} border="1px solid #DEDFE0" borderRadius="16px">
          <NextLink href={`/blog/${slug}`} passHref>
            <Link>
              <Image
                width={"100%"}
                style={{ aspectRatio: "16/8" }}
                src={
                  frontmatter.thumbnail ||
                  "https://storage.googleapis.com/basedosdados-website/blog/um-site-feito-a-varias-maos/image_9.png"
                }
                objectFit={"cover"}
                transition={
                  "transform .6s cubic-bezier(0.01, 0.97, 0.42, 1.09)"
                }
                _groupHover={{ transform: "scale(1.03)" }}
              />
            </Link>
          </NextLink>
        </Box>
        <Heading
          as="h3"
          fontSize={"xl"}
          fontWeight={500}
          fontFamily={"Roboto"}
          _groupHover={{ color: "rgb(43, 140, 77)" }}
        >
          <NextLink href={`/blog/${slug}`} passHref>
            <Link
              display="block"
              paddingTop={"1rem"}
              _groupHover={{ textDecoration: "underline" }}
            >
              {title}
            </Link>
          </NextLink>
        </Heading>
      </Box>
      <Text
        as="p"
        fontFamily={"Roboto"}
        fontWeight={400}
        fontSize={"1rem"}
        marginY={".5rem"}
        color={"gray"}
      >
        {description}
      </Text>
      <Box display={"flex"} alignItems={"center"}>
        {authors ? (
          <Wrap display={"flex"} alignItems={"center"} marginRight={".5rem"}>
            <Authors authors={authors} />
          </Wrap>
        ) : null}
        <DatePost date={date} />
      </Box>
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

      <Grid marginTop={"4rem"} gap={"3rem"} templateColumns="1fr 1fr 1fr">
        {posts.map((post, index) => {
          if (index === 0) {
            return (
              <GridItem as="article" key={index} gridColumn={"span 3"}>
                <LatestBlogCard key={post.slug} {...post} />
              </GridItem>
            );
          } else {
            return (
              <GridItem
                as="article"
                key={index}
                borderTop={"1px solid #DEDFE0"}
                paddingTop={"3rem"}
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
