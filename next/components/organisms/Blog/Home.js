import {
  Stack,
  Box,
  Heading,
  Image,
  Text,
  UnorderedList,
  ListItem,
  Grid,
  GridItem,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from 'next-i18next';
import { categories } from "../../../pages/api/blog/categories";
import Link from "../../atoms/Link";

import FilterIcon from "../../../public/img/icons/filterIcon";
import ChevronIcon from "../../../public/img/icons/chevronIcon";

export const dateToLocatePt = (date) =>
  new Date(date).toLocaleString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function DatePost({ date, slug }) {
  if (date.trim().length === 0) {
    console.error(`Invalid date \`${date}\` for post slug: ${slug}`);
    return null;
  }

  return (
    <Text
      as="span"
      fontFamily="Roboto"
      fontWeight="400"
      fontSize="16px"
      lineHeight="24px"
      color="#71757A"
    >
      {dateToLocatePt(date)}
    </Text>
  );
}

export const prettyCategory = (category) => {
  const prettyName = categories[category];
  if (prettyName == undefined) {
    console.error(`Not found category ${category}`);
    return category;
  }
  return prettyName;
};

function LatestBlogCard({ slug, frontmatter }) {
  const { title, description, date, authors } = frontmatter;
  return (
    <Stack
      flexDirection={{ base: "column", md: "column", lg: "row" }}
      spacing={0}
      gap="40px"
    >
      <Box
        role="group"
        width="100%"
        maxWidth={{ base: "100%", md: "100%", lg: "648px" }}
      >
        <Box
          overflow="hidden"
          border="1px solid #DEDFE0"
          borderRadius="16px"
        >
          <Link href={`/blog/${slug}`} >
            <Image
              cursor="pointer"
              width={"100%"}
              style={{ aspectRatio: "16/9" }}
              src={
                frontmatter.thumbnail ??
                "https://storage.googleapis.com/basedosdados-website/blog/um-site-feito-a-varias-maos/image_9.png"
              }
              objectFit={"none"}
              transition={
                "transform .6s cubic-bezier(0.01, 0.97, 0.42, 1.09)"
              }
              _groupHover={{ transform: "scale(1.03)" }}
            />
          </Link>
        </Box>
      </Box>

      <Stack
        width="100%"
        spacing="8px"
      >
        <Heading as="h1">
          <Link
            href={`/blog/${slug}`}
            fontFamily="Roboto"
            fontSize="50px"
            lineHeight="60px"
            fontWeight="500"
            color="#252A32"
            _hover={{
              opacity: 0.9
            }}
          >
            {title}
          </Link>
        </Heading>

        <Text
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="16px"
          lineHeight="24px"
          color="#71757A"
        >
          {description}
        </Text>

        <Box
          display="flex"
          flexDirection="column"
          marginTop="24px !important"
        >
          {authors ? (
            <Text
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="16px"
              lineHeight="24px"
              color="#252A32"
            >
              {authors[0].name}
            </Text>
          ) : null}
          <DatePost date={date.created} slug={slug} />
        </Box>
      </Stack>
    </Stack>
  );
}

function MiniBlogCard({ slug, frontmatter }) {
  const { title, description, date, authors } = frontmatter;
  return (
    <Stack
      flexDirection="column"
      spacing={0}
    >
      <Box role="group" marginBottom="8px">
        {/* <Box
          overflow={"hidden"}
          border="1px solid #DEDFE0"
          borderRadius="16px"
          marginBottom="24px"
        >
          <Link href={`/blog/${slug}`}>
            <Image
              width={"100%"}
              style={{ aspectRatio: "16/9" }}
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
        </Box> */}

        <Heading as="h3" marginTop="4px">
          <Link
            href={`/blog/${slug}`}
            fontFamily="Roboto"
            fontSize="24px"
            lineHeight="36px"
            fontWeight="500"
            color="#252A32"
            _hover={{
              opacity: 0.9
            }}
          >
            {title}
          </Link>
        </Heading>
      </Box>

      <Text
        fontFamily="Roboto"
        fontWeight="400"
        fontSize="16px"
        lineHeight="24px"
        color="#71757A"
      >
        {description}
      </Text>

      <Box
        display="flex"
        flexDirection="column"
        marginTop="16px !important"
      >
        {authors ? (
          <Text
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="16px"
            lineHeight="24px"
            color="#252A32"
          >
            {authors[0].name}
          </Text>
        ) : null}
        <DatePost date={date.created} slug={slug} />
      </Box>
    </Stack>
  );
}

function BlogHeader({ category }) {
  const { t } = useTranslation('blog')

  return (
    <Box margin="0 0 48px">
      <Box display="flex" width="fit-content" marginBottom="16px" alignItems="center">
        <FilterIcon
          alt="filtrar conjuntos"
          width="20px"
          height="20px"
          fill="#252A32"
        />
        <Text
          as="span"
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="16px"
          lineHeight="24px"
          color="#252A32"
          textAlign="center"
          width="100%"
          marginLeft="8px"
        >
          {t('filter')}
        </Text>
      </Box>

      <Box as="nav">
        <UnorderedList marginInlineStart="0" display="flex" gap="8px">
          {[
            { name: t('all'), shortName: "all", href: "/blog" },
            ...Object.entries(categories).map((category) => {
              const [shortName, name] = category;
              return {
                name,
                shortName,
                href: `/blog?category=${shortName}`,
              };
            }),
          ].map(({ name, shortName, href }) => (
            <ListItem
              key={name}
              listStyleType="none"
              borderRadius="100px"
              pointerEvents={shortName === category ? "none" : "default"}
              background={shortName === category ? "#2B8C4D" : "#EEEEEE"}
              _hover={{
                opacity: 0.8
              }}
            >
              <Link
                _hover={{ textDecoration: "none" }}
                href={href}
                fontSize="12px"
                lineHeight="18px"
                letterSpacing="0.1px"
                fontWeight="500"
                padding="8px 12px"
                color={shortName === category ? "#FFFFFF" : "#464A51"}
              >
                {name}
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    </Box>
  );
}

export function BlogGrid({ posts, category }) {
  const { t } = useTranslation('blog')
  const [data, setData] = useState({})

  function groupByCategories(array) {
    const result = {}

    array.forEach(elm => {
      const { frontmatter } = elm
      const categories = frontmatter.categories || []

      if(categories.length > 0 ) {
        categories.forEach(category => {
          if (!result[category]) {
            result[category] = []
          }
          result[category].push({ ...elm })
        })
      } else {
        if (!result["no categories"]) {
          result["no categories"] = []
        }
        result["no categories"].push({ ...elm })
      }
    })

    return result
  }

  useEffect(() => {
    setData(groupByCategories(posts))
  }, [posts])

  return (
    <Stack
      maxWidth="1440px"
      boxSizing="content-box"
      paddingX="24px"
      paddingTop="24px"
      marginX="auto"
      spacing={0}
    >
      <BlogHeader category={category} />

      {category === "all" ?
        data && Object.entries(data).map(([key, value], index) => {
          return (
            <Box width="100%" key={key}>
              <Divider
                display={index === 0 ? "none" : "flex"}
                borderWidth="0px"
                margin="80px 0 24px"
                borderTop="4px solid #252A32"
                opacity="1"
              />
              <Stack
                spacing={0}
                flexDirection="row"
                justifyContent="space-between"
                marginBottom="40px"
              >
                <Text
                  fontFamily="Roboto"
                  fontWeight="500"
                  fontSize="20px"
                  lineHeight="30px"
                  color="#252A32"
                >
                  {categories?.[key] || t(key)}
                </Text>

                {value.length > 7 &&
                  <Link
                    display="flex"
                    flexDirection="row"
                    href={`blog?category=${key}`}
                    gap="8px"
                    cursor="pointer"
                    textAlign="center"
                    fontWeight="400"
                    fontSize="16px"
                    lineHeight="24px"
                    color="#0068C5"
                    fill="#0068C5"
                    _hover={{
                      color: "#0057A4",
                      fill: "#0068C5"
                    }}
                  >
                    {t("seeAll")}
                    <ChevronIcon
                      alt=""
                      width="16px"
                    />
                  </Link>
                }
              </Stack>

              <Grid gap="40px" templateColumns={{ md: "1fr 1fr", xl: "1fr 1fr 1fr" }}>
                {value.slice(0, 7).map((post, index) => {
                  if (index === 0) {
                    return (
                      <GridItem
                        as="article"
                        key={index}
                        gridColumn={{ md: "span 2", xl: "span 3" }}
                        borderBottom={{base: "1px solid #DEDFE0", md: "none"}}
                        paddingBottom={{base: "24px", md: "none"}}
                      >
                        <LatestBlogCard key={post.slug} {...post} />
                      </GridItem>
                    );
                  } else {
                    return (
                      <GridItem
                        as="article"
                        key={index}
                        boxSizing="content-box"
                        borderBottom="1px solid #DEDFE0"
                        paddingBottom="24px"
                      >
                        <MiniBlogCard key={post.slug} {...post} />
                      </GridItem>
                    );
                  }
                })}
              </Grid>
            </Box>
          )
        })
        :
        <Box width="100%">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="20px"
            lineHeight="30px"
            color="#252A32"
            marginBottom="40px"
          >
            {categories?.[category] || category}
          </Text>

          <Grid gap="40px" templateColumns={{ md: "1fr 1fr", xl: "1fr 1fr 1fr" }}>
            {posts.map((post, index) => {
              if (index === 0) {
                return (
                  <GridItem
                    as="article"
                    key={index}
                    gridColumn={{ md: "span 2", xl: "span 3" }}
                    borderBottom={{base: "1px solid #DEDFE0", md: "none"}}
                    paddingBottom={{base: "24px", md: "none"}}
                  >
                    <LatestBlogCard key={post.slug} {...post} />
                  </GridItem>
                );
              } else {
                return (
                  <GridItem
                    as="article"
                    key={index}
                    boxSizing="content-box"
                    borderBottom="1px solid #DEDFE0"
                    paddingBottom="24px"
                  >
                    <MiniBlogCard key={post.slug} {...post} />
                  </GridItem>
                );
              }
            })}
          </Grid>
        </Box>
      }
    </Stack>
  );
}