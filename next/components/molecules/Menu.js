import {
  Box,
  Stack,
  HStack,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useBoolean,
  Divider,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from "@chakra-ui/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/router"
import { useTranslation } from 'next-i18next';
import LanguageSelector from "../atoms/LanguageSelector";
import cookies from "js-cookie";
import MenuDropdown from "./MenuDropdown";
import { useCheckMobile } from "../../hooks/useCheckMobile.hook"
import { ControlledInputSimple } from "../atoms/ControlledInput";
import Link from "../atoms/Link";
import RoundedButton from "../atoms/RoundedButton";
import HelpWidget from "../atoms/HelpWidget";
import { triggerGAEvent } from "../../utils";

import BDLogoImage from "../../public/img/logos/bd_logo";
import BDLogoProImage from "../../public/img/logos/bd_logo_pro";
import BDLogoEduImage from "../../public/img/logos/bd_logo_edu";
import BDLogoLabImage from "../../public/img/logos/bd_logo_lab";
import DBLogoImage from "../../public/img/logos/db_logo";
import DBLogoProImage from "../../public/img/logos/db_logo_pro";
import DBLogoEduImage from "../../public/img/logos/db_logo_edu";
import DBLogoLabImage from "../../public/img/logos/db_logo_lab";
import FarBarsIcon from "../../public/img/icons/farBarsIcon";
import SearchIcon from "../../public/img/icons/searchIcon";
import RedirectIcon from "../../public/img/icons/redirectIcon";
import SettingsIcon from "../../public/img/icons/settingsIcon";
import SignOutIcon from "../../public/img/icons/signOutIcon";

// ... (rest of the code remains unchanged)

const links = {
  [t('data')]: `/search`,
  [t('solutions')]: [
    {
      icon: locale === 'en' ? <DBLogoProImage widthImage="54px"/> : <BDLogoProImage widthImage="54px"/>,
      name: [t('exclusive_data')],
      href: locale === 'en' ? "https://info.basedosdados.org/en/bd-pro" :
            locale === 'es' ? "https://info.basedosdados.org/es/bd-pro" :
            "https://info.basedosdados.org/bd-pro"
    },
    {
      icon: locale === 'en' ? <DBLogoEduImage widthImage="54px"/> : <BDLogoEduImage widthImage="54px"/>,
      name: [t('data_courses')],
      href: "https://info.basedosdados.org/bd-edu-sql"
    },
    {
      icon: locale === 'en' ? <DBLogoLabImage widthImage="54px"/> : <BDLogoLabImage widthImage="54px"/>,
      name: [t('services')],
      href: "/services"
    },
  ],
  [t('prices')]: "/prices",
  [t('tutorials')]: [
    {name: [t('documentation')], href:
      locale === "en" ? "https://basedosdados.github.io/mais/en" :
      locale === "es" ? "https://basedosdados.github.io/mais/es" :
      "https://basedosdados.github.io/mais"
    },
    {name: [t('youtube_videos')], href: "https://www.youtube.com/c/BasedosDados/featured"},
    {name: [t('blog')], href: "https://medium.com/basedosdados"}
  ],
  [t('institutional')]: [
    {name: [t('about_us')], href: "/about-us"},
    {name: [t('transparency')], href: "/transparency"},
    {name: [t('newsletter')], href: locale === 'en' ? "https://info.basedosdados.org/en/newsletter" :
                                    locale === 'es' ? "https://info.basedosdados.org/es/newsletter" :
                                                      "https://info.basedosdados.org/newsletter"},
    {name: [t('jobs')], href: "https://info.basedosdados.org/carreiras"},
    {name: [t('faq')], href: "/faq"},
  ],
  [t('contact')]: "/contact",
  Button: []
}

// ... (rest of the code remains unchanged)
