import FourOrFourTemplate from "../components/templates/404";
import { isMobileMod } from "../hooks/useCheckMobile.hook"
import { MainPageTemplate } from "../components/templates/main";

export default function FourOFour() {
  return (
    <MainPageTemplate>
      <FourOrFourTemplate alignItems={isMobileMod() ? "flex-end" : "center"} marginTop={isMobileMod() && "120px"}/>
    </MainPageTemplate>
  )
}