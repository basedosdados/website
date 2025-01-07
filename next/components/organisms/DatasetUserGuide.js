import {
  Box,
  Text,
  Tooltip,
  UnorderedList,
  ListItem,
  OrderedList,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Stack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { MDXRemote } from "next-mdx-remote";
import { useTranslation } from 'next-i18next';
import Button from "../atoms/Button";
import Link from "../atoms/Link";
import InfoIcon from "../../public/img/icons/infoIcon";

function Toc({ headings }) {
  const { t } = useTranslation('dataset');
  const [isOverflow, setIsOverflow] = useState({});
  const textRefs = useRef({});
  const [activeId, setActiveId] = useState(null);
  const observerRef = useRef();

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    headings.forEach((elm, i) => {
      const textElement = textRefs.current[i]
      if (textElement) {
        setIsOverflow((prev) => ({
          ...prev,
          [i]: textElement.scrollWidth > textElement.clientWidth,
        }))
      }
    })

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50% 0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observerRef.current = observer;

    const headingElements = document.querySelectorAll(
      headings.map(({ id }) => `#${id}`).join(", ")
    );
    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, [headings]);

  if(headings.length === 0) return null

  return (
    <Box>
      <Text
        paddingLeft="15px"
        fontFamily="Roboto"
        fontWeight="500"
        fontSize="14px"
        lineHeight="20px"
        color="#252A32"
        marginBottom="8px"
      >
        {t("tableContents")}
      </Text>

      <Box>
        {headings.map(({ id, title, level }, i) => (
          <HStack
            key={id}
            spacing="4px"
            cursor="pointer"
            pointerEvents={id === activeId ? "none" : "default"}
          >
            <Box 
              width="3px"
              height="24px"
              backgroundColor={id === activeId && "#2B8C4D"}
              borderRadius="10px"
            />
            <Tooltip
              label={title}
              isDisabled={!isOverflow[i]}
              hasArrow
              padding="16px"
              backgroundColor="#252A32"
              boxSizing="border-box"
              borderRadius="8px"
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              lineHeight="20px"
              textAlign="center"
              color="#FFFFFF"
              placement="top"
              maxWidth="100%"
            >
              <Text
                as="a"
                href={`#${id}`}
                ref={(el) => (textRefs.current[i] = el)}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                width="100%"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="14px"
                lineHeight="20px"
                color={id === activeId  ? "#2B8C4D" : "#71757A"}
                backgroundColor={id === activeId  && "#F7F7F7"}
                _hover={{
                  backgroundColor: id === activeId  ? "#F7F7F7" :"#EEEEEE",
                }}
                borderRadius="8px"
                padding="6px 8px"
              >
                {title}
              </Text>
            </Tooltip>
          </HStack>
        ))}
      </Box>
    </Box>
  );
}

function HeadingWithAnchor(props) {
  return (
    <Text
      as="h2"
      scrollMarginTop="100px"
      fontFamily="Roboto"
      fontWeight="500"
      color="#252A32"
      fontSize="24px"
      lineHeight="36px" 
      margin="40px 0 16px"
      role="group"
      _first={{ marginTop: "0" }}
      {...props}
    >
      {props.children}
    </Text>
  );
}

function HeadingSimple(props) {
  return (
    <Text
      {...props}
      fontFamily="Roboto"
      fontWeight="500"
      color="#252A32"
      margin="16px 0 8px"
    >
      {props.children}
    </Text>
  );
}

