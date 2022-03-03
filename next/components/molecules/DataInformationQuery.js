import {
  VStack,
  HStack,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Text,
  Image,
} from "@chakra-ui/react";
import Title from "../atoms/Title";
import Link from "../atoms/Link";
import { LinkDash } from "../atoms/LinkDash";
import GreenTab from "../atoms/GreenTab"
import RoundedButton from "../atoms/RoundedButton";
import { BlueBox } from "../molecules/BlueBox";


export default function DataInformationQuery ({ resource }) {
  const downloadUrl = `https://storage.googleapis.com/basedosdados-public/one-click-download/${resource.dataset_id}/${resource.name}.zip`

  return (
    <VStack
      spacing={-1} 
      marginTop="50px !important"
      alignItems="flex-start"
      width="100%"
    >
      <Title fontWeigth="400" >Consulta aos dados</Title>
      <Tabs 
        paddingTop="20px"
        width={{ base: "90vw", lg: "100%" }}
      >
        <TabList 
          padding="0px"
          fontFamily="Ubuntu !important"
          borderBottom= "2px solid #DEDFE0"
        >
          <GreenTab>SQL</GreenTab>
          <GreenTab>Python</GreenTab>
          <GreenTab>R</GreenTab>
          <GreenTab>Download</GreenTab>

        </TabList>
        <TabPanels>
          <TabPanel padding="0">
            <Text
              fontFamily="Lato"
              marginTop="20px"
              fontSize="16px"
              letterSpacing="0.5px"
              fontWeight="300"
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
          
          
          </TabPanel>

          <TabPanel padding="0">
            <Text
              fontFamily="Lato"
              marginTop="20px"
              fontSize="16px"
              letterSpacing="0.5px"
              fontWeight="300"
            >
              Criamos um pacote em Python para você acessar o <i>datalake</i>. Basta rodar o código:
            </Text>
          </TabPanel>

          <TabPanel padding="0">
            <Text
              fontFamily="Lato"
              marginTop="20px"
              fontSize="16px"
              letterSpacing="0.5px"
              fontWeight="300"
            >
              Criamos um pacote em R para você acessar o <i>datalake</i>. Basta rodar o código:
            </Text>
          </TabPanel>

          <TabPanel padding="20px 0 0">
            <BlueBox
              title="Estes dados estão disponíveis porque diversas pessoas colaboram para a sua manutenção."
              text={
                <Text>
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
            <Stack
              padding="30px 0 20px"
              direction="column"
              height="100%"
            >
              <Stack
                flex={1}
                alignItems="flex-start"
                flexDirection="column"
                justifyContent="center"
              >
                <Text fontWeight="bold" fontFamily="Ubuntu" fontSize="18px">
                  Doe via PIX
                </Text>

                <Image
                  height="250px"
                  objectFit="contain"
                  src="https://basedosdados-static.s3.us-east-2.amazonaws.com/images/bd_qrcode.png"
                />

                <Text fontSize="16px">
                  Chave CNPJ
                  <br /> 42494318000116
                </Text>
              </Stack>
              <Stack 
                flexDirection="row"
                gridGap="20px"
                alignItems="center"
                justifyContent="flex-end"
                spacing={0}
              >
                <Link
                  maxWidth="210px"
                  width="100%"
                  textDecoration="none !important"
                  target="_blank"
                  href="/#support"
                >
                  <RoundedButton width="100%">Doação mensal</RoundedButton>
                </Link>
                <Link
                  maxWidth="210px"
                  width="100%"
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
              </Stack>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}