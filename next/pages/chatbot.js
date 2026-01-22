
import {
  Flex,
  HStack,
  Stack
} from "@chakra-ui/react";
import Head from "next/head";
import Sidebar from "../components/organisms/chatbot/Sidebar";
import Search from "../components/organisms/chatbot/Search";

export default function Chatbot() {
  return (
    <HStack
      width="100%"
      minHeight="100vh"
      spacing={0}
    >
      <Head>
        <title>Chatbot - Basedosdados</title>
        <meta
          property="og:title"
          content="Chatbot - Basedosdados"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Chatbot - Basedosdados"
          key="ogdesc"
        />
      </Head>
      <HStack
        spacing={0}
        width="100%"
        backgroundColor="#FFFFFF"
        height="100%"
        display="flex"
      >
        <Sidebar />
        <Flex
          flex={1}
          width="100%"
          height="100vh"
          padding="24px"
          overflow="hidden"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            width="100%"
            height="100%"
            maxWidth="1440px"
            boxSizing="border-box"
            spacing={0}
          >
            <Search />
          </Stack>
        </Flex>
      </HStack>
    </HStack>
  )
}