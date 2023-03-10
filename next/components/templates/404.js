import {
  Center,
  Text
} from "@chakra-ui/react";
import FourOhFourImage from "../../public/img/fourOhFour";

export default function FourOhFour({ children, ...props }) {
  return (
    <Center
      width="100%"
      height="100%"
      alignItems="center"
      flexDirection="column"
      {...props}
    >
      <FourOhFourImage
        transform="translateX(-26px)"
        widthImage="320px"
        heightImage="320px"
      />
      {children}
    </Center>
  )
}