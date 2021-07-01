import { Center, Box, VStack, HStack, Flex, Link } from "@chakra-ui/react";

export function Card({
  children,
  icons = [],
  spacing = 5,
  padding = "30px 30px 30px 30px",
  link,
}) {
  return (
    <Link href={link}>
      <Box
        cursor="pointer"
        width="400px"
        height="330px"
        borderRadius="10px"
        filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))"
        backgroundColor="#FFFFFF"
        padding={padding}
        borderRadius="10px"
      >
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          spacing={spacing}
          position="relative"
          height="100%"
        >
          <HStack
            justifyContent="center"
            alignItems="center"
            minHeight="50px"
            paddingBottom="20px"
          >
            {icons}
          </HStack>
          {children}
        </Flex>
      </Box>
    </Link>
  );
}
