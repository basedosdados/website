import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  OrderedList,
  ListItem,
  Link,
} from "@chakra-ui/react";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import BodyText from "../../atoms/Text/BodyText";
import {
  SearchIcon,
  CodeIcon,
  ChartIcon,
  DownloadIcon,
  SparklesIcon,
  LightbulbIcon,
} from "./icons";

const DiscordUrlByLocale = {
  pt: "https://discord.gg/huKWpsVYx4",
  en: "https://discord.gg/tx57ek6zqQ",
  es: "https://discord.gg/nNfQYcmrvM",
};

const WhatsAppCommunityUrl = "https://chat.whatsapp.com/CLLFXb1ogPPDomCM6tQT22";

const SupportEmail = "suporte.bdpro@basedosdados.org";

const AboutLinkProps = {
  color: "#2B8C4D",
  fontWeight: "500",
  textDecoration: "underline",
  _hover: { opacity: 0.8 },
};

// Emphasis inside the welcome copy — Trans injects the text as children.
const Bold = (props) => (
  <Box as="strong" fontWeight="600" color="#252A32" {...props} />
);

// Each feature card keys off about.features.<key>.{title,body}; the icon is the
// card's own accent, so the copy no longer repeats an inline glyph.
const Features = [
  { key: "findData", Icon: SearchIcon },
  { key: "analyze", Icon: CodeIcon },
  { key: "charts", Icon: ChartIcon },
  { key: "export", Icon: DownloadIcon },
];

function SectionHeading({ icon: Icon, children }) {
  return (
    <Flex
      as="h2"
      align="center"
      gap="8px"
      fontFamily="Roboto"
      fontSize="18px"
      fontWeight="600"
      lineHeight="24px"
      color="#252A32"
      marginBottom="16px"
    >
      {Icon && (
        <Icon width="20px" height="20px" fill="#2B8C4D" flexShrink={0} />
      )}
      <Box as="span">{children}</Box>
    </Flex>
  );
}

function FeatureCard({ Icon, title, body, index, mounted }) {
  return (
    <Box
      border="1px solid #E5E7EB"
      borderRadius="12px"
      padding="20px"
      backgroundColor="#FFFFFF"
      opacity={mounted ? 1 : 0}
      transform={mounted ? "translateY(0)" : "translateY(16px)"}
      transition="opacity 0.3s ease, transform 0.3s ease"
      transitionDelay={mounted ? `${index * 90}ms` : "0ms"}
      willChange="opacity, transform"
    >
      <Flex align="center" gap="10px">
        <Icon width="18px" height="18px" fill="#2B8C4D" flexShrink={0} />
        <Box
          as="h3"
          fontFamily="Roboto"
          fontSize="16px"
          fontWeight="600"
          lineHeight="22px"
          color="#252A32"
        >
          {title}
        </Box>
      </Flex>
      <BodyText color="#71757A" marginTop="8px">
        {body}
      </BodyText>
    </Box>
  );
}

export default function AboutContent() {
  const { t } = useTranslation("chatbot");
  const { locale } = useRouter();

  const promptTips = t("about.promptTips", { returnObjects: true });
  const tips = Array.isArray(promptTips) ? promptTips : [];

  // Fade + slide the feature cards in once, staggered — set after first paint
  // so the transition actually runs.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Box
      flex={1}
      minHeight={0}
      overflowY="auto"
      width="100%"
      paddingX={{ base: "16px", md: "24px" }}
      sx={{
        // webkit pseudo-elements only — setting scrollbar-width/color makes
        // Chromium fall back to the native bar and ignore these rules.
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-track": { background: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          background: "#C4C4C4",
          borderRadius: "24px",
        },
      }}
    >
      <Box
        maxWidth="760px"
        marginX="auto"
        paddingTop={{ base: "8px", md: "16px" }}
        paddingBottom="48px"
        display="flex"
        flexDirection="column"
        gap="40px"
      >
        <Box as="header">
          <Box
            as="h1"
            fontFamily="Roboto"
            fontSize={{ base: "28px", md: "32px" }}
            fontWeight="600"
            lineHeight="1.2"
            letterSpacing="-0.01em"
            color="#252A32"
          >
            {t("about.title")}
          </Box>
          <BodyText color="#71757A" marginTop="8px" fontSize="16px">
            {t("about.subtitle")}
          </BodyText>
        </Box>

        <Box as="section">
          <SectionHeading>{t("about.welcomeTitle")}</SectionHeading>
          <Flex direction="column" gap="12px">
            <BodyText color="#71757A">{t("about.welcomeP1")}</BodyText>
            <BodyText color="#71757A">
              <Trans i18nKey="about.welcomeP2" ns="chatbot" components={{ b: <Bold /> }} />
            </BodyText>
            <BodyText color="#71757A">
              <Trans i18nKey="about.welcomeP3" ns="chatbot" components={{ b: <Bold /> }} />
            </BodyText>
            <BodyText color="#71757A">{t("about.welcomeP5")}</BodyText>
            <BodyText color="#71757A">
              <Trans
                i18nKey="about.contact"
                ns="chatbot"
                components={{
                  b: <Bold />,
                  email: <Link href={`mailto:${SupportEmail}`} {...AboutLinkProps} />,
                  discord: (
                    <Link
                      href={DiscordUrlByLocale[locale] || DiscordUrlByLocale.pt}
                      isExternal
                      {...AboutLinkProps}
                    />
                  ),
                  whatsapp: (
                    <Link href={WhatsAppCommunityUrl} isExternal {...AboutLinkProps} />
                  ),
                }}
              />
            </BodyText>
          </Flex>
        </Box>

        <Box as="section">
          <SectionHeading icon={SparklesIcon}>
            {t("about.featuresTitle")}
          </SectionHeading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="12px">
            {Features.map((feature, index) => (
              <FeatureCard
                key={feature.key}
                Icon={feature.Icon}
                index={index}
                mounted={mounted}
                title={t(`about.features.${feature.key}.title`)}
                body={t(`about.features.${feature.key}.body`)}
              />
            ))}
          </SimpleGrid>
        </Box>

        <Box as="section">
          <SectionHeading icon={LightbulbIcon}>
            {t("about.promptGuideTitle")}
          </SectionHeading>
          <BodyText color="#71757A" marginBottom="12px">
            {t("about.promptGuideIntro")}
          </BodyText>
          <OrderedList spacing="10px" margin="0 0 0 20px">
            {tips.map((tip) => (
              <ListItem key={tip}>
                <BodyText as="span" color="#71757A">
                  {tip}
                </BodyText>
              </ListItem>
            ))}
          </OrderedList>
        </Box>
      </Box>
    </Box>
  );
}
