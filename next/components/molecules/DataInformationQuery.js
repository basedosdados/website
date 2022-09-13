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
import { DisclaimerBox } from "./DisclaimerBox";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import Subtitle from "../atoms/Subtitle";
import SectionText from "../atoms/SectionText";
import Link from "../atoms/Link";
import GreenTab from "../atoms/GreenTab";
import RoundedButton from "../atoms/RoundedButton";
import DownloadIcon from "../../public/img/icons/downloadIcon";
import CopyIcon from "../../public/img/icons/copyIcon";
import ExclamationIcon from "../../public/img/icons/exclamationIcon";
import MenuVerticalIcon from "../../public/img/icons/menuVerticalIcon"

export function BoxBigQueryGoogle({ href }) {

  return (
    <DisclaimerBox>
      <HStack spacing={0}>
        <Image width="20px" height="20px" marginRight="10px" src="https://img.icons8.com/color/48/000000/google-logo.png"/>
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
        _hover={{ backgroundColor:"transparent", opacity:"0.6"}}
      >
        {hasCopied ? "Copiado" : "Copiar"}
        <CopyIcon widthIcon="20px" heightIcon="20px" fill="#707783" marginLeft="5px"/>
      </Button>
    </pre>

  )
}

export function TextPix ({ title, text }) {

  return (
    <Box>
      <Text color="#FF8484" letterSpacing="0.3px" fontSize="14px" fontWeight="700" fontFamily="ubuntu">
        {title}
      </Text>
      <SectionText fontWeigth="500">
        {text}
      </SectionText>
    </Box>
  )
}

