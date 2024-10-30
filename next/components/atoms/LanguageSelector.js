import { Menu, MenuButton, MenuList, MenuItem, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import LanguageIcon from "../../public/img/icons/languageIcon";

export default function LanguageSelector() {
  const { locale } = useRouter();
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);

  const changeLanguage = (locale) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  const getTooltipText = () => {
    switch(locale) {
      case 'pt':
        return 'Língua';
      case 'en':
        return 'Language';
      case 'es':
        return 'Idioma';
      default:
        return 'Language';
    }
  };

  return (
    <Menu
      onOpen={() => setShowTooltip(false)}
    >
      {({ isOpen }) => (
        <>
          <Tooltip 
            backgroundColor="#FFF"
            borderRadius="8px"
            letterSpacing="0.1px"
            lineHeight="18px"
            fontWeight="400"
            fontSize="12px"
            fontFamily="Roboto"
            marginTop="-4px"
            color="#252A32"
            padding="8px 12px"
            boxShadow="0 2px 16px rgba(0, 0, 0, 0.16)"
            placement="top-start"
            label={getTooltipText()}
            isOpen={showTooltip && !isOpen}
            onClose={() => setShowTooltip(false)}
          >
            <MenuButton
              aria-label="Language selector"
              width="36px"
              height="36px"
              borderRadius="50%"
              zIndex="11"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <LanguageIcon
                alt="language selector"
                justifyContent="center"
                width="36px"
                height="36px"
                fill="#878A8E"
              />
            </MenuButton>
          </Tooltip>
          <MenuList
            boxShadow="0px 1.5px 16px rgba(0, 0, 0, 0.16)"
            _focus={{boxShadow: "0px 1.5px 16px rgba(0, 0, 0, 0.16) !important"}}
            padding="16px 0 6px"
            borderRadius="8px"
            zIndex="11"
            color="#252A32"
            minW="100px"
          >
            <MenuItem 
              onClick={() => changeLanguage('pt')}
              letterSpacing="0.1px"
              lineHeight="18px"
              fontWeight="400"
              fontSize="12px"
              fontFamily="Roboto"
              color="#252A32"
              backgroundColor="#FFF"
              padding="0 16px 10px"
              _focus={{backgroundColor: "transparent"}}
              _hover={{backgroundColor: "transparent", opacity: "0.7"}}
            >
              Português
            </MenuItem>
            <MenuItem 
              onClick={() => changeLanguage('en')}
              letterSpacing="0.1px"
              lineHeight="18px"
              fontWeight="400"
              fontSize="12px"
              fontFamily="Roboto"
              color="#252A32"
              backgroundColor="#FFF"
              padding="0 16px 10px"
              _focus={{backgroundColor: "transparent"}}
              _hover={{backgroundColor: "transparent", opacity: "0.7"}}
            >
              English
            </MenuItem>
            <MenuItem 
              onClick={() => changeLanguage('es')}
              letterSpacing="0.1px"
              lineHeight="18px"
              fontWeight="400"
              fontSize="12px"
              fontFamily="Roboto"
              color="#252A32"
              backgroundColor="#FFF"
              padding="0 16px 10px"
              _focus={{backgroundColor: "transparent"}}
              _hover={{backgroundColor: "transparent", opacity: "0.7"}}
            >
              Español
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
}