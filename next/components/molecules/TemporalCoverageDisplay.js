import {
  Stack,
  HStack,
  Center,
  Text,
  Box,
  Tooltip,
  useDisclosure,
  ModalCloseButton
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import cookies from "js-cookie";
import { CalendarComunIcon } from "../../public/img/icons/calendarIcon";
import { SectionPrice } from "../../pages/precos";
import { ModalGeneral } from "./uiUserPage";
import RedirectIcon from "../../public/img/icons/redirectIcon";
import CheckIcon from "../../public/img/icons/checkIcon";

export function TemporalCoverage ({
  value,
  text,
  iconSettings = {width: "18px", height: "18px", fill: "#D0D0D0"},
  textSettings = {}
}) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    setStartDate(value?.start)
    setEndDate(value?.end)
  },[value])

  const TextDate = ({ value }) => {
    return (
      <Text
        color="#252A32"
        fontSize="14px"
        lineHeight="24px"
        letterSpacing="0.5px"
        fontWeight="300"
        fontFamily="Lato"
        {...textSettings}
      >
        {value}
      </Text>
    ) 
  }

  if(!value) return <TextDate value={text}/>
  if(startDate === null && endDate === null) return <TextDate value={text}/>

  function Dates ({ date, ...props }) {
    if(date === null) return ""

    return (
      <Center marginRight="10px" {...props}>
        <CalendarComunIcon {...iconSettings} marginRight="6px"/> <TextDate value={date}/>
      </Center>
    )
  }

  return (
    <Center>
      <Dates date={startDate}/> ─ <Dates date={endDate} margin="0 0 0 10px"/>
    </Center>
  )
}

export function TemporalCoverageString({
  value,
  iconSettings = {width: "18px", height: "18px", fill: "#D0D0D0"},
  textSettings = {}
}) {

  let pieces = value.split(" - ")
  let dateStart = pieces[0]
  let dateEnd = pieces[1]

  const TextData = ({textSettings, string}) => {
    return (
      <Text
        color="#252A32"
        fontSize="14px"
        lineHeight="24px"
        letterSpacing="0.5px"
        fontWeight="300"
        fontFamily="Lato"
        {...textSettings}
      >
        {string}
      </Text>
    )
  }

  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      gap="8px"
      spacing={0}
    >
      {value === "" ?
        <span style={{color: "#A3A3A3"}}>─</span>
      :
        <>
          <Center>
            <CalendarComunIcon
              position="relative"
              top="-1px"
              margin="0 6px 0 0"
              width="18px"
              height="18px"
              {...iconSettings}
            />
            <TextData textSettings={textSettings} string={dateStart}/>
          </Center> <span style={{color: "#A3A3A3"}}>─</span> <Center>
            <CalendarComunIcon
              position="relative"
              top="-1px"
              margin="0 6px 0 0"
              width="18px"
              height="18px"
              {...iconSettings}
            />
            <TextData textSettings={textSettings} string={dateEnd}/>
          </Center>
        </>
      }
    </Stack>
  )
}

