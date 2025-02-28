import {
  Box,
  Heading,
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
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import hljs from "highlight.js/lib/core";
import Link from "../../atoms/Link";
import Display from "../../atoms/Text/Display";
import LabelText from "../../atoms/Text/LabelText";
import BodyText from "../../atoms/Text/BodyText";
import { DatePost, dateToLocatePt } from "./Home";

import { CopyIcon } from "../../../public/img/icons/copyIcon";
import FacebookIcon from "../../../public/img/icons/facebookIcon";
import LinkedInIcon from "../../../public/img/icons/linkedinIcon";
import XIcon from "../../../public/img/icons/xIcon";
import ShareIcon from "../../../public/img/icons/shareIcon";
import CheckIcon from "../../../public/img/icons/checkIcon";

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
    <Box marginY={"1rem"} borderRadius={"8px"} backgroundColor="#252A32">
      <Box display={"flex"} alignItems={"center"} padding={"0 0.5rem"}>
        {language ? (
          <Text
            as="span"
            display="block"
            paddingLeft="7px"
            fontWeight="500"
            fontSize="12px"
            color="#878A8E"
            textTransform="capitalize"
            userSelect="none"
            fontFamily="Roboto"
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
          backgroundColor="transparent"
          padding="0"
          display="flex"
          marginLeft="auto"
          alignItems="center"
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
        maxHeight="70vh"
        overflowX="auto"
        overflowY="auto"
        whiteSpace="pre"
        borderBottomLeftRadius="8px"
        borderBottomRightRadius="8px"
      >
        <Text
          as="code"
          paddingTop="0 !important"
          width="100%"
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
      _hover={{ opacity: 0.8 }}
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
        <ShareIcon width="22px" />
      ) : hasCopied ? (
        <CheckIcon width="22px" height="22px" alt="copiado conteúdo" />
      ) : (
        <CopyIcon width="22px" height="22px" alt="copiar conteúdo" />
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
    <Box display="flex" alignItems="center" gap="10px">
      <ChakraLink
        href={`https://x.com/share?text=${encodeURIComponent(text)}&url=${encodedUrl}`}
        _hover={{ opacity: 0.8 }}
        target="_blank"
        isExternal
      >
        <XIcon width="18px" height="18px" />
      </ChakraLink>
      <ChakraLink
        href={`https://www.facebook.com/sharer/sharer.php?t=${encodeURIComponent(text)}&u=${encodedUrl}`}
        _hover={{ opacity: 0.8 }}
        target="_blank"
        isExternal
      >
        <FacebookIcon width="25px" height="25px" />
      </ChakraLink>
      <ChakraLink
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        _hover={{ opacity: 0.8 }}
        target="_blank"
        isExternal
      >
        <LinkedInIcon width="25px" height="25px" />
      </ChakraLink>
      <NativeShare url={url} title={title} description={description} />
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

export function Toc({ headings }) {
  return (
    <Box>
      <LabelText typography="large" marginBottom="2px">
        Tabela de conteúdo
      </LabelText>
      <Box as="hr" borderWidth="2px" borderColor="#DEDFE0" marginBottom="8px" />
      <UnorderedList margin="0">
        {headings.map(({ id, title, level }) => (
          <ListItem listStyleType="none" key={id} marginLeft={`${level * 5}%`}>
            <Link
              href={`#${id}`}
              fontFamily="Roboto"
              display="block"
              _hover={{
                textDecoration: "none",
                opacity: 0.8,
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

export function Header({ frontmatter, slug }) {
  const { t } = useTranslation("blog");

  return (
    <Box as="header" marginBottom="64px">
      <Display as="h1">{frontmatter.title}</Display>
      <BodyText as="h2" color="#71757A" margin="8px 0 24px">
        {frontmatter.description}
      </BodyText>

      <Stack
        width="100%"
        flexDirection={{ base: "column", lg: "row" }}
        spacing={0}
        gap="40px"
      >
        <Stack spacing={0} width="100%">
          {frontmatter.authors && (
            <BodyText>
              {frontmatter.authors.map((elm) => elm.name).join(", ")}
            </BodyText>
          )}

          {frontmatter?.date && (
            <Stack flexDirection="column" spacing="4px">
              {frontmatter.date?.created && (
                <>
                  <DatePost date={frontmatter.date.created} slug={slug} />

                  {frontmatter.date?.updated && (
                    <BodyText as="span" color="#71757A">
                      {`${t("edited")} ${dateToLocatePt(frontmatter.date.updated)}`}
                    </BodyText>
                  )}
                </>
              )}
            </Stack>
          )}
        </Stack>

        <Stack flexDirection="row" alignItems="center" gap="18px" spacing={0}>
          <BodyText>{t("share")}</BodyText>

          <ShareButtons frontmatter={frontmatter} />
        </Stack>
      </Stack>
    </Box>
  );
}

export const mdxComponents = {
  h1: (props) => <HeadingWithAnchor as="h2" fontSize="28px" {...props} />,
  h2: (props) => <HeadingWithAnchor as="h2" fontSize="28px" {...props} />,
  h3: (props) => <HeadingWithAnchor as="h3" fontSize="24px" {...props} />,
  h4: (props) => <HeadingWithAnchor as="h4" fontSize="18px" {...props} />,
  h5: (props) => <HeadingWithAnchor as="h5" fontSize="16px" {...props} />,
  h6: (props) => <HeadingWithAnchor as="h6" fontSize="15px" {...props} />,
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
    <BodyText
      as="a"
      color="#0068C5"
      _hover={{
        color: "#0057A4",
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
  p: (props) => <BodyText {...props} />,
  // Inline code
  code: (props) => (
    <Text
      as="code"
      fontFamily="ui-monospace, monospace"
      backgroundColor="#e7e7e7"
      color="#3b3b3b"
      fontSize="90%"
      padding="2px 4px"
      borderRadius="3px"
      {...props}
    />
  ),
  pre: (props) => <CodeBlock {...props} />,
  ol: (props) => <OrderedList {...props} />,
  ul: (props) => <UnorderedList {...props} />,
  li: (props) => (
    <ListItem marginY="8px" color="#252A32" fontFamily="Roboto" {...props} />
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
      fontFamily="Roboto"
      color="rgb(55, 65, 81)"
      paddingY="0.5rem"
      style={{ textWrap: "wrap" }}
      {...props}
    />
  ),
  th: (props) => <Th fontFamily="Roboto" {...props} />,
  // custom components
  Image: (props) => (
    <Box as="figure" marginY="2rem">
      <Image margin="0 auto" src={props.src} />
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
        <BodyText marginTop="35px" {...body.props} />
        {figcaption ? (
          <BodyText marginTop="16px" color="#71757A" {...figcaption.props} />
        ) : null}
      </Box>
    );
  },
};
