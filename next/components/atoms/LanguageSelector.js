import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import LanguageIcon from "../../public/img/icons/languageIcon";

export default function LanguageSelector() {
  const router = useRouter();
  const { t } = useTranslation('common');

  const changeLanguage = (locale) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<LanguageIcon />} variant="ghost">
        {router.locale === 'pt' ? 'PT' : router.locale === 'en' ? 'EN' : 'ES'}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => changeLanguage('pt')}>Português</MenuItem>
        <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage('es')}>Español</MenuItem>
      </MenuList>
    </Menu>
  );
}