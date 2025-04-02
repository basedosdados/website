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
  Skeleton,
  Tooltip
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from "react";
import Checkbox from "../atoms/Checkbox";
import { ControlledInputSimple } from "./ControlledInput";
import SearchIcon from "../../public/img/icons/searchIcon";
import InfoIcon from "../../public/img/icons/infoIcon";

export function BaseFilterAccordion({
  fieldName,
  children,
  isOpen = null,
  onChange = () => { },
  isHovering = true,
  tooltip = null
}) {
  const [isAccordionOpen, setIsAccordionOpen] = useState(isOpen);

  const handleToggle = () => {
    setIsAccordionOpen((prev) => !prev);
    onChange();
  };

  return (
    <Accordion allowToggle width="100%">
      <AccordionItem border="0px">
        <>
          <Text>
            <AccordionButton
              onClick={handleToggle}
              _hover={isHovering ? { cursor: "pointer", opacity: "0.8" } : "none"}
              padding="0"
              cursor="auto"
            >
              <HStack
                spacing={0}
                gap="8px"
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

                {tooltip && <Tooltip
                  label={tooltip}
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
                  placement="top-end"
                  maxWidth="300px"
                >
                  <InfoIcon 
                    width="14px"
                    height="14px"
                    alt="tip"
                    cursor="pointer"
                    fill="#878A8E"
                  />
                </Tooltip>}
              </HStack>
              <AccordionIcon 
                marginLeft="auto" 
                fontSize="18px" 
                transform={isAccordionOpen ? "rotate(180deg)" : "rotate(0deg)"}
              />
            </AccordionButton>
          </Text>
          {isAccordionOpen && children}
        </>
      </AccordionItem>
    </Accordion>
  );
}

export function CheckboxFilterAccordion({
  fieldName,
  choices = [],
  onChange,
  valuesChecked = [],
  valueField = "id",
  displayField = "name",
  isActive = false,
  canSearch = false,
  isLoading,
  tooltip = null,
  isOpen = true
}) {
  const { t } = useTranslation('search');
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [inputFocus, setInputFocus] = useState(false);

  useEffect(() => {
    if (choices === null || choices.length === 0) return;
    setOptions(choices);
    setSearch("");
  }, [choices]);

  useEffect(() => {
    if (!search) return setOptions(choices);
    const result = choices.filter((c) =>
      c[displayField].toLowerCase().includes(search.toLowerCase())
    );
    setOptions(result);
  }, [search]);

  return (
    <BaseFilterAccordion
      onChange={() => {}}
      isActive={isActive}
      fieldName={fieldName}
      isOpen={isOpen}
      tooltip={tooltip}
      overflowX="hidden"
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
          {canSearch && (
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
          )}
          <VStack
            alignItems="flex-start"
            width="100%"
            maxHeight="400px"
            overflowY="auto"
            height="100%"
            spacing="14px"
            marginTop="0 !important"
          >
            {options.length > 0 &&
              options.map((c) => (
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
                    onChange={(e) => onChange(e.target.value)}
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
