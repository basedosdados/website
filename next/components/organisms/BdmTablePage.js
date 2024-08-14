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
import { useState, useEffect } from "react";
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

export default function BdmTablePage({ id }) {
  const [isLoading, setIsLoading] = useState(true)
  const [resource, setResource] = useState({})
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/tables/getBdmTable?p=${id}`, { method: "GET" })
        const result = await response.json()

        if (result.success) {
          setResource(result.resource)
          setIsError(false)
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

    fetchData()
  }, [id])

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
      onClick: () => {window.open(href)}
    }
  }

  const PublishedOrDataCleanedBy = ({ resource }) => {
    return (
      <HStack spacing="4px">
        {resource?.firstName && resource?.lastName ?
          <Text
            marginRight="4px !important"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="20px"
            color="#464A51"
          >
            {`${resource.firstName} ${resource.lastName}`}
          </Text>
          :
          <Text
            marginRight="4px !important"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="20px"
            color="#464A51"
          >
            Não informado
          </Text>
        }
        {resource?.email && <EmailIcon {...keyIcons({email : resource.email})}/>}
        {resource?.github && <GithubIcon {...keyIcons({github_user : resource.github})}/>}
        {resource?.website && <WebIcon {...keyIcons({website : resource.website})}/>}
        {resource?.twitter && <TwitterIcon {...keyIcons({twitter_user : resource.twitter_user})}/>}
      </HStack>
    )
  }

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
        "second":`Atualização a cada ${frequency} segundos`,
        "minute":`Atualização a cada ${frequency} minutos`,
        "hour":`Atualização a cada ${frequency} horas`,
        "day":`Atualização a cada ${frequency} dias`,
        "week":`Atualização a cada ${frequency} semanas`,
        "month":`Atualização a cada ${frequency} meses`,
        "bimester":`Atualização a cada ${frequency} bimestres`,
        "quarter":`Atualização a cada ${frequency} trimestres`,
        "semester":`Atualização a cada ${frequency} semestres`,
        "year":`Atualização a cada ${frequency} anos`,
      }
      :
      formats = {
        "second":"Atualização por segundo",
        "minute":"Atualização por minuto",
        "hour":"Atualização por hora",
        "day":"Atualização diária",
        "week":"Atualização semanal",
        "month":"Atualização mensal",
        "bimester":"Atualização bimestral",
        "quarter":"Atualização trimestral",
        "semester":"Atualização semestral",
        "year":"Atualização anual",
      }
    }

    return formats[value] ? formats[value] : "Atualização não definida"
  }

  if(isError) return <FourOFour/>

  return (
    <Stack
      flex={1}
      overflow="hidden"
      spacing={0}
    >
      <StackSkeleton
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap="8px"
      >
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="24px"
          lineHeight="36px"
          color="#252A32"
          width="fit-content"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {resource?.name}
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
          {resource?.description || "Não informado"}
        </ReadMore>
      </SkeletonText>

      <Stack spacing="12px" marginBottom="40px !important">
        <StackSkeleton width="240px" height="20px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="18px"
            lineHeight="20px"
            color="#252A32"
          >
            Cobertura temporal da tabela
          </Text>
        </StackSkeleton>

        <StackSkeleton
          width="350px"
          height={!isLoading ? "fit-content" : "65px"}
        >
          <TemporalCoverageBar value={resource?.fullCoverage}/>
        </StackSkeleton>
      </Stack>

      <Stack spacing="12px" marginBottom="40px !important">
        <StackSkeleton width="160px" height="20px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="18px"
            lineHeight="20px"
            color="#252A32"
          >
            Acesso aos dados
          </Text>
        </StackSkeleton>

        <DataInformationQuery
          resource={resource}
        />
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
            Frequência de atualização dos dados
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
            flexDirection="row"
            gap="8px"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="22px"
            color="#464A51"
          >
            {resource?.updates?.[0]?.latest ?
              formatDate(resource.updates[0].latest)
              :
              "Não informado"
            }: Última vez que atualizamos na BD
            {resource?.updates?.[0]?.frequency &&
              <Text
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
                backgroundColor="#EEEEEE"
                padding="2px 4px"
                borderRadius="4px"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="12px"
                lineHeight="18px"
                color="#252A32"
              >
                Sem previsão de atualização
              </Text>
            }
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            gap="8px"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="22px"
            marginTop="4px"
            color="#464A51"
          >
            {resource?.rawDataSource?.[0]?.updates?.[0]?.latest ?
              formatDate(resource.rawDataSource[0].updates[0].latest)
              :
              "Não informado"
            }: Última vez que atualizaram na fonte original
            {resource?.rawDataSource?.[0]?.updates?.[0]?.frequency ?
              <Text
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
                backgroundColor="#EEEEEE"
                padding="2px 4px"
                borderRadius="4px"
                fontFamily="Roboto"
                fontWeight="500"
                fontSize="12px"
                lineHeight="18px"
                color="#252A32"
              >
                Sem previsão de atualização
              </Text>
              :
              <></>
            }
          </Box>
          <Text
            display="flex"
            flexDirection="row"
            gap="8px"
            fontFamily="Roboto"
            fontWeight="400"
            fontSize="14px"
            lineHeight="22px"
            marginTop="4px"
            color="#464A51"
          >
            {resource?.rawDataSource?.[0]?.polls?.[0]?.latest ?
              formatDate(resource.rawDataSource[0].polls[0].latest)
              :
              "Não informado"
            }: Última vez que verificamos a fonte original
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
            ID do BigQuery
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
              "Não informado"
              :
              resource?.cloudTables?.[0]?.gcpProjectId+"."+resource?.cloudTables?.[0]?.gcpDatasetId+"."+resource?.cloudTables?.[0]?.gcpTableId
            }
            <RedirectIcon
              display={resource?.cloudTables ? "flex" : "none"}
              width="16px"
              height="16px"
            />
          </Text>
        </StackSkeleton>
      </Stack>


      <Stack marginBottom="40px !important">
        <StackSkeleton width="205px" height="20px">
          <TooltipText
            text="Partições no BigQuery"
            info="As partições são divisões feitas em uma tabela para facilitar o gerenciamento e a consulta aos dados. Ao segmentar uma tabela grande em partições menores, a quantidade de bytes lidos é reduzida, o que ajuda a controlar os custos e melhora o desempenho da consulta."
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
            {resource?.partitions ? resource.partitions :"Não informado"}
          </Text>
        </StackSkeleton>
      </Stack>

      <Stack marginBottom="40px !important">
        <StackSkeleton width="190px" height="20px">
          <TooltipText
            text="Nível da observação"
            info="Indica qual a menor granularidade possível de análise com aquele dado. Por exemplo, uma tabela com nível da observação de estado permite que façamos uma análise no país (por ser mais amplo que estado), mas não uma análise por município (que já seria um recorte mais específico)."
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
              Não informado
            </Text>
          }
        </Skeleton>       
      </Stack>

      <Stack marginBottom="40px !important">
        <StackSkeleton width="180px" height="20px">
          <TooltipText
            text="Arquivos auxiliares"
            info="Os arquivos dão mais contexto e ajudam a entender melhor os dados disponíveis. Podem incluir notas técnicas, descrições de coleta e amostragem, etc."
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
                Download dos arquivos
                <DownloadIcon
                  width="24px"
                  height="24px"
                />
              </Text>
            :
              "Não informado"
            }
          </Text>  
        </StackSkeleton>
      </Stack>

      <Stack>
        <StackSkeleton width="155px" height="20px">
          <TooltipText
            text="Fontes originais"
            info="São links para páginas externas à plataforma com informações úteis sobre o conjunto de dados. Tentamos sempre fornecer o caminho mais próximo possível à fonte para baixar os dados originais."
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
            {resource?.rawDataSource?.[0]?._id && resource?.rawDataSource?.[0]?.dataset?._id ? 
              <Text
                as="a"
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
                href={`/dataset/${resource.rawDataSource[0].dataset._id}?raw_data_source=${resource.rawDataSource[0]._id}`}
              >
                {resource.rawDataSource[0].name}
              </Text>
            :
              "Não informado"
            }
          </Text>
        </StackSkeleton> 
      </Stack>

      <Divider marginY="40px !important" borderColor="#DEDFE0"/>

      <StackSkeleton width="190px" height="20px" marginBottom="20px !important">
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="18px"
          lineHeight="20px"
          color="#252A32"
        >
          Informações adicionais
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
        >Publicação por</Text>
        <PublishedOrDataCleanedBy
          resource={resource?.publishedByInfo || "Não informado"}
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
        >Tratamento por</Text>
        <PublishedOrDataCleanedBy
          resource={resource?.dataCleanedByInfo || "Não informado"}
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
        >Versão</Text>
        <Text
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          color="#464A51"
        >{resource?.version || "Não informado"}</Text>
      </SkeletonText>
    </Stack>
  )
}
