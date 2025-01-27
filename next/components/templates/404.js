import {
  Center,
} from "@chakra-ui/react";
import FourOFourImage from "../../public/img/fourOFour";

export default function FourOFour({ children, ...props }) {
  return (
    <Center
      width="100%"
      height="100%"
      alignItems="center"
      flexDirection="column"
      {...props}
    >
      <FourOFourImage
        widthImage="256px"
        heightImage="256px"
      />
      {children}
    </Center>
  )
}