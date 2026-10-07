import {
  Box,
  Stack,
  VStack,
  Image,
  SimpleGrid,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState, useMemo } from "react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { MainPageTemplate } from "../components/templates/main";
import { getInvitedResearchersByStatus } from "./api/researchers/getInvitedResearchers";

import Display from "../components/atoms/Text/Display";
import TitleText from "../components/atoms/Text/TitleText";
import LabelText from "../components/atoms/Text/LabelText";
import BodyText from "../components/atoms/Text/BodyText";

import InternalError from "../public/img/internalError";
import WebIcon from "../public/img/icons/webIcon";
import EmailIcon from "../public/img/icons/emailIcon";
import LinkedinIcon from "../public/img/icons/linkedinIcon";
import SchoolIcon from "../public/img/icons/schoolIcon";
import DocIcon from "../public/img/icons/docIcon";

export async function getServerSideProps({ locale }) {
  let researchers = null
  let alumni = []
  try {
    const result = await getInvitedResearchersByStatus(locale)
    researchers = result.current
    alumni = result.alumni
  } catch (error) {
    console.error(error)
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['invitedResearchers', 'common', 'menu'])),
      researchers,
      alumni,
    },
  }
}

const withProtocol = (url) => /^https?:\/\//i.test(url) ? url : `https://${url}`

const ResearcherBox = ({ index, researcher, t }) => {
  const hasLeftSpacing = index % 2 !== 0
  const subtitle = [researcher.position, researcher.affiliations.join(" · ")].filter(Boolean).join(", ")
  const cohort = researcher.cohorts[0] || null

  const iconProps = (href, label) => ({
    alt: label,
    "aria-label": label,
    title: label,
    cursor: "pointer",
    width: "22px",
    height: "22px",
    fill: "#0068C5",
    _hover: {fill: "#0057A4"},
    onClick: () => {window.open(href)}
  })

  const IconLinks = ({ ...props }) => (
    <Box display="flex" flexDirection="row" gap="5px" {...props}>
      {researcher.website && <WebIcon {...iconProps(withProtocol(researcher.website), t('links.website'))}/>}
      {researcher.email && <EmailIcon {...iconProps(`mailto:${researcher.email}`, t('links.email'))}/>}
      {researcher.linkedin && <LinkedinIcon {...iconProps(withProtocol(researcher.linkedin), "LinkedIn")}/>}
      {researcher.googleScholar && <SchoolIcon {...iconProps(withProtocol(researcher.googleScholar), "Google Scholar")}/>}
      {researcher.lattes && <DocIcon {...iconProps(withProtocol(researcher.lattes), t('links.lattes'))}/>}
    </Box>
  )

  return (
    <Box
      display="flex"
      flexDirection={{base: "column", lg: "row"}}
      maxWidth="750px"
      marginLeft={{base: "0", lg: hasLeftSpacing ? "200px !important" : "0"}}
    >
      <Box
        minWidth="160px"
        maxWidth="160px"
        minHeight="160px"
        maxHeight="160px"
        borderRadius="16px"
        marginRight="32px"
        marginBottom={{base: "20px", lg: "0"}}
        overflow="hidden"
      >
        <Image
          alt={researcher.name}
          src={researcher.picture || "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      <Box display="flex" flexDirection="column">
        <Box
          display="flex"
          gap="16px"
          flexDirection="row"
          alignItems="center"
          marginBottom="4px"
        >
          <LabelText typography="large" textAlign="start">
            {researcher.name}
          </LabelText>
          <IconLinks display={{base: "none", lg: "flex"}}/>
        </Box>

        {subtitle &&
          <LabelText color="#71757A" textAlign="start" marginBottom="4px">
            {subtitle}
          </LabelText>
        }

        {researcher.description &&
          <LabelText
            fontWeight="400"
            typography="large"
            textAlign="start"
            color="#464A51"
            marginBottom="8px"
          >
            {researcher.description}
          </LabelText>
        }

        <LabelText
          typography="small"
          fontWeight="400"
          textAlign="start"
          color="#71757A"
          marginBottom={{base: "12px", lg: "0"}}
        >
          {[
            researcher.themes.map((theme) => theme.name).join(" · "),
            cohort ? t('cohort', { cohort }) : null,
          ].filter(Boolean).join(" | ")}
        </LabelText>
        <IconLinks display={{base: "flex", lg: "none"}}/>
      </Box>
    </Box>
  )
}

const AlumniBox = ({ researcher, t }) => {
  const subtitle = [researcher.position, researcher.affiliations.join(" · ")].filter(Boolean).join(", ")
  const cohorts = researcher.cohorts.length > 0
    ? t('cohort', { cohort: researcher.cohorts.join(", ") })
    : null

  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap="16px">
      <Box
        minWidth="64px"
        maxWidth="64px"
        minHeight="64px"
        maxHeight="64px"
        borderRadius="12px"
        overflow="hidden"
      >
        <Image
          alt={researcher.name}
          src={researcher.picture || "https://storage.googleapis.com/basedosdados-website/equipe/sem_foto.png"}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </Box>
      <Box display="flex" flexDirection="column">
        {researcher.website ?
          <LabelText
            as="a"
            href={withProtocol(researcher.website)}
            target="_blank"
            textAlign="start"
            _hover={{ color: "#0057A4" }}
          >
            {researcher.name}
          </LabelText>
        :
          <LabelText textAlign="start">{researcher.name}</LabelText>
        }
        {subtitle &&
          <LabelText typography="small" fontWeight="400" color="#71757A" textAlign="start">
            {subtitle}
          </LabelText>
        }
        {cohorts &&
          <LabelText typography="small" fontWeight="400" color="#71757A" textAlign="start">
            {cohorts}
          </LabelText>
        }
      </Box>
    </Box>
  )
}

