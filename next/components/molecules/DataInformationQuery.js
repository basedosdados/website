import {
  VStack,
  Stack,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Image,
  Box,
  useClipboard,
  Button,
  HStack,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";

import Link from "../atoms/Link";
import GreenTab from "../atoms/GreenTab";
import SectionText from "../atoms/SectionText";
import Subtitle from "../atoms/Subtitle";
import RoundedButton from "../atoms/RoundedButton";

import DisclaimerBox from "./DisclaimerBox";

import { triggerGAEvent } from "../../utils";
import { CopyIcon } from "../../public/img/icons/copyIcon";
import DownloadIcon from "../../public/img/icons/downloadIcon";
import ExclamationIcon from "../../public/img/icons/exclamationIcon";
import MenuVerticalIcon from "../../public/img/icons/menuVerticalIcon";

export function BoxBigQueryGoogle({ href }) {
  return (
    <DisclaimerBox>
      <HStack spacing={0}>
        <Image
          alt=""
          width="20px"
          height="20px"
          marginRight="10px"
          src="https://img.icons8.com/color/48/000000/google-logo.png"
        />
        <SectionText>
          Para usar o BigQuery basta ter uma conta Google. Primeira vez?
          <Link
            target="_blank"
            color="#42B0FF"
            href={href}
          > Siga o passo a passo.
          </Link>
        </SectionText>
      </HStack>
    </DisclaimerBox>
  )
}

export function PrismCodeHighlight({ language, children }) {
  const { hasCopied, onCopy } = useClipboard(children)

  return (
    <pre
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        flexDirection: "row",
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        whiteSpace: "break-spaces",
        wordBreak: "break-all",
      }}
    >
      <code
        className={`language-${language}`}
      >
        {children}
      </code>

      <Button
        height="20px"
        minWidth="100px"
        padding="0 0 0 10px"
        onClick={onCopy}
        color="#707783"
        fontFamily="Lato"
        fontWeight="500"
        backgroundColor="transparent"
        _hover={{ backgroundColor: "transparent", opacity: "0.6" }}
      >
        {hasCopied ? "Copiado" : "Copiar"}
        <CopyIcon alt="copiar conteúdo" width="20px" height="20px" fill="#707783" marginLeft="5px" />
      </Button>
    </pre>
  )
}

export default function DataInformationQuery({ resource }) {
  const gcpDatasetID = resource?.cloudTables[0]?.gcpDatasetId
  const gcpTableId = resource?.cloudTables[0]?.gcpTableId
  const downloadUrl = `https://storage.googleapis.com/basedosdados-public/one-click-download/${gcpDatasetID}/${gcpTableId}/${gcpTableId}.csv.gz`
  const queryBQ = `${gcpDatasetID}.${gcpTableId}`
  const [tabIndex, setTabIndex] = useState(0)
  const [downloadNotAllowed, setDownloadNotAllowed] = useState(false)

  useEffect(() => {
    if (window) window?.Prism?.highlightAll()

    if (resource?.numberRows === 0) return setDownloadNotAllowed(false)
    if (resource?.numberRows) return resource?.numberRows > 200000 ? setDownloadNotAllowed(false) : setDownloadNotAllowed(true)
  }, [resource])

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
      spacing={-1}
      alignItems="flex-start"
      width="100%"
    >
      <Subtitle>Consulta aos dados</Subtitle>
      <Tabs
        paddingTop="16px"
        width={{ base: "90vw", lg: "100%" }}
        onChange={(index) => handleIndexes(index)}
        index={tabIndex}
      >
        <TabList
          padding="0px"
          fontFamily="Ubuntu !important"
          borderBottom="2px solid #DEDFE0 !important"
          justifyContent={isMobileMod() && "space-around"}
        >
          <GreenTab
            fontSize="16px"
            paddingBottom="8px !important"
            letterSpacing="0.2px"
          >
            SQL
          </GreenTab>
          <GreenTab
            fontSize="16px"
            paddingBottom="8px !important"
            letterSpacing="0.2px"
          >
            Python
          </GreenTab>
          <GreenTab
            fontSize="16px"
            paddingBottom="8px !important"
            letterSpacing="0.2px"
          >
            R
          </GreenTab>
          <GreenTab
            fontSize="16px"
            paddingBottom="8px !important"
            letterSpacing="0.2px"
          >
            Stata
          </GreenTab>
          {resource?.isClosed ? <></> :
            isMobileMod() ?
              <Menu>
                <MenuButton
                  variant="unstyled"
                  top="2px"
                  as={IconButton}
                  rightIcon={
                    <MenuVerticalIcon
                      alt="menu"
                      width="20px"
                      height="20px"
                      position="relative"
                      right="4px"
                      top="2px"
                      fill={tabIndex === 4 ? "#2B8C4D" : "#252A32"}
                    />
                  }
                  borderRadius="none"
                  borderBottom={tabIndex === 4 && "3px solid #2B8C4D"}
                />
                <MenuList>
                  <MenuItem _focus={{ backgroundColor: "#FFF" }} onClick={() => handleIndexes(4)}>Download</MenuItem>
                </MenuList>
              </Menu>
              :
              <GreenTab
                fontSize="16px"
                paddingBottom="8px !important"
                letterSpacing="0.2px"
              >
                Download
              </GreenTab>}
        </TabList>
        <TabPanels>
          <TabPanel padding="0">
            {resource?.isClosed ?
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
            </PrismCodeHighlight>

            <BoxBigQueryGoogle
              href={"https://basedosdados.github.io/mais/access_data_bq/#primeiros-passos"}
            />
            <script key="sql" src="/vendor/prism.js"></script>
          </TabPanel>

          <TabPanel padding="0">
            <SectionText
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
            </PrismCodeHighlight>

            <BoxBigQueryGoogle
              href={"https://basedosdados.github.io/mais/access_data_packages/#primeiros-passos"}
            />
            <script key="python" src="/vendor/prism.js"></script>
          </TabPanel>

          <TabPanel padding="0">
            <SectionText
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
            </PrismCodeHighlight>

            <BoxBigQueryGoogle
              href={"https://basedosdados.github.io/mais/access_data_packages/#primeiros-passos"}
            />
            <script key="R" src="/vendor/prism.js"></script>
          </TabPanel>

          <TabPanel padding="0">
            <SectionText
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
            </PrismCodeHighlight>

            <BoxBigQueryGoogle
              href={"https://basedosdados.github.io/mais/access_data_packages/#primeiros-passos"}
            />
            <script key="Stata" src="/vendor/prism.js"></script>
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
      </Tabs>
    </VStack>
  )
}
