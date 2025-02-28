import { VStack, Stack, Box, Text } from "@chakra-ui/react";
import { SimpleTable } from "../components/atoms/SimpleTable";
import { useTranslation } from "react-i18next";
import TitleTextComponent from "../components/atoms/Text/TitleText";
import BodyText from "../components/atoms/Text/BodyText";

export default function PrivacyPolicy() {
  const { t } = useTranslation("terms");

  const TitleText = ({ children, ...props }) => {
    return (
      <TitleTextComponent typography="small" {...props}>
        {children}
      </TitleTextComponent>
    );
  };

  const SecText = ({ children, ...props }) => {
    return (
      <BodyText typography="large" color="#464A51" {...props}>
        {children}
      </BodyText>
    );
  };

  return (
    <VStack
      display="flex"
      flexDirection="column"
      spacing={0}
      alignItems="start"
      gap="40px"
    >
      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <SecText>{t("PP.header.subContent1")}</SecText>
        <SecText>{t("PP.header.subContent2")}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t("PP.term1.title")}</TitleText>
        <Box>
          <SecText>{t("PP.term1.subContent1")}</SecText>
          <SecText>{t("PP.term1.subContent2")}</SecText>
        </Box>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t("PP.term2.title")}</TitleText>
        <Box>
          <SecText>{t("PP.term2.subContent1")}</SecText>
          <SecText>{t("PP.term2.subContent2")}</SecText>
        </Box>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t("PP.term3.title")}</TitleText>

        <VStack width="100%" spacing={0} alignItems="flex-start">
          <VStack
            width="100%"
            spacing="8px"
            alignItems="flex-start"
            marginTop="8px !important"
          >
            <SecText>{t("PP.term3.subContent1")}</SecText>
            <SecText>{t("PP.term3.subContent2")}</SecText>

            <Stack maxWidth="100%">
              <SimpleTable
                valuesTable={{
                  whiteSpace: "break-spaces",
                  headers: {
                    header1: t("PP.term3.subContent3.headers.header1"),
                    header2: t("PP.term3.subContent3.headers.header2"),
                    header3: t("PP.term3.subContent3.headers.header3"),
                  },
                }}
                headers={["Nome do Cookie", "Retenção", "Finalidade"]}
                values={[
                  [
                    t("PP.term3.subContent3.row1.name"),
                    t("PP.term3.subContent3.row1.retention"),
                    t("PP.term3.subContent3.row1.purpose"),
                  ],
                  [
                    t("PP.term3.subContent3.row2.name"),
                    t("PP.term3.subContent3.row2.retention"),
                    t("PP.term3.subContent3.row2.purpose"),
                  ],
                ]}
              />
            </Stack>

            <SecText>{t("PP.term3.subContent4")}</SecText>
            <SecText>{t("PP.term3.subContent5")}</SecText>
          </VStack>
        </VStack>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t("PP.term4.title")}</TitleText>
        <SecText>{t("PP.term4.subContent1")}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t("PP.term5.title")}</TitleText>
        <SecText>{t("PP.term5.subContent1")}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t("PP.term6.title")}</TitleText>
        <SecText>{t("PP.term6.subContent1")}</SecText>
      </VStack>

      <VStack
        display="flex"
        flexDirection="column"
        spacing={0}
        alignItems="start"
        gap="8px"
      >
        <TitleText>{t("PP.term7.title")}</TitleText>
        <SecText>{t("PP.term7.subContent1")}</SecText>
      </VStack>

      <SecText>{t("PP.finalNote")}</SecText>
    </VStack>
  );
}
