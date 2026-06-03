import { Box, Stack } from "@chakra-ui/react";
import Head from "next/head";
import Script from "next/script";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { MainPageTemplate } from "../components/templates/main";
import { withPages } from "../hooks/pages.hook";

export async function getStaticProps({ locale }) {
  const pages = await withPages();
  return {
    props: {
      ...pages,
      ...(await serverSideTranslations(locale, ["common", "menu", "bd-orgs"])),
    },
  };
}

export default function BdOrgs() {
  const { t } = useTranslation("bd-orgs");

  return (
    <MainPageTemplate paddingX="24px">
      <Head>
        <title>{t("pageTitle")}</title>
        <meta property="og:title" content={t("pageTitle")} key="ogtitle" />
        <meta
          property="og:description"
          content={t("pageDescription")}
          key="ogdesc"
        />
      </Head>

      <Script
        src="https://js.hsforms.net/forms/embed/9331013.js"
        strategy="afterInteractive"
      />

      <Stack
        width="100%"
        maxWidth="800px"
        alignItems="center"
        margin="50px auto 80px"
        spacing="40px"
      >
        <Box
          className="hs-form-frame"
          data-region="na1"
          data-form-id="744b422f-59fb-4894-ab8a-9aa20954593e"
          data-portal-id="9331013"
          width="100%"
          minWidth={{ base: "100%", lg: "900px" }}
          maxWidth="1200px"
        />
      </Stack>
    </MainPageTemplate>
  );
}
