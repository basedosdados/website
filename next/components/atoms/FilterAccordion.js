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
import Title from "./Title";

export function BaseFilterAccordion({ fieldName, children }) {
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

export function CheckboxFilterAccordion({
  fieldName,
  choices,
  onChange,
  values,
  valueField = "id",
  displayField = "display_name",
}) {
  return (
    <BaseFilterAccordion fieldName={fieldName}>
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
  value,
  valueField = "id",
  displayField = "display_name",
}) {
  return (
    <BaseFilterAccordion fieldName={fieldName}>
      <VStack spacing={5} paddingTop="10px" alignItems="flex-start">
        {choices.map((c) => (
          <Title
            fontSize="14px"
            cursor="pointer"
            fontWeigth={c[valueField] === value ? "700" : "400"}
            onClick={() => onChange(c[valueField])}
          >
            {c[displayField]}
          </Title>
        ))}
      </VStack>
    </BaseFilterAccordion>
  );
}
