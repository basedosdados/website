import { HStack, Stack, VStack, Box } from "@chakra-ui/react";
import Link from "../atoms/Link";
import { isMobileMod } from "../../hooks/useCheckMobile.hook";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Display from "../atoms/Text/Display";
import LabelText from "../atoms/Text/LabelText";
import BodyText from "../atoms/Text/BodyText";

import YoutubeIcon from "../../public/img/icons/youtubeIcon";
import XIcon from "../../public/img/icons/xIcon";
import BlueskyIcon from "../../public/img/icons/blueskyIcon";
import DiscordIcon from "../../public/img/icons/discordIcon";
import GithubIcon from "../../public/img/icons/githubIcon";
import LinkedinIcon from "../../public/img/icons/linkedinIcon";
import WhatsAppIcon from "../../public/img/icons/whatsAppIcon";
import TelegramIcon from "../../public/img/icons/telegramIcon";
import LanguageSelector from "../atoms/LanguageSelector";

function SectionCategories({ title, children, ...props }) {
  return (
    <VStack spacing={0} alignItems="flex-start" {...props}>
      <BodyText
        typography="small"
        color="#FFF"
        paddingBottom={{ base: "24px", lg: "16px" }}
      >
        {title}
      </BodyText>
      <Stack spacing="10px">{children}</Stack>
    </VStack>
  );
}

const IconKey = {
  width: "24px",
  height: "24px",
  fill: "#FFF",
};

function SocialLink({ href, icon }) {
  return (
    <Link href={href} target="_blank">
      {icon}
    </Link>
  );
}

function FooterLink(props) {
  return (
    <Link
      fontWeight="500"
      fontSize="16px"
      lineHeight="24px"
      color="#FFF"
      target="_blank"
      href={props.href}
      {...props}
    />
  );
}

function TextFooterSimple({ children, ...props }) {
  return (
    <LabelText typography="x-small" fontWeight="400" color="#464A51" {...props}>
      {children}
    </LabelText>
  );
}

