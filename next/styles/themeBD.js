import { extendTheme } from "@chakra-ui/react";

const themeBD = extendTheme({
  colors: {
    "greenBD.500": "#2B8C4D",
    "yellowPro.500" : "#9C8400",
    "blueBD.500": "#0D99FC"
  },
  components: {
    Progress: {
      baseStyle: {
        filledTrack: {
          bg: "blueBD.500",
        },
      },
    },
  },
})

export default themeBD
