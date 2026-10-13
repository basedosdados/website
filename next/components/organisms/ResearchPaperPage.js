import {
  Stack,
  Box,
  Skeleton,
  SkeletonText,
  Divider
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';

import Button from "../atoms/Button";
import Link from "../atoms/Link";
import TitleText from "../atoms/Text/TitleText";
import LabelText from "../atoms/Text/LabelText";
import BodyText from "../atoms/Text/BodyText";
import ReadMore from "../atoms/ReadMore";
import FourOFour from "../templates/404";

import RedirectIcon from "../../public/img/icons/redirectIcon"

const STATUS_KEYS = {
  PUBLISHED: "statusPublished",
  FORTHCOMING: "statusForthcoming",
  WORKING_PAPER: "statusWorkingPaper",
}

export default function ResearchPaperPage({ id }) {
  const { t } = useTranslation('dataset');
  const [isLoading, setIsLoading] = useState(true)
  const [resource, setResource] = useState({})
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchResearchPaper = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/researchPapers/getResearchPaper?id=${id}`, { method: "GET" })
        const result = await response.json()

        if (result.success) {
          setResource(result.resource)
          setIsError(false)
        } else {
          console.error(result.error)
          setIsError(true)
        }
      } catch (error) {
        console.error("Fetch error: ", error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResearchPaper()
  }, [id])

  const accessUrl = resource?.doiUrl || resource?.url

  const citation = () => {
    const parts = [resource?.journal?.name]
    if (resource?.volume) parts.push(resource?.issue ? `${resource.volume}(${resource.issue})` : resource.volume)
    if (resource?.pages) parts.push(resource.pages)
    return parts.filter(Boolean).join(", ")
  }

  const researcherNames = () => {
    const researchers = Object.values(resource?.researchers || {})
    if (researchers.length === 0) return null
    return researchers.map((researcher) => {
      if (researcher.isInvitedResearcher) return `${researcher.name} (${t('researchPaper.invitedResearcher')})`
      if (researcher.isInvitedResearcherAlumni) return `${researcher.name} (${t('researchPaper.invitedResearcherAlumni')})`
      return researcher.name
    }).join(", ")
  }

  const StackSkeleton = ({ children, ...props }) => (
    <Skeleton
      startColor="#F0F0F0"
      endColor="#F3F3F3"
      borderRadius="6px"
      height="36px"
      width="100%"
      isLoaded={!isLoading}
      {...props}
    >
      {children}
    </Skeleton>
  )

  const AddInfoTextBase = ({ title, text, children, ...props }) => (
    <SkeletonText
      startColor="#F0F0F0"
      endColor="#F3F3F3"
      borderRadius="6px"
      minHeight="40px"
      width="100%"
      spacing="4px"
      skeletonHeight="18px"
      noOfLines={2}
      marginBottom="24px !important"
      isLoaded={!isLoading}
      {...props}
    >
      <LabelText typography="small">{title}</LabelText>
      {children ||
        <BodyText typography="small" color="#464A51">
          {text || t('researchPaper.notProvided')}
        </BodyText>
      }
    </SkeletonText>
  )

  if(isError) return <FourOFour/>

  return (
    <Stack
      flex={1}
      overflow="hidden"
      paddingLeft={{base: "0", lg: "24px"}}
      spacing={0}
    >
      <Stack spacing={0} id="dataset_researchpaper_header" marginBottom="40px !important">
        <StackSkeleton height="fit-content" minHeight="36px">
          <TitleText>{resource?.title}</TitleText>
        </StackSkeleton>

        <StackSkeleton height="fit-content" minHeight="24px" marginTop="8px !important">
          <BodyText typography="small" color="#464A51">
            {[resource?.authors, resource?.year].filter(Boolean).join(" · ")}
          </BodyText>
        </StackSkeleton>

        <StackSkeleton width="fit-content" height="40px" marginTop="16px !important">
          <Button
            as="a"
            href={accessUrl}
            target="_blank"
            onClick={() => {}}
            backgroundColor={accessUrl ? "#2B8C4D" : "#ACAEB1"}
            cursor={accessUrl ? "pointer" : "default"}
            _hover={{
              backgroundColor: accessUrl ? "#22703E" : "#ACAEB1"
            }}
          >
            {t('researchPaper.accessPaper')}
            <RedirectIcon width="12px" height="12px"/>
          </Button>
        </StackSkeleton>
      </Stack>

      <Stack spacing="8px">
        <StackSkeleton width="160px" height="28px">
          <TitleText typography="small">
            {t('researchPaper.abstract')}
          </TitleText>
        </StackSkeleton>

        <SkeletonText
          startColor="#F0F0F0"
          endColor="#F3F3F3"
          borderRadius="6px"
          width="100%"
          height="fit-content"
          spacing="6px"
          skeletonHeight="16px"
          noOfLines={3}
          marginTop="8px !important"
          isLoaded={!isLoading}
        >
          <ReadMore id="readLessResearchPaperAbstract">
            {resource?.abstract || t('researchPaper.notProvided')}
          </ReadMore>
        </SkeletonText>
      </Stack>

      <Divider marginY="40px !important" borderColor="#DEDFE0"/>

      <StackSkeleton width="190px" height="28px" marginBottom="20px !important">
        <TitleText typography="small">
          {t('researchPaper.additionalInfo')}
        </TitleText>
      </StackSkeleton>

      <AddInfoTextBase
        title={t('researchPaper.publicationStatus')}
        text={STATUS_KEYS[resource?.publicationStatus] && t(`researchPaper.${STATUS_KEYS[resource.publicationStatus]}`)}
      />

      <AddInfoTextBase title={t('researchPaper.journal')} text={citation()}/>

      <AddInfoTextBase title="DOI">
        {resource?.doi ?
          <Link
            href={resource.doiUrl}
            target="_blank"
            fontWeight="400"
            fontSize="14px"
            lineHeight="20px"
            color="#0068C5"
            _hover={{ color: "#0057A4" }}
          >
            {resource.doi}
          </Link>
        :
          <BodyText typography="small" color="#464A51">{t('researchPaper.notProvided')}</BodyText>
        }
      </AddInfoTextBase>

      <AddInfoTextBase title={t('researchPaper.researchers')} text={researcherNames()}/>

      {resource?.googleScholar &&
        <Box marginBottom="24px">
          <Link
            href={resource.googleScholar}
            target="_blank"
            display="flex"
            alignItems="center"
            gap="6px"
            fontWeight="400"
            fontSize="14px"
            lineHeight="20px"
            color="#0068C5"
            fill="#0068C5"
            _hover={{ color: "#0057A4", fill: "#0057A4" }}
          >
            Google Scholar
            <RedirectIcon width="12px" height="12px"/>
          </Link>
        </Box>
      }
    </Stack>
  )
}
