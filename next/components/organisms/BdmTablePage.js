import {
  VStack,
  Stack,
  Box,
  Text,
  Grid,
  GridItem,
  Tooltip,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import Link from "../atoms/Link";
import SectionText from "../atoms/SectionText";
import { SimpleTable } from "../atoms/SimpleTable";
import LoadingSpin from "../atoms/Loading";
import Subtitle from "../atoms/Subtitle";
import { TemporalCoverageBar } from "../atoms/TemporalCoverageDisplay";
import ColumnDatasets from "../molecules/ColumnDatasets";
import BaseResourcePage from "../molecules/BaseResourcePage";
import DataInformationQuery from "../molecules/DataInformationQuery";
import FourOFour from "../templates/404";

import {
  getBdmTable
} from "../../pages/api/datasets/index"

import StarIcon from "../../public/img/icons/starIcon";
import FrequencyIcon from "../../public/img/icons/frequencyIcon";
import PartitionIcon from "../../public/img/icons/partitionIcon";
import UserIcon from "../../public/img/icons/userIcon";
import VersionIcon from "../../public/img/icons/versionIcon";
import EmailIcon from "../../public/img/icons/emailIcon";
import GithubIcon from "../../public/img/icons/githubIcon";
import CkanIcon from "../../public/img/icons/ckanIcon";
import WebIcon from "../../public/img/icons/webIcon";
import TwitterIcon from "../../public/img/icons/twitterIcon";
import FileIcon from "../../public/img/icons/fileIcon";
import InfoIcon from "../../public/img/icons/infoIcon";
import DownloadIcon from "../../public/img/icons/downloadIcon";

export default function BdmTablePage({ id }) {
  const [isLoading, setIsLoading] = useState(true)
  const [resource, setResource] = useState({})
  const [isError, setIsError] = useState({})

  const fetchBdmTable = async () => {
    try {
      const result = await getBdmTable(id)
      setResource(result)
    } catch (error) {
      setIsError(error)
      console.error(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchBdmTable()
  }, [id])

  const AddInfoTextBase = ({title, text, info, children, ...style}) => {
    return (
      <Box display="block" alignItems="center" gridGap="8px" {...style}>
        <Text
          display="flex"
          alignItems="center"
          fontFamily="ubuntu"
          fontSize="14px"
          fontWeight="400" 
          letterSpacing="0.3px"
          marginBottom="8px"
          color="#252A32"
        >{title}
          {info &&
            <Tooltip
              label={info}
              hasArrow
              bg="#2A2F38"
              fontSize="16px"
              fontWeight="500"
              padding="10px 16px"
              marginTop="8px"
              color="#FFF"
              borderRadius="6px"
            >
              <InfoIcon
                alt="tip"
                marginLeft="8px"
                cursor="pointer"
                fill="#A3A3A3"
                width="16px"
                height="16px"
              />
            </Tooltip>
          }
        </Text>
        <SectionText>
          {text}
        </SectionText>
        {children}
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
    if(ref.ckan_user) {
      href = `/user/${ref.ckan_user}`
      alt = "usuário ckan"
    }
    if(ref.website) {
      href = `https://${ref.website}`
      alt = "website pessoal"
    }

    return {
      alt: alt,
      cursor: "pointer",
      width:"18px",
      height:"18px",
      fill: "#42B0FF",
      onClick: () => {window.open(href)}
    }
  }

  const PublishedOrDataCleanedBy = ({ resource }) => {
    if(resource.firstName === "Ricardo" &&  resource.lastName === "Dahis") return <SectionText marginRight="4px !important">Equipe Dados</SectionText>

    return (
      <>
        {resource?.firstName && resource?.lastName ? <SectionText marginRight="4px !important">{`${resource.firstName} ${resource.lastName}`}</SectionText> : <SectionText marginRight="4px !important">Não listado</SectionText>}
        {resource?.email && <EmailIcon {...keyIcons({email : resource.email})}/>}
        {resource?.github && <GithubIcon {...keyIcons({github_user : resource.github})}/>}
        {resource?.website && <WebIcon {...keyIcons({website : resource.website})}/>}
        {resource?.twitter && <TwitterIcon {...keyIcons({twitter_user : resource.twitter_user})}/>}
      </>
    )
  }

  const UpdateFrequency = () => {
    const value = resource?.updates?.[0]
    if(value === undefined || Object.keys(value).length === 0) return "Não listado"

    if(value?.frequency >= 0 && value?.entity?.name) return `${value.frequency} ${value.entity.name}`
    if(value?.entity?.name) return `${value.entity.name}`

    return "Não listado"
  }

  const Empty = () => {
    return (
      <p style={{margin:"0", fontWeight:"500", color:"#C4C4C4"}}>
        Não listado
      </p>
    )
  }

  const ObservationLevel = () => {
    const notFound = <SectionText marginRight="4px !important">Nenhum nível da observação fornecido.</SectionText>
    if(resource?.observationLevels === undefined || Object.keys(resource?.observationLevels).length === 0) return notFound

    let array = []
    const keys = Object.keys(resource?.observationLevels)

    keys.forEach((elm) => {
      const value = resource?.observationLevels[elm]

      const newValue = [value?.entity?.name || <Empty/>, value?.columns[0]?.name || <Empty/>]
      array.push(newValue)
    })

    return (
      <SimpleTable
        headers={["Entidade","Colunas Correspondentes"]}
        values={array}
        valuesTable={{_first:{textTransform: "capitalize"}}}
      />
    )
  }

  if(isError?.message?.length > 0 || resource === null || Object.keys(resource).length < 0) return <FourOFour/>

  if(isLoading) return <LoadingSpin />

  return (
    <BaseResourcePage
      padding={useCheckMobile() ? "16px 0 0" : "16px 8px 0 0"}
      title={resource?.name}
    >
      <DataInformationQuery resource={resource}/>

      <VStack width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>Descrição</Subtitle>
        <SectionText>
          {resource.description || "Nenhuma descrição fornecida."}
        </SectionText>
      </VStack>
      
      <VStack width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>Cobertura temporal</Subtitle>
        <TemporalCoverageBar/>
      </VStack>

      <VStack width="100%" spacing={4} alignItems="flex-start">
        <Subtitle>
          Colunas
        </Subtitle>
        <ColumnDatasets tableId={resource?._id} />
      </VStack>

      <VStack width="100%" spacing={5} alignItems="flex-start">
        <Subtitle>
          Nível da observação
        </Subtitle>
        <ObservationLevel/>
      </VStack>

      <VStack width="100%" spacing={5} alignItems="flex-start">
        <Stack flex="1" >
          <Subtitle>Informações adicionais</Subtitle>
        </Stack>

        <Grid width="100%" flex={1} templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <StarIcon alt="" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="ID do conjunto"
              text={resource?.dataset?._id || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <StarIcon alt="" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="ID da tabela"
              text={resource?._id || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <FrequencyIcon alt="Frequência de atualização" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Frequência de atualização"
              text={UpdateFrequency()}
            />
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <PartitionIcon alt="Partições no BigQuery" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Partições no BigQuery"
              info="As partições são divisões feitas em uma tabela para facilitar o gerenciamento e a consulta aos dados.
              Ao segmentar uma tabela grande em partições menores, a quantidade de bytes lidos é reduzida,
              o que ajuda a controlar os custos e melhora o desempenho da consulta."
              text={resource?.partitions || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <UserIcon alt="publicação por" width="22px" height="22px" fill="#D0D0D0"/>
            <Box display="block" gridGap="8px">
              <Text
                fontFamily="ubuntu"
                fontSize="14px"
                fontWeight="400" 
                letterSpacing="0.3px"
                marginBottom="8px"
                color="#252A32"
              >Publicação por</Text>
              <Box display="flex" alignItems="center" gridGap="4px">
                <PublishedOrDataCleanedBy
                  resource={resource?.publishedBy || "Não listado"}
                />
              </Box>
            </Box>
          </GridItem>

          <GridItem colSpan={useCheckMobile() && 2} display="flex" alignItems="flex-start" gridGap="8px">
            <UserIcon alt="publicação por" width="22px" height="22px" fill="#D0D0D0"/>
            <Box display="block" gridGap="8px">
              <Text
                fontFamily="ubuntu"
                fontSize="14px"
                fontWeight="400" 
                letterSpacing="0.3px"
                marginBottom="8px"
                color="#252A32"
              >Tratamento por</Text>
              <Box display="flex" alignItems="center" gridGap="4px">
                <PublishedOrDataCleanedBy
                  resource={resource?.dataCleanedBy || "Não listado"}
                />
              </Box>
            </Box>
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <VersionIcon alt="versão" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Versão"
              text={resource?.version || "Não listado"}
            />
          </GridItem>

          <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
            <FileIcon alt="Arquivos auxiliares" width="22px" height="22px" fill="#D0D0D0"/>
            <AddInfoTextBase
              title="Arquivos auxiliares"
              info="Os arquivos dão mais contexto e ajudam a entender melhor os dados disponíveis.
              Podem incluir notas técnicas, descrições de coleta e amostragem, etc."
              text={!resource?.auxiliaryFilesUrl && "Não listado"}
            >
              {resource?.auxiliaryFilesUrl &&
                <Link
                  color="#42B0FF"
                  href={resource?.auxiliaryFilesUrl}
                >
                  Download dos arquivos
                  <DownloadIcon
                    alt="tip"
                    marginLeft="8px"
                    cursor="pointer"
                    fill="#42B0FF"
                    width="18px"
                    height="18px"
                  />
                </Link>
              }
            </AddInfoTextBase>
          </GridItem>
        </Grid>
      </VStack>
    </BaseResourcePage>
  )
}
