import {
  HStack,
  Stack,
  Box,
  Skeleton,
  SkeletonText,
  Divider,
  Tooltip,
  useToast
} from "@chakra-ui/react";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { capitalize } from 'lodash';
import cookies from "js-cookie";
import { formatBytes } from "../../utils";
import Button from "../atoms/Button";
import Link from "../atoms/Link";
import ReadMore from "../atoms/ReadMore";
import TitleText from "../atoms/Text/TitleText";
import LabelText from "../atoms/Text/LabelText";
import BodyText from "../atoms/Text/BodyText";
import ObservationLevel from "../atoms/ObservationLevelTable";
import { TemporalCoverageBar } from "../molecules/TemporalCoverageDisplay";
import DataInformationQuery from "../molecules/DataInformationQuery";
import FourOFour from "../templates/404";

import GithubIcon from "../../public/img/icons/githubIcon";
import WebIcon from "../../public/img/icons/webIcon";
import InfoIcon from "../../public/img/icons/infoIcon";
import DownloadIcon from "../../public/img/icons/downloadIcon";
import RedirectIcon from "../../public/img/icons/redirectIcon";
import {NotificationSolidIcon, NotificationDeactivateIcon} from "../../public/img/icons/notificationIcon";

const createKeyIcons = (router) => (ref) => {
  let href = "";
  let alt = "";

  if(ref.github_user) {
    const github = ref.github_user.replace(/(https:)\/\/(github.com)\//gim, "");
    href = `https://github.com/${github}`;
    alt = "github basedosdados";
  }
  if(ref.twitter_user) {
    const twitter = ref.twitter_user.replace(/(https:)\/\/(twitter.com)\//gim, "");
    href = `https://x.com/${twitter}`;
    alt = "twitter basedosdados";
  }
  if(ref.email) {
    href = `mailto:${ref.email}`;
    alt = "email do contribuidor";
  }
  if(ref.website) {
    const website = ref.website.replace(/(https?:)\/\//gim, "");
    href = `https://${website}`;
    alt = "website pessoal";
  }

  return {
    'aria-label': alt,
    role: 'link',
    tabIndex: 0,
    cursor: href ? "pointer" : "default",
    width: "20px",
    height: "20px",
    fill: "#0068C5",
    _hover: {
      fill: "#0057A4"
    },
    onClick: href ? () => window.open(href, '_blank', 'noopener,noreferrer') : undefined,
  };
};

const TooltipText = memo(({ text, info, ...props }) => {
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
          {...props}
        >
          <Box as="span" display="inline-flex">
            <InfoIcon
              alt="tip"
              cursor="pointer"
              fill="#878A8E"
              width="16px"
              height="16px"
            />
          </Box>
        </Tooltip>
      </TitleText>
    </Box>
  );
});

const StackSkeleton = memo(({ children, isLoading, ...props }) => {
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
  );
});

const PublishedOrDataCleanedBy = memo(({ resource, t, router }) => {
  const keyIcons = useMemo(() => createKeyIcons(router), [router]);

  if (!resource || typeof resource !== 'object' || Object.keys(resource).length === 0) {
    return (
      <BodyText
        typography="small"
        marginRight="4px !important"
        color="#464A51"
      >
        {t('table.notProvided')}
      </BodyText>
    );
  }

  const people = Object.values(resource);

  return (
    <Stack spacing="8px">
      {people.map((person, index) => (
        <HStack key={index} spacing="4px">
          <BodyText
            typography="small"
            marginRight="4px !important"
            color="#464A51"
          >
            {person?.firstName && person?.lastName 
              ? `${person.firstName} ${person.lastName}`
              : t('table.notProvided')
            }
          </BodyText>
          {person?.github && <GithubIcon {...keyIcons({github_user: person.github})}/>}
          {person?.website && <WebIcon {...keyIcons({website: person.website})}/>}
        </HStack>
      ))}
    </Stack>
  );
});

export default function TablePage({ id, isBDSudo, changeTab, datasetName }) {
  const { t } = useTranslation(['dataset', 'prices']);
  const router = useRouter();
  const { locale } = router;
  const toast = useToast();
  const [tableNotificationIsHidden, setTableNotificationIsHidden] = useState(true);
  const [tableNotificationStatus, setTableNotificationStatus] = useState(false);
  const [toggleDisabled, setToggleDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resource, setResource] = useState({});
  const [isError, setIsError] = useState(false);

  const getUserIdFromCookie = useCallback(() => {
    const rawUser = cookies.get("userBD");
    if (!rawUser) return null;
    try {
      const parsed = JSON.parse(rawUser);
      const userIdRaw = parsed?.id;
      if (!userIdRaw) return null;
      return String(userIdRaw).includes(":") ? String(userIdRaw).split(":").pop() : String(userIdRaw);
    } catch (err) {
      console.error('Error parsing userBD cookie', err);
      return null;
    }
  }, []);

  const handlerTableNotificationHiding = useCallback(() => {
    const rawUser = cookies.get("userBD");
    const user = rawUser ? JSON.parse(rawUser) : null;
    if (user?.isAdmin || user?.isSubscriber) {
      setTableNotificationIsHidden(false);
    }
  }, []);

  async function handlerStatusTableNotification() {
    const idUser = getUserIdFromCookie();
    if (!idUser) return;

    try {
      const response = await fetch(`/api/tables/getStatusTableUpdateNotification?p=${btoa(idUser)}&q=${btoa(id)}`, { method: "GET" });
      const result = await response.json();
      if (result) {
        setTableNotificationStatus(result?.status);
      }
    } catch (err) {
      console.error('Error fetching table notification status', err);
    }
  }

  async function handlerToggleTableNotification() {
    if (toggleDisabled) return;

    const idUser = getUserIdFromCookie();
    if (!idUser) return;

    setToggleDisabled(true);
    try {
      const toggleResp = await fetch(`/api/tables/toggleTableUpdateNotification?p=${btoa(idUser)}&q=${btoa(id)}&s=${btoa(String(tableNotificationStatus))}`, { method: "GET" });
      const toggleResult = await toggleResp.json();

      const statusResp = await fetch(`/api/tables/getStatusTableUpdateNotification?p=${btoa(idUser)}&q=${btoa(id)}`, { method: "GET" });
      const statusResult = await statusResp.json();

      if (statusResult && typeof statusResult.status !== 'undefined') {
        setTableNotificationStatus(statusResult.status);
        const enabledMessage = t('table.notificationEnabled');
        const disabledMessage = t('table.notificationDisabled');
        toast({
          title: statusResult.status ? enabledMessage : disabledMessage,
          status: "success",
          duration: 3000,
          position: "bottom"
        });
      } else if (toggleResult && toggleResult.message) {
        toast({ title: toggleResult.message, status: "info", duration: 3000, position: "bottom" });
      }
    } catch (err) {
      console.error('Error toggling table notification', err);
      const failMessage = t('table.notificationToggleFailed');
      toast({ title: failMessage, status: "error", duration: 4000, position: "bottom" });
    } finally {
      setTimeout(() => setToggleDisabled(false), 3000);
    }
  }

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`/api/tables/getTable?id=${id}&locale=${locale}`, { method: "GET" });
      const result = await response.json();

      if (result.success) {
        const statusName = result?.resource?.status?.slug || "";
        if((statusName === "under_review" || statusName === "excluded") && isBDSudo === false) {
          setIsError(true);
        } else {
          setResource(result.resource);
          setIsError(false);
        }
      } else {
        console.error(result.error);
        setIsError(true);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
      setIsError(true);
    } finally {
      handlerTableNotificationHiding();
      handlerStatusTableNotification();
      setIsLoading(false);
    }
  }, [id, locale, isBDSudo]);

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  const formatDate = useCallback((value) => {
    const date = new Date(value);
    return date.getFullYear()+"-"+String(date.getMonth() + 1).padStart(2, "0")+"-"+String(date.getDate()).padStart(2, "0");
  }, []);

  const getUpdateFormat = useCallback((value, yearFrequency = false, frequency) => {
    const formats = yearFrequency ? {
      "second": `${t('table.updateEvery')} ${frequency} ${t('table.seconds')}`,
      "minute": `${t('table.updateEvery')} ${frequency} ${t('table.minutes')}`,
      "hour": `${t('table.updateEvery')} ${frequency} ${t('table.hours')}`,
      "day": `${t('table.updateEvery')} ${frequency} ${t('table.days')}`,
      "week": `${t('table.updateEvery')} ${frequency} ${t('table.weeks')}`,
      "month": `${t('table.updateEvery')} ${frequency} ${t('table.months')}`,
      "bimester": `${t('table.updateEvery')} ${frequency} ${t('table.bimonths')}`,
      "quarter": `${t('table.updateEvery')} ${frequency} ${t('table.quarters')}`,
      "semester": `${t('table.updateEvery')} ${frequency} ${t('table.semesters')}`,
      "year": `${t('table.updateEvery')} ${frequency} ${t('table.years')}`,
    } : {
      "second": t('table.updatePerSecond'),
      "minute": t('table.updatePerMinute'),
      "hour": t('table.updatePerHour'),
      "day": t('table.dailyUpdate'),
      "week": t('table.weeklyUpdate'),
      "month": t('table.monthlyUpdate'),
      "bimester": t('table.bimonthlyUpdate'),
      "quarter": t('table.quarterlyUpdate'),
      "semester": t('table.semiannualUpdate'),
      "year": t('table.annualUpdate'),
    };

    return formats[value] ? formats[value] : t('table.updateNotDefined');
  }, [t]);

  const tableName = useMemo(() => 
    resource?.[`name${capitalize(locale)}`] || resource?.name,
    [resource, locale]
  );

  const tableDescription = useMemo(() => 
    resource?.[`description${capitalize(locale)}`] || resource?.description || t('table.notProvided'),
    [resource, locale, t]
  );

  if (isError) return <FourOFour/>;

  return (
    <Stack
      flex={1}
      overflow="hidden"
      spacing={0}
    >
      <StackSkeleton
        display="flex"
        width="100%"
        height="fit-content"
        flexDirection="row"
        gap="8px"
        justifyContent="space-between"
        alignItems="center"
        isLoading={isLoading}
      >
        <Stack
          display="flex"
          width="100%"
          minWidth="0"
          height="fit-content"
          flexDirection={{base: "column", lg: "row"}}
          alignItems={{base: "start", lg: "center"}}
          gap="8px"
          spacing={0}
        >
          <TitleText
            display="block"
            width="fit-content"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace={{base: "normal", lg:"nowrap"}}
          >
            {tableName}
          </TitleText>

          {resource?.uncompressedFileSize &&
            <LabelText
              width="fit-content"
              typography="x-small"
              color="#71757A"
              whiteSpace="nowrap"
              flexShrink={0}
            >
              {`(${formatBytes(resource.uncompressedFileSize)})`}
            </LabelText>
          }
        </Stack>

        {!tableNotificationIsHidden && 
          <Tooltip
            label={tableNotificationStatus ? t('table.tooltipDisableNotification') : t('table.tooltipEnableNotification')}
            hasArrow
            maxWidth={tableNotificationStatus ? "212px" : "245px"}
            padding="16px"
            backgroundColor="#252A32"
            boxSizing="border-box"
            borderRadius="8px"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="14px"
            lineHeight="20px"
            textAlign="center"
            color="#FFFFFF"
            placement="top"
          >
            <Box
              display="flex"
              flexShrink={0}
            >
              <Button
                width="fit-content"
                padding="11px 16px"
                borderRadius="8px"
                flexShrink={0}
                justifyContent="center"
                isVariant
                onClick={() => { if (!toggleDisabled) handlerToggleTableNotification(); }}
                aria-disabled={toggleDisabled}
                opacity={toggleDisabled ? 0.6 : 1}
                pointerEvents={toggleDisabled ? 'none' : 'auto'}
              >
                {tableNotificationStatus ?
                  <NotificationDeactivateIcon
                    width="18px"
                    height="18px"
                  />
                :
                  <NotificationSolidIcon
                    width="18px"
                    height="18px"
                  />
                }
                <LabelText color="currentColor">
                  {tableNotificationStatus ? t('table.disableNotification') : t('table.enableNotification')}
                </LabelText>
              </Button>
            </Box>
          </Tooltip>
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
          {tableDescription}
        </ReadMore>
      </SkeletonText>

      <Stack
        id="table_temporalcoverage"
        width={{base: "100%", lg: "fit-content"}}
        spacing="8px"
        marginBottom="40px !important"
      >
        <StackSkeleton width="300px" height="28px" isLoading={isLoading}>
          <TitleText typography="small">
            {t('table.temporalCoverage')}
          </TitleText>
        </StackSkeleton>

        <StackSkeleton
          width="100%"
          height={!isLoading ? "fit-content" : "65px"}
          isLoading={isLoading}
        >
          <TemporalCoverageBar value={resource?.fullTemporalCoverage}/>
        </StackSkeleton>
      </Stack>

      {/* {locale !== 'pt' ?
        <Stack spacing="8px"  marginBottom="40px !important">
          <StackSkeleton width="300px" height="28px" isLoading={isLoading}>
            <TitleText typography="small">
              {t('table.spatialCoverage')}
            </TitleText>
          </StackSkeleton>

          <StackSkeleton
            height="20px"
            width={resource?.[`spatialCoverageName${capitalize(locale)}`] ? "100%" : "200px"}
            isLoading={isLoading}
          >
            <BodyText
              typography="small"
              color="#464A51"
            >
              {resource?.[`spatialCoverageName${capitalize(locale)}`]
                ? Object.values(resource[`spatialCoverageName${capitalize(locale)}`])
                    .sort((a, b) => a.localeCompare(b, locale))
                    .join(', ')
                : t('table.notProvided')}
            </BodyText>
          </StackSkeleton>
        </Stack>
        :
        <></>
      } */}

      <Stack
        spacing="8px"
        marginBottom="40px !important"
        backgroundColor="#FFFFFF"
      >
        <StackSkeleton width="200px" height="28px" isLoading={isLoading}>
          <TitleText typography="small">
            {t('table.dataAccess')}
          </TitleText>
        </StackSkeleton>

        <DataInformationQuery
          resource={resource}
          datasetName={datasetName}
          changeTab={changeTab}
        />
      </Stack>

      <Stack spacing="8px" marginBottom="40px !important">
        <StackSkeleton width="380px" height="28px" isLoading={isLoading}>
          <TitleText typography="small">
            {t('table.dataUpdateFrequency')}
          </TitleText>
        </StackSkeleton>

        <SkeletonText
          startColor="#F0F0F0"
          endColor="#F3F3F3"
          borderRadius="6px"
          width={!isLoading ? "100%" : "500px"}
          spacing="4px"
          skeletonHeight="18px"
          noOfLines={3}
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
              <LabelText
                typography="x-small"
                width="fit-content"
                backgroundColor="#EEEEEE"
                padding="2px 4px"
                borderRadius="4px"
              >
                {resource?.updates?.[0]?.frequency === 1 ?
                  getUpdateFormat(resource.updates[0].entity.slug)
                :
                  getUpdateFormat(resource.updates[0].entity.slug, true, resource?.updates?.[0]?.frequency)
                }
              </LabelText>
            }
            {!resource?.updates?.[0]?.frequency &&
              <LabelText
                typography="x-small"
                width="fit-content"
                backgroundColor="#EEEEEE"
                padding="2px 4px"
                borderRadius="4px"
              >
                {t('table.noUpdateScheduled')}
              </LabelText>
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
              `${formatDate(resource.rawDataSource[0].updates[0].latest)}`
              :
              t('table.notProvided')
            }: {t('table.lastUpdateRawDataSource')}
            {resource?.rawDataSource?.[0]?.updates?.[0]?.frequency ?
              <LabelText
                typography="x-small"
                width="fit-content"
                backgroundColor="#EEEEEE"
                padding="2px 4px"
                borderRadius="4px"
              >
                {resource?.rawDataSource?.[0]?.updates?.[0]?.frequency === 1 ?
                  getUpdateFormat(resource?.rawDataSource?.[0]?.updates?.[0]?.entity?.slug)
                :
                  getUpdateFormat(resource?.rawDataSource?.[0]?.updates?.[0]?.entity?.slug, true, resource?.rawDataSource?.[0]?.updates?.[0]?.frequency)
                }
              </LabelText>
            :
            !resource?.rawDataSource?.[0]?.updates?.[0] || !resource?.updates?.[0]?.frequency ?
              <LabelText
                typography="x-small"
                width="fit-content"
                backgroundColor="#EEEEEE"
                padding="2px 4px"
                borderRadius="4px"
              >
                {t('table.noUpdateScheduled')}
              </LabelText>
              :
              <></>
            }
          </Box>
          <Box
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
              `${formatDate(resource.rawDataSource[0].polls[0].latest)}`
              :
              t('table.notProvided')
            }: {t('table.lastCheckRawDataSource')}
          </Box>
        </SkeletonText>
      </Stack>

      <Stack spacing="8px" marginBottom="40px !important">
        <StackSkeleton width="300px" height="28px" isLoading={isLoading}>
          <TitleText typography="small">
            {t('table.bigQueryID')}
          </TitleText>
        </StackSkeleton>

        <StackSkeleton
          height="20px"
          width={resource?.cloudTables ? "fit-content" : "500px"}
          isLoading={isLoading}
        >
          <Link
            id="acessar_o_bigquery_section"
            gap="8px"
            href={`https://console.cloud.google.com/bigquery?p=${resource?.cloudTables?.[0]?.gcpProjectId}&d=${resource?.cloudTables?.[0]?.gcpDatasetId}&t=${resource?.cloudTables?.[0]?.gcpTableId}&page=table`}
            target="_blank"
            rel="noopener noreferrer"
            cursor="pointer"
            fontWeight="400"
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
          </Link>
        </StackSkeleton>
      </Stack>


      <Stack spacing="8px" marginBottom="40px !important">
        <StackSkeleton width="260px" height="28px" isLoading={isLoading}>
          <TooltipText
            text={t("table.partitionsInBigQuery")}
            info={t("table.partitionsTooltip")}
          />
        </StackSkeleton>
        <StackSkeleton
          height="20px"
          width={resource?.partitions ? "100%" : "200px"}
          isLoading={isLoading}
        >
          <BodyText
            typography="small"
            color="#464A51"
          >
            {resource?.partitions ? resource.partitions : t('table.notProvided')}
          </BodyText>
        </StackSkeleton>
      </Stack>

      <Stack marginBottom="40px !important">
        <StackSkeleton width="300px" height="28px" isLoading={isLoading}>
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
            <BodyText
              typography="small"
              color="#464A51"
            >
              {t('table.notProvided')}
            </BodyText>
          }
        </Skeleton>       
      </Stack>

      <Stack spacing="8px" marginBottom="40px !important">
        <StackSkeleton width="240px" height="28px" isLoading={isLoading}>
          <TooltipText
            text={t("table.auxiliaryFiles")}
            info={t("table.auxiliaryFilesTooltip")}
          />
        </StackSkeleton>
        <StackSkeleton
          width={resource?.auxiliaryFilesUrl ? "100%" :"178px"}
          height="24px"
          isLoading={isLoading}
        >
          <BodyText
            typography="small"
            color="#464A51"
          >
            {resource?.auxiliaryFilesUrl ?
              <Link
                gap="8px"
                fontWeight="400"
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
              </Link>
            :
              t('table.notProvided')
            }
          </BodyText>  
        </StackSkeleton>
      </Stack>

      <Stack spacing="8px">
        <StackSkeleton width="240px" height="28px" isLoading={isLoading}>
          <TooltipText
            text={t("table.rawDataSources")}
            info={t("table.rawDataSourcesTooltip")}
          />
        </StackSkeleton>

        <StackSkeleton
          height="20px"
          width={resource?.rawDataSource?.[0]?.name ? "100%" :"132px"}
          isLoading={isLoading}
        >
          <BodyText
            typography="small"
            color="#464A51"
          >
            {resource?.rawDataSource?.[0]?._id ?
              Object.values(resource?.rawDataSource).map((elm, i) => {
                return (
                  <Link
                    key={i}
                    target="_blank"
                    rel="noopener noreferrer"
                    display="flex"
                    flexDirection="row"
                    gap="8px"
                    alignItems="center"
                    fontWeight="400"
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
          </BodyText>
        </StackSkeleton> 
      </Stack>

      <Divider marginY="40px !important" borderColor="#DEDFE0"/>

      <StackSkeleton width="240px" height="28px" marginBottom="20px !important" isLoading={isLoading}>
        <TitleText typography="small">
          {t('table.additionalInformation')}
        </TitleText>
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
        <LabelText typography="small">{t('table.publishedBy')}</LabelText>
        <PublishedOrDataCleanedBy
          resource={resource?.publishedByInfo || t('table.notProvided')}
          t={t}
          router={router}
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
        <LabelText typography="small">{t('table.dataCleanedBy')}</LabelText>
        <PublishedOrDataCleanedBy
          resource={resource?.dataCleanedByInfo || t('table.notProvided')}
          t={t}
          router={router}
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
        <LabelText typography="small">{t('table.version')}</LabelText>
        <BodyText
          typography="small"
          color="#464A51"
        >{resource?.version || t('table.notProvided')}</BodyText>
      </SkeletonText>

      <Box
        display="flex"
        padding="40px"
        boxSizing="border-box"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        background="#FFFFFF"
        border="1px solid #DEDFE0"
        borderRadius="16px"
      >
        <TitleText>
          {t('table.helpInFooterTitle')}
        </TitleText>
        <TitleText typography="small" color="#71757A" marginBottom="16px">
          {t('table.helpInFooterSubtitle')}
        </TitleText>

        <Link
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            padding="10px 20px"
          >
            {t('table.helpInFooterButton')}
          </Button>
        </Link>
      </Box>
    </Stack>
  )
}
