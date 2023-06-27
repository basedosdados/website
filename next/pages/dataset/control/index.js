import {
  Box,
  VStack,
  Stack,
} from "@chakra-ui/react";
import { MainPageTemplate } from "../../../components/templates/main";
import authUser from "../../../middlewares/authUser";

export function getServerSideProps(context) {
  return authUser(context, "/dataset")
}

export default function Control({ pages }) {

  return (
    <MainPageTemplate pages={pages} paddingX="24px">
      <Stack
        gridGap={{base:"40px", lg: "100px"}}
        paddingTop={{ base: "80px", lg: "0px" }}
        width="100%"
        maxWidth="1264px"
        justify="space-between"
        direction={{ base: "column", lg: "row" }}
        margin="auto"
      >
      </Stack>
    </MainPageTemplate>
  )
}
