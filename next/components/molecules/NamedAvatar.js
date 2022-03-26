import { Avatar } from "@chakra-ui/avatar";
import { HStack, Text, VStack } from "@chakra-ui/layout";
import SectionText from "../atoms/SectionText";

export function NamedAvatar({ src, name, position, ...props }) {
  return (
    <HStack spacing={3} {...props}>
      <VStack spacing={0} align="flex-end">
        <Text>{name}</Text>
        <SectionText letterSpacing="0.05rem">{position}</SectionText>
      </VStack>
      <Avatar 
        backgroundColor="white"
        height="70px"
        src={src} 
      />
    </HStack>
  );
}
