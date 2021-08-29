import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import UserContext from "../../context/user";
import { getUser } from "../../pages/api/user";
import SiteHead from "../atoms/SiteHead";
import Footer from "../molecules/Footer";
import Menu from "../molecules/Menu";

export function MainPageTemplate({ strapiPages, children }) {
  const { data = null, isLoading } = useQuery("user", getUser);

  return (
    <UserContext.Provider value={data}>
      <Box backgroundColor="#FAFAFA">
        <SiteHead />
        <Menu strapiPages={strapiPages} />
        <Box paddingTop="130px" paddingBottom="50px">
          {children}
        </Box>
        <Footer strapiPages={strapiPages} />
      </Box>
    </UserContext.Provider>
  );
}
