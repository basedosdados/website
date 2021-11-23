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
  HStack,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { limitTextSize } from "../../utils";
import ControlledInput from "./ControlledInput";
import SectionText from "./SectionText";
import Title from "./Title";

export function BaseFilterAccordion({
  fieldName,
  children,
  overflowX = "scroll",
  isOpen = null,
  isActive = false,
  onChange = () => {},
  bdPlus = null,
  alwaysOpen = false,
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
                _hover={alwaysOpen ? { cursor: "inherit" } : null}
                borderRadius="13px"
              >
                <HStack
                  spacing={2}
                  alignContent="baseline"
                  justifyContent="center"
                  width="100%"
                >
                  <Box
                    flex="1"
                    width="100%"
                    textAlign="left"
                    fontFamily="Lato"
                    fontWeight="700"
                    fontSize="15px"
                    letterSpacing="0.1em"
                  >
                    {fieldName}
                  </Box>
                  {bdPlus ? (
                    <Image src="/img/logo_plus.png" height="20px" />
                  ) : (
                    <></>
                  )}
                </HStack>
                {!alwaysOpen ? <AccordionIcon marginLeft="auto" /> : <></>}
              </AccordionButton>
            </Text>
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
  alwaysOpen = false,
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
      isOpen={alwaysOpen ? alwaysOpen : isOpen}
      overflowX="hidden"
      alwaysOpen={alwaysOpen}
    >
      <CheckboxGroup onChange={(val) => onChange(val)} value={values}>
        {canSearch ? (
          <VStack paddingBottom="10px" width="100%" alignItems="center">
            <ControlledInput
              color="black"
              value={search}
              onChange={setSearch}
              inputBackgroundColor="#FFFFFF"
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
                    src="/img/icon_search.png"
                  />
                </Box>
              }
            />
          </VStack>
        ) : (
          <></>
        )}
        <VStack
          overflowX="hidden !important"
          alignItems="flex-start"
          overflowY="scroll"
          width="100%"
        >
          {(canSearch
            ? choices.filter(
                (c) =>
                  c[displayField].toLowerCase().indexOf(search.toLowerCase()) !=
                  -1
              )
            : choices
          ).map((c) => (
            <Checkbox
              fontFamily="Lato"
              fontWeight="700"
              value={c[valueField]}
              color="#7D7D7D"
              colorScheme="green"
              letterSpacing="0.1em"
            >
              {c[displayField]}
            </Checkbox>
          ))}
        </VStack>
      </CheckboxGroup>
    </BaseFilterAccordion>
  );
}

export function RangeFilterAccordion({
  fieldName,
  onChange,
  onToggle,
  isOpen = null,
  alwaysOpen = false,
  isActive = false,
  maxValue = null,
  minValue = null,
}) {
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(null);

    if (min > max) return setError("Intervalo inválido!");
    if (min && max && max - min > 300) return setError("Intervalo muito longo");
    if (!min && !max) return;

    onChange({ min, max });
  }, [min, max]);

  useEffect(() => {
    setMin(minValue);
    setMax(maxValue);
  }, []);

  return (
    <BaseFilterAccordion
      isOpen={alwaysOpen ? alwaysOpen : isOpen}
      alwaysOpen={alwaysOpen}
      isActive={isActive}
      onChange={onToggle}
      overflowX="hidden"
      fieldName={fieldName}
    >
      <VStack align="flex-start">
        <HStack padding="10px 0px" width="100%">
          <ControlledInput
            value={min}
            onChange={setMin}
            width="100%"
            placeholder="Min"
          />
          <ControlledInput
            value={max}
            onChange={setMax}
            width="100%"
            placeholder="Max"
          />
        </HStack>
        {error ? (
          <SectionText
            paddingLeft="20px"
            color="red"
            fontWeight="bold"
            fontSize="12px"
          >
            {error}
          </SectionText>
        ) : (
          <></>
        )}
      </VStack>
    </BaseFilterAccordion>
  );
}

export function FilterAccordion({
  fieldName,
  choices,
  onChange,
  onToggle,
  value,
  bdPlus = null,
  valueField = "id",
  displayField = "display_name",
  isOpen = null,
  alwaysOpen = false,
  isActive = false,
}) {
  return (
    <BaseFilterAccordion
      isOpen={alwaysOpen ? alwaysOpen : isOpen}
      alwaysOpen={alwaysOpen}
      isActive={isActive}
      onChange={onToggle}
      overflowX="hidden"
      bdPlus={bdPlus}
      fieldName={fieldName}
    >
      <VStack
        width="100%"
        spacing={1}
        overflowX="hidden !important"
        alignItems="flex-start"
      >
        {choices.map((c) => (
          <Title
            fontSize="14px"
            cursor="pointer"
            fontWeigth={c[valueField] === value ? "700" : "400"}
            padding="5px 10px"
            borderRadius="5px"
            transform="translateX(-10px)"
            zIndex="100"
            position="relative"
            width="100%"
            backgroundColor={
              c[valueField] === value ? "#F5F5F5" : "transparent"
            }
            onClick={() => onChange(c[valueField])}
          >
            {c[displayField]}
          </Title>
        ))}
      </VStack>
    </BaseFilterAccordion>
  );
}
