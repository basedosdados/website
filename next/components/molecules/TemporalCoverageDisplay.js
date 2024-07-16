import {
  Stack,
  HStack,
  Center,
  Text,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { CalendarComunIcon } from "../../public/img/icons/calendarIcon";
import RedirectIcon from "../../public/img/icons/redirectIcon";

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
      width="350px"
      height="65px"
      alignItems="normal"
      spacing={0}
    >
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
        <Box flex={3} display={values?.["0"] ? "" : "none"}>
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
                right={0}
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
        label="Faça o upgrade para liberar o período"
      >
        <Box flex={2} display={values?.["3"] ? "" : "none"}>
          <Box
            as="a"
            cursor="pointer"
            width="100%"
            height="24px"
            backgroundColor="#E4F2FF"
            fontFamily="Roboto"
            fontWeight="500"
            fontSize="12px"
            lineHeight="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            letterSpacing="0.2px"
            color="#0068C5"
            fill="#0068C5"
            gap="10px"
            marginBottom="10px"
            padding="6px 16px"
            _hover={{
              color:"#4F9ADC",
              fill:"#4F9ADC",
              backgroundColor:"#E4F2FF"
            }}
            href="/precos"
            target="_blank"
          >
            PAGO
            <RedirectIcon
              width="12px"
              height="12px"
            />
          </Box>

          <Box
            position="relative"
            width="100%"
            borderBottom="solid 3px #0068C5"
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
                right={0}
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