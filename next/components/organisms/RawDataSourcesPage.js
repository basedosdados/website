import {
  Stack,
  Box,
  Text,
  Skeleton,
  SkeletonText,
  Tooltip,
  Divider
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

import ReadMore from "../atoms/ReadMore";
import ObservationLevel from "../atoms/ObservationLevelTable";
import { TemporalCoverage } from "../molecules/TemporalCoverageDisplay";
import { AlertDiscalimerBox } from "../molecules/DisclaimerBox";
import FourOFour from "../templates/404";

import RedirectIcon from "../../public/img/icons/redirectIcon"
import InfoIcon from "../../public/img/icons/infoIcon";

export default function RawDataSourcesPage({ id }) {
  const [isLoading, setIsLoading] = useState(true)
  const [resource, setResource] = useState({})
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const featchRawDataSources = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/datasets/getRawDataSources?p=${id}`, { method: "GET" })
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

    featchRawDataSources()
  },[id])

  const ObjectValues = (value) => {
    if(value === undefined || Object.keys(value).length === 0) return "Não informado"

    const array = []

    Object.values(value).map((elm) => {
      array.push(elm.name)
    })

    if(array.length === 0) return "Não informado"
    return array.join(", ").toString()
  }

  const TrueOrFalse = (value) => {
    switch (value) {
      case true:
        return "Sim"
        break;
      case false:
        return "Não"
        break;
      default:
        return "Não informado"
        break;
    }
  }

  const UpdateFrequency = () => {
    const value = resource?.updates?.[0]
    if(value === undefined || Object.keys(value).length === 0) return "Não informado"

    if(value?.frequency >= 0 && value?.entity?.name) return `${value.frequency} ${value.entity.name}`
    if(value?.entity?.name) return `${value.entity.name}`

    return "Não informado"
  }

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
          {...props}
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

  const AddInfoTextBase = ({ title, text, ...props }) => {
    return (
      <SkeletonText
        startColor="#F0F0F0"
        endColor="#F3F3F3"
        borderRadius="6px"
        minHeight="40px"
        width="100%"
        spacing="4px"
        skeletonHeight="18px"
        noOfLines={2}
        marginBottom="24px !important"
        isLoaded={!isLoading}
        {...props}
      >
        <Text
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="14px"
          lineHeight="20px"
          color="#252A32"
        >{title}</Text>
        <Text
          fontFamily="Roboto"
          fontWeight="400"
          fontSize="14px"
          lineHeight="20px"
          color="#464A51"
        >{text || "Não informado"}</Text>
      </SkeletonText>
    )
  }

  if(isError) return <FourOFour/>

  return (
    <Stack
      flex={1}
      overflow="hidden"
      paddingLeft={{base: "0", lg: "24px"}}
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
      </StackSkeleton>

      <StackSkeleton
        height="56px"
        marginTop="8px !important"
      >
        <AlertDiscalimerBox>
          Estes dados não passaram pela metodologia de tratamento da Base dos Dados.
        </AlertDiscalimerBox>
      </StackSkeleton>

      <StackSkeleton
        width="fit-content"
        height="40px"
        marginTop="8px !important"
        marginBottom="40px !important"
      >
        <Box
          as="a"
          href={resource?.url}
          target="_blank"
          display="flex"
          alignItems="center"
          height="40px"
          width="fit-content"
          borderRadius="8px"
          backgroundColor={resource?.url ? "#0D99FC" : "#ACAEB1"}
          padding="8px 16px"
          cursor={resource?.url ? "pointer" : "default"}
          color="#FFF"
          fill="#FFF"
          fontFamily="Roboto"
          fontWeight="500"
          fontSize="14px"
          gap="8px"
          lineHeight="20px"
          _hover={{
            opacity: resource?.url ? "0.7" : "1"
          }}
        >
          Acessar fonte original
          <RedirectIcon
            width="16px"
            height="16px"
          />
        </Box>
      </StackSkeleton>

      <Stack spacing="12px" marginBottom="40px !important">
        <StackSkeleton width="160px" height="20px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="18px"
            lineHeight="20px"
            color="#252A32"
          >
            Descrição
          </Text>
        </StackSkeleton>

        <SkeletonText
          startColor="#F0F0F0"
          endColor="#F3F3F3"
          borderRadius="6px"
          width="100%"
          minHeight="60px"
          spacing="6px"
          skeletonHeight="16px"
          noOfLines={3}
          marginTop="8px !important"
          isLoaded={!isLoading}
        >
          <ReadMore id="readLessRawDescription">
            {resource?.description || "Não fornecido"}
          </ReadMore>
        </SkeletonText>
      </Stack>

      <Stack spacing="12px">
        <StackSkeleton width="160px" height="20px">
          <Text
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="18px"
            lineHeight="20px"
            color="#252A32"
          >
            Cobertura temporal
          </Text>
        </StackSkeleton>

        <StackSkeleton
          width="350px"
          height="24px"
          alignItems="start"
        >
          <Text
            fontFamily="Roboto"
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            color="#464A51"
          >
            Não informado
          </Text>
          {/* <TemporalCoverage
            value={resource?.coverages?.[0]?.datetimeRanges?.[0]}
            text="Nenhuma cobertura temporal fornecida"
          /> */}
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

      <AddInfoTextBase
        title="Idioma"
        text={ObjectValues(resource?.languages)}
      />

      <AddInfoTextBase
        title="Disponibilidade"
        text={resource?.availability?.name}
      />

      <AddInfoTextBase
        title="Tem dados estruturados"
        text={TrueOrFalse(resource?.containsStructuredData)}
      />

      <AddInfoTextBase
        title="Tem API"
        text={TrueOrFalse(resource?.containsApi)}
      />

      <AddInfoTextBase
        title="Frequência de atualização"
        text={UpdateFrequency()}
      />

      <Stack marginBottom="24px !important">
        <StackSkeleton width="190px" height="20px">
          <TooltipText
            text="Nível da observação"
            info="indica qual a menor granularidade possível de análise com aquele dado. Por exemplo, uma tabela com nível da observação de estado permite que façamos uma análise no país (por ser mais amplo que estado), mas não uma análise por município (que já seria um recorte mais específico)."
            fontSize="14px"
          />
        </StackSkeleton>

        <Skeleton
          startColor="#F0F0F0"
          endColor="#F3F3F3"
          borderRadius="16px"
          height="100%"
          width="800px"
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

      <AddInfoTextBase
        title="Requer registro"
        text={TrueOrFalse(resource?.requiredRegistration)}
      />

      <AddInfoTextBase
        title="Requer IP de algum país"
        text={ObjectValues(resource?.areaIpAddressRequired)}
      />

      <AddInfoTextBase
        title="Gratuito"
        text={TrueOrFalse(resource?.isFree)}
      />
    </Stack>
  )
}
