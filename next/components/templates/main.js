import { Box } from "@chakra-ui/react";
import SiteHead from "../atoms/SiteHead";
import Footer from "../molecules/Footer";
import Menu from "../molecules/Menu";

export function MainPageTemplate({ strapiPages, children }) {
  return (
    <Box backgroundColor="#FAFAFA">
      <SiteHead />
      <Menu strapiPages={strapiPages} />
      <Box paddingTop="130px" paddingBottom="50px">
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
