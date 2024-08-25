import { MainPageTemplate } from "../../components/templates/main";
import {
  Box,
  Heading,
  Image,
  Text,
  Wrap,
  WrapItem,
  Avatar,
  createIcon,
} from "@chakra-ui/react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { getAllPosts, getPostBySlug } from "../api/blog";
import Link from "../../components/atoms/Link";

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

const components = {
  h1: (props) => <Heading as="h1" size="xl" {...props} />,
  h2: (props) => (
    <Heading
      fontFamily={"Roboto"}
      as="h2"
      fontSize={"1.8rem"}
      marginY={"2rem"}
      {...props}
    />
  ),
  h3: (props) => (
    <Heading
      fontFamily={"Roboto"}
      as="h3"
      fontSize="1.5rem"
      marginY={"1.5rem"}
      {...props}
    />
  ),
  h4: (props) => (
    <Heading
      fontFamily={"Roboto"}
      as="h4"
      fontSize="1.2rem"
      marginY={"1.5rem"}
      {...props}
    />
  ),
  h5: (props) => (
    <Heading
      fontFamily={"Roboto"}
      as="h5"
      fontSize={"1.1rem"}
      marginY={"1.5rem"}
      {...props}
    />
  ),
  h6: (props) => (
    <Heading
      fontFamily={"Roboto"}
      as="h6"
      fontSize={"1.05rem"}
      marginY={"1.5rem"}
      {...props}
    />
  ),
  blockquote: (props) => (
    <Box
      bg={"#dbf9d7"}
      padding={"2rem 2.5rem"}
      marginY={"3rem"}
      borderRadius={"lg"}
      {...props}
    />
  ),
  a: (props) => <Text as="a" color="#0068C5" {...props} />,
  p: (props) => (
    <Text
      as={"p"}
      lineHeight={"7"}
      marginY={"2"}
      fontFamily={"Roboto"}
      {...props}
    />
  ),
  img: (props) => (
    <Box marginY={"2rem"}>
      <Image margin={"0 auto"} src={props.src} />
      <Text
        as="p"
        fontFamily={"Roboto"}
        fontSize={"sm"}
        color={"gray"}
        textAlign={"center"}
      >
        {props.alt}
      </Text>
    </Box>
  ),
  Blockquote: (props) => (
    <Box
      padding={"2rem 2.5rem"}
      borderLeft={"4px solid #7ec876"}
      marginY={"3rem"}
      position={"relative"}
    >
      <Text
        as="span"
        fontSize={"4rem"}
        pointerEvents={"none"}
        userSelect={"none"}
        position={"absolute"}
        lineHeight={"1"}
        top="1rem"
      >
        “
      </Text>
      <Text
        as="p"
        marginTop={"1.5rem"}
        fontFamily={"Roboto"}
        fontSize={"lg"}
        {...props}
      />
      <Text as="p" fontFamily={"Roboto"} color="gray" marginTop={"1rem"}>
        {props.author}
      </Text>
    </Box>
  ),
};

const authorIconFallback = createIcon({
  displayName: "user",
  viewBox: "0 0 22 22",
  path: (
    <path
      fill="current-color"
      d="M11.4998 1.87695C14.5058 1.87695 16.9425 4.31372 16.9425 7.31966C16.9425 10.3256 14.5058 12.7624 11.4998 12.7624C8.4939 12.7624 6.05713 10.3256 6.05713 7.31966C6.05713 4.31372 8.4939 1.87695 11.4998 1.87695ZM17.7346 13.2325L15.3087 12.6261C12.7601 14.4592 9.67081 14.0501 7.69096 12.6261L5.26511 13.2325C3.81137 13.596 2.7915 14.9021 2.7915 16.4006V17.6608C2.7915 18.5626 3.52253 19.2936 4.42432 19.2936H18.5754C19.4771 19.2936 20.2082 18.5626 20.2082 17.6608V16.4006C20.2082 14.9021 19.1883 13.596 17.7346 13.2325Z"
    />
  ),
});

export default function Blog({ slug, mdxSource }) {
  const { frontmatter } = mdxSource;

  return (
    <MainPageTemplate maxWidth={"900px"} margin={"0 auto"} paddingX="3rem">
      <Box paddingTop={"4rem"}>
        <Text
          as="span"
          display={"block"}
          marginBottom={"10"}
          color={"gray"}
          fontFamily={"Roboto"}
        >
          {new Date(frontmatter.date).toLocaleString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <Heading as="h1" fontFamily={"Roboto"} size="2xl">
          {frontmatter.title}
        </Heading>
        <Text
          as="p"
          fontFamily={"Roboto"}
          fontSize={"xl"}
          color={"gray"}
          marginY={"10"}
        >
          {frontmatter.description}
        </Text>
        <Box marginBottom={"4rem"}>
          <Wrap display={"flex"} alignItems={"center"}>
            {frontmatter?.authors?.map((author) => (
              <WrapItem alignItems={"center"}>
                <Avatar
                  size="md"
                  name={author.name}
                  src={author.avatar}
                  icon={authorIconFallback}
                />
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"start"}
                  marginLeft={"2"}
                  marginRight={"4"}
                >
                  <Link
                    href={author.social}
                    fontFamily={"Roboto"}
                    fontSize={"1rem"}
                    fontWeight={500}
                  >
                    {author.name}
                  </Link>
                  <Text
                    as="span"
                    fontSize={"0.8rem"}
                    fontFamily={"Roboto"}
                    color="gray"
                  >
                    {author.role}
                  </Text>
                </Box>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
        <MDXRemote {...mdxSource} components={components} />
      </Box>
    </MainPageTemplate>
  );
}
