import { Avatar } from "@chakra-ui/avatar";
import { HStack, Text, VStack } from "@chakra-ui/layout";

export function NamedAvatar({ src, name, position, ...props }) {
  return (
    <HStack spacing={3} {...props}>
      <VStack spacing={0} align="flex-end">
        <Text
          fontFamily="Ubuntu"
          fontSize="18px"
          fontWeight="400"
          letterSpacing="0.1px"
          color="#2A2532"
        >
          {name}
        </Text>
        <Text
          fontFamily="Ubuntu"
          fontSize="14px"
          fontWeight="300"
          color="#252A32"
          paddingTop="4px"
          letterSpacing="0.3px"
        >
          {position}
        </Text>
      </VStack>
      <Avatar
        name=""
        backgroundColor="#FFF"
        height="75px"
        src={src} 
      />
    </HStack>
  );
}