export const mdxComponents = {
  h1: (props) => <HeadingWithAnchor {...props} />,
  h2: (props) => <HeadingSimple as="h3" fontSize="18px" lineHeight="28px" {...props} />,
  h3: (props) => <HeadingSimple as="h3" fontSize="18px" lineHeight="28px" {...props} />,
  h4: (props) => <HeadingSimple as="h4" fontSize="18px" lineHeight="28px" {...props} />,
  h5: (props) => <HeadingSimple as="h5" fontSize="16px" {...props} />,
  h6: (props) => <HeadingSimple as="h6" fontSize="15px" {...props} />,
  blockquote: (props) => (
    <Box
      as="blockquote"
      position="relative"
      display="flex"
      flexDirection="row"
      marginBottom="16px"
    >
      <Box
        position="absolute"
        left={0}
        width="40px"
        height="100%"
        borderRadius="10px"
        backgroundColor="#0068C5"
      />
      <Stack
        flexDirection="row"
        alignItems="center"
        spacing={0}
        gap="16px"
        width="100%"
        padding="16px 24px"
        marginLeft="4px"
        borderRadius="8px"
        backgroundColor="#E4F2FF"
        zIndex="10"
      >
        <InfoIcon
          width="20px"
          height="20px"
          padding="2px"
          fill="#0068C5"
        />
        <Text
          as="span"
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          color="#252A32"
          {...props}
        />
      </Stack>
    </Box>
  ),
  a: (props) => (
  <Text
    as="a"
    fontFamily="Roboto"
    fontSize="14px"
    fontWeight="400"
    lineHeight="20px"
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
      as="p"
      fontFamily="Roboto"
      fontSize="14px"
      fontWeight="400"
      lineHeight="20px"
      color="#464A51"
      marginBottom="4px"
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
  ol: (props) => <OrderedList {...props} />,
  ul: (props) => <UnorderedList {...props} margin="4px 0 4px 20px"/>,
  li: (props) => (
    <ListItem
      fontFamily="Roboto"
      fontWeight="400"
      fontSize="14px"
      lineHeight="20px"
      letterSpacing="0.1px"
      color="#464A51"
      margin={0}
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

export default function DatasetUserGuide({ data, locale = "pt", slug }) {
  const { t } = useTranslation('dataset');
  const [mdxSource] = useState(data.mdxSource)
  const [hasGuide] = useState(!!data?.mdxSource?.frontmatter?.title)

  const repository = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_FRONTEND
    if (baseUrl === "http://localhost:3000" || baseUrl === "https://development.basedosdados.org") return "development" 
    if (baseUrl === "https://staging.basedosdados.org") return "staging"
    if (baseUrl === "https://basedosdados.org") return "main" 
    return null
  }

  return (
    <Stack
      paddingTop="32px"
      spacing={0}
      flexDirection="row"
      height="100%"
    >
      {data?.headings.length > 0 &&
        <Box
          display={{base: "none", md: "flex"}}
          as="aside"
          position="sticky"
          height="100%"
          top="80px"
          overflowY="auto"
          minWidth="272px"
          maxWidth="272px"
          boxSizing="content-box"
          padding="4px 26px 0 0"
        >
          <Toc headings={data.headings} />
        </Box>
      }

      <Box
        as="section"
        width="100%"
        paddingLeft={{base: "0", md: data?.headings.length === 0 ? "0" : "24px"}}
      >
        {mdxSource && <MDXRemote {...mdxSource} components={mdxComponents} />}

        <Box
          marginTop="40px"
          borderRadius="16px"
          border={hasGuide ? "1px solid #DEDFE0" : ""}
          padding="40px 24px"
        >
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="24px"
            lineHeight="36px"
            textAlign="center"
            color="#252A32"
          >{hasGuide ? t("gotAnyQuestionsGuide") : t("notHaveUserGuide")}</Text>
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="18px"
            lineHeight="28px"
            textAlign="center"
            color="#71757A"
          >{t("contributeToTheUsageGuide")}</Text>

          <Box
            display="flex"
            flexDirection={{base: "column", lg: "row"}}
            alignItems="center"
            justifyContent="center"
            gap="16px"
            marginTop="16px"
          >
            <Link
              width={{base: "100%", lg: "fit-content"}}
              href="/contact"
              target="_self"
            >
              <Button
                width={{base: "100%", lg: "fit-content"}}
                justifyContent="center"
              >
                {t("sendQuestionUsageGuide")}
              </Button>
            </Link>

            <Link
              width={{base: "100%", lg: "fit-content"}}
              href={`https://github.com/basedosdados/website/edit/${repository()}/next/content/userGuide/${locale}/${hasGuide ? slug : "README"}.md`}
              target="_self"
            >
              <Button
                width={{base: "100%", lg: "fit-content"}}
                justifyContent="center"
                color="#2B8C4D"
                border="1px solid #2B8C4D"
                backgroundColor="#FFFFFF"
                _hover={{
                  backgroundColor: "#FFFFFF",
                  color: "#22703E",
                  boderColor: "#22703E"
                }}
              >
                {t("makeSuggestionUsageGuide")}
              </Button>
            </Link>
          </Box>

          <Text
            display={hasGuide ? "none" : "flex"}
            marginTop="32px"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="20px"
            color="#71757A"
            justifyContent="center"
            textAlign="center"
            flexWrap="wrap"
          >
            {t("haveAnyQuestions", { returnObjects: true }).replace(
              "{{content}}",
              ""
            )}
            <Link
              href="/faq"
              color="#0068C5"
              fontWeight="400"
              marginLeft="4px"
              _hover={{
                color: "#0057A4"
              }}
            >
              {t("pageFaq")}
            </Link>.
          </Text>
        </Box>
      </Box>
    </Stack>
  )
}