import {
  Stack,
  Box,
  Skeleton,
  SkeletonText,
  Tooltip,
  Divider
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { capitalize } from "lodash";

import Button from "../atoms/Button";
import TitleText from "../atoms/Text/TitleText";
import LabelText from "../atoms/Text/LabelText";
import BodyText from "../atoms/Text/BodyText";
import ReadMore from "../atoms/ReadMore";
import ObservationLevel from "../atoms/ObservationLevelTable";
import { AlertDiscalimerBox } from "../molecules/DisclaimerBox";
import FourOFour from "../templates/404";

import RedirectIcon from "../../public/img/icons/redirectIcon"
import InfoIcon from "../../public/img/icons/infoIcon";

export default function RawDataSourcesPage({ id, isBDSudo }) {
  const { t } = useTranslation('dataset');
  const router = useRouter();
  const { locale } = router;
  const [isLoading, setIsLoading] = useState(true)
  const [resource, setResource] = useState({})
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchRawDataSources = async () => {
      setIsLoading(true)
      try {
        const url = `/api/rawDataSources/getRawDataSource?id=${id}&locale=${locale}`;
        const response = await fetch(url, { method: "GET" })
        const result = await response.json()

        if (result.success) {
          const statusName = result?.resource?.status?.slug || ""
          if(statusName === "under_review" || statusName === "excluded" && isBDSudo === false) {
            setIsError(true)
          } else {
            setResource(result.resource)
            setIsError(false)
          }
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

    fetchRawDataSources()
  }, [id, locale])

  const ObjectValues = (value) => {
    if(value === undefined || Object.keys(value).length === 0) return t('rawDataSource.notProvided')

    const array = []

    Object.values(value).map((elm) => {
      const translatedName = elm[`name${capitalize(locale)}`] || elm.name
      array.push(translatedName)
    })

    if(array.length === 0) return t('rawDataSource.notProvided')
    return array.join(", ").toString()
  }

  const TrueOrFalse = (value) => {
    switch (value) {
      case true:
        return t('rawDataSource.yes')
        break;
      case false:
        return t('rawDataSource.no')
        break;
      default:
        return t('rawDataSource.notProvided')
        break;
    }
  }

  const UpdateFrequency = () => {
    const value = resource?.updates?.[0];
    if (!value || Object.keys(value).length === 0) return t('rawDataSource.notProvided');

    const localizedName = value.entity[`name${capitalize(locale)}`];
    const defaultName = value.entity.name;

    if (value.frequency >= 0 && (localizedName || defaultName)) {
      return `${value.frequency} ${localizedName || defaultName}`;
    }
    if (localizedName || defaultName) {
      return `${localizedName || defaultName}`;
    }

    return t('rawDataSource.notProvided');
  }

  const TooltipText = ({ text, info, ...props }) => {
    return (
      <Box>
        <TitleText
          typography="small"
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="8px"
          {...props}
        >
          {text}
          <Tooltip
            label={info}
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
            maxWidth="300px"
          >
            <InfoIcon
              alt="tip"
              cursor="pointer"
              fill="#878A8E"
              width="16px"
              height="16px"
            />
          </Tooltip>
        </TitleText>
      </Box>
    )
  }

  const StackSkeleton = ({ children, ...props }) => {
    return (
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
  }

  const AddInfoTextBase = ({ title, text, ...props }) => {
    return (
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
        <BodyText
          typography="small"
          color="#464A51"
        >{text || t('rawDataSource.notProvided')}</BodyText>
      </SkeletonText>
    )
  }

  if(isError) return <FourOFour/>

  return (
    <Stack
      flex={1}
      overflow="hidden"
      paddingLeft={{base: "0", lg: "24px"}}
      spacing={0}
    >
      <StackSkeleton
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap="8px"
      >
        <TitleText
          width="fit-content"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {resource?.[`name${capitalize(locale)}`] || resource?.name}
        </TitleText>
      </StackSkeleton>

      <StackSkeleton
        minHeight="56px"
        height="fit-content"
        marginTop="8px !important"
      >
        <AlertDiscalimerBox>
          {t('rawDataSource.rawDataDisclaimer')}
        </AlertDiscalimerBox>
      </StackSkeleton>

      <StackSkeleton
        width="fit-content"
        height="40px"
        marginTop="8px !important"
        marginBottom="40px !important"
      >
        <Button
          as="a"
          href={resource?.url}
          target="_blank"
          onClick={() => {}}
          backgroundColor={resource?.url ? "#2B8C4D" : "#ACAEB1"}
          cursor={resource?.url ? "pointer" : "default"}
          _hover={{
            backgroundColor: resource?.url ? "#22703E" : "#ACAEB1"
          }}
        >
          {t('rawDataSource.accessOriginalSource')}
          <RedirectIcon
            width="12px"
            height="12px"
          />
        </Button>
      </StackSkeleton>

      <Stack spacing="8px">
        <StackSkeleton width="160px" height="28px">
          <TitleText typography="small">
            {t('rawDataSource.description')}
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
          <ReadMore id="readLessRawDescription">
            {resource?.[`description${capitalize(locale)}`] || resource?.description || t('rawDataSource.notProvided')}
          </ReadMore>
        </SkeletonText>
      </Stack>

      <Divider marginY="40px !important" borderColor="#DEDFE0"/>

      <StackSkeleton width="190px" height="28px" marginBottom="20px !important">
        <TitleText typography="small">
          {t('rawDataSource.additionalInfo')}
        </TitleText>
      </StackSkeleton>

      <AddInfoTextBase
        title={t('rawDataSource.language')}
        text={ObjectValues(resource?.languages)}
      />

      <AddInfoTextBase
        title={t('rawDataSource.availability')}
        text={resource?.availability?.name}
      />

      <AddInfoTextBase
        title={t('rawDataSource.hasStructuredData')}
        text={TrueOrFalse(resource?.containsStructuredData)}
      />

      <AddInfoTextBase
        title={t('rawDataSource.hasAPI')}
        text={TrueOrFalse(resource?.containsApi)}
      />

      <AddInfoTextBase
        title={t('rawDataSource.updateFrequency')}
        text={UpdateFrequency()}
      />

      <Stack marginBottom="24px !important">
        <StackSkeleton width="190px" height="28px">
          <TooltipText
            text={t('rawDataSource.observationLevel')}
            info={t('rawDataSource.observationLevelTooltip')}
            fontSize="14px"
          />
        </StackSkeleton>

        <Skeleton
          startColor="#F0F0F0"
          endColor="#F3F3F3"
          borderRadius="16px"
          height="100%"
          width="100%"
          isLoaded={!isLoading}
        >
          {resource?.observationLevels && Object.keys(resource?.observationLevels).length > 0 ?
            <ObservationLevel resource={resource}/>
            :
            <BodyText
              typography="small"
              color="#464A51"
            >
              {t('rawDataSource.notProvided')}
            </BodyText>
          }
        </Skeleton>       
      </Stack>

      <AddInfoTextBase
        title={t('rawDataSource.requiresRegistration')}
        text={TrueOrFalse(resource?.requiresRegistration)}
      />

      <AddInfoTextBase
        title={t('rawDataSource.requiresIPFromCountry')}
        text={ObjectValues(resource?.areaIpAddressRequired)}
      />

      <AddInfoTextBase
        title={t('rawDataSource.isFree')}
        text={TrueOrFalse(resource?.isFree)}
      />
    </Stack>
  )
}
