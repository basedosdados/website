import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  CheckboxGroup,
  VStack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect } from "react/cjs/react.production.min";
import { limitTextSize } from "../../utils";
import Title from "./Title";

export function BaseFilterAccordion({
  fieldName,
  children,
  overflowX = "scroll",
  isOpen = null,
  isActive = false,
  onChange = () => {},
}) {
  return (
    <Accordion ex allowToggle width="100%">
      <AccordionItem border="0px">
        {({ isExpanded }) => (
          <>
            <Text>
              <AccordionButton
                onClick={onChange}
                border={isActive ? "2px solid #3AA1EB" : "1px solid #DEDFE0"}
                color={isActive ? "#3AA1EB" : null}
                borderRadius="15px"
              >
                <Box
                  flex="1"
                  textAlign="left"
                  fontFamily="Lato"
                  fontWeight="700"
                  fontSize="16px"
                >
                  {fieldName}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Text>
            {console.log(isOpen, isExpanded)}
            {(isOpen && isOpen === true) || (isOpen == null && isExpanded) ? (
              <VStack
                overflowY="auto"
                overflowX={overflowX + " !important"}
                maxHeight="300px"
                pb={4}
                pt={2}
                pl={4}
                width="100%"
                alignItems="flex-start"
              >
                {children}
              </VStack>
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
  choices,
  onChange,
  onToggle,
  values,
  valueField = "id",
  displayField = "display_name",
  isActive = false,
  isOpen = null,
}) {
  return (
    <BaseFilterAccordion
      onChange={onToggle}
      isActive={isActive}
      fieldName={fieldName}
      isOpen={isOpen}
    >
      <CheckboxGroup onChange={(val) => onChange(val)} value={values}>
        <VStack alignItems="flex-start">
          {choices.map((c) => (
            <Checkbox value={c[valueField]}>{c[displayField]}</Checkbox>
          ))}
        </VStack>
      </CheckboxGroup>
    </BaseFilterAccordion>
  );
}

export function FilterAccordion({
  fieldName,
  choices,
  onChange,
  onToggle,
  value,
  valueField = "id",
  displayField = "display_name",
  isOpen = null,
  isActive = false,
}) {
  return (
    <BaseFilterAccordion
      isActive={isActive}
      isOpen={isOpen}
      onChange={onToggle}
      overflowX="hidden"
      fieldName={fieldName}
    >
      <VStack
        overflowX="none !important"
        spacing={5}
        paddingTop="10px"
        alignItems="flex-start"
      >
        {choices.map((c) => (
          <Tooltip label={c[displayField]} aria-label={c[displayField]}>
            <Title
              fontSize="14px"
              cursor="pointer"
              fontWeigth={c[valueField] === value ? "700" : "400"}
              onClick={() => onChange(c[valueField])}
            >
              {c[displayField]}
            </Title>
          </Tooltip>
        ))}
      </VStack>
    </BaseFilterAccordion>
  );
}
