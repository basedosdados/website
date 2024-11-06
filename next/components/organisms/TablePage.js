import {
  HStack,
  Stack,
  Box,
  Text,
  Skeleton,
  SkeletonText,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import Link from "../atoms/Link";
import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { capitalize } from 'lodash';
import ReadMore from "../atoms/ReadMore";
import { formatBytes } from "../../utils";
import ObservationLevel from "../atoms/ObservationLevelTable";
import { TemporalCoverageBar } from "../molecules/TemporalCoverageDisplay";
import DataInformationQuery from "../molecules/DataInformationQuery";
import FourOFour from "../templates/404";

import EmailIcon from "../../public/img/icons/emailIcon";
import GithubIcon from "../../public/img/icons/githubIcon";
import WebIcon from "../../public/img/icons/webIcon";
import TwitterIcon from "../../public/img/icons/twitterIcon";
import InfoIcon from "../../public/img/icons/infoIcon";
import DownloadIcon from "../../public/img/icons/downloadIcon";
import RedirectIcon from "../../public/img/icons/redirectIcon";
import axios from "axios";

export default function TablePage({ id }) {
  const { t } = useTranslation('dataset', 'prices');
  const router = useRouter();
  const { locale } = router;
  const [isLoading, setIsLoading] = useState(true)
  const [resource, setResource] = useState({})
  const [isError, setIsError] = useState(false)
  const [spatialCoverageNames, setSpatialCoverageNames] = useState([]);

  const allowedURLs = ["https://basedosdados.org", "https://staging.basedosdados.org"]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/tables/getTable?id=${id}&locale=${locale}`, { method: "GET" })
        const result = await response.json()

        if (result.success) {
          if(!allowedURLs.includes(process.env.NEXT_PUBLIC_BASE_URL_FRONTEND)) {
            let areaNames = [];

            if (result.resource?.spatialCoverage) {
              const coverageArray = Array.isArray(result.resource.spatialCoverage)
                ? result.resource.spatialCoverage
                : typeof result.resource.spatialCoverage === 'string'
                  ? result.resource.spatialCoverage.split(',').map(item => item.trim())
                  : Object.values(result.resource.spatialCoverage);
  
              const promises = coverageArray.map(slug => 
                axios.get(`/api/areas/getArea?slug=${slug}&locale=${locale}`)
              );
              
              const responses = await Promise.all(promises);
              areaNames = responses
                .map(res => res.data.resource[0]?.node[`name${capitalize(locale)}`] || res.data.resource[0]?.node.name)
                .filter(Boolean)
                .sort((a, b) => a.localeCompare(b, locale));
            }

            setSpatialCoverageNames(areaNames);
          }
          
          setResource(result.resource);
          setIsError(false);
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

    setIsLoading(true);
    fetchData();
  }, [id, locale])

  const TooltipText = ({ text, info, ...props }) => {
    return (
      <Box>
        <Text
          display="flex"
          flexDirection="row"
          alignItems="center"
          gap="8px"
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="18px"
          lineHeight="20px"
          color="#252A32"
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
            {...props}
          >
            <InfoIcon
              alt="tip"
              cursor="pointer"
              fill="#878A8E"
              width="16px"
              height="16px"
            />
          </Tooltip>
        </Text>
      </Box>
    )
  }

  const keyIcons = (ref) => {
    let href = ""
    let alt = ""

    if(ref.github_user) {
      const github = ref.github_user.replace(/(https:)\/\/(github.com)\//gim, "")
      href = `https://github.com/${github}` 
      alt = "github basedosdados"
    }
    if(ref.twitter_user) {
      const twitter = ref.twitter_user.replace(/(https:)\/\/(twitter.com)\//gim, "")
      href = `https://twitter.com/${twitter}`
      alt = "twitter basedosdados"
    }
    if(ref.email) {
      href = `mailto:${ref.email}`
      alt= "email do contribuidor"
    }
    if(ref.website) {
      const website = ref.website.replace(/(https?:)\/\//gim, "")
      href = `https://${website}`
      alt = "website pessoal"
    }

    return {
      alt: alt,
      cursor: "pointer",
      width:"20px",
      height:"20px",
      fill: "#0068C5",
      _hover: {
        fill: "#0057A4"
      },
      onClick: () => {router.push(href)}
    }
  }

  const PublishedOrDataCleanedBy = ({ resource }) => {
    if (!resource || typeof resource !== 'object' || Object.keys(resource).length === 0) {
      return (
        <Text
          marginRight="4px !important"
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          color="#464A51"
        >
          {t('table.notProvided')}
        </Text>
      );
    }

    const people = Object.values(resource);

    return (
      <Stack spacing="8px">
        {people.map((person, index) => (
          <HStack key={index} spacing="4px">
            <Text
              marginRight="4px !important"
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              lineHeight="20px"
              color="#464A51"
            >
              {person?.firstName && person?.lastName 
                ? `${person.firstName} ${person.lastName}`
                : t('table.notProvided')
              }
            </Text>
            {person?.email && <EmailIcon {...keyIcons({email: person.email})}/>}
            {person?.github && <GithubIcon {...keyIcons({github_user: person.github})}/>}
            {person?.website && <WebIcon {...keyIcons({website: person.website})}/>}
            {person?.twitter && <TwitterIcon {...keyIcons({twitter_user: person.twitter})}/>}
          </HStack>
        ))}
      </Stack>
    );
  };

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

  const formatDate = (value) => {
    const date = new Date(value);
    const formattedDate = date.getFullYear()+"-"+String(date.getMonth() + 1).padStart(2, "0")+"-"+String(date.getDate()).padStart(2, "0")
    return formattedDate
  }

  const getUpdateFormat = (value, yearFrequency = false, frequency) => {
    let formats
    {yearFrequency ?
      formats = {
        "second":`${t('table.updateEvery')} ${frequency} ${t('table.seconds')}`,
        "minute":`${t('table.updateEvery')} ${frequency} ${t('table.minutes')}`,
        "hour":`${t('table.updateEvery')} ${frequency} ${t('table.hours')}`,
        "day":`${t('table.updateEvery')} ${frequency} ${t('table.days')}`,
        "week":`${t('table.updateEvery')} ${frequency} ${t('table.weeks')}`,
        "month":`${t('table.updateEvery')} ${frequency} ${t('table.months')}`,
        "bimester":`${t('table.updateEvery')} ${frequency} ${t('table.bimonths')}`,
        "quarter":`${t('table.updateEvery')} ${frequency} ${t('table.quarters')}`,
        "semester":`${t('table.updateEvery')} ${frequency} ${t('table.semesters')}`,
        "year":`${t('table.updateEvery')} ${frequency} ${t('table.years')}`,
      }
      :
      formats = {
        "second":t('table.updatePerSecond'),
        "minute":t('table.updatePerMinute'),
        "hour":t('table.updatePerHour'),
        "day":t('table.dailyUpdate'),
        "week":t('table.weeklyUpdate'),
        "month":t('table.monthlyUpdate'),
        "bimester":t('table.bimonthlyUpdate'),
        "quarter":t('table.quarterlyUpdate'),
        "semester":t('table.semiannualUpdate'),
        "year":t('table.annualUpdate'),
      }
    }

    return formats[value] ? formats[value] : t('table.updateNotDefined')
  }

  if (isError) return <FourOFour/>;
  
  return (
    <Stack
      flex={1}
      overflow="hidden"
      spacing={0}
    >
      <StackSkeleton
        display="flex"
        height="100%"
        flexDirection={{base: "column", lg: "row"}}
        alignItems={{base: "start", lg: "center"}}
        gap="8px"
      >
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="24px"
          lineHeight="36px"
          color="#252A32"
          width={{base: "100%", lg:"fit-content"}}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace={{base: "normal", lg:"nowrap"}}
        >
          {resource?.[`name${capitalize(locale)}`] || resource?.name}
        </Text>
        {resource?.uncompressedFileSize &&
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="12px"
            lineHeight="18px"
            color="#71757A"
          >
            {`(${formatBytes(resource.uncompressedFileSize)})`}
          </Text>
        }
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
        marginBottom="40px !important"
        isLoaded={!isLoading}
      >
        <ReadMore id="readLessTable">
          {resource?.[`description${capitalize(locale)}`] || resource?.description || t('table.notProvided')}
        </ReadMore>
      </SkeletonText>

      <Stack spacing="12px" marginBottom="40px !important">
        <StackSkeleton width="300px" height="20px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="18px"
            lineHeight="20px"
            color="#252A32"
          >
            {t('table.temporalCoverage')}
          </Text>
        </StackSkeleton>

        <StackSkeleton
          width="100%"
          height={!isLoading ? "fit-content" : "65px"}
        >
          <TemporalCoverageBar value={resource?.fullTemporalCoverage}/>
        </StackSkeleton>
      </Stack>

      {!allowedURLs.includes(process.env.NEXT_PUBLIC_BASE_URL_FRONTEND) &&
        <Stack spacing="12px"  marginBottom="40px !important">
          <StackSkeleton width="300px" height="20px">
            <Text
              fontFamily="Roboto"
              fontWeight="500"
              fontSize="18px"
              lineHeight="20px"
              color="#252A32"
            >
              {t('table.spatialCoverage')}
            </Text>
          </StackSkeleton>

          <StackSkeleton
            height="20px"
            width={resource?.spatialCoverageNames ? "100%" : "200px"}
          >
            <Text
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              lineHeight="20px"
              color="#464A51"
            >
              {spatialCoverageNames.length > 0 
                ? spatialCoverageNames.join(', ')
                : t('table.notProvided')}
            </Text>
          </StackSkeleton>
        </Stack>
      }

      <Stack spacing="12px" marginBottom="40px !important">
        <StackSkeleton width="200px" height="20px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="18px"
            lineHeight="20px"
            color="#252A32"
          >
            {t('table.dataAccess')}
          </Text>
        </StackSkeleton>

        <DataInformationQuery
          resource={resource}
        />
      </Stack>

      <Stack marginBottom="40px !important">
        <StackSkeleton width="380px" height="20px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="18px"
            lineHeight="20px"
            color="#252A32"
          >
            {t('table.dataUpdateFrequency')}
          </Text>
        </StackSkeleton>

        <SkeletonText
          startColor="#F0F0F0"
          endColor="#F3F3F3"
          borderRadius="6px"
          width={!isLoading ? "100%" : "500px"}
          spacing="4px"
          skeletonHeight="18px"
          noOfLines={3}
          marginTop="12px !important"
          isLoaded={!isLoading}
        >
          <Box
            display="flex"
            marginBottom={{base: "24px", lg: "0"}}
            flexDirection={{base: "column", lg: "row"}}
            gap="4px"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="22px"
            color="#464A51"
          >
            {resource?.updates?.[0]?.latest ?
              `${formatDate(resource.updates[0].latest)}`
              :
              t('table.notProvided')
            }: {t('table.lastUpdateBD')}
            {resource?.updates?.[0]?.frequency &&
              <Text
                width="fit-content"
                backgroundColor="#EEEEEE"
                padding="2px 4px"
                borderRadius="4px"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="12px"
                lineHeight="18px"
                color="#252A32"
              >
                {resource?.updates?.[0]?.frequency === 1 ?
                  getUpdateFormat(resource.updates[0].entity.slug)
                :
                  getUpdateFormat(resource.updates[0].entity.slug, true, resource?.updates?.[0]?.frequency)
                }
              </Text>
            }
            {!resource?.updates?.[0]?.frequency &&
              <Text
                width="fit-content"
                backgroundColor="#EEEEEE"
                padding="2px 4px"
                borderRadius="4px"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="12px"
                lineHeight="18px"
                color="#252A32"
              >
                {t('table.noUpdateScheduled')}
              </Text>
            }
          </Box>
          <Box
            display="flex"
            flexDirection={{base: "column", lg: "row"}}
            marginBottom={{base: "24px", lg: "0"}}
            gap="4px"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="22px"
            marginTop="4px"
            color="#464A51"
          >
            {resource?.rawDataSource?.[0]?.updates?.[0]?.latest ?
              `${formatDate(resource.rawDataSource[0].updates[0].latest)}:`
              :
              t('table.notProvided')
            }: {t('table.lastUpdateRawDataSource')}
            {resource?.rawDataSource?.[0]?.updates?.[0]?.frequency ?
              <Text
                width="fit-content"
                backgroundColor="#EEEEEE"
                padding="2px 4px"
                borderRadius="4px"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="12px"
                lineHeight="18px"
                color="#252A32"
              >
                {resource?.rawDataSource?.[0]?.updates?.[0]?.frequency === 1 ?
                  getUpdateFormat(resource?.rawDataSource?.[0]?.updates?.[0]?.entity?.slug)
                :
                  getUpdateFormat(resource?.rawDataSource?.[0]?.updates?.[0]?.entity?.slug, true, resource?.rawDataSource?.[0]?.updates?.[0]?.frequency)
                }
              </Text>
            :
            !resource?.rawDataSource?.[0]?.updates?.[0] || !resource?.updates?.[0]?.frequency ?
              <Text
                width="fit-content"
                backgroundColor="#EEEEEE"
                padding="2px 4px"
                borderRadius="4px"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="12px"
                lineHeight="18px"
                color="#252A32"
              >
                {t('table.noUpdateScheduled')}
              </Text>
              :
              <></>
            }
          </Box>
          <Text
            display="flex"
            flexDirection={{base: "column", lg: "row"}}
            gap="4px"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="22px"
            marginTop="4px"
            color="#464A51"
          >
            {resource?.rawDataSource?.[0]?.polls?.[0]?.latest ?
              `${formatDate(resource.rawDataSource[0].polls[0].latest)}:`
              :
              t('table.notProvided')
            }: {t('table.lastCheckRawDataSource')}
          </Text>
        </SkeletonText>
      </Stack>

      <Stack marginBottom="40px !important">
        <StackSkeleton width="300px" height="20px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="18px"
            lineHeight="20px"
            color="#252A32"
          >
            {t('table.bigQueryID')}
          </Text>
        </StackSkeleton>

        <StackSkeleton
          height="20px"
          width={resource?.cloudTables ? "fit-content" : "500px"}
          marginTop="12px !important"
        >
          <Text
            as="a"
            id="acessar_o_bigquery_section"
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="8px"
            href={`https://console.cloud.google.com/bigquery?p=${resource?.cloudTables?.[0]?.gcpProjectId}&d=${resource?.cloudTables?.[0]?.gcpDatasetId}&t=${resource?.cloudTables?.[0]?.gcpTableId}&page=table`}
            target="_blank"
            cursor="pointer"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="20px"
            color={resource?.cloudTables ? "#0068C5" : "#464A51"}
            pointerEvents={resource?.cloudTables ? "default" : "none"}
            fill="#0068C5"
            _hover={{
              color:"#0057A4",
              fill:"#0057A4"
            }}
          >
            {!resource?.cloudTables ?
              t('table.notProvided')
              :
              resource?.cloudTables?.[0]?.gcpProjectId+"."+resource?.cloudTables?.[0]?.gcpDatasetId+"."+resource?.cloudTables?.[0]?.gcpTableId
            }
            <RedirectIcon
              display={resource?.cloudTables ? "flex" : "none"}
              width="12px"
              height="12px"
            />
          </Text>
        </StackSkeleton>
      </Stack>


      <Stack marginBottom="40px !important">
        <StackSkeleton width="260px" height="20px">
          <TooltipText
            text={t("table.partitionsInBigQuery")}
            info={t("table.partitionsTooltip")}
          />
        </StackSkeleton>
        <StackSkeleton
          height="20px"
          width={resource?.partitions ? "100%" : "200px"}
          marginTop="12px !important"
        >
          <Text
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="20px"
            color="#464A51"
          >
            {resource?.partitions ? resource.partitions : t('table.notProvided')}
          </Text>
        </StackSkeleton>
      </Stack>

      <Stack marginBottom="40px !important">
        <StackSkeleton width="300px" height="20px">
          <TooltipText
            text={t("table.observationLevel")}
            info={t("table.observationLevelTooltip")}
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
            <Text
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              lineHeight="20px"
              color="#464A51"
            >
              {t('table.notProvided')}
            </Text>
          }
        </Skeleton>       
      </Stack>

      <Stack marginBottom="40px !important">
        <StackSkeleton width="240px" height="20px">
          <TooltipText
            text={t("table.auxiliaryFiles")}
            info={t("table.auxiliaryFilesTooltip")}
          />
        </StackSkeleton>
        <StackSkeleton
          width={resource?.auxiliaryFilesUrl ? "100%" :"178px"}
          height="24px"
          marginTop="12px !important"
        >
          <Text
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="20px"
            color="#464A51"
          >
            {resource?.auxiliaryFilesUrl ?
              <Text
                as="a"
                display="flex"
                flexDirection="row"
                gap="8px"
                alignItems="center"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="14px"
                lineHeight="20px"
                color="#0068C5"
                fill="#0068C5"
                _hover={{
                  fill: "#0057A4",
                  color: "#0057A4"
                }}
                href={resource.auxiliaryFilesUrl}
              >
                {t('table.downloadFiles')}
                <DownloadIcon
                  width="16px"
                  height="16px"
                />
              </Text>
            :
              t('table.notProvided')
            }
          </Text>  
        </StackSkeleton>
      </Stack>

      <Stack>
        <StackSkeleton width="240px" height="20px">
          <TooltipText
            text={t("table.rawDataSources")}
            info={t("table.rawDataSourcesTooltip")}
          />
        </StackSkeleton>

        <StackSkeleton
          height="20px"
          width={resource?.rawDataSource?.[0]?.name ? "100%" :"132px"}
          marginTop="12px !important"
        >
          <Text
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="20px"
            color="#464A51"
          >
            {resource?.rawDataSource?.[0]?._id ?
              Object.values(resource?.rawDataSource).map((elm, i) => {
                return (
                  <Link
                    key={i}
                    target="_blank"
                    display="flex"
                    flexDirection="row"
                    gap="8px"
                    alignItems="center"
                    fontFamily="Roboto"
                    fontWeight="400"
                    fontSize="14px"
                    lineHeight="20px"
                    color="#0068C5"
                    fill="#0068C5"
                    _hover={{
                      fill: "#0057A4",
                      color: "#0057A4"
                    }}
                    href={`/dataset/${elm?.dataset?._id}?raw_data_source=${elm?._id}`}
                  >
                    {elm?.[`name${capitalize(locale)}`] || elm?.name}
                  </Link>
                )
              }) 
              :
                t('table.notProvided')
            }
          </Text>
        </StackSkeleton> 
      </Stack>

      <Divider marginY="40px !important" borderColor="#DEDFE0"/>

      <StackSkeleton width="240px" height="20px" marginBottom="20px !important">
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="18px"
          lineHeight="20px"
          color="#252A32"
        >
          {t('table.additionalInformation')}
        </Text>
      </StackSkeleton>

      <SkeletonText
        startColor="#F0F0F0"
        endColor="#F3F3F3"
        borderRadius="6px"
        width={resource?.publishedByInfo ? "100%" :"200px"}
        minHeight="40px"
        spacing="4px"
        skeletonHeight="16px"
        noOfLines={2}
        marginBottom="24px !important"
        isLoaded={!isLoading}
      >
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="14px"
          lineHeight="20px"
          color="#252A32"
        >{t('table.publishedBy')}</Text>
        <PublishedOrDataCleanedBy
          resource={resource?.publishedByInfo || t('table.notProvided')}
        />
      </SkeletonText>

      <SkeletonText
        startColor="#F0F0F0"
        endColor="#F3F3F3"
        borderRadius="6px"
        width={resource?.dataCleanedByInfo ? "100%" : "200px"}
        minHeight="40px"
        spacing="4px"
        skeletonHeight="16px"
        noOfLines={2}
        marginBottom="24px !important"
        isLoaded={!isLoading}
      >
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="14px"
          lineHeight="20px"
          color="#252A32"
        >{t('table.dataCleanedBy')}</Text>
        <PublishedOrDataCleanedBy
          resource={resource?.dataCleanedByInfo || t('table.notProvided')}
        />
      </SkeletonText>

      <SkeletonText
        startColor="#F0F0F0"
        endColor="#F3F3F3"
        borderRadius="6px"
        width={resource?.version ? "100%" : "100px"}
        minHeight="40px"
        spacing="4px"
        skeletonHeight="18px"
        noOfLines={2}
        marginBottom="24px !important"
        isLoaded={!isLoading}
      >
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="14px"
          lineHeight="20px"
          color="#252A32"
        >{t('table.version')}</Text>
        <Text
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          color="#464A51"
        >{resource?.version || t('table.notProvided')}</Text>
      </SkeletonText>
    </Stack>
  )
}
