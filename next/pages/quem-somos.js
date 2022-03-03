import {
  Box,
  Flex,
  Image,
  VStack,
  HStack,
} from "@chakra-ui/react";
import BigTitle from "../components/atoms/BigTitle";
import SectionText from "../components/atoms/SectionText";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";
  
export async function getStaticProps(context) {
  return await withPages();
}
  
export default function QuemSomos({ pages }) {
  return (
  <MainPageTemplate pages={pages}>
    <HStack
      paddingTop={{ base: "50px", lg: "0px" }}
      width="80%"
      justify="space-between"
      direction={{ base: "column", lg: "row" }}
      margin="auto"
    >
      <VStack maxWidth={{ base: "90%", lg: "45%" }}>
        <Box contentAlign="flex-start">
          <BigTitle paddingBottom="40px">
            Quem somos
          </BigTitle>
          <SectionText fontSize="14px" fontWeight="300">
            Adicionar texto
          </SectionText>
        </Box>
      </VStack>
      <Image height="px" width="px" src="" />
    </HStack>
  </MainPageTemplate>
  )
}