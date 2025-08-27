import {
  Box,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from 'next-i18next';
import { isMobileMod } from "../../../hooks/useCheckMobile.hook";
import { triggerGAEvent } from "../../../utils";
import Link from "../../atoms/Link";
import Display from "../../atoms/Text/Display";
import TitleText from "../../atoms/Text/TitleText";
import LabelText from "../../atoms/Text/LabelText";
import Button from "../../atoms/Button";

export default function Hero({ locale }) {
  const { t } = useTranslation("home");

  return (
    <VStack
      alignItems="center"
      width="100%"
      marginTop={isMobileMod() ? "" : "50px"}
      zIndex="10"
      position="relative"
    >
      <VStack
        position="relative"
        width="100%"
        maxWidth="1440px"
        height="100%"
        spacing={0}
        padding="40px 24px"
        alignItems="flex-start"
      >
        <Stack spacing={0} width="100%">
          <Text
            as="h1"
            display="flex"
            flexDirection="column"
            width="100%"
          >
            <Display as="span" typography={isMobileMod() ? "small" : "large"}>{t("organized_data")}</Display>
            <Display as="span" typography={isMobileMod() ? "small" : "large"}>{t("reliable_analysis")}</Display>
          </Text>
          <TitleText
            as="h2"
            maxWidth="1120px"
            color="#71757A"
            paddingTop="16px"
            typography={isMobileMod() ? "small" : "medium"}
          >
            {t("description_organized_data")}
          </TitleText>
          <Stack
            flexDirection={isMobileMod() ? "column" : "row"}
            gap="16px"
            padding="32px 0"
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

        <Stack
          width="100%"
          padding="40px 0"
          spacing={0}
        >
          <Box
            width="100%"
            height={{base: "100%", md: "780px"}}
            display="flex"
            alignItems="center"
            backgroundColor="#FFFFFF"
            boxShadow="0px 1.6px 16px rgba(100, 96, 103, 0.16)"
            borderRadius="16px"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{ width: '100%', height: 'auto', borderRadius: '16px' }}
              onError={(e) => {
                console.error('Erro ao carregar o vídeo', e);
              }}
            >
              <source src={`https://storage.googleapis.com/basedosdados-website/video/platform-presentation-${locale}.mp4`} type="video/mp4" />
            </video>
          </Box>
        </Stack>
      </VStack>
    </VStack>
  );
}