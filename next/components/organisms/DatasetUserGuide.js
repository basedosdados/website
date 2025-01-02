import {
  Box,
  Image,
  Text,
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
  Stack,
  Divider,
  Heading,
  Link,
} from "@chakra-ui/react";
import { MDXRemote } from "next-mdx-remote";
import hljs from "highlight.js/lib/core";

import CheckIcon from "../../public/img/icons/checkIcon";
import { CopyIcon } from "../../public/img/icons/copyIcon";

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

function Toc({ headings }) {
  return (
    <Box>
      <Text
        fontFamily="Roboto"
        fontWeight="500"
        fontSize="18px"
        lineHeight="28px"
        color="#252A32"
        marginBottom="2px"
      >
        Tabela de conteúdo
      </Text>
      <Box as="hr" borderWidth="2px" borderColor="#DEDFE0" marginBottom="8px"/>
      <UnorderedList margin="0">
        {headings.map(({ id, title, level }) => (
          <ListItem listStyleType="none" key={id} marginLeft={`${level * 5}%`}>
            <Link
              href={`#${id}`}
              fontFamily="Roboto"
              display="block"
              _hover={{
                textDecoration: "none",
                opacity: 0.8
              }}
              fontWeight="500"
              fontSize="14px"
              lineHeight="20px"
              letterSpacing="0.1px"
              color="#252A32"
              padding="8px 16px"
            >
              {title}
            </Link>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}

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
    <Box marginY={"1rem"} borderRadius={"8px"} backgroundColor="#252A32">
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

function HeadingWithAnchor(props) {
  return (
    <Link
      href={`#${props.id}`}
      variant="unstyled"
      transition="none"
      _hover={{ textDecoration: "none" }}
    >
      <Heading
        {...props}
        scrollMarginTop="100px"
        fontFamily="Roboto"
        margin="24px 0 0"
        role="group"
      >
        {props.children}
      </Heading>
    </Link>
  );
}

function FigCaption(props) {
  return props.children ? (
    <Text
      as="figcaption"
      fontFamily="Roboto"
      fontSize="14px"
      color="#71757A"
      textAlign="center"
      marginY="8px"
    >
      {props.children}
    </Text>
  ) : null;
}

export const mdxComponents = {
  h1: (props) => <HeadingWithAnchor as="h2" size="28px" {...props} />,
  h2: (props) => <HeadingWithAnchor as="h2" fontSize="28px" {...props} />,
  h3: (props) => <HeadingWithAnchor as="h3" fontSize="24px" {...props} />,
  h4: (props) => <HeadingWithAnchor as="h4" fontSize="18px" {...props} />,
  h5: (props) => <HeadingWithAnchor as="h5" fontSize={"16px"} {...props} />,
  h6: (props) => <HeadingWithAnchor as="h6" fontSize={"15px"} {...props} />,
  blockquote: (props) => (
    <Box
      as="blockquote"
      padding="24px"
      background="#D5E8DB"
      borderRadius="16px"
      {...props}
    />
  ),
  a: (props) => (
  <Text
    as="a"
    fontFamily="Roboto"
    fontSize="16px"
    fontWeight="400"
    lineHeight="24px"
    color="#0068C5"
    _hover={{
      color: "#0057A4"
    }}
    {...props} 
  />
  ),
  hr: (props) => (
    <Divider
      borderWidth="0px"
      borderTop="3px solid #252A32"
      opacity="1"
      margin="24px 0"
      {...props}
    />
  ),
  p: (props) => (
    <Text
      as={"p"}
      fontFamily="Roboto"
      fontSize="16px"
      fontWeight="400"
      lineHeight="24px"
      color="#252A32"
      {...props}
    />
  ),
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
      marginY="8px"
      color="#252A32"
      fontFamily="Roboto"
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
        padding="16px 20px"
        borderLeft="4px solid #2B8C4D"
        marginY="24px"
        position="relative"
      >
        <Text
          as="span"
          position="absolute"
          top="0"
          pointerEvents="none"
          userSelect="none"
          fontFamily="Roboto"
          fontSize="65px"
        >
          “
        </Text>
        <Text
          as="p"
          fontFamily="Roboto"
          fontSize="16px"
          fontWeight="400"
          lineHeight="24px"
          color="#252A32"
          marginTop="35px"
          {...body.props}
        />
        {figcaption ? (
          <Text
            as="p"
            marginTop="16px"
            fontFamily="Roboto"
            color="#71757A"
            {...figcaption.props}
          />
        ) : null}
      </Box>
    );
  },
};

export default function DatasetUserGuide({ mdxSource, headings }) {
  return (
    <Stack
      paddingTop="32px"
      spacing={0}
      height="100%"
    >
      <Box
        display={"flex"}
        flexDirection={{ base: "column", md: "row" }}
        alignItems={"start"}
        maxWidth={"100%"}
      >
        <Box
          as="aside"
          marginLeft={"auto"}
          marginTop={{ base: "0", md: "2rem" }}
          position={"sticky"}
          top="6rem"
          maxHeight={"calc(100vh - 6rem)"}
          overflowY={"auto"}
          paddingLeft={{ base: "0", md: "5rem" }}
          paddingRight={"1rem"}
          paddingBottom={"2rem"}
          width={{ base: "100%", md: "35%", xl: "35%" }}
        >
          <Box display={{ base: "none", md: "block" }}>
            {headings.length > 0 ? (
              <>
                <Toc headings={headings} />
                <Box as="hr" marginBottom={"1rem"} />
              </>
            ) : null}
          </Box>
        </Box>

        <Box as="section" width={{ base: "100%", md: "65%", xl: "65%" }}>
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </Box>
      </Box>
    </Stack>
  )
}