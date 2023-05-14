import {
  Center,
  Spinner
} from "@chakra-ui/react";

export default function LoadingSpin ({
  isLoading = true,
  ...props
}) {
  if(!isLoading) return null

  return (
    <Center
      width="100%"
      height="100%"
    >
      <Spinner
        width="180px"
        height="180px"
        borderWidth="6px"
        color="#2B8C4D"
        emptyColor="#CECECE"
        speed="1s"
        {...props}
      />
    </Center>
  )
}