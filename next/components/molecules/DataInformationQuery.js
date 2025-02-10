import {
  VStack,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Box,
  useClipboard,
  Tooltip,
  Skeleton,
  Stack,
  useDisclosure,
  ModalCloseButton,
  Spinner
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import sqlHighlight from "highlight.js/lib/languages/sql";
import pythonHighlight from "highlight.js/lib/languages/python";
import rHighlight from "highlight.js/lib/languages/r";
import cookies from "js-cookie";
import 'highlight.js/styles/obsidian.css'
import { useTranslation } from 'next-i18next';
import { useRouter } from "next/router";

import TitleText from "../atoms/Text/TitleText";
import LabelText from "../atoms/Text/LabelText";
import BodyText from "../atoms/Text/BodyText";
import Button from "../atoms/Button";
import GreenTab from "../atoms/GreenTab";
import Toggle from "../atoms/Toggle";
import TableColumns from "./TableColumns";
import { SectionPrice } from "../../pages/prices";
import { ModalGeneral } from "./uiUserPage";
import { AlertDiscalimerBox} from "./DisclaimerBox";
import { triggerGAEvent, formatBytes } from "../../utils";

import {
  getBigTableQuery
} from "../../pages/api/tables"


import { CopySolidIcon } from "../../public/img/icons/copyIcon";
import DownloadIcon from "../../public/img/icons/downloadIcon";
import InfoIcon from "../../public/img/icons/infoIcon";
import ChevronIcon from "../../public/img/icons/chevronIcon";
import CheckIcon from "../../public/img/icons/checkIcon";
import Link from "../atoms/Link";

export function CodeHighlight({ language, children }) {
  const { t } = useTranslation('dataset');
  const textRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const [highlightedCode, setHighlightedCode] = useState("")
  const { hasCopied, onCopy } = useClipboard(children)

  useEffect(() => {
    if(language === "sql") hljs.registerLanguage("sql", sqlHighlight)
    if(language === "python") hljs.registerLanguage("python", pythonHighlight)
    if(language === "r") hljs.registerLanguage("r", rHighlight)

    const highlighted = hljs.highlight(children, { language:language }).value
    setHighlightedCode(highlighted)
  }, [children, language])

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(false)
      setIsExpanded(true)
      const { clientHeight } = textRef.current
      setIsOverflowing(clientHeight > 190)
      if(clientHeight > 190) setIsExpanded(false)
    }
  }, [highlightedCode])

  return (
    <Box
      display="flex"
      gap="20px"
      flexDirection="column"
      width="100%"
      borderRadius="8px"
      backgroundColor="#252A32"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        overflow="hidden"
        padding="22px 16px"
        height={isExpanded ? "auto" : "190px"}
      >
        <Text
          as="code"
          padding="0 !important"
          ref={textRef}
          whiteSpace="break-spaces"
          className={`hljs ${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />

        <Box
          id={`copy-${language}`}
          display="flex"
          flexDirection="row"
          alignItems="center"
          cursor="pointer"
          height="20px"
          onClick={onCopy}
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="12px"
          lineHeight="18px"
          color="#878A8E"
          fill="#878A8E"
          _hover={{
            fill:"#9D9FA3",
            color:"#9D9FA3",
          }}
        >
          {hasCopied ? t('table.copied') : t('table.copy')}
          {hasCopied ? 
            <CheckIcon
              alt="copied"
              width="24px"
              height="24px"
              marginLeft="5px"
            />
          :
            <CopySolidIcon
              alt="copy"
              width="24px"
              height="24px"
              marginLeft="5px"
            />
          }
        </Box>
      </Box>

      {isOverflowing && (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          cursor="pointer"
          gap="8px"
          width="100%"
          padding="12px 16px"
          borderTop="1px solid #464A51"
          onClick={() => setIsExpanded(!isExpanded)}
          fill="#878A8E"
          color="#878A8E"
          _hover={{
            fill:"#9D9FA3",
            color:"#9D9FA3"
          }}
        >
          <ChevronIcon
            alt="expand/collapse"
            width="24px"
            height="24px"
            transform={isExpanded ? "rotate(-90deg)" : "rotate(90deg)"}
          />
          <LabelText
            typography="x-small"
          >
            {isExpanded ? t('table.collapse') : t('table.expand')}
          </LabelText>
        </Box>
      )}
    </Box>
  )
}

export default function DataInformationQuery({ resource }) {
  const { t } = useTranslation('dataset');
  const { locale } = useRouter();
  const [tabAccessIndex, setTabAccessIndex] = useState(0)
  const [tabIndex, setTabIndex] = useState(0)
  const [downloadPermitted, setDownloadPermitted] = useState(false)
  const [downloadWarning, setDownloadWarning] = useState("")
  const [checkedColumns, setCheckedColumns] = useState([])
  const [numberColumns, setNumberColumns] = useState(0)
  const [sqlCode, setSqlCode] = useState("")
  const [insufficientChecks, setInsufficientChecks] = useState(false)
  const [includeTranslation, setIncludeTranslation] = useState(true)
  const [hasLoadingColumns, setHasLoadingColumns] = useState(true)
  const [isLoadingCode, setIsLoadingCode] = useState(false)
  const [isLoadingSpin, setIsLoadingSpin] = useState(false)
  const [hasLoadingResponse, setHasLoadingResponse] = useState(false)
  const plansModal = useDisclosure()

  const [gcpProjectID, setGcpProjectID] = useState("")
  const [gcpDatasetID, setGcpDatasetID] = useState("")
  const [gcpTableId, setGcpTableId] = useState("")

  const isUserPro = () => {
    let user
    if(cookies.get("userBD")) user = JSON.parse(cookies.get("userBD"))

    if(user?.isSubscriber) return user?.isSubscriber
    return false
  }

  useEffect(() => {
    if(resource?.dataset?._id === "e083c9a2-1cee-4342-bedc-535cbad6f3cd") setIncludeTranslation(false)
  }, [resource.dataset])

  useEffect(() => {
    if (resource?.uncompressedFileSize) {
      const limit100MB = 100 * 1024 * 1024;
      const limit1GB = 1 * 1024 * 1024 * 1024;

      if (resource?.uncompressedFileSize < limit100MB) {
        setDownloadPermitted(true)
        setDownloadWarning("free")
      } else if (resource?.uncompressedFileSize < limit1GB) {
        setDownloadPermitted(isUserPro())
        setDownloadWarning("100mbBetween1gb")
      } else {
        setDownloadWarning("biggest1gb")
      }
    }

    if (resource?.cloudTables?.[0]) {
      setGcpProjectID(resource.cloudTables[0]?.gcpProjectId || "")
      setGcpDatasetID(resource.cloudTables[0]?.gcpDatasetId || "")
      setGcpTableId(resource.cloudTables[0]?.gcpTableId || "")
    }
  }, [resource.uncompressedFileSize, resource.cloudTables])

  useEffect(() => {
    if(resource._id === undefined) return
    setIsLoadingCode(true)
    setHasLoadingResponse(false)
    setSqlCode("")
    setInsufficientChecks(false)
  }, [resource._id, checkedColumns, includeTranslation])

  useEffect(() => {
    if(hasLoadingResponse === true) {
      setIsLoadingSpin(true)
      SqlCodeString()
    }
  }, [hasLoadingResponse])

  useEffect(() => {
    if(sqlCode !== "") scrollFocus() 
  }, [sqlCode])

  function scrollFocus() {
    let idTab

    if (tabIndex === 0) idTab = "SQL_section"
    else if (tabIndex === 1) idTab = "python_section"
    else if (tabIndex === 2) idTab = "r_section"
    else return
  
    const targetElement = document.getElementById(idTab)
  
    if (targetElement) {
      const { top } = targetElement.getBoundingClientRect()
      const heightScreen = window.innerHeight
      const positionTarget = top + window.pageYOffset
  
      window.scrollTo({
        top: positionTarget - (heightScreen / 2),
        behavior: "smooth",
      })
    }
  }

  async function SqlCodeString() {
    const result = await getBigTableQuery(resource._id, checkedColumns, includeTranslation)
    if(result === null) return 
    setSqlCode(result.trim())
    setIsLoadingCode(false)
    setIsLoadingSpin(false)
  }

  const handleAccessIndexes = (index) => {
    const categoryValues = [t('table.bigQueryAndPackages'), t('table.download')];
    setTabAccessIndex(index)
    triggerGAEvent("category_click", categoryValues[index])
  }

  const handleCategoryIndexes = (index) => {
    const categoryValues = ["SQL", "Python", "R"]
    setTabIndex(index)
    triggerGAEvent("category_click", categoryValues[index])
  }

  const queryLanguage = () => {
    const language = {
      0 : "SQL",
      1 : "Python",
      2 : "R"
    }
    return language[tabIndex] ? language[tabIndex] : ""
  }

  return (
    <VStack
      alignItems="flex-start"
      width="100%"
      border="1px solid #DEDFE0"
      borderRadius="16px"
    >
      <ModalGeneral
        isOpen={plansModal.isOpen}
        onClose={plansModal.onClose}
        propsModalContent={{
          minWidth: "fit-content"
        }}
      >
        <Stack spacing={0} marginBottom="16px">
          <TitleText
            width="100%"
            fontWeight="400"
            textAlign="center"
          >
            {t('table.compareThePlans')}
          </TitleText>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", color:"#0B89E2"}}
          />
        </Stack>

        <SectionPrice/>
      </ModalGeneral>

      <Tabs
        width="100%"
        variant="unstyled"
        isLazy
        onChange={(index) => handleAccessIndexes(index)}
        index={tabAccessIndex}
        overflow="hidden"
      >
        <TabList
          pointerEvents={hasLoadingColumns ? "none" : "default"}
          padding="8px 24px 0"
          borderBottom="1px solid #DEDFE0 !important"
        >
          <GreenTab>{t('table.bigQueryAndPackages')}</GreenTab>
          <GreenTab>{t('table.download')}</GreenTab>
        </TabList>

        <VStack
          spacing={0}
          padding="24px"
          overflow="hidden"
        >
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            gap="16px"
          >
            <Skeleton
              startColor="#F0F0F0"
              endColor="#F3F3F3"
              borderRadius="6px"
              lineHeight="20px"
              width="fit-content"
              isLoaded={!hasLoadingColumns}
            >
              <BodyText typography="small">
                {tabAccessIndex === 0 ? t('table.selectColumns') : t('table.checkColumns')}
              </BodyText>
            </Skeleton>

            <TableColumns
              tableId={resource._id}
              checkedColumns={checkedColumns}
              onChangeCheckedColumns={setCheckedColumns}
              numberColumns={setNumberColumns}
              hasLoading={hasLoadingColumns}
              setHasLoading={setHasLoadingColumns}
              template={tabAccessIndex === 1 ? "download" : "checks"}
            />

            <Skeleton
              display={resource?.dataset?._id === "e083c9a2-1cee-4342-bedc-535cbad6f3cd" && tabAccessIndex !== 1 ? "flex" : "none"}
              startColor="#F0F0F0"
              endColor="#F3F3F3"
              borderRadius="6px"
              height="100%"
              width="100%"
              isLoaded={!hasLoadingColumns}
            >
              <AlertDiscalimerBox
                type="info"
              >
                {t('table.infoTranslationNotAvailable', { returnObjects: true })[0]}
                <Link href="https://basedosdados.org/dataset/e083c9a2-1cee-4342-bedc-535cbad6f3cd?table=0308fbe0-270c-4135-9115-ea1100f400f6" target="_blank" color="#0068C5" _hover={{color: "#0057A4"}}>{t('table.infoTranslationNotAvailable', { returnObjects: true })[1]}</Link>
                {t('table.infoTranslationNotAvailable', { returnObjects: true })[2]}
                <Link href="https://basedosdados.org/dataset/33b49786-fb5f-496f-bb7c-9811c985af8e?table=dffb65ac-9df9-4151-94bf-88c45bfcb056" target="_blank" color="#0068C5" _hover={{color: "#0057A4"}}>{t('table.infoTranslationNotAvailable', { returnObjects: true })[3]}</Link>
                {t('table.infoTranslationNotAvailable', { returnObjects: true })[4]}
              </AlertDiscalimerBox>
            </Skeleton>

            <Skeleton
              display={tabAccessIndex === 1 ? "none" : "flex"}
              startColor="#F0F0F0"
              endColor="#F3F3F3"
              borderRadius="6px"
              height="34px"
              width="fit-content"
              isLoaded={!hasLoadingColumns}
            >
              <Box
                display="flex"
                flexDirection="row"
                gap="8px"
                alignItems="center"
              >
                <BodyText
                  typography="small"
                  as="label"
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap="16px"
                  pointerEvents={resource?.dataset?._id === "e083c9a2-1cee-4342-bedc-535cbad6f3cd" ? "none" : ""}
                >
                  <Toggle
                    defaultChecked={resource?.dataset?._id === "e083c9a2-1cee-4342-bedc-535cbad6f3cd" ? false : true}
                    value={includeTranslation}
                    onChange={() => setIncludeTranslation(!includeTranslation)}
                  /><Text as="span">{t('table.translateInstitutionalCodes')}</Text>
                </BodyText>
                <Tooltip
                  label={t('table.translateTooltip')}
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
                  maxWidth="230px"
                >
                  <InfoIcon
                    alt="tip"
                    cursor="pointer"
                    fill="#878A8E"
                    width="16px"
                    height="16px"
                  />
                </Tooltip>
              </Box>
            </Skeleton>

            {checkedColumns.length > 0 && resource.uncompressedFileSize && resource.uncompressedFileSize/(1024 * 1024 * 1024) > 5 &&
              <Skeleton
                display={tabAccessIndex === 1 ? "none" : ""}
                startColor="#F0F0F0"
                endColor="#F3F3F3"
                borderRadius="6px"
                height="100%"
                width="100%"
                isLoaded={!hasLoadingColumns}
              >
                <AlertDiscalimerBox
                  type="warning"
                >
                  {t('table.warningLargeTable', { returnObjects: true })[0]}
                  <Text as="span" fontWeight="700">{formatBytes(resource.uncompressedFileSize)}</Text>
                  {t('table.warningLargeTable', { returnObjects: true })[1]}
                  <Text as="a" marginRight="4px" href="https://basedosdados.github.io/sdk/access_data_bq/#entenda-o-uso-gratuito-do-big-query-bq" target="_blank" color="#0068C5" _hover={{color: "#0057A4"}}>{t('table.warningLargeTable', { returnObjects: true })[2]}</Text>
                  {t('table.warningLargeTable', { returnObjects: true })[3]}
                  <Text as="br" display={{base: "none", lg: "flex"}}/>
                  {numberColumns === checkedColumns.length && t('table.warningLargeTableOptimize')}
                </AlertDiscalimerBox>
              </Skeleton>
            }

            {insufficientChecks &&
              <Skeleton
                display={tabAccessIndex === 1 ? "none" : ""}
                startColor="#F0F0F0"
                endColor="#F3F3F3"
                borderRadius="6px"
                height="100%"
                width="100%"
                isLoaded={!hasLoadingColumns}
              >
                <AlertDiscalimerBox
                  type="error"
                  text={t('table.errorInsufficientChecks')}
                />
              </Skeleton>
            }

            <Skeleton
              display={tabAccessIndex !== 1 ? "flex" : "none"}
              startColor="#F0F0F0"
              endColor="#F3F3F3"
              borderRadius="6px"
              height="40px"
              width="fit-content"
              isLoaded={!hasLoadingColumns}
            >
              <Button
                onClick={() => {
                  if(checkedColumns.length === 0) return setInsufficientChecks(true)
                  triggerGAEvent("gerar_consulta_click", queryLanguage())
                  setHasLoadingResponse(true)
                }}
              >
                {t('table.generateQuery')} <Spinner display={ isLoadingSpin ? "flex" : "none"} width="16px" height="16px"/>
              </Button>
            </Skeleton>
          </Box>

          <VStack
            alignItems="flex-start"
            width="100%"
            display={tabAccessIndex === 1 ? "flex" : "none" }
          >
            <Stack
              id="download_table"
              display={!hasLoadingColumns ? "flex" : "none"}
              flexDirection="column"
              width="100%"
              gap="16px"
              marginTop="16px"
              padding={0}
            >
              {isUserPro() === false && downloadWarning === "free" &&
                <AlertDiscalimerBox type="info">
                  {t('table.infoDataAvailability', { returnObjects: true })[0]}
                  <Link
                    display="inline"
                    target="_blank"
                    href={
                      locale === "en" ? "https://basedosdados.github.io/sdk/en/colab_data/" :
                      locale === "es" ? "https://basedosdados.github.io/sdk/es/colab_data/" :
                      "https://basedosdados.github.io/sdk/colab_data/"
                    }
                    fontWeight="400"
                    color="#0068C5"
                    _hover={{color: "#0057A4"}}
                  >
                    {t('table.infoDataAvailability', { returnObjects: true })[1]}
                  </Link>.
                </AlertDiscalimerBox>
              }
              {isUserPro() === false && downloadWarning === "100mbBetween1gb" &&
                <AlertDiscalimerBox
                  type="warning"
                >
                  {t('table.warningPaidPlanRequired', { returnObjects: true })[0]}
                  <Link
                    display="inline"
                    target="_blank"
                    href="/prices"
                    fontWeight="400"
                    color="#0068C5"
                    _hover={{color: "#0057A4"}}
                  >
                    {t('table.warningPaidPlanRequired', { returnObjects: true })[1]}
                  </Link>
                  {t('table.warningPaidPlanRequired', { returnObjects: true })[2]}
                </AlertDiscalimerBox>
              }
              {downloadWarning === "biggest1gb" &&
                <AlertDiscalimerBox
                  type="error"
                  text={t('table.errorTableTooLarge')}
                />
              }

              <Button
                onClick={() => {
                  if(downloadWarning !== "free" && isUserPro() === false) return plansModal.onOpen()
                  window.open(`/api/tables/downloadTable?p=${btoa(gcpDatasetID)}&q=${btoa(gcpTableId)}&d=${btoa(downloadPermitted)}&s=${btoa(downloadWarning)}`, "_blank")
                  triggerGAEvent("download_da_tabela",`{
                    gcp: ${gcpProjectID+"."+gcpDatasetID+"."+gcpTableId},
                    tamanho: ${formatBytes(resource.uncompressedFileSize) || ""},
                    dataset: ${resource?.dataset?._id},
                    table: ${resource?._id},
                  }`)
                }}
                backgroundColor={downloadWarning !== "biggest1gb" ? "#2B8C4D" : "#ACAEB1"}
                cursor={downloadWarning !== "biggest1gb" ? "pointer" : "default"}
                pointerEvents={downloadWarning !== "biggest1gb" ? "default" : "none"}
              >
                <DownloadIcon
                  width="16px"
                  height="16px"
                />
                  {t('table.downloadTable')} {downloadWarning !== "biggest1gb" && `(${formatBytes(resource.uncompressedFileSize)})`}
              </Button>
            </Stack>
          </VStack>

          <VStack
            display={tabAccessIndex === 0 && sqlCode !== "" ? "flex" : "none" }
            alignItems="flex-start"
            width="100%"
            border="1px solid #DEDFE0"
            borderRadius="16px"
            marginTop="24px !important"
          >
            <Tabs
              width="100%"
              variant="unstyled"
              isLazy
              onChange={(index) => handleCategoryIndexes(index)}
              index={tabIndex}
              overflow="hidden"
            >
              <TabList
                pointerEvents={hasLoadingColumns ? "none" : "default"}
                padding="8px 24px 0"
                borderBottom="1px solid #DEDFE0 !important"
              >
                <GreenTab>SQL</GreenTab>
                <GreenTab>Python</GreenTab>
                <GreenTab>R</GreenTab>
              </TabList>

              <VStack
                spacing={0}
                padding="24px"
                overflow="hidden"
              >
                <TabPanels>
                  <TabPanel
                    id="SQL_section"
                    display={hasLoadingResponse ? "flex" : "none"}
                    flexDirection="column"
                    gap="16px"
                    padding={0}
                  >
                    <Skeleton
                      startColor="#F0F0F0"
                      endColor="#F3F3F3"
                      borderRadius="6px"
                      height="20px"
                      width="fit-content"
                      isLoaded={!isLoadingCode}
                    >
                      <BodyText typography="small">
                        {t('table.bigQueryInstructions')}
                      </BodyText>
                    </Skeleton>

                    <Skeleton
                      startColor="#F0F0F0"
                      endColor="#F3F3F3"
                      borderRadius="6px"
                      height="100%"
                      width="100%"
                      isLoaded={!isLoadingCode}
                    >
                      <AlertDiscalimerBox type="info">
                        {t('table.firstTimeBigQuery')}
                        <Link
                          display="inline"
                          marginLeft="4px"
                          target="_blank"
                          href={
                            locale === "en" ? "https://basedosdados.github.io/sdk/en/access_data_bq/#getting-started" :
                            locale === "es" ? "https://basedosdados.github.io/sdk/es/access_data_bq/#pinitos" :
                            "https://basedosdados.github.io/sdk/access_data_bq/#primeiros-passos"
                          }
                          fontWeight="400"
                          color="#0068C5"
                          _hover={{color: "#0057A4"}}
                        >
                          {t('table.followStepByStep')}
                        </Link>
                      </AlertDiscalimerBox>
                    </Skeleton>

                    <Skeleton
                      startColor="#F0F0F0"
                      endColor="#F3F3F3"
                      borderRadius="6px"
                      height="100%"
                      width="100%"
                      isLoaded={!isLoadingCode}
                    >
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        padding="2px"
                        backgroundColor="#2B8C4D"
                        borderRadius="10px"
                      >
                        <Box
                          as="a"
                          id="acessar_o_bigquery_button"
                          href={`https://console.cloud.google.com/bigquery?p=${gcpProjectID}&d=${gcpDatasetID}&t=${gcpTableId}&page=table`}
                          target="_blank"
                          display="flex"
                          alignItems="center"
                          height="40px"
                          borderRadius="8px"
                          backgroundColor="#FFF"
                          padding="8px 16px"
                          cursor="pointer"
                          color="#2B8C4D"
                          _hover={{
                            color:"#22703E"
                          }}
                        >
                          <BodyText typography="small">
                            {t('table.accessBigQuery')}
                          </BodyText>
                        </Box>
                      </Box>
                    </Skeleton>

                    <Skeleton
                      id="SQL_section"
                      startColor="#F0F0F0"
                      endColor="#F3F3F3"
                      borderRadius="10px"
                      height="100%"
                      width="100%"
                      isLoaded={!isLoadingCode}
                    >
                      <CodeHighlight language="sql">
                        {sqlCode}
                      </CodeHighlight>
                    </Skeleton>
                  </TabPanel>

                  <TabPanel
                    id="python_section"
                    display={hasLoadingResponse ? "flex" : "none"}
                    flexDirection="column"
                    gap="16px"
                    padding={0}
                  >
                    <Skeleton
                      startColor="#F0F0F0"
                      endColor="#F3F3F3"
                      borderRadius="6px"
                      height="20px"
                      width="fit-content"
                      isLoaded={!isLoadingCode}
                    >
                      <BodyText typography="small">
                        {t('table.pythonInstructions')}
                      </BodyText>
                    </Skeleton>

                    <Skeleton
                      startColor="#F0F0F0"
                      endColor="#F3F3F3"
                      borderRadius="6px"
                      height="100%"
                      width="100%"
                      isLoaded={!isLoadingCode}
                    >
                      <AlertDiscalimerBox type="info" >
                        {t('table.firstTimePython')}
                        <Link
                          display="inline"
                          marginLeft="4px"
                          target="_blank"
                          href={
                            locale === "en" ? "https://basedosdados.github.io/sdk/en/api_reference_python/" :
                            locale === "es" ? "https://basedosdados.github.io/sdk/es/api_reference_python/" :
                            "https://basedosdados.github.io/sdk/api_reference_python/"
                          }
                          fontWeight="400"
                          color="#0068C5"
                          _hover={{color: "#0057A4"}}
                        >
                          {t('table.followStepByStep')}
                        </Link>
                      </AlertDiscalimerBox>
                    </Skeleton>

                    <Skeleton
                      id="python_section"
                      startColor="#F0F0F0"
                      endColor="#F3F3F3"
                      borderRadius="10px"
                      height="100%"
                      width="100%"
                      isLoaded={!isLoadingCode}
                    >
                      <CodeHighlight language="python">{`import basedosdados as bd

billing_id = <seu_billing_id>

query = """
  ${sqlCode}
"""

bd.read_sql(query = query, billing_project_id = billing_id)`}
                      </CodeHighlight>
                    </Skeleton>
                  </TabPanel>

                  <TabPanel
                    id="r_section"
                    display={hasLoadingResponse ? "flex" : "none"}
                    flexDirection="column"
                    gap="16px"
                    padding={0}
                  >
                    <Skeleton
                      startColor="#F0F0F0"
                      endColor="#F3F3F3"
                      borderRadius="6px"
                      height="20px"
                      width="fit-content"
                      isLoaded={!isLoadingCode}
                    >
                      <BodyText typography="small">
                        {t('table.rInstructions')}
                      </BodyText>
                    </Skeleton> 

                    <Skeleton
                      startColor="#F0F0F0"
                      endColor="#F3F3F3"
                      borderRadius="6px"
                      height="100%"
                      width="100%"
                      isLoaded={!isLoadingCode}
                    >
                      <AlertDiscalimerBox type="info" >
                        {t('table.firstTimeR')}
                        <Link
                          display="inline"
                          marginLeft="4px"
                          target="_blank"
                          href={
                            locale === "en" ? "https://basedosdados.github.io/sdk/en/api_reference_r/" :
                            locale === "es" ? "https://basedosdados.github.io/sdk/es/api_reference_r/" :
                            "https://basedosdados.github.io/sdk/api_reference_r/"
                          }
                          fontWeight="400"
                          color="#0068C5"
                          _hover={{color: "#0057A4"}}
                        >
                          {t('table.followStepByStep')}
                        </Link>
                      </AlertDiscalimerBox>
                    </Skeleton>

                    <Skeleton
                      id="r_section"
                      startColor="#F0F0F0"
                      endColor="#F3F3F3"
                      borderRadius="10px"
                      height="100%"
                      width="100%"
                      isLoaded={!isLoadingCode}
                    >
                      <CodeHighlight language="r">{`
# Defina o seu projeto no Google Cloud
set_billing_id("<YOUR_PROJECT_ID>")

# Para carregar o dado direto no R
query <- "
${sqlCode}
"

read_sql(query, billing_project_id = get_billing_id())
`}
                      </CodeHighlight>
                    </Skeleton>
                  </TabPanel>
                </TabPanels>
              </VStack>
            </Tabs>
          </VStack>
        </VStack>
      </Tabs>
    </VStack>
  )
}
