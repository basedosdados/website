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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Subtitle from "../atoms/Subtitle";
import SectionText from "../atoms/SectionText";
import Link from "../atoms/Link";
import GreenTab from "../atoms/GreenTab";
import RoundedButton from "../atoms/RoundedButton";
import CopyIcon from "../../public/img/icons/copyIcon";
import { DisclaimerBox } from "./DisclaimerBox";
import ExclamationIcon from "../../public/img/icons/exclamationIcon";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook"

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
        <CopyIcon marginLeft="5px"/>
      </Button>
    </pre>

  )
}

export default function DataInformationQuery ({ resource }) {
  const downloadUrl = `https://storage.googleapis.com/basedosdados-public/one-click-download/${resource.dataset_id}/${resource.name}.zip`
  const queryName = `${resource.dataset_id}.${resource.name}`;
  const [isMobileMod, setIsMobileMod] = useState(false)
  const isMobile = useCheckMobile();

  useEffect(() => {
    setIsMobileMod(isMobile)
  },[isMobile])

  useEffect(() => {
    if (window) window.Prism.highlightAll();
  }, [resource])

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
      >
        <TabList
          padding="0px"
          fontFamily="Ubuntu !important"
          borderBottom= "2px solid #DEDFE0 !important"
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
          <GreenTab
            fontSize="16px"
            paddingBottom="8px !important"
            letterSpacing="0.2px"
          >
            Download
          </GreenTab>
        </TabList>
        <TabPanels>
          <TabPanel padding="0">
            <SectionText
              margin="24px 0 16px"
            >
              Copie o código abaixo,
              <Link
                color="#42B0FF"
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

            <PrismCodeHighlight language="Stata">
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

          <TabPanel padding="16px 0 0">
            <SectionText>
              Estes dados estão disponíveis porque diversas pessoas colaboram para a sua manutenção.
            </SectionText>
            <SectionText>
              Antes de baixar os dados, apoie você também com uma doação financeira ou <Link color="#42B0FF" href="https://basedosdados.github.io/mais/colab_data/">saiba como contribuir com seu tempo</Link>.
            </SectionText>
          {/* <DisclaimerBox>
                <HStack gridGap="8px" alignItems="flex-start">
                 <ExclamationIcon 
                   widthIcon="20px"
                   heightIcon="20px"
                   fill="#42B0FF"
                   marginTop="4px"
                 />
                 <Box>
                   <SectionText fontWeigth="700">ATENÇÃO: O tamanho da tabela ultrapassou o limite permitido para download.</SectionText>
                   <SectionText>Ao clicar em <i>Download dos dados</i>, você baixará apenas uma prévia dos dados. Para acessar a tabela completa, utilize nossos pacotes em Python, R ou Stata.</SectionText>
                 </Box>
               </HStack>
              </DisclaimerBox> */}
            <VStack
              alignItems={isMobileMod ? "center" :"flex-start"}
              padding="32px 0 24px"
              direction="column"
              height="100%"
              spacing={4}
            >
              <HStack spacing={10} flexDirection={isMobileMod && "column"}>
                <Image
                  height="250px"
                  objectFit="contain"
                  marginLeft="-15px"
                  src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/bd_qrcode.png"
                />

                <Stack spacing={5} >
                  <Text color="#252A32" fontWeight="bold" fontFamily="Ubuntu" fontSize="20px">
                    Doe via PIX
                  </Text>
                  <Text color="#252A32" fontFamily="Lato" fontSize="18px">
                    Chave CNPJ
                    <br /> 42494318000116
                  </Text>
                </Stack>
              </HStack>

              <HStack
                spacing={!isMobileMod && 6}
                flexDirection={isMobileMod && "column"}
                gridGap={isMobileMod && "10px"}
              >
                <Link
                  minWidth="225px"
                  width="100%"
                  textDecoration="none !important"
                  _hover={{ opacity:"none" }}
                  target="_blank"
                  href="/#support"
                >
                  <RoundedButton width="100%">Doação mensal</RoundedButton>
                </Link>
                <Link
                  minWidth="225px"
                  width="100%"
                  _hover={{ opacity:"none" }}
                  textDecoration="none !important"
                  href={downloadUrl}
                >
                  <RoundedButton
                    width="100%"
                    color="#42B0FF"
                    border="2px solid #42B0FF"
                    backgroundColor="white"
                    colorScheme="gray"
                  >
                    Download dos dados
                  </RoundedButton>
                </Link>
              </HStack>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}
