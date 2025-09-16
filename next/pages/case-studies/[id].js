import {
  Stack,
  VStack,
  HStack,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import Image from 'next/image';
import { MDXRemote } from "next-mdx-remote";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../../components/templates/main";
import Display from "../../components/atoms/Text/Display";
import TitleText from "../../components/atoms/Text/TitleText";
import LabelText from "../../components/atoms/Text/LabelText";
import BodyText from "../../components/atoms/Text/BodyText";

import {
  getAllCaseStudies,
  getCaseStudiesById,
  serializeCaseStudies
} from "../api/caseStudies"

import {
  mdxComponents
} from "../../components/organisms/Blog/Slug"

import ChevronIcon from "../../public/img/icons/chevronIcon";
import Button from "../../components/atoms/Button";
import Link from "../../components/atoms/Link";

export async function getStaticProps({ params, locale }) {
  const { id } = params;

  const content = await getCaseStudiesById(id, locale);

  if (!content) {
    return {
      redirect: {
        destination: locale === "pt" ? "/case-studies" : `/${locale}/case-studies`,
        permanent: false,
      },
    };
  }

  const serialize = await serializeCaseStudies(content);

  return {
    props: {
      serialize,
      ...(await serverSideTranslations(locale, ['common', 'menu', 'caseStudies'])),
    },
    revalidate: 30
  }
}

export async function getStaticPaths() {
  const allCaseStudies = await getAllCaseStudies();

  return {
    paths: allCaseStudies.map(({ id }) => {
      return {params: { id }}
    }),
    fallback: "blocking"
  }
}

export default function CaseStudies ({ serialize }) {
  const { t } = useTranslation('caseStudies');
  const router = useRouter();
  const { frontmatter } = serialize;

  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>{t('pageTitle', { title: frontmatter.displayTitle || "" })}</title>
        <link
          rel="image_src"
          href={frontmatter.thumbnail || ""}
        />
        <meta
          property="og:image"
          content={frontmatter.thumbnail || ""}
          key="ogimage"
        />
        <meta
          name="twitter:image"
          content={frontmatter.thumbnail || ""}
          key="twimage"
        />
        <meta
          property="og:title"
          content={t('pageTitle', { title: frontmatter.displayTitle || "" })}
          key="ogtitle"
        />
        <meta
          property="og:description"
          content={frontmatter.description || ""}
          key="ogdesc"
        />
      </Head>

      <Stack
        spacing={0}
        maxWidth="1440px"
        margin="50px auto auto"
      >
        <Link
          display={{base: "none", lg: "flex"}}
          alignItems="center"
          gap="8px"
          marginBottom="48px"
          color="#0068C5"
          fill="#0068C5"
          _hover={{
            color: "#0057A4",
            fill: "#0057A4"
          }}
          fontWeight="500"
          fontFamily="Roboto"
          fontSize="16px"
          width="fit-content"
          href="/case-studies"
        >
          <ChevronIcon
            alt="back"
            width="16px"
            transform={"rotate(180deg)"}
          />
          {t('backLink')}
        </Link>

        <TitleText
          typography="large"
          as="h1"
          display={{base: "flex", lg: "none"}}
          margin="0 0 48px !important"
        >{frontmatter?.title || ""}</TitleText>

        <VStack position="relative" spacing={0} gridGap="16px">
          <Display
            typography="small"
            as="h1"
            display={{base: "none", lg: "flex"}}
            position="absolute"
            paddingTop={{base: "80px", lg: "0"}}
            margin="40px 48px"
            color="#FFF"
            zIndex="10"
          >{frontmatter?.title || ""}</Display>

          <Box
            position="relative"
            width="100%"
            height={{base:"145px", lg:"450px"}}
            overflow="hidden"
            borderRadius={{base:"12px", lg:"24px"}}
            filter={{base: "none", lg: "brightness(0.4)"}}
          >
            {frontmatter.img ?
              <Image
                alt={frontmatter?.displayTitle}
                src={frontmatter.img}
                layout="fill"
                objectFit="cover"
              />
            :
              <Skeleton width="100%" height="100%"/>
            }
          </Box>

          {frontmatter.imgDescription && 
            <BodyText
              typography="small"
              as="h3"
              width="100%"
              textAlign="end"
              color="#71757A"
            >
              {frontmatter.imgDescription}
            </BodyText>
          }
        </VStack>

        <HStack
          flexDirection={{base: "column", lg: "row"}}
          spacing={0}
          alignItems="flex-start"
          paddingTop="64px"
          position="relative"
          gridGap={{base: "40px", lg: "80px"}}
        >
          <VStack
            position={{base: "relative", lg: "sticky"}}
            top={{base: "0", lg: "100px"}}
            marginBottom={{base: "32px", lg: "0"}}
            spacing={0}
            maxWidth="300px"
            alignItems="flex-start"
          >
            <Box
              position="relative"
              width="100%"
              height="85px"
              overflow="hidden"
              marginBottom="32px"
            >
              {frontmatter?.logo?.img ?
                <Image
                  alt={frontmatter?.displayTitle}
                  src={frontmatter.logo.img}
                  width={frontmatter?.logo.width}
                  height={frontmatter?.logo.height}
                />
              :
                <Skeleton width="245px" height="85px"/>
              }
            </Box>

            <LabelText>
              {t('about')}
            </LabelText>

            <BodyText
              as="h2"
              paddingBottom="32px"
              color="#71757A"
            >
              {frontmatter?.about || ""}
            </BodyText>

            <LabelText>
              {t('sector')}
            </LabelText>

            <BodyText
              paddingBottom="32px"
              color="#71757A"
            >
              {frontmatter?.sector || ""}
            </BodyText>

            <BodyText paddingBottom="8px">
              {t('contactText')}
            </BodyText>

            <Button onClick={() => router.push('/contact')}>
              {t('contactButton')}
            </Button>
          </VStack>

          <Box
            as="section"
            flex={1}
            width="100%"
            display="flex"
            flexDirection="column"
            gap="24px"
          >
            <MDXRemote {...serialize} components={mdxComponents} />
          </Box>
        </HStack>
      </Stack>
    </MainPageTemplate>  
  )
}