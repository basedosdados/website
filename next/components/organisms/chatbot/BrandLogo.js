import { useRouter } from "next/router";

import BDLogoImage from "../../../public/img/logos/bd_logo";
import DBLogoImage from "../../../public/img/logos/db_logo";

// Locale-aware wordmark: Data Basis (DB) on the English site, Base dos Dados (BD)
// otherwise. Mirrors the rule used by the main site nav
// (components/molecules/Menu.js), driven by router.locale so it is SSR-safe.
export default function BrandLogo(props) {
  const { locale } = useRouter();
  const Logo = locale === "en" ? DBLogoImage : BDLogoImage;
  return <Logo {...props} />;
}
