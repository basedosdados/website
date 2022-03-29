import { Avatar } from "@chakra-ui/avatar";
import { HStack, Text, VStack } from "@chakra-ui/layout";
import Title from "../atoms/Title"
import SectionText from "../atoms/SectionText";

export function NamedAvatar({ src, name, position, ...props }) {
  return (
    <HStack spacing={3} {...props}>
      <VStack spacing={0} align="flex-end">
        <Title
          fontWeight="400"
          color="#2A2532"
        >
          {name}
        </Title>
        <Text
          fontFamily="Ubuntu"
          fontSiz="14px"
          fontWeight="300"
          color="#252A32"
          paddingTop="3px"
          letterSpacing="0.5px"
        >
          {position}
        </Text>
      </VStack>
      <Avatar 
        backgroundColor="white"
        height="75px"
        src={src} 
      />
    </HStack>
  );
}
