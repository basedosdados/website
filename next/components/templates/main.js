import { Box } from "@chakra-ui/react";
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
    <Box backgroundColor={backgroundColor}>
      <SiteHead />
      <Menu pages={pages} simpleTemplate={cleanTemplate} userTemplate={userTemplate}/>
      <Box
        paddingTop="72px"
        paddingBottom="50px"
        {...style}
      >
        {children}
      </Box>
      <Footer pages={pages} ocult={cleanTemplate || userTemplate}/>
    </Box>
  );
}
