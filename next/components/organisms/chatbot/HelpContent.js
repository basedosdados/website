import { Box, Link, UnorderedList, ListItem } from "@chakra-ui/react";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import TitleText from "../../atoms/Text/TitleText";
import BodyText from "../../atoms/Text/BodyText";
import LabelText from "../../atoms/Text/LabelText";
import DownloadIcon from "../../../public/img/icons/downloadIcon";
import ThumbUpIcon from "../../../public/img/icons/thumbUpIcon";
import ThumbDownIcon from "../../../public/img/icons/thumbDownIcon";
import { CopyIcon } from "../../../public/img/icons/copyIcon";

const DiscordUrlByLocale = {
  pt: "https://discord.gg/huKWpsVYx4",
  en: "https://discord.gg/tx57ek6zqQ",
  es: "https://discord.gg/nNfQYcmrvM",
};

const WhatsAppCommunityUrl =
  "https://chat.whatsapp.com/CLLFXb1ogPPDomCM6tQT22";

const SupportEmail = "suporte.bdpro@basedosdados.org";

const InlineIconProps = {
  as: "span",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "text-bottom",
  width: "18px",
  height: "18px",
  marginX: "2px",
};

const HelpLinkProps = {
  color: "#2B8C4D",
  fontWeight: "500",
  textDecoration: "underline",
  _hover: { opacity: 0.8 },
};

const HelpListProps = {
  spacing: "12px",
  margin: "0 0 0 20px",
  paddingLeft: "0",
  stylePosition: "outside",
};

function InlineIcon({ icon: Icon }) {
  return (
    <Box {...InlineIconProps}>
      <Icon width="16px" height="16px" fill="currentColor" />
    </Box>
  );
}

function HelpSection({ title, children }) {
  return (
    <Box as="section">
      <LabelText
        as="h2"
        typography="large"
        marginBottom="12px"
      >
        {title}
      </LabelText>
      {children}
    </Box>
  );
}

function HelpList({ items }) {
  return (
    <UnorderedList {...HelpListProps}>
      {items.map((item) => (
        <ListItem key={item}>
          <BodyText as="span">{item}</BodyText>
        </ListItem>
      ))}
    </UnorderedList>
  );
}

export default function HelpContent() {
  const { t } = useTranslation("chatbot");
  const { locale } = useRouter();
  const promptTips = t("help.promptTips", { returnObjects: true });
  const tips = Array.isArray(promptTips) ? promptTips : [];
  const capabilitiesRaw = t("help.capabilities", { returnObjects: true });
  const capabilities = Array.isArray(capabilitiesRaw) ? capabilitiesRaw : [];

  return (
    <Box
      flex={1}
      minHeight={0}
      overflowY="auto"
      width="100%"
      paddingX={{ base: "4px", md: "24px" }}
      sx={{
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          background: "#C4C4C4",
          borderRadius: "24px",
        },
        scrollbarWidth: "thin",
        scrollbarColor: "#C4C4C4 transparent",
      }}
    >
      <Box
        maxWidth="720px"
        marginX="auto"
        paddingBottom="48px"
        display="flex"
        flexDirection="column"
        gap="28px"
      >
        <Box>
          <TitleText
            as="h1"
            typography="large"
            marginBottom="8px"
          >
            {t("help.title")}
          </TitleText>
          <BodyText color="#71757A">
            {t("help.subtitle")}
          </BodyText>
        </Box>

        <HelpSection title={t("help.welcomeTitle")}>
          <BodyText marginBottom="12px">{t("help.welcomeP1")}</BodyText>
          <BodyText marginBottom="12px">{t("help.welcomeP2")}</BodyText>
          <BodyText marginBottom="12px">{t("help.welcomeP3")}</BodyText>
          <BodyText marginBottom="12px">{t("help.welcomeP4")}</BodyText>
          <Box marginBottom="12px">
            <HelpList items={capabilities} />
          </Box>
          <BodyText marginBottom="12px">{t("help.welcomeP5")}</BodyText>
          <BodyText>
            <Trans
              i18nKey="help.contact"
              ns="chatbot"
              components={{
                email: (
                  <Link
                    href={`mailto:${SupportEmail}`}
                    {...HelpLinkProps}
                  />
                ),
                discord: (
                  <Link
                    href={DiscordUrlByLocale[locale] || DiscordUrlByLocale.pt}
                    isExternal
                    {...HelpLinkProps}
                  />
                ),
                whatsapp: (
                  <Link
                    href={WhatsAppCommunityUrl}
                    isExternal
                    {...HelpLinkProps}
                  />
                ),
              }}
            />
          </BodyText>
        </HelpSection>

        <HelpSection title={t("help.featuresTitle")}>
          <BodyText marginBottom="12px">{t("help.dataSources")}</BodyText>
          <BodyText marginBottom="12px">{t("help.suggestedQuestions")}</BodyText>
          <BodyText marginBottom="12px">
            <Trans
              i18nKey="help.download"
              ns="chatbot"
              components={{
                download: <InlineIcon icon={DownloadIcon} />,
              }}
            />
          </BodyText>
          <BodyText marginBottom="12px">
            <Trans
              i18nKey="help.copyResults"
              ns="chatbot"
              components={{
                copy: <InlineIcon icon={CopyIcon} />,
              }}
            />
          </BodyText>
          <BodyText>
            <Trans
              i18nKey="help.feedback"
              ns="chatbot"
              components={{
                up: <InlineIcon icon={ThumbUpIcon} />,
                down: <InlineIcon icon={ThumbDownIcon} />,
              }}
            />
          </BodyText>
        </HelpSection>

        <HelpSection title={t("help.promptGuideTitle")}>
          <BodyText marginBottom="12px">{t("help.promptGuideIntro")}</BodyText>
          <HelpList items={tips} />
        </HelpSection>
      </Box>
    </Box>
  );
}
