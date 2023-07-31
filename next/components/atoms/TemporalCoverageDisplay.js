import {
  Stack,
  Center,
  Text,
  Progress
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { CalendarComunIcon } from "../../public/img/icons/calendarIcon";
import TimeIcon from "../../public/img/icons/timeIcon";

export function TemporalCoverage ({
  value,
  text,
  iconSettings = {width: "18px", height: "18px", fill: "#D0D0D0"},
  textSettings = {}
}) {
  const [startDate, setStartDate] = useState({})
  const [endDate, setEndDate] = useState({})

  useEffect(() => {
    setStartDate({    
      second:value?.startSecond,
      minute:value?.startMinute,
      hour:value?.startHour,
      day:value?.startDay,
      month:value?.startMonth,
      year:value?.startYear
    })
    setEndDate({    
      second:value?.endSecond,
      minute:value?.endMinute,
      hour:value?.endHour,
      day:value?.endDay,
      month:value?.endMonth,
      year:value?.endYear
    })
  },[value])

  // value = {
  //   startSecond: "30",
  //   startMinute: "24",
  //   startHour: "20",
  //   startDay: "12",
  //   startMonth: "12",
  //   startYear: "2022",
  //   endSecond: "0",
  //   endMinute: "48",
  //   endHour: "8",
  //   endDay: "24",
  //   endMonth: "6",
  //   endYear: "2023",
  // }

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

  function Dates ({ dates, ...props }) {
    const yearMonthDay = []
    const hourMinuteSecond = []

    if(dates.second) hourMinuteSecond.push(`${dates.second}s`)
    if(dates.minute) hourMinuteSecond.push(`${dates.minute}min`)
    if(dates.hour) hourMinuteSecond.push(`${dates.hour}h`)
    if(dates.day) yearMonthDay.push(dates.day)
    if(dates.month) yearMonthDay.push(dates.month)
    if(dates.year) yearMonthDay.push(dates.year)

    yearMonthDay.reverse()
    hourMinuteSecond.reverse()

    if(dates === null) return ""

    return (
      <Center marginRight="10px" {...props}>
        <CalendarComunIcon {...iconSettings} marginRight="6px"/> <TextDate value={yearMonthDay.join("-")}/>
        {hourMinuteSecond.length > 0 && <><TimeIcon {...iconSettings} margin="0 6px 0 8px"/> <TextDate value={hourMinuteSecond.join(" ")}/></>}
      </Center>
    )
  }

  return (
    <Center>
      <Dates dates={startDate}/> ─ <Dates dates={endDate} margin="0 0 0 10px"/>
    </Center>
  )
}

export function TemporalCoverageString({
  value,
  iconSettings = {width: "18px", height: "18px", fill: "#D0D0D0"},
  textSettings = {}
}) {

  let pieces = value.split(" - ")
  let dataStart = pieces[0]
  let dataEnd = pieces[1]

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
      <Center>
        <CalendarComunIcon
          position="relative"
          top="-1px"
          margin="0 6px 0 0"
          width="18px"
          height="18px"
          {...iconSettings}
        />
        <TextData textSettings={textSettings} string={dataStart}/>
      </Center> <span style={{color: "#A3A3A3"}}>─</span> <Center>
        <CalendarComunIcon
          position="relative"
          top="-1px"
          margin="0 6px 0 0"
          width="18px"
          height="18px"
          {...iconSettings}
        />
        <TextData textSettings={textSettings} string={dataEnd}/>
      </Center>
    </Stack>
  )
}

export function TemporalCoverageBar () {

  return (
    <Stack 
      position="relative"  
      width="600px"
    >
      <Progress
        value={80}
        position='absolute'
        height='3px'
        width='full'
        top='10px'
      />
    </Stack>
  )
}