export function TemporalCoverageBar ({ value }) {
  const [values, setValues] = useState({})
  const plansModal = useDisclosure()

  const isUserPro = () => {
    let user
    if(cookies.get("userBD")) user = JSON.parse(cookies.get("userBD"))

    if(user?.internalSubscription?.edges?.[0]?.node?.isActive === true) return true
    return false
  }

  const TextData = ({ string, ...style }) => {
    return (
      <Text
        color="#464A51"
        fontSize="14px"
        lineHeight="20px"
        fontWeight="400"
        fontFamily="Roboto"
        {...style}
      >
        {string}
      </Text>
    )
  }

  useEffect(() => {
    if (value === null || value === undefined) return setValues(null)

    let newValue = {}

    if(value["2"]?.type === "closed")  newValue["3"] = value["2"].date

    if(value["0"]?.type === "open") newValue["0"] = value["0"].date
    if(value["0"]?.type === "closed")  newValue["2"] = value["0"].date

    if(value["1"]?.type === "open") newValue["1"] = value["1"].date
    if(value["1"]?.type === "closed")  newValue["3"] = value["1"].date

    setValues(newValue)
  }, [value])

  if(values === null) return <TextData string="Não informado"/>

  return (
    <HStack 
      position="relative"  
      width="100%"
      maxWidth="325px"
      height="65px"
      alignItems="normal"
      spacing={0}
    >
      <ModalGeneral
        isOpen={plansModal.isOpen}
        onClose={plansModal.onClose}
        propsModalContent={{
          minWidth: "fit-content"
        }}
      >
        <Stack spacing={0} marginBottom="16px">
          <Text
            width="100%"
            fontFamily="Roboto"
            fontWeight="400"
            color="#252A32"
            fontSize="24px"
            textAlign="center"
            lineHeight="40px"
          >
            Compare os planos
          </Text>
          <ModalCloseButton
            fontSize="14px"
            top="34px"
            right="26px"
            _hover={{backgroundColor: "transparent", color:"#0B89E2"}}
          />
        </Stack>

        <SectionPrice/>
      </ModalGeneral>

      <Tooltip
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
        maxWidth="160px"
        label="Acesso liberado para o período"
      >
        <Box
          flex={3}
          marginRight={values?.["3"] ? "" : {base:"24px !important", lg: "0"}}
          display={values?.["0"] ? "" : "none"}
        >
          <Box
            width="100%"
            height="24px"
            backgroundColor="#D5E8DB"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="12px"
            lineHeight="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            letterSpacing="0.2px"
            color="#2B8C4D"
            marginBottom="10px"
            padding="6px 16px"
          >
            GRÁTIS
          </Box>
          <Box
            position="relative"
            width="100%"
            borderBottom="solid 3px #2B8C4D"
            marginBottom="10px"
          >
            <Box position="absolute" width="100%">
              <Box
                position="absolute"
                display="flex"
                alignItems="start"
                flexDirection="column"
                left={0}
                top="-3px"
              >
                <Box
                  width="8px"
                  height="8px"
                  backgroundColor="#2B8C4D"
                  borderRadius="50%"
                />
                <TextData
                  position="absolute"
                  top="14px"
                  width="max-content"
                  string={values?.["0"]}
                />
              </Box>
            </Box>

            <Box position="absolute" width="100%">
              <Box
                position="absolute"
                display="flex"
                alignItems="center"
                flexDirection="column"
                right={values?.["3"] ? "-4px" : "0"}
                top="-3px"
                zIndex={1}
              >
                <Box
                  width="8px"
                  height="8px"
                  backgroundColor="#2B8C4D"
                  borderRadius="50%"
                />
                <TextData
                  position="absolute"
                  top="14px"
                  width="max-content"
                  string={values?.["1"]}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Tooltip>

      <Tooltip
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
        maxWidth="160px"
        label={isUserPro() ? "Acesso liberado para o período" : "Faça o upgrade para liberar o período"}
      >
        <Box
          flex={2}
          marginRight={{base:"24px !important", lg: "0"}}  display={values?.["3"] ? "" : "none"}
        >
          <Box
            as="a"
            cursor={isUserPro() ? "default" : "pointer"}
            width="100%"
            height="24px"
            backgroundColor={isUserPro() ? "#D5E8DB" : "#E4F2FF"}
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="12px"
            lineHeight="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            letterSpacing="0.2px"
            color={isUserPro() ? "#2B8C4D" : "#0068C5"}
            fill={isUserPro() ? "#2B8C4D" : "#0068C5"}
            gap="10px"
            marginBottom="10px"
            padding="6px 16px"
            marginLeft="2px"
            _hover={{
              color: isUserPro() ? "#2B8C4D" : "#0057A4",
              fill: isUserPro() ? "#2B8C4D" : "#0057A4",
              backgroundColor: isUserPro() ? "#D5E8DB" : "#E4F2FF"
            }}
            onClick={() => {
              if(isUserPro()) return
              plansModal.onOpen()}
            }
          >
            PAGO
            {isUserPro() ?
              <CheckIcon
                width="20px"
                height="20px"
              />
              :
              <RedirectIcon
                width="12px"
                height="12px"
              />
            }
          </Box>

          <Box
            position="relative"
            width="100%"
            borderBottom="solid 3px"
            borderColor={isUserPro() ? "#22703E" : "#0068C5"}
            marginBottom="10px"
          >
            <Box position="absolute" width="100%" display={values?.["2"] ? "" : "none"}>
              <Box
                position="absolute"
                display="flex"
                alignItems="start"
                flexDirection="column"
                left={0}
                top="-3px"
              >
                <Box
                  width="8px"
                  height="8px"
                  backgroundColor="#0068C5"
                  borderRadius="50%"
                />
                <TextData
                  position="absolute"
                  top="14px"
                  width="max-content"
                  string={values?.["2"]}
                />
              </Box>
            </Box>

            <Box position="absolute" width="100%">
              <Box
                position="absolute"
                display="flex"
                alignItems="center"
                flexDirection="column"
                top="-3px"
                right="-4px"
              >
                <Box
                  width="8px"
                  height="8px"
                  backgroundColor={isUserPro() ? "#22703E" : "#0068C5"}
                  borderRadius="50%"
                />
                <TextData
                  position="absolute"
                  top="14px"
                  width="max-content"
                  string={values?.["3"]}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Tooltip>
    </HStack>
  )
}