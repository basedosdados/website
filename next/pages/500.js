import FiveHundredTemplate from "../components/templates/500";
import { isMobileMod } from "../hooks/useCheckMobile.hook"
import { MainPageTemplate } from "../components/templates/main";

export default function InternalServerError() {
  return (
    <MainPageTemplate>
      <FiveHundredTemplate alignItems={isMobileMod() ? "flex-end" : "center"} marginTop={isMobileMod() && "120px"}/>
    </MainPageTemplate>
  )
}