import { Stack } from "@chakra-ui/layout";
import SectionText from "../atoms/SectionText";

export function DisclaimerBox({ title, text, children, ...style }) {
  return (
    <Stack
      display="flex"
      flexDirection="row"
      padding="10px 12px"
      boxShadow="0 1px 4px 0 rgba(0,0,0, 0.15)"
      borderLeft="3px solid #42B0FF"
      borderEndRadius="6px"
      marginTop="24px"
      alignItems="center"
      {...style}
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
