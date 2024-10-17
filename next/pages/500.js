import FiveHundredTemplate from "../components/templates/500";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { isMobileMod } from "../hooks/useCheckMobile.hook"
import { MainPageTemplate } from "../components/templates/main";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'menu',])),
    },
  };
}

export default function InternalServerError() {
  return (
    <MainPageTemplate>
      <FiveHundredTemplate alignItems={isMobileMod() ? "flex-end" : "center"} marginTop={isMobileMod() && "120px"}/>
    </MainPageTemplate>
  )
}