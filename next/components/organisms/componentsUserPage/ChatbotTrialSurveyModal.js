import { useEffect, useState } from "react";
import { Box, Stack, ModalCloseButton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import TitleText from "../../atoms/Text/TitleText";
import BodyText from "../../atoms/Text/BodyText";
import { ModalGeneral, Button } from "../../molecules/uiUserPage";

const ChatbotTrialSurveyOptions = [
  { value: "already_knew_bd", labelKey: "alreadyKnewBd" },
  { value: "instagram_ads", labelKey: "instagramAds" },
  { value: "facebook_ads", labelKey: "facebookAds" },
  { value: "google_ads", labelKey: "googleAds" },
  { value: "google_search", labelKey: "googleSearch" },
  { value: "linkedin", labelKey: "linkedin" },
  { value: "referral", labelKey: "referral" },
  { value: "newsletter", labelKey: "newsletter" },
  { value: "other", labelKey: "other" },
];

const SurveyOptionBaseProps = {
  borderRadius: "16px",
  cursor: "pointer",
  width: { base: "100%", sm: "fit-content" },
  maxWidth: "100%",
  fontFamily: "Roboto",
  fontWeight: "500",
  fontSize: { base: "16px", md: "18px" },
  lineHeight: { base: "24px", md: "28px" },
};

export default function ChatbotTrialSurveyModal({ isOpen, onSubmit, onSkip }) {
  const { t } = useTranslation("user");
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setSelected("");
    setError("");
  }, [isOpen]);

  function handleContinue() {
    if (!selected) {
      setError(t("survey.error"));
      return;
    }
    onSubmit(selected);
  }

  return (
    <ModalGeneral
      isOpen={isOpen}
      onClose={onSkip}
      propsModal={{ id: "modal-chatbot-trial-survey", closeOnOverlayClick: false }}
      propsModalContent={{
        width: "100%",
        maxWidth: "656px",
      }}
    >
      <Stack spacing={0} marginBottom="16px">
        <Box height="24px" />
        <ModalCloseButton
          fontSize="14px"
          top="28px"
          right="26px"
          _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
        />
      </Stack>

      <Stack spacing={0} gap="16px" marginBottom="24px">
        <TitleText>{t("username.chatbotTrialSurvey.title")}</TitleText>
        <BodyText color="#464A51">
          {t("username.chatbotTrialSurvey.description")}
        </BodyText>

        {error && (
          <BodyText color="#BF3434">{error}</BodyText>
        )}

        <Stack
          flexDirection="row"
          flexWrap="wrap"
          width="100%"
          gap="12px"
          spacing={0}
          paddingTop="8px"
        >
          {ChatbotTrialSurveyOptions.map((option) => {
            const isSelected = selected === option.value;
            return (
              <Box
                key={option.value}
                as="button"
                type="button"
                onClick={() => {
                  setSelected(option.value);
                  setError("");
                }}
                {...SurveyOptionBaseProps}
                border={isSelected ? "2px solid #2B8C4D" : "1px solid #DEDFE0"}
                backgroundColor={isSelected ? "#D5E8DB" : "#FFF"}
                padding={isSelected ? "11px" : "12px"}
                color={isSelected ? "#2B8C4D" : "#464A51"}
              >
                {t(`username.chatbotTrialSurvey.options.${option.labelKey}`)}
              </Box>
            );
          })}
        </Stack>
      </Stack>

      <Stack
        flexDirection={{ base: "column-reverse", lg: "row" }}
        spacing={0}
        gap="16px"
        width="100%"
        justifyContent="end"
      >
        <Button isVariant width={{ base: "100%", lg: "fit-content" }} onClick={onSkip}>
          {t("survey.skip")}
        </Button>
        <Button width={{ base: "100%", lg: "fit-content" }} onClick={handleContinue}>
          {t("survey.continue")}
        </Button>
      </Stack>
    </ModalGeneral>
  );
}
