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
} from "@chakra-ui/react";

export function FilterAccordion({ fieldName, children }) {
  return (
    <Accordion allowToggle width="100%">
      <AccordionItem border="0px">
        <Text>
          <AccordionButton border="1px solid #DEDFE0" borderRadius="15px">
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
        <AccordionPanel overflowY="scroll" maxHeight="300px" pb={4}>
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export function SelectFilterAccordion({
  fieldName,
  choices,
  onChange,
  values,
  valueField = "id",
  displayField = "display_name",
}) {
  return (
    <FilterAccordion fieldName={fieldName}>
      <CheckboxGroup onChange={(val) => onChange(val)} defaultValue={values}>
        <VStack alignItems="flex-start">
          {choices.map((c) => (
            <Checkbox value={c[valueField]}>{c[displayField]}</Checkbox>
          ))}
        </VStack>
      </CheckboxGroup>
    </FilterAccordion>
  );
}
