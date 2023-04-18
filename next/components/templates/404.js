import {
  Center,
  Text
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
        transform="translateX(-26px)"
        widthImage="320px"
        heightImage="320px"
      />
      {children}
    </Center>
  )
}