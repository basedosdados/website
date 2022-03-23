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
import { useEffect } from "react";
import Title from "../atoms/Title";
import Link from "../atoms/Link";
import { LinkDash } from "../atoms/LinkDash";
import GreenTab from "../atoms/GreenTab"
import RoundedButton from "../atoms/RoundedButton";
import CopyIcon from "../../public/img/icons/copyIcon"
import { DisclaimerBox } from "./DisclaimerBox"

export function BoxBigQueryGoogle({ href }) {

  return (
    <DisclaimerBox>
      <HStack spacing={0}>
        <Image width="20px" height="20px" marginRight="10px" src="https://img.icons8.com/color/48/000000/google-logo.png"/>
        <Text color="#252A32">
          Para usar o BigQuery basta ter uma conta Google. Primeira vez? 
          <LinkDash
            fontWeight="700"
            target="_blank"
            dash={false}
            href={href}
          > Siga o passo a passo.
          </LinkDash>
        </Text>
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

  useEffect(() => {
    if (window) window.Prism.highlightAll();
  }, [resource]);

  return (
    <VStack
      spacing={-1} 
      alignItems="flex-start"
      width="100%"
    >
      <Title fontWeigth="400">Consulta aos dados</Title>
      <Tabs 
        paddingTop="20px"
        width={{ base: "90vw", lg: "100%" }}
      >
        <TabList 
          padding="0px"
          fontFamily="Ubuntu !important"
          borderBottom= "2px solid #DEDFE0 !important"
        >
          <GreenTab>SQL</GreenTab>
          <GreenTab>Python</GreenTab>
          <GreenTab>R</GreenTab>
          <GreenTab>Stata</GreenTab>
          <GreenTab>Download</GreenTab>
        </TabList>
        <TabPanels>
          <TabPanel padding="0">
            <Text
              fontFamily="Lato"
              margin="20px 0 14px"
              fontSize="16px"
              letterSpacing="0.5px"
              fontWeight="300"
              color="#252A32" 
            >
              Copie o código abaixo, 
              <LinkDash 
                fontWeight="700" 
                textDecoration="none" 
                dash={false} 
                href={`https://console.cloud.google.com/bigquery?p=basedosdados&d=${resource.dataset_id}&t=${resource.name}&page=table`}
              > clique aqui
              </LinkDash> para ir ao <i>datalake</i> no BigQuery e cole no Editor de Consultas:
            </Text>

            <PrismCodeHighlight language="sql">
              {`SELECT * FROM \`basedosdados.${queryName}\` LIMIT 100`}
            </PrismCodeHighlight>
          
            <BoxBigQueryGoogle
              href={"https://basedosdados.github.io/mais/access_data_bq/#primeiros-passos"}
            />
            <script key="sql" src="/vendor/prism.js"></script>
          </TabPanel>

          <TabPanel padding="0">
            <Text
              color="#252A32" 
              fontFamily="Lato"
              margin="20px 0 14px"
              fontSize="16px"
              letterSpacing="0.5px"
              fontWeight="300"
            >
              Criamos um pacote em Python para você acessar o <i>datalake</i>. Basta rodar o código:
            </Text>

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
            <Text
              color="#252A32" 
              fontFamily="Lato"
              margin="20px 0 14px"
              fontSize="16px"
              letterSpacing="0.5px"
              fontWeight="300"
            >
              Criamos um pacote em R para você acessar o <i>datalake</i>. Basta rodar o código:
            </Text>

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
            <Text
              color="#252A32" 
              fontFamily="Lato"
              margin="20px 0 14px"
              fontSize="16px"
              letterSpacing="0.5px"
              fontWeight="300"
            >
              Criamos um pacote em Stata para você acessar o <i>datalake</i>. Basta rodar o código:
            </Text>

            <PrismCodeHighlight language="Stata">
              {`github install basedosdados/stata-package
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

          <TabPanel padding="20px 0 0">
            <DisclaimerBox
              title="Estes dados estão disponíveis porque diversas pessoas colaboram para a sua manutenção."
              text={
              <Text color="#252A32">
                  Apoie você também com doação financeira ou
                  <LinkDash
                    fontWeight="bold"
                    textDecoration="none"
                    target="_blank"
                    href="https://basedosdados.github.io/mais/colab/"
                    dash={false}
                    > saiba como contribuir com seu tempo.
                  </LinkDash>
                </Text>
              }
            />
            <VStack
              alignItems="flex-start"
              padding="30px 0 20px"
              direction="column"
              height="100%"
              spacing={5}
            >
              <HStack spacing={10}>
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
                  <Text color="#252A32" fontSize="18px">
                    Chave CNPJ
                    <br /> 42494318000116
                  </Text>
                </Stack>
              </HStack>

              <HStack spacing={5}>
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
                    color="#3AA1EB"
                    border="2px solid #3AA1EB"
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