import {
  VStack,
  Stack,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  TabIndicator,
  Text,
  Box,
  useClipboard,
  Tooltip,
  Skeleton
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import sqlHighlight from "highlight.js/lib/languages/sql";
import pythonHighlight from "highlight.js/lib/languages/python";
import rHighlight from "highlight.js/lib/languages/r";
import 'highlight.js/styles/obsidian.css'

import GreenTab from "../atoms/GreenTab";
import Toggle from "../atoms/Toggle";
import ColumnsTable from "./ColumnsTable";
import { AlertDiscalimerBox} from "./DisclaimerBox";
import { triggerGAEvent } from "../../utils";

import {
  getBigTableQuery
} from "../../pages/api/tables"


import { CopyIcon } from "../../public/img/icons/copyIcon";
import DownloadIcon from "../../public/img/icons/downloadIcon";
import InfoIcon from "../../public/img/icons/infoIcon";
import ChevronIcon from "../../public/img/icons/chevronIcon";
import CheckIcon from "../../public/img/icons/checkIcon";

export function CodeHighlight({ language, children }) {
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
          cursor="pointer"
          height="20px"
          padding="0 12px"
          onClick={onCopy}
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="12px"
          lineHeight="18px"
          letterSpacing="0.1px"
          color="#878A8E"
          fill="#878A8E"
          _hover={{
            fill:"#71757A",
            color:"#71757A",
          }}
        >
          {hasCopied ? "Copiado" : "Copiar"}
          {hasCopied ? 
            <CheckIcon
              alt="copiado conteúdo"
              width="24px"
              height="24px"
              marginLeft="5px"
            />
          :
            <CopyIcon
              alt="copiar conteúdo"
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
          fill="#71757A"
          color="#71757A"
          _hover={{
            fill:"#878A8E",
            color:"#878A8E"
          }}
        >
          <ChevronIcon
            alt="expandir/recoler código"
            width="24px"
            height="24px"
            transform={isExpanded ? "rotate(-90deg)" : "rotate(90deg)"}
          />
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="12px"
            lineHeight="18px"
            letterSpacing="0.1px"
          >
            {isExpanded ? "Recolher" : "Expandir"}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default function DataInformationQuery({ resource }) {
  const [tabIndex, setTabIndex] = useState(0)
  const [downloadNotAllowed, setDownloadNotAllowed] = useState(false)
  const [checkedColumns, setCheckedColumns] = useState([])
  const [sqlCode, setSqlCode] = useState("")
  const [hasLoadingColumns, setHasLoadingColumns] = useState(true)
  const [isLoadingCode, setIsLoadingCode] = useState(false)
  const [hasLoadingResponse, setHasLoadingResponse] = useState(false)
  const [insufficientChecks, setInsufficientChecks] = useState(false)

  let gcpDatasetID
  let gcpTableId
  let downloadUrl

  useEffect(() => {
    if (resource?.numberRows === 0) return setDownloadNotAllowed(false)
    if (resource?.numberRows) return resource?.numberRows > 200000 ? setDownloadNotAllowed(false) : setDownloadNotAllowed(true)

    if (resource?.cloudTables?.[0]?.gcpDatasetId) gcpDatasetID = resource.cloudTables[0].gcpDatasetId
    if (resource?.cloudTables?.[0]?.gcpTableId) gcpTableId = resource.cloudTables[0].gcpTableId

    if (gcpDatasetID) {
      if (gcpTableId) {
        downloadUrl = `https://storage.googleapis.com/basedosdados-public/one-click-download/${gcpDatasetID}/${gcpTableId}/${gcpTableId}.csv.gz`
      }
    }
  }, [resource])


  useEffect(() => {
    if(resource._id === undefined) return
    setIsLoadingCode(true)
    setHasLoadingResponse(false)
    setSqlCode("")
    setInsufficientChecks(false)
  }, [resource._id, checkedColumns, tabIndex])

  useEffect(() => {
    if(hasLoadingResponse === true) {
      SqlCodeString()
      scrollFocus()
    }
  }, [hasLoadingResponse])

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
    const result = await getBigTableQuery(resource._id, checkedColumns)
    setSqlCode(result.trim())
    setIsLoadingCode(false)
  }

  const handlerDownload = () => {
    if (downloadNotAllowed === false) return null

    return window.open(downloadUrl)
  }

  const handleIndexes = (index) => {
    const categoryValues = ["SQL", "Python", "R", "Stata", "Download"]
    setTabIndex(index)
    triggerGAEvent("category_click", categoryValues[index])
  }

  return (
    <VStack
      alignItems="flex-start"
      width="100%"
      border="1px solid #DEDFE0"
      borderRadius="16px"
    >
      <Tabs
        width="100%"
        variant="unstyled"
        isLazy
        onChange={(index) => handleIndexes(index)}
        index={tabIndex}
        overflow="hidden"
      >
        <TabList
          pointerEvents={hasLoadingColumns ? "none" : "default"}
          padding="8px 24px 0"
          borderBottom="2px solid #DEDFE0 !important"
        >
          <GreenTab>SQL</GreenTab>
          <GreenTab>Python</GreenTab>
          <GreenTab>R</GreenTab>
          {/* <GreenTab>Stata</GreenTab> */}
          <GreenTab>Download</GreenTab>
        </TabList>

        <TabIndicator
          marginTop="-4px"
          height="3px"
          bg="#2B8C4D"
          borderRadius="100"
        />

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
              height="20px"
              width="fit-content"
              isLoaded={!hasLoadingColumns}
            >
              <Text
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="14px"
                color="#252A32"
              >
                Selecione as colunas que você deseja acessar:
              </Text>
            </Skeleton>

            <ColumnsTable
              tableId={resource._id}
              checkedColumns={checkedColumns}
              onChangeCheckedColumns={setCheckedColumns}
              hasLoading={hasLoadingColumns}
              setHasLoading={setHasLoadingColumns}
              template={tabIndex === 3 ? "download" : "checks"}
            />

            <Skeleton
              display={tabIndex === 3 ? "none" : "flex"}
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
                <label
                  style={{
                    display:"flex",
                    flexDirection:"row",
                    alignItems:"center",
                    gap:"16px",
                    fontFamily:"Roboto",
                    fontWeight:"400",
                    fontSize:"14px",
                    lineHeight:"20px",
                    color:"#252A32"
                  }}>
                  <Toggle /><Text>Traduzir códigos institucionais</Text>
                </label>
                <Tooltip
                  label="Por exemplo, traduzir o código “2927408” por “Salvador-BA”"
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
                display={tabIndex === 3 ? "none" : ""}
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
                  Essa tabela possui mais de <Text as="span" fontWeight="700">5 GB</Text>. Cuidado para não ultrapassar o <Text as="a" href="" target="_blank" color="#0068C5" _hover={{color: "#4F9ADC"}}>limite de processamento gratuito</Text> do BigQuery. <Text as="br" display={{base: "none", lg: "flex"}}/>
                  Para otimizar a consulta, você pode selecionar menos colunas ou adicionar filtros no BigQuery.
                </AlertDiscalimerBox>
              </Skeleton>
            }

            {insufficientChecks &&
              <Skeleton
                display={tabIndex === 3 ? "none" : ""}
                startColor="#F0F0F0"
                endColor="#F3F3F3"
                borderRadius="6px"
                height="100%"
                width="100%"
                isLoaded={!hasLoadingColumns}
              >
                <AlertDiscalimerBox
                  type="error"
                  text={`Por favor, selecione acima as colunas que você deseja acessar.`}
                />
              </Skeleton>
            }

            <Skeleton
              display={tabIndex !== 3 ? "flex" : "none"}
              startColor="#F0F0F0"
              endColor="#F3F3F3"
              borderRadius="6px"
              height="40px"
              width="fit-content"
              isLoaded={!hasLoadingColumns}
            >
              <Box
                as="button"
                onClick={() => {
                  if(checkedColumns.length === 0) return setInsufficientChecks(true)
                  setHasLoadingResponse(true)
                }}
                target="_blank"
                display="flex"
                alignItems="center"
                height="40px"
                width="fit-content"
                borderRadius="8px"
                backgroundColor="#2B8C4D"
                padding="8px 16px"
                cursor="pointer"
                color="#FFF"
                fill="#FFF"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="14px"
                gap="8px"
                lineHeight="20px"
                _hover={{
                  backgroundColor:"#80BA94"
                }}
              >
                Gerar consulta
              </Box>
            </Skeleton>
          </Box>

          <TabPanels>
            <TabPanel
              id="SQL_section"
              display={hasLoadingResponse ? "flex" : "none"}
              flexDirection="column"
              gap="16px"
              marginTop="40px"
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
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#252A32"
                >
                  No editor de consultas do BigQuery, digite a seguinte instrução:
                </Text>
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
                  Primeira vez usando o BigQuery?
                  <Text
                    marginLeft="4px"
                    as="a"
                    target="_blank"
                    href="https://basedosdados.github.io/mais/access_data_bq/#primeiros-passos"
                    color="#0068C5"
                    _hover={{color: "#4F9ADC"}}
                  >
                    Siga o passo a passo.
                  </Text>
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
                    href="https://console.cloud.google.com/"
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
                      color:"#80BA94"
                    }}
                  >
                    <Text
                      fontFamily="Roboto"
                      fontWeight="500"
                      fontSize="14px"
                      lineHeight="20px"
                    >
                      Acessar o BigQuery
                    </Text>
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
              marginTop="40px"
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
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#252A32"
                >
                  No terminal do Python, digite a seguinte instrução:
                </Text>
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
                  Primeira vez usando o pacote Python?
                  <Text
                    marginLeft="4px"
                    as="a"
                    target="_blank"
                    href="https://basedosdados.github.io/mais/api_reference_python/"
                    color="#0068C5"
                    _hover={{color: "#4F9ADC"}}
                  >
                    Siga o passo a passo.
                  </Text>
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
              marginTop="40px"
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
                <Text
                  fontFamily="Roboto"
                  fontWeight="400"
                  fontSize="14px"
                  lineHeight="20px"
                  color="#252A32"
                >
                  No terminal do R, digite a seguinte instrução:
                </Text>
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
                  Primeira vez usando o pacote R?
                  <Text
                    marginLeft="4px"
                    as="a"
                    target="_blank"
                    href="https://basedosdados.github.io/mais/api_reference_r/"
                    color="#0068C5"
                    _hover={{color: "#4F9ADC"}}
                  >
                    Siga o passo a passo.
                  </Text>
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

            {/* <TabPanel padding="0">
                Criamos um pacote em Stata para você acessar o <i>datalake</i>. Basta rodar o código:
                Criamos um pacote em Stata para você acessar o <i>datalake</i>. Basta rodar o código:
              </SectionText>
              Criamos um pacote em Stata para você acessar o <i>datalake</i>. Basta rodar o código:
              </SectionText>

              <PrismCodeHighlight language="stata">
                {`net install basedosdados, from("https://raw.githubusercontent.com/basedosdados/mais/master/stata-package")

  bd_read_table, ///
      path("<PATH>") ///
      dataset_id("${gcpDatasetID}") ///
      table_id("${gcpTableId}") ///
      billing_project_id("<PROJECT_ID>")`}
              </PrismCodeHighlight>
            </TabPanel> */}

            <TabPanel
              id="download_section"
              display={!hasLoadingColumns ? "flex" : "none"}
              flexDirection="column"
              gap="16px"
              marginTop="16px"
              padding={0}
            >
              {downloadNotAllowed ?
                <AlertDiscalimerBox type="info">
                  <Text>Estes dados estão disponíveis porque diversas pessoas colaboram para a sua manutenção.</Text>
                  <Text>
                    Antes de baixar os dados, apoie você também com uma doação financeira ou
                    <Text
                      marginLeft="4px"
                      as="a"
                      target="_blank"
                      href="https://basedosdados.github.io/mais/colab_data/"
                      color="#0068C5"
                      _hover={{color: "#4F9ADC"}}
                    >
                      saiba como contribuir com seu tempo.
                    </Text>
                  </Text>
                </AlertDiscalimerBox>
              :
                <AlertDiscalimerBox
                  type="error"
                  text={`O tamanho da tabela ultrapassou o limite permitido para download, de 200.000 lihas. Você pode acessar os dados em SQL, Python e R.`}
                />
              }

              <Box
                as="button"
                onClick={() => handlerDownload()}
                display="flex"
                alignItems="center"
                height="40px"
                width="fit-content"
                borderRadius="8px"
                backgroundColor={downloadNotAllowed ? "#2B8C4D" : "#ACAEB1"}
                padding="8px 16px"
                cursor={downloadNotAllowed ? "pointer" : "default"}
                color="#FFF"
                fill="#FFF"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="14px"
                gap="8px"
                lineHeight="20px"
                _hover={{
                  backgroundColor: downloadNotAllowed ? "#80BA94" : "#ACAEB1"
                }}
              >
                <DownloadIcon
                  width="24px"
                  height="24px"
                />
                  Download da tabela
              </Box>
            </TabPanel>
          </TabPanels>
        </VStack>
      </Tabs>
    </VStack>
  )
}
