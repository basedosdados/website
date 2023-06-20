import { Box } from "@chakra-ui/react";
import { useQuery } from "react-query";
import UserContext from "../../context/user";
// import { getUser } from "../../pages/api/user";
import SiteHead from "../atoms/SiteHead";
import Footer from "../molecules/Footer";
import Menu from "../molecules/Menu";

export function MainPageTemplate({
  pages,
  children,
  backgroundColor = "#FFFFFF",
  ...style
}) {

  return (
    // <UserContext.Provider value={data}>
    <UserContext.Provider>
      <Box backgroundColor={backgroundColor}>
        <SiteHead />
        <Menu pages={pages} />
        <Box paddingTop={{ base: "30px", lg: "120px" }} paddingBottom="50px" {...style}>
          {children}
        </Box>
        <Footer pages={pages} />
      </Box>
    </UserContext.Provider>
  );
}
