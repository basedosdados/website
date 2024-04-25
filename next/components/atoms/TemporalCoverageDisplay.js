import {
  Stack,
  Center,
  Text,
  Progress,
  Box,
  Badge,
  Tooltip,
  useBoolean,
} from "@chakra-ui/react";
import { useState, useEffect, Children } from "react";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook"
import { CalendarComunIcon } from "../../public/img/icons/calendarIcon";
import TimeIcon from "../../public/img/icons/timeIcon";
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
  const [flag, setFlag] = useBoolean()

  const TextData = ({ string, ...style }) => {
    return (
      <Text
        color="#252A32"
        fontSize="14px"
        lineHeight="24px"
        letterSpacing="0.5px"
        fontWeight="300"
        fontFamily="Lato"
        {...style}
      >
        {string}
      </Text>
    )
  }

  value = !!value ? Object.values(value) : null

  if(!value) return <TextData string="Não Listado"/>
  if(!value.length) return <TextData string="Não Listado"/>

  let dateStart = ""
  let dateMid = ""
  let dateEnd = ""

  if (value.length === 2) {
    dateStart = value[0]
    dateEnd = value[1]
  }

  if (value.length === 3) {
    dateStart = value[0]
    dateMid = value[1]
    dateEnd = value[2]
  }

  const checkoutBdpro = (value) => {
    if(value === "open") return 
    window.open("/precos", "_blank")
  }

  const BadgeContainer = ({
    value,
    bool = false,
    mouseOn = null,
    mouseOff = null,
    ...props
  }) => {
    const toggleTag = value === "open"

    return (
      <Badge
        position="absolute"          
        backgroundColor={toggleTag ? "#D5E6DC" : "#FAEEAE" }
        color={toggleTag ? "#1C703A" : "#7D6A00" }
        padding="2px 10px"
        borderRadius="12px"
        onClick={() => checkoutBdpro(value)}
        _hover={toggleTag ? "" : {opacity: 0.7}}
        opacity={bool && 0.7}
        onMouseEnter={mouseOn}
        onMouseLeave={mouseOff}
        cursor="pointer"
      >{toggleTag ? 
        "GRÁTIS" :
        <Box
          display="flex"
          alignItems="center"
          gap="4px"
        >PAGO
          <RedirectIcon
            display={bool ? "flex" : "none"}
            position="relative"
            top="-1px"
            fill="#7D6A00"
          />
        </Box>}
      </Badge>
    )
  }

  const TooltipContent = ({children, text, firstValue, lastValue, ...props}) => {
    return (
      <Tooltip
        label={
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {text}
            <Box display="flex" gap="12px" marginTop="6px">
              <Center
                position="relative"
                left="-1px"
              >
                <CalendarComunIcon
                  position="relative"
                  top="-1px"
                  margin="0 6px 0 0"
                  width="20px"
                  height="20px"
                  fill="#A3A3A3"
                />
                <TextData string={firstValue?.date} color="#FFF" fontWeight="400"/>
              </Center> ─
              <Center
                position="relative"
                left="-1px"
              >
                <CalendarComunIcon
                  position="relative"
                  top="-1px"
                  margin="0 6px 0 0"
                  width="20px"
                  height="20px"
                  fill="#A3A3A3"
                />
                <TextData string={lastValue?.date} color="#FFF" fontWeight="400"/>
              </Center>
            </Box>
          </Box>
        }
        hasArrow
        bg="#2A2F38"
        fontSize="16px"
        fontWeight="400"
        padding="5px 16px 6px"
        marginTop="10px"
        color="#FFF"
        borderRadius="6px"
        placement="top"
        top="-4px"
        fontFamily="lato"
        {...props}
      >
        {children}
      </Tooltip>
    )
  }

  return (
    <Stack 
      position="relative"  
      width="100%"
      margin="50px 0 80px !important"
      spacing={0}
    >
      <Progress
        value={value.length === 2 ? 100 : useCheckMobile() ? 54 :70}
        height="3px"
        marginLeft="10px"
        width="100%"
        backgroundColor="#9C8400"
        colorScheme={dateStart?.type === "closed" ? "yellowPro" : "greenBD"}
      />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        position="absolute"
        top="-7px"
        gap="12px"
      >
        <Box
          width="16px"
          height="16px"
          borderRadius="50%"
          backgroundColor={dateStart?.type === "open" ? "#2B8C4D" : "#9C8400"}
        />
        <Center
          position="relative"
          left="-1px"
        >
          <CalendarComunIcon
            position="relative"
            top="-1px"
            margin="0 6px 0 0"
            width="20px"
            height="20px"
            fill={dateStart?.type === "open" ? "#2B8C4D" : "#9C8400"}
          />
          <TextData string={dateStart?.date}/>
        </Center>
      </Box>

      {dateMid !== "" &&
        <Box
          display="flex"
        >
          <TooltipContent
            text="Acesso liberado entre"
            firstValue={dateStart}
            lastValue={dateMid}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              position="absolute"
              left={useCheckMobile() ? "54%" : "70%"}
              top="-41px"
              gap="12px"
            >
              <Box
                position="relative"
                top="34px"
                width="16px"
                height="16px"
                borderRadius="50%"
                cursor="pointer"
                backgroundColor={dateMid?.type === "open" ? "#2B8C4D" : "#9C8400"}
              />

              <BadgeContainer value={dateMid?.type}/>
            </Box>
          </TooltipContent>
          <Center
            position="absolute"
            left={useCheckMobile() ? "36%" : "60%"}
            top="24px"
            minWidth="120px"
          >
            <CalendarComunIcon
              position="relative"
              top="-1px"
              margin="0 6px 0 0"
              width="20px"
              height="20px"
              fill={dateMid?.type === "open" ? "#2B8C4D" : "#9C8400"}
            />
            <TextData string={dateMid?.date}/>
          </Center>
        </Box>
      }

      <Box
        display="flex"
      >
        <TooltipContent
          text={dateEnd?.type === "open" ? "Acesso liberado entre" : "Assine a BD PAGO para liberar entre"}
          firstValue={dateEnd?.type === "open" ? dateStart : dateEnd?.type === "closed" ? dateStart : dateMid}
          lastValue={dateEnd}
          isOpen={flag}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            position="absolute"
            left="99%"
            top="-41px"
            gap="12px"
          >
            <Box
              position="relative"
              top="34px"
              width="16px"
              height="16px"
              borderRadius="50%"
              cursor="pointer"
              backgroundColor={dateEnd?.type === "open" ? "#2B8C4D" : "#9C8400"}
              onClick={() => checkoutBdpro(dateEnd?.type)}
              onMouseEnter={setFlag.on}
              onMouseLeave={setFlag.off}
            />

            <BadgeContainer
              value={dateEnd?.type}
              bool={flag}
              mouseOn={setFlag.on}
              mouseOff={setFlag.off}
            />
          </Box>
        </TooltipContent>
        <Center
          position="absolute"
          top="24px"
          minWidth="120px"
          left={useCheckMobile() ? "75%" : "90%"}
        >
          <CalendarComunIcon
            position="relative"
            top="-1px"
            margin="0 6px 0 0"
            width="20px"
            height="20px"
            fill={dateEnd?.type === "open" ? "#2B8C4D" : "#9C8400"}
          />
          <TextData string={dateEnd?.date}/>
        </Center>
      </Box>
    </Stack>
  )
}