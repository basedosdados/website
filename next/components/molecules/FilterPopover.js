import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  InputRightElement,
  Stack,
  HStack,
  Checkbox,
  Text,
  VStack,
  Heading,
  Input,
  Button,
} from "@chakra-ui/react";

function FilterInput({ label, onChange, value }) {
  return (
    <VStack alignItems="flex-start" spacing={2}>
      <Heading fontFamily="ubuntu" fontWeight="500" fontSize="12px">
        {label.toUpperCase()}
      </Heading>
      <Input borderRadius="14.1587px" />
    </VStack>
  );
}

export function FilterPopover({}) {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <InputRightElement
          width={{ base: "100px", md: "150px" }}
          backgroundColor="#eee"
          padding="10px"
          height="60%"
          borderRadius="10px"
          transform="translateY(32%)"
          marginRight="10px"
          cursor="pointer"
          children={
            <Text fontFamily="Ubuntu" fontWeight="500" fontSize="15px">
              + filtros
            </Text>
          }
        />
      </PopoverTrigger>
      <PopoverContent width={{base:"300px", lg:"500px"}} maxWidth="500px">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody
          width="100%"
          padding={{base:"20px", md:"30px"}}
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
        >
          <VStack alignItems="flex-start" width="100%" spacing={5}>
            <HStack width="100%" justifyContent="space-between">
              <FilterInput label="Organizações" />
              <FilterInput label="Temas" />
            </HStack>
            <HStack width="100%" justifyContent="space-between">
              <FilterInput label="Abrangência Temporal" />
              <FilterInput label="Abrangência Geográfica" />
            </HStack>
            <Checkbox
              fontFamily="ubuntu"
              padding="10px 0px"
              defaultIsChecked
            >
              Somente conjuntos disponíveis no datalake
            </Checkbox>
            <HStack width="100%" justifyContent="space-between">
              <FilterInput label="Tamanho do Arquivo (MB)" />
              <FilterInput label="Periodicidade" />
            </HStack>
            <HStack
              justifyContent="flex-end"
              alignItems="flex-end"
              width="100%"
            >
              <Button
                color="#A8A8A8"
                variant="ghost"
                fontFamily="ubuntu"
                letterSpacing="0.1em"
                borderRadius="23.1818px"
                width="120px"
                fontSize="14px"
              >
                Limpar
              </Button>
              <Button
                backgroundColor="#42B0FF"
                fontFamily="ubuntu"
                letterSpacing="0.1em"
                borderRadius="23.1818px"
                colorScheme="blue"
                width="120px"
                boxShadow="0px 4.63636px 4.63636px rgba(0, 0, 0, 0.25);"
                fontSize="14px"
              >
                Filtrar
              </Button>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
