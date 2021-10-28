import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import UserContext from "../../context/user";
import { getUser } from "../../pages/api/user";
import SiteHead from "../atoms/SiteHead";
import Footer from "../molecules/Footer";
import Menu from "../molecules/Menu";

export function MainPageTemplate({
  strapiPages,
  children,
  backgroundColor = "#FFFFFF",
}) {
  const { data = null, isLoading } = useQuery("user", getUser);

  return (
    <UserContext.Provider value={data}>
      <Box backgroundColor={backgroundColor}>
        <SiteHead />
        <Menu strapiPages={strapiPages} />
        <Box paddingTop={{ base: "30px", lg: "120px" }} paddingBottom="50px">
          {children}
        </Box>
        <Footer strapiPages={strapiPages} />
      </Box>
    </UserContext.Provider>
  );
}
