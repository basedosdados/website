import {
  VStack,
  Stack,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  TabIndicator,
  Text,
  Image,
  Box,
  useClipboard,
  Button,
  HStack,
  Tooltip
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import sqlHighlight from "highlight.js/lib/languages/sql";
import pythonHighlight from "highlight.js/lib/languages/python";
import rHighlight from "highlight.js/lib/languages/r";
import 'highlight.js/styles/monokai-sublime.css'

import Link from "../atoms/Link";
import GreenTab from "../atoms/GreenTab";
import SectionText from "../atoms/SectionText";
import Toggle from "../atoms/Toggle";
import RoundedButton from "../atoms/RoundedButton";
import ColumnsDatasets from "./ColumnsDatasets";

import {
  getBigTableQuery
} from "../../pages/api/tables"

import { DisclaimerBox, AlertDiscalimerBox} from "./DisclaimerBox";

import { triggerGAEvent } from "../../utils";
import { CopyIcon } from "../../public/img/icons/copyIcon";
import DownloadIcon from "../../public/img/icons/downloadIcon";
import ExclamationIcon from "../../public/img/icons/exclamationIcon";
import InfoIcon from "../../public/img/icons/infoIcon";


export function CodeHighlight({ language, children }) {
  const textRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const [highlightedCode, setHighlightedCode] = useState("")
  const { hasCopied, onCopy } = useClipboard(children)

  useEffect(() => {
    if(language === "sql") hljs.registerLanguage("sql", sqlHighlight)
    if(language === "python") hljs.registerLanguage("python", sqlHighlight)
    if(language === "r") hljs.registerLanguage("r", sqlHighlight)

    const highlighted = hljs.highlight(children, { language:language }).value
    setHighlightedCode(highlighted)
  }, [children, language])

  useEffect(() => {
    if (textRef.current) {
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
      backgroundColor="#23241F"
      padding="22px 16px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        overflow="hidden"
        height={isExpanded ? "auto" : "190px"}
      >
        <Text
          as="code"
          ref={textRef}
          whiteSpace="break-spaces"
          className={`hljs ${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />

        <Button
          height="20px"
          minWidth="100px"
          padding="0 0 0 10px"
          onClick={onCopy}
          color="#707783"
          fontFamily="Roboto"
          fontWeight="500"
          backgroundColor="transparent"
          _hover={{ backgroundColor: "transparent", opacity: "0.6" }}
        >
          {hasCopied ? "Copiado" : "Copiar"}
          <CopyIcon alt="copiar conteúdo" width="20px" height="20px" fill="#707783" marginLeft="5px" />
        </Button>
      </Box>

      {isOverflowing && (
        <Box
          width="100%"
          height="40px"
          padding="12px 16px"
          color="#FFF"
        >
          <Text
            cursor="pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Reduzir" : "Expandir"}
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
  const [isLoading, setIsLoading] = useState(true)

  let gcpDatasetID
  let gcpTableId
  let downloadUrl
  let queryBQ

  useEffect(() => {
    if (resource?.numberRows === 0) return setDownloadNotAllowed(false)
    if (resource?.numberRows) return resource?.numberRows > 200000 ? setDownloadNotAllowed(false) : setDownloadNotAllowed(true)

    if (resource?.cloudTables?.[0]?.gcpDatasetId) gcpDatasetID = resource.cloudTables[0].gcpDatasetId
    if (resource?.cloudTables?.[0]?.gcpTableId) gcpTableId = resource.cloudTables[0].gcpTableId

    if (gcpDatasetID) {
      if (gcpTableId) {
        downloadUrl = `https://storage.googleapis.com/basedosdados-public/one-click-download/${gcpDatasetID}/${gcpTableId}/${gcpTableId}.csv.gz`
        queryBQ = `${gcpDatasetID}.${gcpTableId}`
      }
    }
  }, [resource])


  useEffect(() => {
    if(resource._id === undefined) return
    setIsLoading(true)

    setSqlCode("")
    if (checkedColumns.length === 0) return setIsLoading(false)

    async function sqlCodeString() {
      const result = await getBigTableQuery(resource._id, checkedColumns)
      setSqlCode(result)
    }

    if(tabIndex === 0) sqlCodeString()
  }, [resource._id, checkedColumns, tabIndex])

  const handlerDownload = () => {
    if (downloadNotAllowed === false) return null

    return window.open(downloadUrl)
  }

  const handleIndexes = (index) => {
    const categoryValues = ["SQL", "Python", "R", "Stata", "Download"];
    setTabIndex(index);
    triggerGAEvent("category_click", categoryValues[index]);
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
          padding="8px 24px 0"
          borderBottom="2px solid #DEDFE0 !important"
        >
          <GreenTab>SQL</GreenTab>
          <GreenTab>Python</GreenTab>
          <GreenTab>R</GreenTab>
          <GreenTab>Stata</GreenTab>
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
            <Text
              fontFamily="Roboto"
              fontWeight="400"
              fontSize="14px"
              lineHeight="20px"
              color="#252A32"
            >
              Selecione as colunas que você deseja acessar:
            </Text>

            <ColumnsDatasets
              tableId={resource._id}
              checkedColumns={checkedColumns}
              onChangeCheckedColumns={setCheckedColumns}
            />

            <Box display="flex" flexDirection="row" gap="8px" alignItems="center">
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
                maxWidth="180px"
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

            {checkedColumns.length > 0 &&
              <AlertDiscalimerBox
                type="warning"
                text={`Cuidado para não ultrapassar o limite de processamento gratuito do BigQuery.
  Para otimizar a consulta, você pode selecionar menos colunas ou adicionar filtros no BigQuery.`}
              >
              </AlertDiscalimerBox>
            }
          </Box>

          <TabPanels>
            <TabPanel
              id="SQL_section"
              display="flex"
              flexDirection="column"
              gap="16px"
              marginTop="40px"
              padding={0}
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

              {checkedColumns.length === 0 ?
                <AlertDiscalimerBox
                  type="error"
                >
                  Por favor, selecione acima as colunas que você deseja acessar.
                </AlertDiscalimerBox>
                :
                <>
                  <AlertDiscalimerBox
                    type="info"
                  >
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
                        Acesse o BigQuery
                      </Text>
                    </Box>
                  </Box>

                  <CodeHighlight language="sql">
                    {sqlCode}
                  </CodeHighlight>
                </>
              }
              {/* {resource?.isClosed ?
                <SectionText margin="24px 0 16px">
                  Com uma assinatura BD Pro válida, copie o código abaixo e cole no Editor de Consultas no BigQuery:
                </SectionText>
                :
                <SectionText
                  margin="24px 0 16px"
                >
                  Copie o código abaixo,
                  <Link
                    color="#42B0FF"
                    target="_blank"
                    textDecoration="none"
                    href={`https://console.cloud.google.com/bigquery?p=basedosdados&d=${gcpDatasetID}&t=${gcpTableId}&page=table`}
                  > clique aqui
                  </Link> para ir ao <i>datalake</i> no BigQuery e cole no Editor de Consultas:
                </SectionText>
              }
              <PrismCodeHighlight language="sql">
                {`SELECT * FROM \`basedosdados.${queryBQ}\` LIMIT 100`}
              </PrismCodeHighlight> */}
            </TabPanel>

            <TabPanel padding="0">
              {/* <SectionText
                margin="24px 0 16px"
              >
                Criamos um pacote em Python para você acessar o <i>datalake</i>. Basta rodar o código:
              </SectionText>

              <PrismCodeHighlight language="python">
                {`import basedosdados as bd

  # Para carregar o dado direto no pandas
  df = bd.read_table(dataset_id='${gcpDatasetID}',
  table_id='${gcpTableId}',
  billing_project_id="<YOUR_PROJECT_ID>")`}
              </PrismCodeHighlight> */}
            </TabPanel>

            <TabPanel padding="0">
              {/* <SectionText
                margin="24px 0 16px"
              >
                Criamos um pacote em R para você acessar o <i>datalake</i>. Basta rodar o código:
              </SectionText>

              <PrismCodeHighlight language="R">
                {`install.packages("basedosdados")
  library("basedosdados")

  # Defina o seu projeto no Google Cloud
  set_billing_id("<YOUR_PROJECT_ID>")

  # Para carregar o dado direto no R
  query <- bdplyr("${queryBQ}")
  df <- bd_collect(query)`}
              </PrismCodeHighlight> */}
            </TabPanel>

            <TabPanel padding="0">
              {/* <SectionText
                margin="24px 0 16px"
              >
                Criamos um pacote em Stata para você acessar o <i>datalake</i>. Basta rodar o código:
              </SectionText>

              <PrismCodeHighlight language="stata">
                {`net install basedosdados, from("https://raw.githubusercontent.com/basedosdados/mais/master/stata-package")

  bd_read_table, ///
      path("<PATH>") ///
      dataset_id("${gcpDatasetID}") ///
      table_id("${gcpTableId}") ///
      billing_project_id("<PROJECT_ID>")`}
              </PrismCodeHighlight> */}
            </TabPanel>

            <TabPanel padding="0">
              <SectionText marginTop="24px">
                Estes dados estão disponíveis porque diversas pessoas colaboram para a sua manutenção.
              </SectionText>
              <SectionText>
                Antes de baixar os dados, apoie você também com uma doação financeira ou <Link color="#42B0FF" href="https://basedosdados.github.io/mais/colab_data/">saiba como contribuir com seu tempo</Link>.
              </SectionText>

              {!downloadNotAllowed &&
                <DisclaimerBox
                  borderColor="#D93B3B"
                >
                  <HStack gridGap="8px" alignItems="flex-start">
                    <ExclamationIcon
                      alt="atenção"
                      width="20px"
                      height="20px"
                      fill="#D93B3B"
                      marginTop="4px"
                    />
                    <Box>
                      <SectionText fontWeight="700">ATENÇÃO: O tamanho da tabela ultrapassou o limite permitido para download, de 200.000 linhas.</SectionText>
                      <SectionText>Para acessar os dados, utilize nosso <i>datalake</i> no BigQuery ou nossos pacotes em Python, R e Stata.</SectionText>
                    </Box>
                  </HStack>
                </DisclaimerBox>
              }

              <RoundedButton
                marginTop="24px"
                fontSize="14px"
                fontWeight="700"
                color="#FFF"
                backgroundColor={downloadNotAllowed ? "#42B0FF" : "#C4C4C4"}
                paddingX="30px"
                width="fit-content"
                gridGap="6px"
                cursor={downloadNotAllowed ? "pointer" : "default"}
                _hover={!downloadNotAllowed ? { transform: "none" } : ""}
                onClick={() => handlerDownload()}
              >
                <DownloadIcon alt="download" width="22px" height="22px" fill="#FFF" />
                Download dos dados
              </RoundedButton>
            </TabPanel>
          </TabPanels>
        </VStack>
      </Tabs>
    </VStack>
  )
}
