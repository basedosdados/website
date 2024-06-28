import { Box } from "@chakra-ui/react";
import SiteHead from "../atoms/SiteHead";
import Footer from "../molecules/Footer";
import Menu from "../molecules/Menu";

export function MainPageTemplate({
  children,
  backgroundColor = "#FFFFFF",
  cleanTemplate = false,
  userTemplate = false,
  footerTemplate = "default",
  ...style
}) {

  return (
    <Box backgroundColor={backgroundColor}>
      <SiteHead />
      <Menu simpleTemplate={cleanTemplate} userTemplate={userTemplate}/>
      <Box
        paddingTop="70px"
        paddingBottom="50px"
        {...style}
      >
        {children}
      </Box>
      <Footer template={footerTemplate} ocult={cleanTemplate || userTemplate}/>
    </Box>
  );
}
