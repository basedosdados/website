
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Hero from "../components/organisms/Home/Hero";
import { BePartner } from "../components/organisms/Home/BePartner";
import SocioeconomicData from '../components/organisms/Home/SocioeconomicData';
import TablesStats from '../components/organisms/Home/TablesStats';
import MentionSection from '../components/molecules/MentionSection';
import ProductivityDataAnalysis from '../components/organisms/Home/ProductivityDataAnalysis';
import PresentationSolutions from '../components/organisms/Home/PresentationSolutions';
import ContentPublicPurpose from '../components/organisms/Home/ContentPublicPurpose';
import { MainPageTemplate } from "../components/templates/main";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['home', 'common', 'menu', 'dataset'])),
    },
    revalidate: 30
  };
}

export default function Home({ locale }) {
  const { t } = useTranslation("home");

  return (
    <MainPageTemplate id="home" backgroundColor="#FFFFFF">
      <Hero locale={locale} />
      <BePartner />
      <SocioeconomicData />
      <TablesStats />
      <MentionSection
        content={t("mentions.home1Content")}
        author={t("mentions.home1Author")}
        position={t("mentions.home1Position")}
        marginTop="120px !important"
        padding={{base: "40px 24px", md: "120px 24px"}}
      />
      <ProductivityDataAnalysis />
      <PresentationSolutions />
      <MentionSection
        content={t("mentions.home2Content")}
        author={t("mentions.home2Author")}
        position={t("mentions.home2Position")}
        marginTop="120px !important"
        padding={{base: "40px 24px", md: "120px 24px"}}
      />
      <ContentPublicPurpose/>
    </MainPageTemplate>
  );
}

/**
 * Next-Logger Setup,
 * a.k.a force dependency injection. 
 * Beware, as it works only with Next.js 12.
 * - https://stackoverflow.com/questions/71422446
 * - https://github.com/sainsburys-tech/next-logger/issues/13
 */
export const config = {
  unstable_includeFiles: [
    // package
    "next-logger",
    // dependencies
    "pino",
    "cosmiconfig",
    "path-type",
    "parse-json",
    "error-ex",
    "is-arrayish",
    "json-parse-even-better-errors",
    "lines-and-columns",
    "@babel/code-frame",
    "@babel/highlight",
    "js-tokens",
    "@babel/helper-validator-identifier",
    "chalk",
    "ansi-styles",
    "color-convert",
    "color-name",
    "supports-color",
    "has-flag",
    "pino-std-serializers",
    "fast-redact",
    "quick-format-unescaped",
    "sonic-boom",
    "atomic-sleep",
    "on-exit-leak-free",
    "thread-stream",
    "safe-stable-stringify",
  ].map(
      (dep) => `node_modules/${dep}/**/*.+(js|json)`
  ),
};
