import {
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
  AspectRatio,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import hljs from "highlight.js/lib/core";
import Link from "../../atoms/Link";
import { DatePost } from "./Home";

import { CopyIcon } from "../../../public/img/icons/copyIcon";
import AuthorIconFallback from "../../../public/img/icons/authorIconFallback";
import FacebookIcon from "../../../public/img/icons/facebookIcon";
import LinkedInIcon from "../../../public/img/icons/linkedinIcon";
import XIcon from "../../../public/img/icons/xIcon";
import ForkIcon from "../../../public/img/icons/forkIcon";
import ShareIcon from "../../../public/img/icons/shareIcon";
import CheckIcon from "../../../public/img/icons/checkIcon";
import { TimeIcon } from "@chakra-ui/icons";

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
