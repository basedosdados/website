import {
  Center,
  Text
} from "@chakra-ui/react";
import ImageNotFound from "../../public/img/notFoundImage";

export default function FourOhFour({ ...props }) {
  return (
    <Center
      width="100%"
      height="100%"
      alignItems="center"
      flexDirection="column"
      {...props}
    >
      <ImageNotFound
        transform="translateX(-26px)"
        widthImage="320px"
        heightImage="320px"
      />
      <Text
        fontSize="80px"
        color="#252A32"
        fontFamily="ubuntu"
        fontWeight="bold"
      >404</Text>
    </Center>
  )
}