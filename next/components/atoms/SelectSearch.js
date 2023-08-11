import {
  Stack,
  Box,
  Text,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import FuzzySearch from "fuzzy-search";

export default function SelectSearch({
  value,
  onChange,
  keyId = "_id",
  displayName = "name",
  options = [],
  hasNode = true
}) {
  const timerRef = useRef();
  const [optionsArray, setOptionsArray] = useState(options)
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if(value !== "" && inputValue == "") {
      const findOption = () => {
        if(hasNode) return options.find((option) => option.node[`${keyId}`] === value)
        return options.find((option) => option[`${keyId}`] === value)
      }
      setInputValue(hasNode ? findOption().node[`${displayName}`] : findOption()[`${displayName}`])
    }
    if(value === "") setInputValue("")
  }, [value])

  const mouseEnterEvent = () => {
    setIsOpen(true)
  }
  const mouseLeaveEvent = () => {
    timerRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 100)
  }
  const listMouseEnterEvent = () => {
    clearTimeout(timerRef.current)
    timerRef.current = undefined
    setIsOpen(true)
  }
  const listMouseLeaveEvent = () => {
    setIsOpen(false)
  }

  const searcher = new FuzzySearch(
    options, hasNode ? [`node.${displayName}`] : [`${displayName}`], {sort: true}
  )

  useEffect(() => {
    const result = searcher.search(inputValue)
    setOptionsArray(result)
  }, [inputValue])

  return (
    <Stack
      spacing={0}
    >
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onMouseEnter={mouseEnterEvent}
        onMouseLeave={mouseLeaveEvent}
      />
      <Box
        position="absolute"
        zIndex={10}
        backgroundColor="#FFF"
        top="75px"
        display={isOpen ? "block" : "none"}
        width="100%"
        height="fit-content"
        maxHeight="400px"
        overflow="auto"
        border="2px solid #FAFAFA"
        padding="8px 16px"
        onMouseEnter={listMouseEnterEvent}
        onMouseLeave={listMouseLeaveEvent}
      >
        <Text
          onClick={() => {
            setInputValue("")
            onChange("")
          }}
          cursor="pointer"
        >
          ...
        </Text>
        {optionsArray.map((elm) => {
          return (
            <Text
              cursor="pointer"
              onClick={() => {
                setInputValue(hasNode ? elm.node[`${displayName}`] : elm[`${displayName}`])
                setIsOpen(false)
                onChange(hasNode ? elm.node[`${keyId}`] : elm[`${keyId}`])
              }}
              value={hasNode ? elm.node[`${keyId}`] : elm[`${keyId}`]}
            >
              {hasNode ? elm.node[`${displayName}`] : elm[`${displayName}`]}
            </Text>
          )
        })}
      </Box>
    </Stack>
  )
}