const InfoCard = ({ title, items }) => (
  <Box
    flex="1"
    padding="32px"
    borderRadius="20px"
    boxShadow="0 2px 8px 1px rgba(64, 60, 67, 0.16)"
    backgroundColor="#FFFFFF"
  >
    <TitleText paddingBottom="16px" typography="large">
      {title}
    </TitleText>
    <UnorderedList spacing="8px" marginLeft="24px">
      {items.map((item, i) => (
        <ListItem key={i}>
          <BodyText typography="large" color="#464A51">{item}</BodyText>
        </ListItem>
      ))}
    </UnorderedList>
  </Box>
)

export default function InvitedResearchers({ researchers, alumni }) {
  const { t } = useTranslation('invitedResearchers');
  const [filterTheme, setFilterTheme] = useState("")

  const themes = useMemo(() => {
    const unique = new Map()
    researchers?.forEach((researcher) => {
      researcher.themes.forEach((theme) => unique.set(theme.slug, theme))
    })
    return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [researchers])

  const filteredResearchers = useMemo(() => {
    if (!researchers) return []
    if (!filterTheme) return researchers
    return researchers.filter((researcher) =>
      researcher.themes.some((theme) => theme.slug === filterTheme)
    )
  }, [researchers, filterTheme])

  const FilterLabel = ({ slug, children }) => (
    <LabelText
      color={filterTheme === slug ? "#2B8C4D" : "#71757A"}
      _hover={{ color: "#2B8C4D" }}
      width="max-content"
      cursor="pointer"
      onClick={() => setFilterTheme(slug)}
    >
      {children}
    </LabelText>
  )

  return (
    <MainPageTemplate>
      <Head>
        <title>{t('pageTitle')}</title>
        <meta property="og:title" content={t('pageTitle')} key="ogtitle"/>
        <meta property="og:description" content={t('pageDescription')} key="ogdesc"/>
        <meta name="description" content={t('pageDescription')}/>
      </Head>

      <VStack spacing={0}>
        <Stack
          width="100%"
          maxWidth="1440px"
          margin="auto"
          paddingTop={{ base: "128px", lg: "80px" }}
          paddingX="24px"
          paddingBottom="50px"
          alignItems="center"
          spacing="24px"
        >
          <Display
            as="h1"
            width="100%"
            typography="large"
            fontSize={{ base: "36px", lg: "60px" }}
            lineHeight={{ base: "48px", lg: "70px" }}
            textAlign="center"
          >
            {t('heroTitle')}
          </Display>
          <BodyText
            typography="large"
            color="#464A51"
            textAlign="center"
            maxWidth="800px"
          >
            {t('heroSubtitle')}
          </BodyText>
        </Stack>

        <Stack
          padding="64px 24px 50px"
          justifyContent="center"
          maxWidth="1440px"
          spacing="24px"
          width={{ base: "100%", lg: "800px" }}
        >
          <Display as="h2" textAlign="center" color="#252A32">
            {t('aboutTitle')}
          </Display>
          <BodyText typography="large" color="#464A51">
            {t('aboutText1')}
          </BodyText>
          <BodyText typography="large" color="#464A51">
            {t('aboutText2')}
          </BodyText>
        </Stack>

        <Stack
          width="100%"
          maxWidth="1100px"
          padding="24px 24px 50px"
          flexDirection={{ base: "column", lg: "row" }}
          gap="32px"
          spacing={0}
        >
          <InfoCard
            title={t('eligibilityTitle')}
            items={[t('eligibilityPhd'), t('eligibilityAffiliation')]}
          />
          <InfoCard
            title={t('rulesTitle')}
            items={[t('rulesMembership'), t('rulesTerm'), t('rulesCohorts')]}
          />
        </Stack>
      </VStack>

      <Stack
        id="researchers"
        width="100%"
        maxWidth="1440px"
        padding="94px 24px 50px"
        margin="auto"
        spacing={0}
      >
        <Display as="h2" textAlign="center" paddingBottom="104px">
          {t('rosterTitle')}
        </Display>

        {researchers === null ?
          <Stack justifyContent="center" alignItems="center">
            <InternalError widthImage="300" heightImage="300"/>
          </Stack>
        : researchers.length === 0 ?
          <BodyText typography="large" color="#464A51" textAlign="center">
            {t('rosterEmpty')}
          </BodyText>
        :
          <Stack
            position="relative"
            gap="80px"
            spacing={0}
            flexDirection={{base: "column", lg: "row"}}
            justifyContent="space-between"
            paddingBottom="50px"
          >
            <Box
              display="flex"
              height="100%"
              flexDirection="column"
              gap="16px"
              position={{base: "relative", lg: "sticky"}}
              top={{base: "0", lg: "120px"}}
              zIndex="20"
            >
              <FilterLabel slug="">{t('filterAll')}</FilterLabel>
              {themes.map((theme) => (
                <FilterLabel key={theme.slug} slug={theme.slug}>{theme.name}</FilterLabel>
              ))}
            </Box>

            <Stack width="fit-content" spacing={{ base: "72px", lg: "96px" }}>
              {filteredResearchers.map((researcher, index) => (
                <ResearcherBox
                  key={researcher.id}
                  index={index}
                  researcher={researcher}
                  t={t}
                />
              ))}
            </Stack>
          </Stack>
        }
      </Stack>
      {alumni?.length > 0 &&
        <Stack
          id="alumni"
          width="100%"
          maxWidth="1440px"
          padding="50px 24px 94px"
          margin="auto"
          spacing={0}
        >
          <Display as="h2" textAlign="center" paddingBottom="16px">
            {t('alumniTitle')}
          </Display>
          <BodyText typography="large" color="#464A51" textAlign="center" paddingBottom="64px">
            {t('alumniText')}
          </BodyText>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacingX="48px"
            spacingY="32px"
            maxWidth="1100px"
            width="100%"
            alignSelf="center"
          >
            {alumni.map((researcher) => (
              <AlumniBox key={researcher.id} researcher={researcher} t={t}/>
            ))}
          </SimpleGrid>
        </Stack>
      }
    </MainPageTemplate>
  )
}
