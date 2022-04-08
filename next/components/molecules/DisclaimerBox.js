import { Text, Stack } from "@chakra-ui/layout";
import SectionText from "../atoms/SectionText";

export function DisclaimerBox({ title, text, children }) {
  return (
    <Stack
      display="flex"
      flexDirection="row"
      padding="10px 12px"
      boxShadow="0 1px 4px 0 rgba(0,0,0, 0.25)"
      borderLeft="3px solid #3AA1EB"
      borderEndRadius="6px"
      marginTop="24px"
      alignItems="center"
    > 
      {!children &&
        <SectionText
          width="100%"
        >
          <b>{title}</b>
          <br />{text}
        </SectionText>
      }
      {children}
    </Stack>
  );
}
