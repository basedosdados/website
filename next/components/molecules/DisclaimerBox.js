import { Text, Stack } from "@chakra-ui/layout";

export function DisclaimerBox({ title, text, children }) {
  return (
    <Stack
      display="flex"
      flexDirection="row"
      fontSize="14px"
      fontWeight="300"
      fontFamily="Lato"
      letterSpacing="0.5px"
      padding="10px 12px"
      boxShadow="0 1px 4px 0 rgba(0,0,0, 0.25)"
      borderLeft="3px solid #3AA1EB"
      borderEndRadius="6px"
      marginTop="20px"
      alignItems="center"
    > 
      {!children &&
        <Text
          fontFamily="Lato"
          lineHeight="24px"
          letterSpacing="0.5px"
          fontWeight="300"
          fontSize="14px"
          width="100%"
        >
          <b>{title}</b>
          <br />{text}
        </Text>
      }
      {children}
    </Stack>
  );
}
