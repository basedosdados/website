import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  Box,
  CheckboxGroup,
  VStack,
  Text,
  HStack,
  Skeleton
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from "react";
import Checkbox from "../atoms/Checkbox";
import { ControlledInputSimple } from "./ControlledInput";
import SearchIcon from "../../public/img/icons/searchIcon";

export function BaseFilterAccordion({
  fieldName,
  children,
  isOpen = null,
  onChange = () => { },
  alwaysOpen = false,
  isHovering = true
}) {

  return (
    <Accordion allowToggle width="100%">
      <AccordionItem border="0px">
        {({ isExpanded }) => (
          <>
            <Text>
              <AccordionButton
                onClick={onChange}
                _hover={isHovering ? { cursor: "pointer", opacity: "0.7" } : "none"}
                padding="0"
                cursor="auto"
              >
                <HStack
                  spacing={2}
                  alignContent="baseline"
                  justifyContent="flex-start"
                  width="100%"
                >
                  <Box
                    width="fit-content"
                    fontFamily="Roboto"
                    fontWeight="500"
                    fontSize="16px"
                    color="#252A32"
                  >
                    {fieldName}
                  </Box>
                </HStack>
                {!alwaysOpen ? <AccordionIcon marginLeft="auto" fontSize="18px" /> : <></>}
              </AccordionButton>
            </Text>
            {(isOpen && isOpen === true) || (isOpen == null && isExpanded) ? (
              <>
                {children}
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
}

export function CheckboxFilterAccordion({
  fieldName,
  choices = [],
  onChange,
  onToggle,
  valuesChecked = [],
  alwaysOpen = false,
  valueField = "id",
  displayField = "name",
  isActive = false,
  isOpen = null,
  canSearch = false,
  isLoading
}) {
  const { t } = useTranslation('search');
  const [options , setOptions] = useState([])
  const [search, setSearch] = useState("");
  const [inputFocus, setInputFocus] = useState(false)

  useEffect(() => {
    if (choices === null) return
    if (choices.length === 0) return
    setOptions(choices)
  }, [choices])

  useEffect(() => {
    const allOptions = choices
    if(search === "" || undefined) return setOptions(choices)
    const result = allOptions.filter((c) =>
      c[displayField].toLowerCase().indexOf(search.toLowerCase()) != -1
    )
    setOptions(result)
  }, [search])

  return (
    <BaseFilterAccordion
      onChange={onToggle}
      isActive={isActive}
      fieldName={fieldName}
      isOpen={alwaysOpen ? alwaysOpen : isOpen}
      overflowX="hidden"
      alwaysOpen={alwaysOpen}
    >
      <Skeleton
        width="100%"
        height={isLoading ? "100%" : "40px"}
        margin="12px 0 5px 0"
        borderRadius="6px"
        startColor="#F0F0F0"
        endColor="#F3F3F3"
        isLoaded={isLoading}
      >
        <CheckboxGroup defaultValue={valuesChecked}>
          {canSearch &&
            <VStack padding="0 0 16px" width="100%" alignItems="center">
              <ControlledInputSimple
                width="100%"
                value={search}
                onChange={setSearch}
                inputFocus={inputFocus}
                changeInputFocus={setInputFocus}
                placeholder={t('search_placeholder')}
                fill="#464A51"
                icon={
                  <SearchIcon
                    alt="pesquisar"
                    width="16.8px"
                    height="16.8px"
                    cursor="pointer"
                  />
                }
              />
            </VStack>
          }
          <VStack
            alignItems="flex-start"
            width="100%"
            maxHeight="400px"
            overflowY="auto"
            height="100%"
            spacing="14px"
            marginTop="0 !important"
          >
            {options.length > 0 && options.map((c) => (
              <Text
                as="label"
                key={c[valueField]}
                display="flex"
                width="100%"
                minHeight="20px"
                cursor="pointer"
                gap="2px"
                alignItems="center"
                fontFamily="Roboto"
                fontWeight="400"
                fontSize="14px"
                lineHeight="20px"
                color="#71757A"
                overflow="hidden"
              >
                <Checkbox
                  value={c[valueField]}
                  onChange={(e) => { onChange(e.target.value)}}
                  minWidth="18px"
                  minHeight="18px"
                  maxWidth="18px"
                  maxHeight="18px"
                  marginRight="14px"
                  flexShrink={0}
                />
                <Text
                  as="span"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  marginRight="2px"
                  flex="1 1 1"
                >
                  {c[displayField]}
                </Text>
                <Text as="span" flexShrink={0}>
                  {c["count"] ? `(${c["count"]})` : `(0)`}
                </Text>
              </Text>
            ))}
          </VStack>
        </CheckboxGroup>
      </Skeleton>
    </BaseFilterAccordion>
  );
}

