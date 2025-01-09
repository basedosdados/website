import {
  Center,
  Text
} from "@chakra-ui/react";
import InternalErrorImage from "../../public/img/internalError";

export default function InternalError({ children, ...props }) {
  return (
    <Center
      width="100%"
      height="100%"
      alignItems="center"
      flexDirection="column"
      {...props}
    >
      <InternalErrorImage
        widthImage="320px"
        heightImage="320px"
      />
      {children}
    </Center>
  )
}