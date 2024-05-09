import {
  VStack,
  HStack,
  Stack,
  Center,
  Image,
  Box,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook";
import LoadingSpin from "../atoms/Loading";
import Subtitle from "../atoms/Subtitle";
import SectionText from "../atoms/SectionText";
import RoundedButton from "../atoms/RoundedButton";
import { TemporalCoverage } from "../molecules/TemporalCoverageDisplay";
import BaseResourcePage from "../molecules/BaseResourcePage";
import DisclaimerBox from "../molecules/DisclaimerBox";
import FourOFour from "../templates/404";

import {
  getInformationRequest
} from "../../pages/api/datasets/index";

import StatusIcon from "../../public/img/icons/statusIcon";
import UserIcon from "../../public/img/icons/userIcon";
import ExclamationIcon from "../../public/img/icons/exclamationIcon";
import RedirectIcon from "../../public/img/icons/redirectIcon";

export default function InformationRequestPage({ id }) {
  const [isLoading, setIsLoading] = useState(true)
  const [resource, setResource] = useState({})
  const [isError, setIsError] = useState({})

  const featchInformationRequest = async () => {
    try {
      const result = await getInformationRequest(id)
      setResource(result)
    } catch (error) {
      setIsError(error)
      console.error(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    featchInformationRequest()
  },[id])


  const AddInfoTextBase = ({title, text, children, ...style}) => {
    return (
      <Box display="block" alignItems="center" gridGap="8px" {...style}>
        <Text
          fontFamily="ubuntu"
          fontSize="14px"
          fontWeight="400" 
          letterSpacing="0.3px"
          marginBottom="8px"
          color="#252A32"
        >{title}</Text>
        <SectionText>
          {text}
        </SectionText>
        {children}
      </Box>
    )
  }


  if(isError?.message?.length > 0 || resource === null || Object.keys(resource).length < 0) return <FourOFour/>

  if(isLoading) return <LoadingSpin />

  return (
    <BaseResourcePage
      padding={useCheckMobile() ? "16px 0 0" : "16px 8px 0 0"}
      title={`Número do pedido: ${resource?.number}`}
    >
      <VStack 
        marginTop="0 !important" 
        width="100%" 
        letterSpacing="0.5px" 
        spacing={4} 
        alignItems="flex-start"
      >
        <VStack width="100%" marginTop="32px !important" spacing={4} alignItems="flex-start">
          <Subtitle>Consulta aos dados</Subtitle>
          <DisclaimerBox width="100%">
            <HStack
              spacing={0}
              flexDirection={useCheckMobile() && "column"}
              alignItems="flex-start"
            >
              <Center>
                <ExclamationIcon alt="atenção" width="20px" height="20px" fill="#42B0FF"/>
                <SectionText margin="0 4px 0 12px" fontWeight="bolder" fontFamily="lato">ATENÇÃO:</SectionText>
              </Center>
              <SectionText
                display="flex"
                marginLeft={useCheckMobile() && "32px !important"}
              >
                Estes dados não passaram pela metodologia de tratamento da Base dos Dados.
              </SectionText>
            </HStack>
          </DisclaimerBox>

          <HStack
            width="100%"
            alignItems="flex-start"
            flexDirection={useCheckMobile() && "column"}
            gridGap={useCheckMobile() ? "16px" : "8px"}
            marginTop={useCheckMobile() && "24px !important"}
            spacing={0}
          >
            <a href={resource?.dataUrl} target="_blank">
              <RoundedButton
                height="35px"
                fontSize="14px"
                minWidth="180px"
                width={useCheckMobile() && "100%"}
                color="#FFF"
                backgroundColor={resource?.dataUrl ? "#42B0FF" : "#C4C4C4"}
                padding="0 20px"
                isDisabled={resource?.dataUrl ? false : true}
              >
                <RedirectIcon alt="hiperlink" marginRight="8px" width="14px" height="14px" fill="#FFF"/>
                Acessar dados
                </RoundedButton>
            </a>

            <a href={resource?.url} target="_blank">
              <RoundedButton
                height="35px"
                fontSize="14px"
                minWidth="180px"
                width={useCheckMobile() && "100%"}
                color={resource?.url ? "#42B0FF" : "#FFF"}
                border={resource?.url && "2px solid #42B0FF"}
                backgroundColor={resource?.url ? "#FFF" : "#C4C4C4"}
                padding="0 20px"
                isDisabled={resource?.url ? false : true}
              >
                <RedirectIcon alt="hiperlink" marginRight="8px" width="14px" height="14px" fill={resource?.url ? "#42B0FF" : "#FFF"}/>
                Acessar pedido
              </RoundedButton>
            </a>
          </HStack>
        </VStack>

        <VStack
          alignItems="flex-start"
          marginTop="32px !important"
          fontFamily="Lato"
          fontSize="16px"
        >
          <Subtitle >Descrição</Subtitle>
          <SectionText marginTop="16px !important">
            {resource?.observations || "Nenhuma descrição fornecida."}
          </SectionText>
        </VStack>

        <VStack width="100%" marginTop="32px !important" spacing={4} alignItems="flex-start">
          <Subtitle>Cobertura temporal</Subtitle>
          <SectionText>
            <TemporalCoverage
              value={resource?.coverages?.[0]?.datetimeRanges?.[0]}
              text="Nenhuma cobertura temporal fornecida"
            />
          </SectionText>
        </VStack>

        <VStack width="100%" marginTop="32px !important" spacing={5} alignItems="flex-start">
          <Stack flex="1" >
            <Subtitle>Informações adicionais</Subtitle>
          </Stack>
  
          <Grid width="100%" flex={1} templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
              <StatusIcon alt="estado" width="22px" height="22px" fill="#D0D0D0"/>
              <AddInfoTextBase
                title="Estado"
                text={resource?.status?.name || "Não listado"}
              />
            </GridItem>

            <GridItem colSpan={2} display="flex" alignItems="flex-start" gridGap="8px">
              <UserIcon alt="Pedido feito por" width="22px" height="22px" fill="#D0D0D0"/>
              <AddInfoTextBase
                title="Pedido feito por"
                text={`${resource?.startedBy?.firstName} ${resource?.startedBy?.lastName}` || "Não listado"}
              />
            </GridItem>
          </Grid>
        </VStack>
      </VStack>
    </BaseResourcePage>
  )
}
