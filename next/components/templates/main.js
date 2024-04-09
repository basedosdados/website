import { Box } from "@chakra-ui/react";
// import UserContext from "../../context/user";
// import { useQuery } from "react-query";
import SiteHead from "../atoms/SiteHead";
import Footer from "../molecules/Footer";
import Menu from "../molecules/Menu";

export function MainPageTemplate({
  pages,
  children,
  backgroundColor = "#FFFFFF",
  cleanTemplate = false,
  userTemplate = false,
  ...style
}) {

  return (
    // <UserContext.Provider value={data}>
      <Box backgroundColor={backgroundColor}>
        <SiteHead />
        <Menu pages={pages} simpleTemplate={cleanTemplate} userTemplate={userTemplate}/>
        <Box
          paddingTop={{ base: "30px", lg: "120px" }}
          paddingBottom="50px"
          {...style}
        >
          {children}
        </Box>
        <Footer pages={pages} ocult={cleanTemplate || userTemplate}/>
      </Box>
    // </UserContext.Provider>
  );
}
