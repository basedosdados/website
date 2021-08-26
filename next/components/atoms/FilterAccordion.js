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
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { limitTextSize } from "../../utils";
import ControlledInput from "./ControlledInput";
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
                borderRadius="13px"
              >
                <Box
                  flex="1"
                  textAlign="left"
                  fontFamily="Lato"
                  fontWeight="700"
                  fontSize="16px"
                  letterSpacing="0.1em"
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
                pr={4}
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
  canSearch = false,
}) {
  const [search, setSearch] = useState("");

  return (
    <BaseFilterAccordion
      onChange={onToggle}
      isActive={isActive}
      fieldName={fieldName}
      isOpen={isOpen}
    >
      <CheckboxGroup onChange={(val) => onChange(val)} value={values}>
        {canSearch ? (
          <VStack paddingBottom="10px" width="100%" alignItems="center">
            <ControlledInput
              color="black"
              value={search}
              onChange={setSearch}
              inputBackgroundColor="#FAFAFA"
              inputStyle={{
                height: "30px",
                fontSize: "14px",
                width: "100%",
                margin: "0",
                borderRadius: "20px",
              }}
              rightIcon={
                <Box width="20px" height="20px" position="relative">
                  <Image
                    cursor="pointer"
                    layout="fill"
                    objectFit="contain"
                    src="/_nxt/img/icon_search.png"
                  />
                </Box>
              }
            />
          </VStack>
        ) : (
          <></>
        )}
        <VStack alignItems="flex-start" overflowY="scroll">
          {choices
            .filter(
              (c) =>
                c[displayField].toLowerCase().indexOf(search.toLowerCase()) !=
                -1
            )
            .map((c) => (
              <Checkbox
                fontFamily="Lato"
                fontWeight="700"
                value={c[valueField]}
                color="#7D7D7D"
                letterSpacing="0.1em"
                fontSize="16px"
              >
                {c[displayField]}
              </Checkbox>
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
