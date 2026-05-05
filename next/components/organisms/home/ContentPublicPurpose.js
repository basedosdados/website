import {
  Stack,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";
import { triggerGAEvent } from "../../../utils";
import Link from "../../atoms/Link";
import Display from "../../atoms/Text/Display";
import TitleText from "../../atoms/Text/TitleText";
import LabelText from "../../atoms/Text/LabelText";
import Button from "../../atoms/Button";

export default function ContentPublicPurpose() {
  const { t } = useTranslation("home");

  return (
    <Stack
      position="relative"
      alignItems="center"
      width="100%"
      padding="120px 24px 70px"
      boxSizing="border-box"
      zIndex="10"
    >
      <Stack 
        position="relative"
        width="100%"
        maxWidth="1440px"
        height="100%"
        alignItems="flex-start"
        spacing={0}
      >
        <Text
          as="h3"
          display="flex"
          flexDirection="column"
          width="100%"
        >
          <Display
            as="span"
            typography={isMobileMod() ? "small" : "large"}
          >
            {t("section_public_purpose.title")}
          </Display>
        </Text>
        <TitleText
          as="h4"
          maxWidth="1120px"
          color="#71757A"
          paddingTop="16px"
          typography={isMobileMod() ? "small" : "medium"}
        >
          {t("section_public_purpose.content")}
        </TitleText>
        <Stack
          flexDirection={isMobileMod() ? "column" : "row"}
          gap="16px"
          padding="32px 0 8px"
          spacing={0}
        >
          <Link
            href="/search"
            target="_self"
            onClick={() => triggerGAEvent("navigating_to_data", "hero-home")}
          >
            <Button
              height="54px"
              width={isMobileMod() ? "100%" : "fit-content"}
              justifyContent={{base: "center", md: "flex-start"}}
            >
              <LabelText typography={isMobileMod() ? "medium" : "x-large"} color="currentColor">
                {t("organized_data_first_button")}
              </LabelText>
            </Button>
          </Link>
          <Link
            href="/services"
            target="_self"
            onClick={() => triggerGAEvent("navigating_to_services", "hero-home")}
          >
            <Button
              height="54px"
              width={isMobileMod() ? "100%" : "fit-content"}
              justifyContent={{base: "center", md: "flex-start"}}
              isVariant
            >
              <LabelText typography={isMobileMod() ? "medium" : "x-large"} color="currentColor">
                {t("organized_data_second_button")}
              </LabelText>
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Stack>
  )
}