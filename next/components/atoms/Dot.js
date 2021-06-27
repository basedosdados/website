import { Box } from "@chakra-ui/layout";

export function Dot({ radius = 1 }) {
  return (
    <Box
      width={radius}
      height={radius}
      borderRadius={radius * 10}
      backgroundColor="#6F6F6F"
    />
  );
}
