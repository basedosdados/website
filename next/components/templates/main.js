import { Box } from "@chakra-ui/react";
import Footer from "../molecules/Footer";
import Menu from "../molecules/Menu";

export function MainPageTemplate({
  children,
  backgroundColor = "#FFFFFF",
  cleanTemplate = false,
  userTemplate = false,
  footerTemplate = "default",
  locale,
  ...style
}) {

  return (
    <Box 
      backgroundColor={backgroundColor}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      <Menu simpleTemplate={cleanTemplate} userTemplate={userTemplate}/>
      <Box
        paddingTop="70px"
        paddingBottom="50px"
        flex={1}
        {...style}
      >
        {children}
      </Box>
      <Footer template={footerTemplate} ocult={cleanTemplate || userTemplate}/>
    </Box>
  );
}