export default function Footer({ template, ocult = false }) {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  if (template === "simple")
    return (
      <VStack zIndex="10" width="100%" spacing={0}>
        <VStack width="100%" height="100%" backgroundColor="#EEEEEE">
          <Stack
            width="100%"
            maxWidth="1440px"
            height="100%"
            justifyContent="space-between"
            direction={{ base: "column-reverse", lg: "row" }}
            spacing={0}
            gridGap={{ base: "8px", lg: "40px" }}
            padding="24px"
          >
            <HStack spacing={4}>
              <TextFooterSimple>
                {t("footer.copyright", { year: new Date().getFullYear() })}
              </TextFooterSimple>
              <Box ml={4}>
                <LanguageSelector theme="light" />
              </Box>
            </HStack>
            <HStack spacing={4}>
              <Link href="/terms?section=terms" _hover={{ color: "#252A32" }}>
                <TextFooterSimple>{t("footer.termsOfUse")}</TextFooterSimple>
              </Link>
              <Link href="/terms?section=privacy" _hover={{ color: "#252A32" }}>
                <TextFooterSimple>{t("footer.privacyPolicy")}</TextFooterSimple>
              </Link>
              <Link href="/contact" _hover={{ color: "#252A32" }}>
                <TextFooterSimple>{t("footer.contact")}</TextFooterSimple>
              </Link>
            </HStack>
          </Stack>
        </VStack>
      </VStack>
    );

  if (ocult === true) return null;

  return (
    <VStack position="relative" zIndex="10" width="100%" spacing={0}>
      <VStack
        width="100%"
        backgroundColor="#34A15A"
        padding="80px 24px 40px"
        spacing={10}
      >
        <Stack
          alignItems="flex-start"
          width="100%"
          maxWidth="1440px"
          justifyContent="space-between"
          flexDirection={{ base: "column", lg: "row" }}
          spacing={0}
          gridGap="24px"
        >
          <Display
            typography="small"
            minWidth="260px"
            fontWeight="400"
            color="#FFF"
            paddingBottom="40px"
          >
            {t("footer.title")}
          </Display>

          <Stack
            paddingBottom="40px"
            display={{ base: "grid", lg: "flex" }}
            flexDirection="row"
            gridTemplateColumns={{ base: "1fr 1fr", lg: "" }}
            gap={{ base: "30px", lg: "80px" }}
            width="100%"
            alignItems="flex-start"
            justifyContent="flex-end"
            spacing={0}
            marginLeft="auto"
          >
            <SectionCategories title={t("footer.products.title")}>
              <FooterLink target="_self" href="/search">
                {t("footer.products.searchEngine")}
              </FooterLink>
              <FooterLink
                href={
                  locale === "en"
                    ? "https://basedosdados.github.io/sdk/en"
                    : locale === "es"
                      ? "https://basedosdados.github.io/sdk/es"
                      : "https://basedosdados.github.io/sdk"
                }
              >
                {t("footer.products.publicDatalake")}
              </FooterLink>
              <FooterLink
                href={
                  locale === "en"
                    ? "https://info.basedosdados.org/en/bd-pro"
                    : locale === "es"
                      ? "https://info.basedosdados.org/es/bd-pro"
                      : "https://info.basedosdados.org/bd-pro"
                }
              >
                {t("footer.products.DBPro")}
              </FooterLink>
              {locale === "pt" && (
                <FooterLink href="https://info.basedosdados.org/bd-edu-cursos">
                  {t("footer.products.DBEdu")}
                </FooterLink>
              )}
            </SectionCategories>

            {locale === "pt" && (
              <SectionCategories
                title={t("footer.services.title")}
                marginBottom={isMobileMod() && "24px !important"}
              >
                <FooterLink target="_self" href="/services#data-capture">
                  {t("footer.services.dataCapture")}
                </FooterLink>
                <FooterLink href="/services#analytics">
                  {t("footer.services.dataAnalytics")}
                </FooterLink>
                <FooterLink href="/services#consulting">
                  {t("footer.services.dataConsulting")}
                </FooterLink>
                <FooterLink href="/services#case-studies">
                  {t("footer.services.caseStudies")}
                </FooterLink>
              </SectionCategories>
            )}

            <SectionCategories
              title={t("footer.resources.title")}
              marginBottom={isMobileMod() && "24px !important"}
            >
              <FooterLink
                href={
                  locale === "en"
                    ? "https://basedosdados.github.io/sdk/en"
                    : locale === "es"
                      ? "https://basedosdados.github.io/sdk/es"
                      : "https://basedosdados.github.io/sdk"
                }
              >
                {t("footer.resources.documentation")}
              </FooterLink>
              <FooterLink href="https://www.youtube.com/watch?v=nGM2OwTUY_M&list=PLu5pyM8QY6hg3GpNCyCtSS3sUi4Jo8Pir">
                {t("footer.resources.youtubeVideos")}
              </FooterLink>
              <FooterLink href="/blog">{t("footer.resources.blog")}</FooterLink>
              <FooterLink href="/faq">{t("footer.resources.faq")}</FooterLink>
            </SectionCategories>

            <SectionCategories
              title={t("footer.institutional.title")}
              marginBottom={isMobileMod() && "24px !important"}
            >
              <FooterLink target="_self" href="/about-us">
                {t("footer.institutional.aboutUs")}
              </FooterLink>
              <FooterLink target="_self" href="/transparency">
                {t("footer.institutional.transparency")}
              </FooterLink>
              {locale === "pt" && (
                <>
                  <FooterLink href="https://info.basedosdados.org/newsletter">
                    {t("footer.institutional.newsletter")}
                  </FooterLink>
                  <FooterLink href="https://info.basedosdados.org/carreiras">
                    {t("footer.institutional.careers")}
                  </FooterLink>
                </>
              )}
              <FooterLink target="_self" href="/terms">
                {t("footer.institutional.termsAndPrivacy")}
              </FooterLink>
              <FooterLink target="_self" href="/contact">
                {t("footer.institutional.contact")}
              </FooterLink>
              <Link
                href="/#support"
                fontWeight="500"
                fontSize="16px"
                lineHeight="24px"
                color="#FFF"
              >
                {t("footer.institutional.supportProject")}
              </Link>
            </SectionCategories>
          </Stack>
        </Stack>
      </VStack>

      <HStack
        width="100%"
        height={{ base: "100%", lg: "96px" }}
        backgroundColor="#2B8C4D"
        padding="30px"
      >
        <HStack
          width="100%"
          height="100%"
          maxWidth="1440px"
          margin="0 auto"
          justifyContent="space-between"
          flexDirection={{ base: "column-reverse", lg: "row" }}
          alignItems="center"
          spacing={0}
        >
          <HStack
            spacing={0}
            textAlign="center"
            maxWidth="1440px"
            flexDirection={{ base: "column", lg: "row" }}
            alignItems="flex-start"
            marginTop={{ base: "16px", lg: "0" }}
          >
            <HStack spacing="30px">
              <LabelText typography="x-small" fontWeight="400" color="#FFFFFF">
                {t("footer.copyright", { year: new Date().getFullYear() })}
              </LabelText>

              <Link
                fontWeight="400"
                fontSize="12px"
                lineHeight="18px"
                color="#FFFFFF"
                href="/terms?section=terms"
              >
                {t("footer.termsOfUse")}
              </Link>
              <Link
                fontWeight="400"
                fontSize="12px"
                lineHeight="18px"
                color="#FFFFFF"
                href="/terms?section=privacy"
              >
                {t("footer.privacyPolicy")}
              </Link>

              <LanguageSelector theme="dark" />
            </HStack>
          </HStack>

          <HStack spacing={3}>
            <SocialLink
              title="X"
              href={
                locale === "en"
                  ? "https://x.com/data__basis"
                  : locale === "es"
                    ? "https://x.com/basedelosdatos"
                    : "https://x.com/basedosdados"
              }
              icon={<XIcon alt="X" {...IconKey} />}
            />
            <SocialLink
              title="Bluesky"
              href={
                locale === "en"
                  ? "https://bsky.app/profile/databasis"
                  : locale === "es"
                    ? "https://bsky.app/profile/basedelosdatos"
                    : "https://bsky.app/profile/basedosdados"
              }
              icon={<BlueskyIcon alt="bluesky" {...IconKey} />}
            />
            <SocialLink
              title="Discord"
              href="https://discord.gg/huKWpsVYx4"
              icon={<DiscordIcon alt="discord" {...IconKey} />}
            />
            <SocialLink
              title="GitHub"
              href="https://github.com/basedosdados"
              icon={<GithubIcon alt="github" {...IconKey} />}
            />
            <SocialLink
              title="LinkedIn"
              href="https://www.linkedin.com/company/base-dos-dados/mycompany/"
              icon={<LinkedinIcon alt="linkedin" {...IconKey} />}
            />
            <SocialLink
              title="YouTube"
              href="https://www.youtube.com/basedosdados"
              icon={<YoutubeIcon alt="youtube" {...IconKey} />}
            />
            <SocialLink
              title="WhatsApp"
              href="https://chat.whatsapp.com/CLLFXb1ogPPDomCM6tQT22"
              icon={<WhatsAppIcon alt="whatsApp" {...IconKey} />}
            />
            <SocialLink
              title="Telegram"
              href="https://t.me/joinchat/OKWc3RnClXnq2hq-8o0h_w"
              icon={<TelegramIcon alt="telegram" {...IconKey} />}
            />
          </HStack>
        </HStack>
      </HStack>
    </VStack>
  );
}
