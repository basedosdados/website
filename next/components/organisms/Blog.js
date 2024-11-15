import {
  Stack,
  Box,
  Heading,
  Image,
  Text,
  Wrap,
  WrapItem,
  Avatar,
  UnorderedList,
  ListItem,
  OrderedList,
  Button,
  useClipboard,
  createIcon,
  AspectRatio,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Grid,
  GridItem,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import hljs from "highlight.js/lib/core";
import { useTranslation } from 'next-i18next';
import { categories } from "../../pages/api/blog/categories";
import Link from "../atoms/Link";

import FilterIcon from "../../public/img/icons/filterIcon";
import { CopyIcon } from "../../public/img/icons/copyIcon";
import CheckIcon from "../../public/img/icons/checkIcon";
import { TimeIcon } from "@chakra-ui/icons";

export const dateToLocatePt = (date) =>
  new Date(date).toLocaleString("pt-BR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function DatePost({ date, slug }) {
  if (date.trim().length === 0) {
    console.error(`Invalid date \`${date}\` for post slug: ${slug}`);
    return null;
  }

  return (
    <Text
      as="span"
      fontFamily={"Roboto"}
      fontSize={"sm"}
      color="gray"
      lineHeight={"1"}
    >
      {dateToLocatePt(date)}
    </Text>
  );
}

const LANGS_SUPPORTED = [
  "sql",
  "python",
  "r",
  "bash",
  "sh",
  "stata",
  "markdown",
  "md",
];

function CodeBlock({ children }) {
  const code = children.props.children;

  const language = children.props.className?.replace("language-", "").trim();

  const { hasCopied, onCopy } = useClipboard(code);

  const highlighted = LANGS_SUPPORTED.includes(language)
    ? hljs.highlight(code, {
        language: language,
      })
    : { value: code };

  return (
    <Box marginY={"1rem"} borderRadius={"8px"} backgroundColor={"#282b2e"}>
      <Box display={"flex"} alignItems={"center"} padding={"0 0.5rem"}>
        {language ? (
          <Text
            as="span"
            display={"block"}
            paddingLeft={"7px"}
            fontWeight={500}
            fontSize="12px"
            color="#878A8E"
            textTransform={"capitalize"}
            userSelect={"none"}
            fontFamily={"Roboto"}
          >
            {["sh", "sql"].includes(language)
              ? language.toUpperCase()
              : language}
          </Text>
        ) : null}
        <Button
          variant="unstyled"
          onClick={onCopy}
          _groupActive={{ background: "transparent" }}
          backgroundColor={"transparent"}
          padding={0}
          display={"flex"}
          marginLeft={"auto"}
          alignItems={"center"}
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="12px"
          color="#878A8E"
          fill="#878A8E"
          _hover={{
            fill: "#9D9FA3",
            color: "#9D9FA3",
          }}
          rightIcon={
            hasCopied ? (
              <CheckIcon alt="copiado conteúdo" width="24px" height="24px" />
            ) : (
              <CopyIcon alt="copiar conteúdo" width="24px" height="24px" />
            )
          }
        >
          {hasCopied ? "Copiado" : "Copiar"}
        </Button>
      </Box>
      <Box
        as="pre"
        display="flex"
        justifyContent="space-between"
        width="100%"
        maxHeight={"70vh"}
        overflowX="auto"
        overflowY={"auto"}
        whiteSpace={"pre"}
        borderBottomLeftRadius={"8px"}
        borderBottomRightRadius={"8px"}
      >
        <Text
          as="code"
          paddingTop={"0 !important"}
          width={"100%"}
          className={`hljs ${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted.value }}
        />
      </Box>
    </Box>
  );
}

const ShareIcon = createIcon({
  displayName: "share",
  viewBox: "0 0 16 16",
  path: (
    <path d="m 12.818311,11.294921 c 1.280064,0 2.333667,1.054406 2.333667,2.333668 0,1.279261 -1.054406,2.371411 -2.333667,2.371411 -1.279262,0 -2.333668,-1.09215 -2.333668,-2.371411 0,-0.187915 0,-0.377435 0.03774,-0.526802 L 4.8407964,9.789199 A 2.4252158,2.4252158 0 0 1 0.772537,8.020076 2.4252158,2.4252158 0 0 1 4.8383872,6.250954 L 10.48384,2.9761092 A 2.8974102,2.8974102 0 0 1 10.40915,2.4091547 C 10.40915,1.0921502 11.5013,0 12.818304,0 c 1.317008,0 2.409159,1.0921502 2.409159,2.4091547 0,1.3170047 -1.092151,2.4091553 -2.409155,2.4091553 -0.640032,0 -1.204577,-0.263401 -1.656695,-0.677776 L 5.5161598,7.453925 c 0.036941,0.187914 0.074684,0.377434 0.074684,0.564545 0,0.187111 -0.037744,0.377434 -0.075486,0.562137 l 5.7217422,3.31339 c 0.417587,-0.377434 0.979724,-0.602289 1.582012,-0.602289 z"></path>
  ),
});

const FacebookIcon = createIcon({
  displayName: "facebook",
  viewBox: "0 0 24 24",
  path: (
    <path
      fill="currentColor"
      d="M22 12.061C22 6.505 17.523 2 12 2S2 6.505 2 12.061c0 5.022 3.657 9.184 8.438 9.939v-7.03h-2.54V12.06h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.908h-2.33V22c4.78-.755 8.437-4.917 8.437-9.939"
    ></path>
  ),
});

const LinkedInIcon = createIcon({
  displayName: "linkedin",
  viewBox: "0 0 24 24",
  path: (
    <path
      fill="currentColor"
      d="M21 4.324v15.352A1.324 1.324 0 0 1 19.676 21H4.324A1.324 1.324 0 0 1 3 19.676V4.324A1.324 1.324 0 0 1 4.324 3h15.352A1.324 1.324 0 0 1 21 4.324M8.295 9.886H5.648v8.478h2.636V9.886zm.221-2.914a1.52 1.52 0 0 0-1.51-1.533H6.96a1.533 1.533 0 0 0 0 3.066 1.52 1.52 0 0 0 1.556-1.487zm9.825 6.236c0-2.555-1.626-3.542-3.229-3.542a3.02 3.02 0 0 0-2.67 1.37h-.082V9.875H9.875v8.477h2.648v-4.494a1.754 1.754 0 0 1 1.579-1.893h.104c.837 0 1.464.523 1.464 1.858v4.54h2.647l.024-5.144z"
    ></path>
  ),
});

const XIcon = createIcon({
  displayName: "xicon",
  viewBox: "0 0 1200 1227",
  path: (
    <path
      fill="currentColor"
      d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
    ></path>
  ),
});

function NativeShare({ url, title, description }) {
  const { hasCopied, onCopy } = useClipboard(url);

  const [nagivatorAvailable, setNavigatorAvailable] = useState(false);

  useEffect(() => {
    setNavigatorAvailable(typeof window.navigator.share !== "undefined");
  }, []);

  return (
    <Box
      as="button"
      variant="unstyled"
      onClick={() => {
        if (nagivatorAvailable) {
          navigator
            .share({
              title: `${title} – Blog – Base dos Dados`,
              text: `${title}\n${description}`,
              url: url,
            })
            .then(() => {})
            .catch((error) => {
              console.error(`Something went wrong to share: ${url}`, error);
            });
        } else {
          onCopy();
        }
      }}
    >
      {nagivatorAvailable ? (
        <ShareIcon width={"1.4rem"} />
      ) : hasCopied ? (
        <CheckIcon width={"1.4rem"} height={"1.4rem"} alt="copiado conteúdo" />
      ) : (
        <CopyIcon width={"1.4rem"} height={"1.4rem"} alt="copiar conteúdo" />
      )}
    </Box>
  );
}

export function ShareButtons({ frontmatter }) {
  const { title, description } = frontmatter;

  const [origin, setOrigin] = useState("https://basedosdados.org");
  const router = useRouter();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const text = `${title} – Blog – Base dos Dados`;
  const url = origin + router.asPath;
  const encodedUrl = encodeURIComponent(url);

  return (
    <Box display={"flex"} alignItems={"center"} gap="1rem" marginTop={"1rem"}>
      <Link
        href={`https://x.com/share?text=${encodeURIComponent(text)}&url=${encodedUrl}`}
        target="_blank"
      >
        <XIcon width={"1.1rem"} height={"1.1rem"} />
      </Link>
      <Link
        href={`https://www.facebook.com/sharer/sharer.php?t=${encodeURIComponent(text)}&u=${encodedUrl}`}
        target="_blank"
      >
        <FacebookIcon width={"1.4rem"} height={"1.4rem"} />
      </Link>
      <Link
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
      >
        <LinkedInIcon width={"1.4rem"} height={"1.4rem"} />
      </Link>
      <NativeShare url={url} title={title} description={description} />
    </Box>
  );
}

function HeadingWithAnchor(props) {
  return (
    <Heading
      {...props}
      scrollMarginTop={"6rem"}
      fontFamily="Roboto"
      marginY={"1.5rem"}
      role="group"
    >
      {props.children}
      <Link
        href={`#${props.id}`}
        variant="unstyled"
        opacity="0"
        color="gray"
        fontSize={"inherit"}
        marginLeft="5px"
        transition="none"
        _hover={{ textDecoration: "none" }}
        _groupHover={{ opacity: "1" }}
      >
        {"#"}
      </Link>
    </Heading>
  );
}

function FigCaption(props) {
  return props.children ? (
    <Text
      as="figcaption"
      fontFamily={"Roboto"}
      fontSize={"sm"}
      color={"gray"}
      textAlign={"center"}
      marginY="0.5rem"
    >
      {props.children}
    </Text>
  ) : null;
}

export const mdxComponents = {
  h1: (props) => <HeadingWithAnchor as="h2" size="1.8rem" {...props} />,
  h2: (props) => <HeadingWithAnchor as="h2" fontSize="1.8rem" {...props} />,
  h3: (props) => <HeadingWithAnchor as="h3" fontSize="1.5rem" {...props} />,
  h4: (props) => <HeadingWithAnchor as="h4" fontSize="1.2rem" {...props} />,
  h5: (props) => <HeadingWithAnchor as="h5" fontSize={"1.1rem"} {...props} />,
  h6: (props) => <HeadingWithAnchor as="h6" fontSize={"1.05rem"} {...props} />,
  blockquote: (props) => (
    <Box
      as="blockquote"
      paddingY={"0.1rem"}
      paddingLeft={"1.5rem"}
      borderLeft={"3px solid #7ec876"}
      {...props}
    />
  ),
  a: (props) => <Text as="a" color="#0068C5" {...props} />,
  p: (props) => (
    <Text
      as={"p"}
      lineHeight={"7"}
      marginY={"1.5rem"}
      // color="#252A32"
      color="rgb(55, 65, 81)"
      fontFamily={"Roboto"}
      {...props}
    />
  ),
  // Inline code
  code: (props) => (
    <Text
      as="code"
      fontFamily={"ui-monospace, monospace"}
      backgroundColor={"#e7e7e7"}
      color="#3b3b3b"
      fontSize={"90%"}
      padding="2px 4px"
      borderRadius={"3px"}
      {...props}
    />
  ),
  pre: (props) => <CodeBlock {...props} />,
  ol: (props) => <OrderedList {...props} />,
  ul: (props) => <UnorderedList {...props} />,
  li: (props) => (
    <ListItem
      marginY={"2"}
      color="rgb(55, 65, 81)"
      fontFamily={"Roboto"}
      {...props}
    />
  ),
  table: (props) => (
    <TableContainer>
      <Table variant="simple" border="1px solid #edf2f7" {...props} />
    </TableContainer>
  ),
  thead: (props) => <Thead {...props} />,
  tbody: (props) => <Tbody {...props} />,
  tr: (props) => <Tr {...props} />,
  td: (props) => (
    <Td
      fontFamily={"Roboto"}
      color="rgb(55, 65, 81)"
      paddingY={"0.5rem"}
      style={{ textWrap: "wrap" }}
      {...props}
    />
  ),
  th: (props) => <Th fontFamily={"Roboto"} {...props} />,
  // custom components
  Image: (props) => (
    <Box as="figure" marginY={"2rem"}>
      <Image margin={"0 auto"} src={props.src} />
      <FigCaption {...props} />
    </Box>
  ),
  Video: (props) => (
    <Box as="figure" marginY="2rem">
      <video width="100%" controls preload="metadata" src={props.src} />
      <FigCaption {...props} />
    </Box>
  ),
  Embed: ({ children }) => (
    <Box marginY="2rem">
      <AspectRatio ratio={16 / 9}>{children}</AspectRatio>
      <FigCaption {...children.props} />
    </Box>
  ),
  Blockquote: ({ children }) => {
    const withCaption = children.length > 1;

    const figcaption = withCaption ? children[0] : null;
    const body = withCaption ? children[1] : children;

    return (
      <Box
        as="blockquote"
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
          fontFamily={"Roboto"}
          fontSize={"lg"}
          marginTop={"1.5rem"}
          {...body.props}
        />
        {figcaption ? (
          <Text
            as="p"
            marginTop={"1rem"}
            fontFamily={"Roboto"}
            color="gray"
            {...figcaption.props}
          />
        ) : null}
      </Box>
    );
  },
};

export function Toc({ headings }) {
  return (
    <Box marginBottom={"1rem"}>
      <Text
        as="p"
        fontFamily={"Roboto"}
        fontWeight={"500"}
        paddingBottom={"0.6rem"}
      >
        Tabela de conteúdo
      </Text>
      <Box as="hr" />
      <UnorderedList marginTop={"1rem"}>
        {headings.map(({ id, title, level }) => (
          <ListItem key={id} margin={"0.5rem 0"} marginLeft={`${level * 5}%`}>
            <Link
              href={`#${id}`}
              fontFamily="Roboto"
              fontWeight="normal"
              display="block"
              _hover={{ textDecoration: "none" }}
            >
              {title}
            </Link>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}

const ForkIcon = createIcon({
  displayName: "fork",
  viewBox: "0 0 16 16",
  path: (
    <path
      fill="current-color"
      d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"
    />
  ),
});

const AuthorIconFallback = createIcon({
  displayName: "user",
  viewBox: "0 0 22 22",
  path: (
    <path
      fill="current-color"
      d="M11.4998 1.87695C14.5058 1.87695 16.9425 4.31372 16.9425 7.31966C16.9425 10.3256 14.5058 12.7624 11.4998 12.7624C8.4939 12.7624 6.05713 10.3256 6.05713 7.31966C6.05713 4.31372 8.4939 1.87695 11.4998 1.87695ZM17.7346 13.2325L15.3087 12.6261C12.7601 14.4592 9.67081 14.0501 7.69096 12.6261L5.26511 13.2325C3.81137 13.596 2.7915 14.9021 2.7915 16.4006V17.6608C2.7915 18.5626 3.52253 19.2936 4.42432 19.2936H18.5754C19.4771 19.2936 20.2082 18.5626 20.2082 17.6608V16.4006C20.2082 14.9021 19.1883 13.596 17.7346 13.2325Z"
    />
  ),
});

export function Contribute({ slug }) {
  return (
    <Box>
      <Text
        as="p"
        color="gray"
        fontSize={"0.9rem"}
        fontFamily={"Roboto"}
        marginBottom={"1rem"}
      >
        Todos os documentos são abertos. Viu algo errado ou pouco claro? Envie
        um pull request e contribua na Base dos Dados {"💚"}
      </Text>
      <Link
        href={`https://github.com/basedosdados/website/edit/main/next/blog/${slug}.md`}
        display={"flex"}
        alignItems={"center"}
        borderRadius="8px"
        fontFamily={"Roboto"}
        fontWeight={"500"}
        letterSpacing={"0"}
        _hover={{ textDecoration: "none" }}
        isExternal
      >
        <>
          <ForkIcon width={"16px"} height={"16px"} marginRight={"0.5rem"} />
          Editar essa página no GitHub
        </>
      </Link>
    </Box>
  );
}

export function Header({ frontmatter, slug }) {
  return (
    <Box as="header">
      <Heading as="h1" fontFamily={"Roboto"} size="2xl">
        {frontmatter.title}
      </Heading>
      <Heading
        as="h2"
        fontFamily={"Roboto"}
        fontWeight={"normal"}
        fontSize={"xl"}
        color={"gray"}
        marginY={"10"}
      >
        {frontmatter.description}
      </Heading>

      {frontmatter?.date ? (
        <Box display={"flex"} alignItems={"center"} marginBottom={"2rem"}>
          {frontmatter.date?.created ? (
            <Box>
              <Box
                display={"flex"}
                alignItems={"center"}
                alignContent={"center"}
              >
                <TimeIcon color="gray" marginRight={"0.3rem"} />
                <DatePost date={frontmatter.date.created} slug={slug} />
              </Box>
              {frontmatter.date?.updated ? (
                <Box fontSize={"1rem"}>
                  <Text
                    as="span"
                    color={"gray"}
                    fontFamily={"Roboto"}
                    fontSize={".8rem"}
                  >
                    {`Editado em ${dateToLocatePt(frontmatter.date.updated)}`}
                  </Text>
                </Box>
              ) : null}
            </Box>
          ) : null}
        </Box>
      ) : null}

      {frontmatter.authors ? (
        <Box marginBottom={"2rem"}>
          <Wrap display={"flex"} alignItems={"center"}>
            {frontmatter.authors.map((author, index) => {
              const authorComponent = (
                <WrapItem alignItems={"center"}>
                  <Box
                    // href={author.social}
                    fontFamily={"Roboto"}
                    fontSize={"0.9rem"}
                    fontWeight={500}
                    display="flex"
                    alignItems={"center"}
                  >
                    <Avatar
                      size="sm"
                      name={author.name}
                      src={author?.avatar}
                      icon={<AuthorIconFallback />}
                    />
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"start"}
                      marginLeft={"2"}
                      marginRight={"4"}
                    >
                      {author.name}
                      {author?.role ? (
                        <Text
                          as="span"
                          marginTop={"-0.2rem"}
                          fontSize={"0.7rem"}
                          fontFamily={"Roboto"}
                          color="gray"
                        >
                          {author.role}
                        </Text>
                      ) : null}
                    </Box>
                  </Box>
                </WrapItem>
              );

              return (
                <Box key={index}>
                  {author?.social ? (
                    <Link
                      _hover={{ textDecoration: "none" }}
                      href={author.social}
                    >
                      {authorComponent}
                    </Link>
                  ) : (
                    <>{authorComponent}</>
                  )}
                </Box>
              );
            })}
          </Wrap>
        </Box>
      ) : null}
    </Box>
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
            icon={<AuthorIconFallback />}
          />
        )}
      </WrapItem>
    );
  });
}

export const prettyCategory = (category) => {
  const prettyName = categories[category];
  if (prettyName == undefined) {
    console.error(`Not found category ${category}`);
    return category;
  }
  return prettyName;
};

function Categories({ categories }) {
  if (categories !== undefined) {
    return (
      <Box>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/blog?category=${category}`}
            color="#2B8C4D"
            fontWeight="500"
            fontSize="14px"
            lineHeight="20px"
            letterSpacing="0.1px"
            _hover={{
              color: "#22703E"
            }}
          >
            {prettyCategory(category)}
          </Link>
        ))}
      </Box>
    );
  }
  return null;
}

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
        height="365px"
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

      <Box
        width="100%"
      >
        <Categories categories={frontmatter.categories} />
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
          <DatePost date={date.created} slug={slug} />
        </Box>
      </Box>
    </Stack>
  );
}

function MiniBlogCard({ slug, frontmatter }) {
  const { title, description, date, authors } = frontmatter;
  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box role="group">
        <Box overflow={"hidden"} border="1px solid #DEDFE0" borderRadius="16px">
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
        </Box>
        <Categories categories={frontmatter.categories} />
        <Heading as="h3" fontSize={"xl"} fontWeight={500} fontFamily={"Roboto"}>
          <Link href={`/blog/${slug}`}>
            <Text as="span" display="block" paddingTop={"1rem"}>
              {title}
            </Text>
          </Link>
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
        <DatePost date={date.created} slug={slug} />
      </Box>
    </Box>
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
            { name: t('all'), shortName: t('all'), href: "/blog" },
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
      <Grid gap="40px" templateColumns={{ md: "1fr 1fr", xl: "1fr 1fr 1fr" }}>
        {posts.map((post, index) => {
          if (index === 0) {
            return (
              <GridItem
                as="article"
                key={index}
                gridColumn={{ md: "span 2", xl: "span 3" }}
              >
                <LatestBlogCard key={post.slug} {...post} />
              </GridItem>
            );
          } else {
            return (
              <GridItem
                as="article"
                key={index}
                borderBottom="1px solid #DEDFE0"
                paddingBottom="40px"
              >
                <MiniBlogCard key={post.slug} {...post} />
              </GridItem>
            );
          }
        })}
      </Grid>
    </Stack>
  );
}
