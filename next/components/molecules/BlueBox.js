import { Text, VStack } from "@chakra-ui/layout";

export function BlueBox({ title, text }) {
  return (
    <VStack width="100%" spacing={3} alignItems="flex-start">
      <Text
        fontFamily="Lato"
        lineHeight="24px"
        letterSpacing="0.1em"
        fontWeight="400"
        fontSize="14px"
        backgroundColor="rgba(130, 202, 255, 0.15);"
        padding="15px 20px"
        borderRadius="20px"
        width="100%"
      >
        <b>{title}</b>
        <br /> {text}
      </Text>
    </VStack>
  );
}
