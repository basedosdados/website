import {
  Stack,
} from "@chakra-ui/react";
import TitleText from "../atoms/Text/TitleText";
import BodyText from "../atoms/Text/BodyText";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import PointsIcon from "../../public/img/icons/pointsIcon";

export default function MentionSection({
  content = "",
  author = "",
  position = "",
  ...props
}) {
  return (
    <Stack
      width="100%"
      backgroundColor="#252A32"
      marginTop="80px !important"
      padding={{base: "40px 24px", md: "80px 24px"}}
      spacing={0}
      {...props}
    >
      <Stack
        width="100%"
        maxWidth="1440px"
        flexDirection="column"
        margin="0 auto !important"
        spacing={0}
        gap="24px"
      >
        <PointsIcon fill="#2B8C4D" width="25px" height="22px"/>
        <TitleText
          maxWidth="900px"
          typography={isMobileMod() ? "small" : "large"}
          color="#FFF"
        >
          {content}
        </TitleText>
        <Stack spacing={0}>
          <BodyText typography="large" color="#FFF">
            {author}
          </BodyText>
          <BodyText typography="large" color="#EEEEEE">
            {position}
          </BodyText>
        </Stack>
      </Stack>
    </Stack>
  )
}
