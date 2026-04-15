
import {
  Stack,
  Image
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";
import Display from "../../atoms/Text/Display";
import TitleText from "../../atoms/Text/TitleText";

export default function ProductivityDataAnalysis() {
  const { t } = useTranslation("home");

  return (
    <Stack
      width="100%"
      maxWidth="1440px"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      padding="120px 24px 80px"
      spacing={0}
      margin="0 auto"
    >
      <Display
        as="h3"
        typography={isMobileMod() ? "small" : "large"}
        width="100%"
        textAlign="center"
      >
        {t("productivity_data_analysis.title")}
      </Display>
      <TitleText
        as="h4"
        width="100%"
        color="#71757A"
        padding="16px 0 24px"
        textAlign="center"
        typography={isMobileMod() ? "small" : "medium"}
      >
        {t("productivity_data_analysis.subtitle")}
      </TitleText>
      <Image
        alt="cruzamentos"
        src="https://storage.googleapis.com/basedosdados-website/images/image_cruzamento.png"
        width="100%"
        height="100%"
        maxWidth="1060px"
        maxHeight="443px"
        objectFit="contain"
        loading="lazy"
        paddingY="40px"
      />
    </Stack>
  )
}
