import { useEffect, useState } from "react";
import {
  ModalCloseButton,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import TitleText from "../../atoms/Text/TitleText";
import {
  ModalGeneral,
  Button,
  ExtraInfoTextForm,
} from "../../molecules/uiUserPage";

export default function FeedbackModal({
  isOpen,
  onClose,
  rating,
  onSubmit,
  isSubmitting,
}) {
  const { t } = useTranslation("chatbot");
  const [feedbackText, setFeedbackText] = useState("");
  const isPositive = rating === 1;

  useEffect(() => {
    if (isOpen) {
      setFeedbackText("");
    }
  }, [isOpen, rating]);

  const handleSubmit = () => {
    onSubmit(feedbackText.trim());
  };

  return (
    <ModalGeneral
      isOpen={isOpen}
      onClose={onClose}
      propsModalContent={{
        minWidth: { base: "auto", lg: "520px !important" },
        maxWidth: "520px",
      }}
    >
      <Stack spacing={0} marginBottom="16px">
        <TitleText marginRight="24px">{t("ui.feedback.title")}</TitleText>
        <ModalCloseButton
          fontSize="14px"
          top="34px"
          right="26px"
          _hover={{ backgroundColor: "transparent", opacity: 0.7 }}
          onClick={onClose}
        />
      </Stack>

      <Stack spacing="16px" marginBottom="24px">
        <ExtraInfoTextForm marginBottom="0">
          {t("ui.feedback.detailsLabel")}
        </ExtraInfoTextForm>

        <Textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder={
            isPositive
              ? t("ui.feedback.positivePlaceholder")
              : t("ui.feedback.negativePlaceholder")
          }
          minHeight="120px"
          resize="vertical"
          border="2px solid transparent"
          borderRadius="8px"
          backgroundColor="#EEEEEE"
          color="#464A51"
          fontFamily="Roboto"
          fontSize="14px"
          lineHeight="20px"
          padding="12px 16px"
          _placeholder={{ color: "#71757A", opacity: 1 }}
          _hover={{
            border: "2px solid transparent",
            backgroundColor: "#DEDFE0",
          }}
          _focus={{
            border: "2px solid #0068C5",
            backgroundColor: "#FFF",
            boxShadow: "none",
          }}
        />
      </Stack>

      <Stack
        flexDirection={{ base: "column-reverse", lg: "row" }}
        spacing={0}
        gap="16px"
        width={{base: "100%", lg: "fit-content"}}
        marginLeft={{ base: "0", lg: "auto" }}
      >
        <Button
          isVariant
          width={{base: "100%", lg: "fit-content"}}
          minWidth="120px"
          onClick={onClose}
        >
          {t("ui.cancel")}
        </Button>

        <Button
          width={{base: "100%", lg: "fit-content"}}
          minWidth="120px"
          onClick={handleSubmit}
          isLoading={isSubmitting}
        >
          {t("ui.send")}
        </Button>
      </Stack>
    </ModalGeneral>
  );
}