export default function DataInformationQuery ({ resource }) {
  const downloadUrl = `https://storage.googleapis.com/basedosdados-public/one-click-download/${resource.dataset_id}/${resource.name}/data000000000000.csv.gz`
  const queryName = `${resource.dataset_id}.${resource.name}`
  const { hasCopied, onCopy } = useClipboard("42494318000116")
  const [tabIndex, setTabIndex] = useState(0)
  const [downloadNotAllowed, setDownloadNotAllowed] = useState(true)
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile()

  useEffect(() => {
    setIsMobileMod(isMobile)
  },[isMobile])

  useEffect(() => {
    if (window) window.Prism.highlightAll()

    if(resource.number_rows) {
      resource.number_rows > 200000 ? setDownloadNotAllowed(true) : setDownloadNotAllowed(false)
    }
  }, [resource])

  const handlerDownload = () => {
    if(downloadNotAllowed === true) return null
    return window.open(downloadUrl) 
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
        onChange={(index) => setTabIndex(index)}
        index={tabIndex}
      >
        <TabList
          padding="0px"
          fontFamily="Ubuntu !important"
          borderBottom= "2px solid #DEDFE0 !important"
          justifyContent={isMobileMod && "space-around"}
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
          {isMobileMod ?
            <Menu>
              <MenuButton
                variant="unstyled"
                top="2px"
                as={IconButton}
                rightIcon={
                  <MenuVerticalIcon 
                    widthIcon="20px" 
                    heightIcon="20px"
                    position="relative"
                    right="4px"
                    top="2px"
                    fill={tabIndex === 4 && "#2B8C4D"}
                  />
                }
                borderRadius="none"
                borderBottom={tabIndex === 4 &&"3px solid #2B8C4D"}
              />
              <MenuList>
                <MenuItem _focus={{backgroundColor: "#FFF"}} onClick={() => setTabIndex(4)}>Download</MenuItem>
              </MenuList>
            </Menu>
            :
            <GreenTab
              fontSize="16px"
              paddingBottom="8px !important"
              letterSpacing="0.2px"
            >
              Download
            </GreenTab>
          }
        </TabList>
        <TabPanels>
          <TabPanel padding="0">
            <SectionText
              margin="24px 0 16px"
            >
              Copie o código abaixo,
              <Link
                color="#42B0FF"
                target="_blank"
                textDecoration="none"
                href={`https://console.cloud.google.com/bigquery?p=basedosdados&d=${resource.dataset_id}&t=${resource.name}&page=table`}
              > clique aqui
              </Link> para ir ao <i>datalake</i> no BigQuery e cole no Editor de Consultas:
            </SectionText>

            <PrismCodeHighlight language="sql">
              {`SELECT * FROM \`basedosdados.${queryName}\` LIMIT 100`}
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
df = bd.read_table(dataset_id='${resource.dataset_id}',
table_id='${resource.name}',
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
query <- bdplyr("${queryName}")
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
    dataset_id("${resource.dataset_id}") ///
    table_id("${resource.table_id}") ///
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

            {downloadNotAllowed &&
              <DisclaimerBox>
                <HStack gridGap="8px" alignItems="flex-start">
                <ExclamationIcon 
                  widthIcon="20px"
                  heightIcon="20px"
                  fill="#42B0FF"
                  marginTop="4px"
                />
                <Box>
                  <SectionText fontWeigth="700">ATENÇÃO: O tamanho da tabela ultrapassou o limite permitido para download, de 200.000 linhas.</SectionText>
                  <SectionText>Para acessar os dados, utilize nosso <i>datalake</i> no BigQuery ou nossos pacotes em Python, R ou Stata.</SectionText>
                </Box>
              </HStack>
              </DisclaimerBox>
            }
            <VStack
              alignItems={isMobileMod ? "center" :"flex-start"}
              padding={isMobileMod ? "32px 0 24px 0 !important" :"32px 0 24px 40px !important"}
              margin="24px 4px 0"
              direction="column"
              height="100%"
              boxShadow="0 1px 8px 1px rgba(100, 96, 103, 0.16)"
              borderRadius="6px"
            >
              <HStack marginBottom="32px" spacing={0} alignItems="flex-start" flexDirection="column">
                <Box
                  width={isMobileMod ? "100%" : "216px" }
                  textAlign="center"
                  marginBottom="24px"
                >
                  <Text color="#FF8484" fontWeight="700" fontFamily="Ubuntu" fontSize="18px">
                    Doe agora
                  </Text>
                </Box>

                <HStack 
                  flexDirection={isMobileMod && "column"}
                  spacing={isMobileMod ? 0 : 8}
                >
                  <Image
                    height="216px"
                    objectFit="contain"
                    border="2px solid #DEDFE0"
                    borderRadius="5px"
                    src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/bd_qrcode.png"
                  />

                  <VStack
                    marginTop={isMobileMod && "32px !important"}
                    justifyContent="center"
                    alignItems="flex-start"
                  >
                    <TextPix title="Razão Social" text="Instituto Base dos Dados"/>
                    <TextPix title="CNPJ" text="42494318/0001-16"/>
                    <TextPix title="Banco" text="Stone"/>
                    <Box display="flex" gridGap="48px">
                      <TextPix title="Agência" text="0001"/>
                      <TextPix title="Conta" text="6761821-5"/>
                    </Box>
                  </VStack>
                </HStack>

                <Stack spacing={5} >
                  
                </Stack>
              </HStack>

              <HStack
                spacing={!isMobileMod && 6}
                flexDirection={isMobileMod && "column"}
                gridGap={isMobileMod && "16px"}
              >
                <RoundedButton
                  fontSize="14px"
                  fontWeight="700"
                  backgroundColor="#FF8484"
                  paddingX="30px"
                  width="100%"
                  gridGap="6px"
                  onClick={onCopy}
                  opacity={hasCopied && "0.8"}
                >
                  <CopyIcon widthIcon="22px" heightIcon="22px" fill="#FFF"/>
                  {hasCopied ? "Copiada chave PIX" :"Copiar chave PIX"}
                </RoundedButton>
                
                <RoundedButton
                  fontSize="14px"
                  fontWeight="700"
                  backgroundColor="#FFF"
                  color={downloadNotAllowed ? "#C4C4C4" :"#FF8484"}
                  border={downloadNotAllowed ? "1px solid #C4C4C4" :"1px solid #FF8484"}
                  paddingX="30px"
                  width="100%"
                  gridGap="6px"
                  cursor={downloadNotAllowed ? "auto" :"pointer"}
                  _hover={downloadNotAllowed ? {transform : "none"} : ""}
                  onClick={handlerDownload}
                >
                  <DownloadIcon widthIcon="22px" heightIcon="22px" fill={downloadNotAllowed ? "#C4C4C4" :"#FF8484"}/>
                  Download dos dados
                </RoundedButton>

              </HStack>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}
