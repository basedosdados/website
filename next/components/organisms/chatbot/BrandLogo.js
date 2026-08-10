import { useRouter } from "next/router";

import BDLogoImage from "../../../public/img/logos/bd_logo";
import DBLogoImage from "../../../public/img/logos/db_logo";

export default function BrandLogo(props) {
  const { locale } = useRouter();
  const Logo = locale === "en" ? DBLogoImage : BDLogoImage;
  return <Logo {...props} />;
}
